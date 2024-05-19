
import { Injectable } from "@angular/core";
import emailjs, { type EmailJSResponseStatus } from "@emailjs/browser";
import { environment } from "src/environments/environment.development";
import { from } from "rxjs";

export const alias = "TT-AVTO-88";

@Injectable({
  providedIn: "root",
})
export class EmailService {

  constructor() {}

  sendEmail(form: HTMLFormElement) {
    return from(
      emailjs.sendForm(environment.emailConfifg.serviceID, environment.emailConfifg.templateID, form, {
        publicKey: environment.emailConfifg.publicKey,
      })
    );
  }
}
