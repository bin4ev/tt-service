import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  from,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { environment } from "src/environments/environment.development";
import { NotificationService } from "./notification.service";
import { PlaceResponse } from "../models/google-place-responce";
import { ApiKeysService } from "./api-keys.service";
import { getFunctions, httpsCallable } from "firebase/functions";
@Injectable({
  providedIn: "root",
})
export class GooglePlaceService {
  functions = getFunctions();

  #http = inject(HttpClient);
  #notifService = inject(NotificationService);
  #apiKeysService = inject(ApiKeysService);

  getMyPlaceDetails(): Observable<PlaceResponse | null> {
    return from(httpsCallable(this.functions, "getPlaceDetails",)()).pipe(
      map((res: any) => {
        console.log(res.data);
        return res.data}),
      catchError((err) => {
        this.#notifService.showError(err);
        return throwError(() => err);
      })
    );
  }
}
