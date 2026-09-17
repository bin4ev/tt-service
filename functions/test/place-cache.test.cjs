const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

const DAY_MS = 24 * 60 * 60 * 1000;

function setup({ cache, response, readError, writeError, apiError, secret = 'test-key' } = {}) {
  const now = 1_800_000_000_000;
  const calls = { google: 0, secretReads: 0, writes: [], options: undefined };
  const result = { name: 'TT Service', rating: 4.8, reviews: [] };

  class Timestamp {
    constructor(ms) { this.ms = ms; }
    toMillis() { return this.ms; }
    static fromMillis(ms) { return new Timestamp(ms); }
  }

  class HttpsError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  }

  const storedCache = cache && {
    result: cache.result || result,
    expiresAt: Timestamp.fromMillis(now + cache.remainingMs),
  };
  const modules = {
    'firebase-functions/v2/https': {
      HttpsError,
      onCall: (options, handler) => {
        calls.options = options;
        return handler;
      },
    },
    'firebase-functions/params': {
      defineSecret: (name) => {
        assert.equal(name, 'GOOGLE_PLACES_API_KEY');
        return {
          name,
          value: () => {
            calls.secretReads++;
            return secret;
          },
        };
      },
    },
    'firebase-admin/app': { initializeApp() {} },
    'firebase-admin/firestore': {
      Timestamp,
      getFirestore: () => ({
        collection: (name) => {
          assert.equal(name, 'placeCache');
          return {
            doc: (id) => {
              assert.equal(id, 'ChIJfWqBMMGVpkARCXTa2ufVueo_bg');
              return {
                async get() {
                  if (readError) throw readError;
                  return { data: () => storedCache };
                },
                async set(value) {
                  if (writeError) throw writeError;
                  calls.writes.push(value);
                },
              };
            },
          };
        },
      }),
    },
    axios: {
      default: {
        async get(url, options) {
          calls.google++;
          assert.equal(url, 'https://maps.googleapis.com/maps/api/place/details/json');
          assert.equal(options.params.language, 'bg');
          assert.equal(options.params.fields, 'rating,reviews');
          assert.equal(options.params.key, 'test-key');
          assert.equal(options.timeout, 10000);
          if (apiError) throw apiError;
          return { data: response || { status: 'OK', result } };
        },
      },
    },
  };
  const exports = {};
  runInNewContext(
    readFileSync(require.resolve('../lib/index.js'), 'utf8'),
    {
      exports,
      require: (name) => {
        assert.ok(modules[name], `Unexpected dependency: ${name}`);
        return modules[name];
      },
      Date: { now: () => now },
      console: { error() {} },
    }
  );

  return { handler: exports.getPlaceDetails, calls, now, result };
}

test('a fresh shared cache returns details without calling Google or requiring a key', async () => {
  const { handler, calls, result } = setup({ cache: { remainingMs: 1 } });
  assert.equal(await handler({ data: {} }), result);
  assert.equal(calls.google, 0);
  assert.equal(calls.writes.length, 0);
  assert.equal(calls.secretReads, 0);
});

for (const [name, cache] of [
  ['missing', undefined],
  ['exactly expired', { remainingMs: 0 }],
  ['older than 24 hours', { remainingMs: -1 }],
]) {
  test(`${name} cache is refreshed and expires 24 hours after fetching`, async () => {
    const { handler, calls, now, result } = setup({ cache });
    assert.equal(await handler({ data: null }), result);
    assert.equal(calls.google, 1);
    assert.equal(calls.writes.length, 1);
    assert.equal(calls.writes[0].fetchedAt.toMillis(), now);
    assert.equal(calls.writes[0].expiresAt.toMillis(), now + DAY_MS);
    assert.equal(calls.writes[0].result, result);
    assert.equal('apiKey' in calls.writes[0], false);
  });
}

test('missing server secret does not call Google or fall back to a client key', async () => {
  for (const secret of ['', ' ']) {
    const { handler, calls } = setup({ secret });
    await assert.rejects(
      handler({ data: { apiKey: 'client-key' } }),
      { code: 'failed-precondition' }
    );
    assert.equal(calls.google, 0);
    assert.equal(calls.writes.length, 0);
  }
});

test('client-supplied keys are ignored in favor of the server secret', async () => {
  const { handler, calls, result } = setup();
  assert.equal(await handler({ data: { apiKey: 'untrusted-client-key' } }), result);
  assert.equal(calls.secretReads, 1);
  assert.equal(calls.google, 1);
  assert.equal(JSON.stringify(result).includes('test-key'), false);
  assert.equal(JSON.stringify(calls.writes).includes('test-key'), false);
});

test('Google API error payloads and missing results are not cached', async () => {
  for (const response of [{ status: 'REQUEST_DENIED' }, { status: 'OK' }]) {
    const { handler, calls } = setup({ response });
    await assert.rejects(handler({ data: { apiKey: 'test-key' } }), { code: 'unavailable' });
    assert.equal(calls.writes.length, 0);
  }
});

test('network failures are not cached', async () => {
  const { handler, calls } = setup({ apiError: new Error('network failed') });
  await assert.rejects(handler({ data: { apiKey: 'test-key' } }), { code: 'internal' });
  assert.equal(calls.writes.length, 0);
});

test('Firestore read failures do not fall through to a paid Google call', async () => {
  const { handler, calls } = setup({ readError: new Error('Firestore unavailable') });
  await assert.rejects(handler({ data: { apiKey: 'test-key' } }), { code: 'internal' });
  assert.equal(calls.google, 0);
});

test('Firestore write failures are reported to the client', async () => {
  const { handler } = setup({ writeError: new Error('write failed') });
  await assert.rejects(handler({ data: { apiKey: 'test-key' } }), { code: 'internal' });
});

test('deployment options serialize requests within the configured instance limit', () => {
  const { calls } = setup();
  assert.equal(calls.options.maxInstances, 1);
  assert.equal(calls.options.concurrency, 1);
  assert.equal(calls.options.secrets[0].name, 'GOOGLE_PLACES_API_KEY');
});