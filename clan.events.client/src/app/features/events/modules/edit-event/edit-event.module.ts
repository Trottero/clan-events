import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditEventComponent } from './edit-event.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [EditEventComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EditEventComponent,
      },
    ]),
  ],
})
export class EditEventModule {}
