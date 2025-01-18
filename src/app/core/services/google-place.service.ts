import { HttpClient } from "@angular/common/http";
import { afterNextRender, inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { NotificationService } from "./notification.service";
import { PlaceResponse } from "../models/google-place-responce";

@Injectable({
  providedIn: "root",
})
export class GooglePlaceService {
  private apiKey = environment.reviewsConfig.apiKey;
  private baseUrl = environment.reviewsConfig.baseUrl;
  private placeId = environment.reviewsConfig.placeId;

  myPlaceDetails = new BehaviorSubject<PlaceResponse | null>(null);
  myPlaceDetails$ = this.myPlaceDetails.asObservable();

  #http = inject(HttpClient);
  #notifService = inject(NotificationService);

  getMyPlaceDetails(): Observable<PlaceResponse | null> {
    const url = `${this.baseUrl}?placeid=${this.placeId}&key=${this.apiKey}`;
    return this.#http.get(url).pipe(
      tap((res: any) => {
        debugger
        console.log(res);
        
        this.myPlaceDetails.next(res.result);
      }),
      catchError((err) => {
        this.#notifService.showError(err.error_message);
        console.log(err);
        
        this.myPlaceDetails.next(null);
        return throwError(() => err);
      })
    );
  }
}
