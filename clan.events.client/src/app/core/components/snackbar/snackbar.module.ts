import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';
import { SnackbarTestComponent } from './snackbar-test/snackbar-test.component';
import { SnackbarService } from './snackbar.service';

@NgModule({
  declarations: [CustomSnackbarComponent, SnackbarTestComponent],
  imports: [CommonModule],
  providers: [SnackbarService],
  exports: [CustomSnackbarComponent, SnackbarTestComponent],
})
export class SnackbarModule {}
