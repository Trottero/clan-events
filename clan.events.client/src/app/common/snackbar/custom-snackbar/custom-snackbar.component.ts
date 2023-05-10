import { Component, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SnackbarData } from '../snackbar-data';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
})
export class CustomSnackbarComponent {
  snackbarRef = inject(MatSnackBarRef);
  data = inject<SnackbarData>(MAT_SNACK_BAR_DATA);
}
