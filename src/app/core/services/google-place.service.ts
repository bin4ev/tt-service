import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, Subject, switchMap, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { NotificationService } from "./notification.service";
import { PlaceResponse } from "../models/google-place-responce";
import { ApiKeysService } from "./api-keys.service";

@Injectable({
  providedIn: "root",
})
export class GooglePlaceService {
  private baseUrl = environment.reviewsConfig.baseUrl;
  private placeId = environment.reviewsConfig.placeId;

  #http = inject(HttpClient);
  #notifService = inject(NotificationService);
  #apiKeysService = inject(ApiKeysService);

  getMyPlaceDetails(): Observable<PlaceResponse | null> {
    return this.#apiKeysService.getGoogleMapKey().pipe(
      switchMap((response) => {
        if (!response) {
          return of(null);
        }

        const url = `${this.baseUrl}?placeid=${this.placeId}&key=${response?.['key']}`;
        return this.#http.get(url).pipe(
          map((res: any) => res.result),
          catchError((err) => {
            this.#notifService.showError(err.error_message);
            return throwError(() => err);
          })
        );
      })
    );
  }
}
