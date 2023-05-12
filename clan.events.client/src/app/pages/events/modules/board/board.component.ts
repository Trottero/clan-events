import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { BoardApiService } from './board.api.service';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { EventIdStream } from '../../streams/event-id.stream';
import {
  Subject,
  Subscription,
  combineLatest,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import {
  filterMapSuccess,
  mapToLoadable,
} from 'src/app/common/operators/loadable';
import { TileResponse } from '@common/events';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  private readonly boardService = inject(BoardService);

  tiles$ = this.boardService.tiles$;

  selectedTile$ = this.boardService.selectedTile$;

  ngOnInit(): void {}

  createTile() {
    this.boardService.createTile();
  }

  resetCanvas() {
    this.boardService.resetCanvas();
  }
}
