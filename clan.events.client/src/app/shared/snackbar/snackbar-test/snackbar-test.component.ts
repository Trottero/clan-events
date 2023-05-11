import { Component, inject } from '@angular/core';
import { SnackbarService } from '../snackbar-service';

@Component({
  selector: 'app-snackbar-test',
  templateUrl: './snackbar-test.component.html',
  styleUrls: ['./snackbar-test.component.scss'],
})
export class SnackbarTestComponent {
  snackbarService = inject(SnackbarService);

  openInfo() {
    this.snackbarService.info('Info message');
  }

  openWarning() {
    this.snackbarService.warning('Warning message');
  }

  openError() {
    this.snackbarService.error('Error message');
  }

  openSuccess() {
    this.snackbarService.success('Success message');
  }
}
