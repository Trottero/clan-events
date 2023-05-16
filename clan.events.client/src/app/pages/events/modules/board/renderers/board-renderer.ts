import { inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BoardService } from '../board.service';
import { ThemingService } from 'src/app/shared/theming/theming.service';
import { BoardCanvasObject } from './board-canvas-object';

export abstract class BoardRenderer {
  protected readonly boardService = inject(BoardService);
  protected readonly themingService = inject(ThemingService);
  protected readonly subscriptions = new Subscription();

  abstract canvasObjects$: Observable<BoardCanvasObject[]>;

  abstract render(context: CanvasRenderingContext2D): void;
  abstract onGrabMove(index: number, x: number, y: number): void;
  abstract onGrabEnd(index: number, x: number, y: number): void;
  abstract selectCanvasObject(index?: number): void;

  destroy(): void {
    this.subscriptions.unsubscribe();
  }

  renderBackground(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void {}
}
