import { Component, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, NgForm } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { catchError, finalize } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { TranslateModule } from "@ngx-translate/core";
import { ProcessWheelComponent } from "src/app/shared/components/process-wheel/process-wheel.component";
import { AuthService } from "src/app/core/services/auth.service";
import { NotificationService } from "src/app/core/services/notification.service";

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
    ProcessWheelComponent,
    TranslateModule
  ],
  templateUrl: "./sign-in.component.html",
  styleUrl: "./sign-in.component.scss",
})
export class SignInComponent {
  formData: any = {};
  loading = signal(false);

  #authService = inject(AuthService);
  #notifService = inject(NotificationService);

  submit(form:NgForm) {
    if(form.invalid) {
      return
    }
    this.loading.set(true);
    this.#authService.login(this.formData.email, this.formData.password).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError((err) => {
        console.error(err);
       this.#notifService.showError(err);
       return of(null);
      })
    ).subscribe()
  }
}
