import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.scss",
})
export class SignInComponent {
  formData: any = {};

  authService = inject(AuthService);

  submit() {
    this.authService.login(this.formData.email, this.formData.password);
  }
}
