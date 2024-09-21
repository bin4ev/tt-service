import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  from,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { NotificationService } from './notification.service';
import { PlaceResponse } from '../models/google-place-responce';
import { ApiKeysService } from './api-keys.service';
import { getFunctions, httpsCallable } from 'firebase/functions';
@Injectable({
  providedIn: 'root',
})
export class GooglePlaceService {
  functions = getFunctions();

  #http = inject(HttpClient);
  #notifService = inject(NotificationService);
  #apiKeysService = inject(ApiKeysService);

  // getMyPlaceDetails(): Observable<PlaceResponse | null> {
  //   return this.#apiKeysService.getGoogleMapKey().pipe(
  //     switchMap((response) => {
  //       if (!response) {
  //         return of(null);
  //       }

  //       const url = `${this.baseUrl}?placeid=${this.placeId}&key=${response?.['key']}`;
  //       return this.#http.get(url).pipe(
  //         map((res: any) => res.result),
  //         catchError((err) => {
  //           this.#notifService.showError(err.error_message);
  //           return throwError(() => err);
  //         })
  //       );
  //     })
  //   );
  // }

  getMyPlaceDetails(): Observable<PlaceResponse | null> {
    return this.#apiKeysService.getGoogleMapKey().pipe(
      switchMap((apiKey) => {
        if (!apiKey) {
          return of(null);
        }

        const requestFn = httpsCallable(this.functions, 'getPlaceDetails');
        return from(requestFn({ apiKey: apiKey['key'] })).pipe(
          map((res: any) => {
            return res.data;
          }),
          catchError((err) => {
            this.#notifService.showError(err);
            return throwError(() => err);
          })
        );
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      })
    );
  }
}
