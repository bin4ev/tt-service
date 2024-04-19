import { Component, inject } from "@angular/core";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { FormsModule, NgForm } from "@angular/forms";
import { EmailService } from "../services/email.service";
import { JsmapComponent } from "../jsmap/jsmap.component";
import { NotificationService } from "../services/notification.service";
import { finalize } from "rxjs";
import { BUSSINES_PHONE_NUMBER } from "../constants/constants";

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
  BUSSINES_PHONE_NUMBER = BUSSINES_PHONE_NUMBER
  private contactService = inject(EmailService);
  formData: any = {};
  private notificationService = inject(NotificationService);
  loading = false;

  onSubmit(form: NgForm, event: SubmitEvent) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.contactService.sendEmail(event.target as HTMLFormElement).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.notificationService.showSuccess(`Email is sended successfully`);
      },
      error: (err) => {
        console.log(err);
        this.notificationService.showError(`${err.text}. Email sending failed`);
      },
    });
  }
}
