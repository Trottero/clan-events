import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleThemeComponent } from './toggle-theme.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [ToggleThemeComponent],
  imports: [CommonModule, MatSlideToggleModule],
  exports: [ToggleThemeComponent],
})
export class ToggleThemeModule {}
