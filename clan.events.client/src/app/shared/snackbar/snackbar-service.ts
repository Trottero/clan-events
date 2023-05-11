import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { SnackbarData } from './snackbar-data';

@Injectable()
export class SnackbarService {
  private readonly _snackbar = inject(MatSnackBar);
  private readonly _snackbarDuration = 100000;

  info(message: string, action: string = 'Dismiss') {
    this._snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this._snackbarDuration,
        panelClass: 'info',
        data: {
          action,
          message,
          type: 'info',
        },
      }
    );
  }

  warning(message: string, action: string = 'Dismiss') {
    this._snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this._snackbarDuration,
        panelClass: 'warning',
        data: {
          action,
          message,
          type: 'warning',
        },
      }
    );
  }

  error(message: string, action: string = 'Dismiss') {
    this._snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this._snackbarDuration,
        panelClass: 'error',
        data: {
          action,
          message,
          type: 'error',
        },
      }
    );
  }

  success(message: string, action: string = 'Dismiss') {
    this._snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this._snackbarDuration,
        panelClass: 'success',
        data: {
          action,
          message,
          type: 'success',
        },
      }
    );
  }
}
