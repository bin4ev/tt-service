import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import axios from 'axios';

initializeApp();

const PLACE_ID = 'ChIJfWqBMMGVpkARCXTa2ufVueo';
const LANGUAGE = 'bg';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const googlePlacesApiKey = defineSecret('GOOGLE_PLACES_API_KEY');

interface GooglePlaceDetailsResponse {
  status: string;
  result?: Record<string, unknown>;
}

export const getPlaceDetails = onCall(
  {
    cors: true,
    secrets: [googlePlacesApiKey],
    // Serialize requests so a cold/expired cache is not refreshed in parallel.
    maxInstances: 1,
    concurrency: 1,
    timeoutSeconds: 30,
  },
  async () => {
    const cacheRef = getFirestore()
      .collection('placeCache')
      .doc(`${PLACE_ID}_${LANGUAGE}`);

    try {
      const snapshot = await cacheRef.get();
      const cache = snapshot.data();

      if (
        cache?.expiresAt instanceof Timestamp &&
        cache.expiresAt.toMillis() > Date.now() &&
        cache.result
      ) {
        return cache.result;
      }

      // Read the server-only secret at runtime, never from the client request.
      const apiKey = googlePlacesApiKey.value().trim();
      if (!apiKey) {
        throw new HttpsError('failed-precondition', 'Google Place details are not configured.');
      }

      const response = await axios.get<GooglePlaceDetailsResponse>(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: PLACE_ID,
            key: apiKey,
            language: LANGUAGE,
            fields: 'rating,reviews',
          },
          timeout: 10000,
        }
      );

      // Google can return an API error with HTTP 200. Never cache that response.
      if (response.data.status !== 'OK' || !response.data.result) {
        throw new HttpsError('unavailable', 'Google Place details are currently unavailable.');
      }

      const fetchedAt = Date.now();
      await cacheRef.set({
        result: response.data.result,
        fetchedAt: Timestamp.fromMillis(fetchedAt),
        expiresAt: Timestamp.fromMillis(fetchedAt + CACHE_TTL_MS),
      });

      // onCall wraps this in { data: ... }, matching httpsCallable on the client.
      return response.data.result;
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      // Do not log the Axios error object: its request config contains the API key.
      console.error('Unable to read, refresh, or save the Google Place details cache.');
      throw new HttpsError('internal', 'Error fetching place details.');
    }
  }
);