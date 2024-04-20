import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ConfirmDialogConfig } from "src/app/interfaces/confirm-dialog-config";

@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: "./confirmation-dialog.component.html",
  styleUrl: "./confirmation-dialog.component.scss",
})
export class ConfirmationDialogComponent {
  config = signal<ConfirmDialogConfig>({
    title: "DELETE_CONFIRMATION.title",
    message: "DELETE_CONFIRMATION.message",
    cancel_button_label: "DELETE_CONFIRMATION.cancel_button_label",
    confirm_button_label: "DELETE_CONFIRMATION.confirm_button_label",
  });

  #matDialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);


  closeDialog(bul: boolean) {
    this.#matDialogRef.close(bul);
  }
}

