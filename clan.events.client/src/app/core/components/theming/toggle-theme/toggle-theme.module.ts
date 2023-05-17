import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleThemeComponent } from './toggle-theme.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ToggleThemeComponent],
  imports: [CommonModule, MatSlideToggleModule, MatFormFieldModule],
  exports: [ToggleThemeComponent],
})
export class ToggleThemeModule {}
