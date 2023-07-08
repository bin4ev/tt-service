import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { ContactData } from "../interfaces/contactData";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment.development";

export const alias = "TT-AVTO-88";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private url = `${environment.emailProviderUrl}${alias}`;

  private http: HttpClient = inject(HttpClient);

  constructor() {}

  postMsg(formData: ContactData) {
    return this.http.post(this.url, formData, { responseType: "text" }).pipe(
      map((responce: any) => {
        if (responce) {
          return responce;
        } else {
          null;
        }
      }),
      catchError((err) => err)
    );
  }
}
