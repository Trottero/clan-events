import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData } from './snackbar-data';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';

@Injectable()
export class SnackbarService {
  private readonly snackbar = inject(MatSnackBar);
  private readonly snackbarDuration = 5000;

  info(message: string, action: string = 'Dismiss') {
    this.snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this.snackbarDuration,
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
    this.snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this.snackbarDuration,
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
    this.snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this.snackbarDuration,
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
    this.snackbar.openFromComponent<CustomSnackbarComponent, SnackbarData>(
      CustomSnackbarComponent,
      {
        duration: this.snackbarDuration,
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
