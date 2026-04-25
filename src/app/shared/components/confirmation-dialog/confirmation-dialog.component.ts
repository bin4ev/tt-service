import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ConfirmDialogConfig } from "src/app/core/interfaces/confirm-dialog-config";

@Component({
  selector: "app-confirmation-dialog",
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: "./confirmation-dialog.component.html",
  styleUrl: "./confirmation-dialog.component.scss",
})
export class ConfirmationDialogComponent {
  #matDialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

  dataFromDialog = inject<ConfirmDialogConfig>(MAT_DIALOG_DATA);
  dataFromDialogSignal = signal<ConfirmDialogConfig>(this.dataFromDialog);
  configInitial = signal<ConfirmDialogConfig>({
    title: "DELETE_CONFIRMATION.title",
    message: "DELETE_CONFIRMATION.message",
    cancel_button_label: "DELETE_CONFIRMATION.cancel_button_label",
    confirm_button_label: "DELETE_CONFIRMATION.confirm_button_label",
  });
  config = computed(() =>( this.dataFromDialogSignal() ? {...this.configInitial(),...this.dataFromDialogSignal()} : this.configInitial()));





  closeDialog(bul: boolean) {
    this.#matDialogRef.close(bul);
  }
}

