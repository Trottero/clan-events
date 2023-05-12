import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditTileComponent } from './edit-tile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [EditTileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [EditTileComponent],
})
export class EditTileModule {}
