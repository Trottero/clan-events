import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ChallengeResponse, TileResponse } from '@common/events';
import { TileChallengesService } from '../tile-challenges/tile-challenges.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
} from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { observeProperty } from 'src/app/core/common/observable/observe-property';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { Validators } from '@angular/forms';
import { BoardService } from '../board/board.service';
import { filterMapSuccess } from 'src/app/core/common/operators/loadable';

type Mode = 'view' | 'edit';

@Component({
  selector: 'app-tile-challenge-item',
  templateUrl: './tile-challenge-item.component.html',
  styleUrls: ['./tile-challenge-item.component.scss'],
})
export class TileChallengeItemComponent implements OnInit, OnDestroy {
  private readonly tileChallengesService = inject(TileChallengesService);
  private readonly boardService = inject(BoardService);

  private readonly modeSubject = new BehaviorSubject<Mode>('view');
  private readonly saveSubject = new Subject<void>();

  @Input() challenge?: ChallengeResponse;
  @Input() tileId?: string;

  mode$ = this.modeSubject.asObservable();

  challenge$ = observeProperty(this, 'challenge').pipe(
    notNullOrUndefined()
  ) as Observable<ChallengeResponse>;

  tileId$ = observeProperty(this, 'tileId').pipe(
    notNullOrUndefined()
  ) as Observable<string>;

  availableTiles$ = combineLatest([
    this.tileId$.pipe(notNullOrUndefined()),
    this.boardService.tiles$.pipe(
      notNullOrUndefined(),
      filterMapSuccess(tiles => tiles.value.data)
    ),
  ]).pipe(map(([tileId, tiles]) => tiles.filter(tile => tile.id !== tileId)));

  descriptionControl = new FormControl<string>('', [Validators.required]);
  nextTileControl = new FormControl<TileResponse | null>(null);

  readonly formGroup = new FormGroup({
    description: this.descriptionControl,
    nextTile: this.nextTileControl,
  });

  private readonly subscriptions = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.saveSubject
        .pipe(withLatestFrom(this.formGroup.value$))
        .subscribe(([_, value]) => {
          console.log(value);
          this.tileChallengesService.updateChallenge({
            id: this.challenge?.id ?? '',
            description: value.description,
            nextTile: value.nextTile?.id,
          });
        })
    );

    this.subscriptions.add(
      this.challenge$
        .pipe(withLatestFrom(this.availableTiles$))
        .subscribe(([challenge, tiles]) => {
          this.descriptionControl.setValue(challenge.description, {
            emitEvent: false,
          });

          const nextTile = tiles.find(tile => tile.id === challenge.nextTile);
          console.log(challenge, nextTile);
          this.nextTileControl.setValue(nextTile ?? null, {
            emitEvent: false,
          });
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  editChallenge() {
    this.modeSubject.next('edit');
  }

  cancelEditChallenge() {
    this.modeSubject.next('view');
  }

  saveChallenge() {
    this.saveSubject.next();
  }

  deleteChallenge() {
    if (!this.challenge?.id) {
      return;
    }

    this.tileChallengesService.deleteChallenge(this.challenge.id);
  }
}
