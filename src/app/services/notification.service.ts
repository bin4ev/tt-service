import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarConfig,
  MatSnackBarLabel,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  constructor() { }

  showSuccess(message: string, action?: string | undefined, config?: MatSnackBarConfig<any> | undefined): MatSnackBarRef<TextOnlySnackBar> {
    config = {
     duration: 3000,
     panelClass: 'success-snackbar',
     ...config
    };

    return this._snackBar.open(message, action, config);
  }

  showError(message: string, action: string | undefined = "OK", config?: MatSnackBarConfig<any> | undefined): MatSnackBarRef<TextOnlySnackBar> {
    config = {
     duration: 3000,
     panelClass: 'error-snackbar',
     ...config
    };

    return this._snackBar.open(message, action, config);
  }
}
