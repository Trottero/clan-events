import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class FileInputComponent {
  @Input() accept = 'image/*';

  @Output() fileSelected = new EventEmitter<File>();

  file$ = this.fileSelected.pipe(tap(file => console.log(file)));

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.fileSelected.emit(file);
  }

  onFakeButtonClick(event: Event) {
    event.preventDefault();
  }
}
