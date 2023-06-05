import { Injectable, OnDestroy, inject } from '@angular/core';
import { TileChallengesApiService } from './tile-challenges.api.service';
import { BoardService } from '../board/board.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import {
  Subject,
  Subscription,
  combineLatest,
  share,
  shareReplay,
  withLatestFrom,
  startWith,
  switchMap,
  of,
} from 'rxjs';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { loading, mapToLoadable } from 'src/app/core/common/operators/loadable';
import { CreateChallengeRequest, UpdateChallengeRequest } from '@common/events';

@Injectable({
  providedIn: 'root',
})
export class TileChallengesService implements OnDestroy {
  private readonly tileChallengesApiService = inject(TileChallengesApiService);
  private readonly boardService = inject(BoardService);

  private readonly eventId$ = inject(EventIdStream).pipe(notNullOrUndefined());
  private readonly selectedTile$ = this.boardService.selectedTile$;
  private readonly clanName$ = inject(
    SelectedClanService
  ).selectedClanName$.pipe(notNullOrUndefined());

  private readonly createChallengeSubject =
    new Subject<CreateChallengeRequest>();
  private readonly updateChallengeSubject = new Subject<
    UpdateChallengeRequest & { id: string }
  >();
  private readonly deleteChallengeSubject = new Subject<string>();

  private readonly subscriptions = new Subscription();

  createChallenge$ = this.createChallengeSubject.pipe(
    withLatestFrom(
      this.eventId$,
      this.selectedTile$.pipe(notNullOrUndefined()),
      this.clanName$
    ),
    switchMap(([request, eventId, selectedTile, clanName]) => {
      return this.tileChallengesApiService.createChallenge(
        clanName,
        eventId,
        selectedTile.id,
        request
      );
    }),
    share()
  );

  updateChallenge$ = this.updateChallengeSubject.pipe(
    withLatestFrom(
      this.eventId$,
      this.selectedTile$.pipe(notNullOrUndefined()),
      this.clanName$
    ),
    switchMap(([request, eventId, selectedTile, clanName]) => {
      return this.tileChallengesApiService.updateChallenge(
        clanName,
        eventId,
        selectedTile.id,
        request.id,
        request
      );
    }),
    share()
  );

  deleteChallenge$ = this.deleteChallengeSubject.pipe(
    withLatestFrom(
      this.eventId$,
      this.selectedTile$.pipe(notNullOrUndefined()),
      this.clanName$
    ),
    switchMap(([challengeId, eventId, selectedTile, clanName]) => {
      return this.tileChallengesApiService.deleteChallenge(
        clanName,
        eventId,
        selectedTile.id,
        challengeId
      );
    }),
    share()
  );

  challenges$ = combineLatest([
    combineLatest([
      this.createChallenge$.pipe(startWith(undefined)),
      this.updateChallenge$.pipe(startWith(undefined)),
      this.deleteChallenge$.pipe(startWith(undefined)),
    ]),
    this.selectedTile$,
  ]).pipe(
    withLatestFrom(this.eventId$, this.clanName$),
    switchMap(([[, selectedTile], eventId, clanName]) => {
      return selectedTile
        ? this.tileChallengesApiService
            .getChallenges(clanName, eventId, selectedTile.id)
            .pipe(mapToLoadable())
        : of(undefined);
    }),
    shareReplay(1)
  );

  constructor() {
    this.subscriptions.add(
      combineLatest([
        this.createChallenge$.pipe(startWith(undefined)),
        this.updateChallenge$.pipe(startWith(undefined)),
        this.deleteChallenge$.pipe(startWith(undefined)),
      ]).subscribe(([create, update, deleteChallenge]) => {
        this.boardService.refreshTiles();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  createChallenge(request: CreateChallengeRequest) {
    this.createChallengeSubject.next(request);
  }

  updateChallenge(request: UpdateChallengeRequest & { id: string }) {
    this.updateChallengeSubject.next(request);
  }

  deleteChallenge(challengeId: string) {
    this.deleteChallengeSubject.next(challengeId);
  }
}
