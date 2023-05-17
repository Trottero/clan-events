import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleThemeModule } from './components/theming';
import { LayoutModule } from './ui/layout/layout.module';
import { SnackbarModule } from './components/snackbar/snackbar.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [LayoutModule, SnackbarModule, ToggleThemeModule],
})
export class CoreModule {}
