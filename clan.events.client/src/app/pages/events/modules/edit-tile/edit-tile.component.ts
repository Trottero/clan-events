import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BoardService } from '../board/board.service';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Subject, Subscription, switchMap, withLatestFrom } from 'rxjs';
import { BoardApiService } from '../board/board.api.service';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';

@Component({
  selector: 'app-edit-tile',
  templateUrl: './edit-tile.component.html',
  styleUrls: ['./edit-tile.component.scss'],
})
export class EditTileComponent implements OnInit, OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly boardApiService = inject(BoardApiService);
  private readonly selectedClanService = inject(SelectedClanService);
  private readonly eventId$ = inject(EventIdStream);

  private readonly triggerSaveSubject = new Subject<void>();
  private readonly subscriptions = new Subscription();

  selectedTile$ = this.boardService.selectedTile$;

  nameControl = new FormControl<string>();
  borderColorControl = new FormControl<string>();
  fillColorControl = new FormControl<string>();
  borderWidthControl = new FormControl<number>();
  widthControl = new FormControl<number>();
  heightControl = new FormControl<number>();

  formGroup = new FormGroup({
    name: this.nameControl,
    borderColor: this.borderColorControl,
    fillColor: this.fillColorControl,
    borderWidth: this.borderWidthControl,
    width: this.widthControl,
    height: this.heightControl,
  });

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedTile$.subscribe(tile => {
        if (tile) {
          this.nameControl.setValue(tile.name);
          this.borderColorControl.setValue(tile.borderColor);
          this.fillColorControl.setValue(tile.fillColor);
          this.borderWidthControl.setValue(tile.borderWidth);
          this.widthControl.setValue(tile.width);
          this.heightControl.setValue(tile.height);
        }
      })
    );

    this.subscriptions.add(
      this.triggerSaveSubject
        .pipe(
          withLatestFrom(
            this.selectedTile$.pipe(notNullOrUndefined()),
            this.selectedClanService.selectedClanName$.pipe(
              notNullOrUndefined()
            ),
            this.eventId$.pipe(notNullOrUndefined()),
            this.formGroup.value$
          ),
          switchMap(([_, tile, clan, eventId, form]) =>
            this.boardApiService.updateTile(clan, eventId, tile.id, {
              ...tile,
              name: form.name,
              borderColor: form.borderColor,
              fillColor: form.fillColor,
              borderWidth: form.borderWidth,
              width: form.width,
              height: form.height,
            })
          )
        )
        .subscribe(() => this.boardService.refreshTiles())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  update() {
    this.triggerSaveSubject.next();
  }
}
