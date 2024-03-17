import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
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
  ],
  templateUrl: "./confirmation-dialog.component.html",
  styleUrl: "./confirmation-dialog.component.scss",
})
export class ConfirmationDialogComponent {
  matDialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  config = signal<ConfirmDialogConfig>({
    title: "Изтриване на файл",
    message: "Сигурни ли сте, че искате да изтриете файла?",
    cancel_button_label: "Не",
    confirm_button_label: "Да",
  });

  closeDialog(bul: boolean) {
    this.matDialogRef.close(bul);
  }
}

