import { Injectable } from "@angular/core";
import emailjs, { type EmailJSResponseStatus } from "@emailjs/browser";
import { environment } from "src/environments/environment.development";
import { from } from "rxjs";

export const alias = "TT-AVTO-88";
export enum EMAIL_TEMPLATES_IDS {
  CONTACT = "template_13ugvxh",
  CREATE_APPOINTMENT = "template_gskd79e",
}

@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor() {}

  sendEmail(form: HTMLFormElement, templateId: EMAIL_TEMPLATES_IDS) {
    return from(
      emailjs.sendForm(environment.emailConfifg.serviceID, templateId, form, {
        publicKey: environment.emailConfifg.publicKey,
      })
    );
  }
}
