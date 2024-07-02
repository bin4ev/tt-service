import { Component, inject } from "@angular/core";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { FormsModule, NgForm } from "@angular/forms";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { finalize } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { ADDRESS_STREET, ADDRESS_TOWN, BUSSINES_PHONE_NUMBER } from "src/app/core/constants/constants";
import { EMAIL_TEMPLATES_IDS, EmailService } from "src/app/core/services/email.service";
import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-contacts",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    JsmapComponent,
    TranslateModule,
  ],
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "translateX(-100%)" }),
        animate("1000ms ease", style({ transform: "translateX(0)" })),
      ]),
      transition(":leave", [
        animate("1000ms ease", style({ transform: "translateX(-100%)" })),
      ]),
    ]),
  ],
})
export class ContactsComponent {
  BUSSINES_PHONE_NUMBER = BUSSINES_PHONE_NUMBER;
  ADDRESS_TOWN = ADDRESS_TOWN;
  ADDRESS_STREET = ADDRESS_STREET;

  formData: any = {};
  loading = false;

  #contactService = inject(EmailService);
  #notificationService = inject(NotificationService);

  onSubmit(form: NgForm, event: SubmitEvent) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.#contactService
      .sendEmail(event.target as HTMLFormElement, EMAIL_TEMPLATES_IDS.CONTACT)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.#notificationService.showSuccess(`Email is sended successfully`);
        },
        error: (err) => {
          console.log(err);
          this.#notificationService.showError(
            `${err.text}. Email sending failed`
          );
        },
      });
  }
}
