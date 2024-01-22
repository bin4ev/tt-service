import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from "@angular/animations";
import { FormsModule, NgForm } from "@angular/forms";
import { EmailService } from "../services/email.service";
import { JsmapComponent } from "../jsmap/jsmap.component";

@Component({
  selector: "app-contacts",
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    JsmapComponent
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
  private contactService = inject(EmailService);
  formData: any = {};

  constructor() {}

  submit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.contactService.postMsg(form.value).subscribe({
      next: (responce) => {
        console.log(responce);
        location.href = 'https://mailthis.to/confirm'
      },
      error: (err) => console.error(err),
    });
  }

}
