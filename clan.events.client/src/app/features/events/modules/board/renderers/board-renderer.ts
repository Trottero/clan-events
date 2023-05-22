import { inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BoardService } from '../board.service';
import { BoardCanvasObject } from './board-canvas-object';
import { ThemingService } from 'src/app/core/components/theming/theming.service';

export abstract class BoardRenderer {
  protected readonly boardService = inject(BoardService);
  protected readonly themingService = inject(ThemingService);
  protected readonly subscriptions = new Subscription();

  abstract readonly name: string;

  abstract canvasObjects$: Observable<BoardCanvasObject[]>;

  abstract render(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void;

  onGrabMove(index: number, x: number, y: number): void {}
  onGrabEnd(index: number, x: number, y: number): void {}
  selectCanvasObject(index?: number): void {}

  destroy(): void {
    this.subscriptions.unsubscribe();
  }

  renderBackground(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void {}
}
