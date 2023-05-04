import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { RouterModule } from '@angular/router';
import { ToggleThemeModule } from 'src/app/common/theming';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, RouterModule, ToggleThemeModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
