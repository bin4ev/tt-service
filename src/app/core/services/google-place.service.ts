import { inject, Injectable } from '@angular/core';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { catchError, defer, map, Observable, throwError } from 'rxjs';
import { PlaceResponse } from '../models/google-place-responce';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class GooglePlaceService {
  private readonly notificationService = inject(NotificationService);

  getMyPlaceDetails(): Observable<PlaceResponse> {
    return defer(() => {
      // The server owns both the API key and the shared 24-hour cache.
      const request = httpsCallable<void, PlaceResponse>(
        getFunctions(),
        'getPlaceDetails'
      );
      return request();
    }).pipe(
      map((response) => response.data),
      catchError((error: unknown) => {
        this.notificationService.showError(
          error instanceof Error ? error.message : 'Error fetching place details.'
        );
        return throwError(() => error);
      })
    );
  }
}