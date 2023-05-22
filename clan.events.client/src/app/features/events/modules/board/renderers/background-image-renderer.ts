import { of } from 'rxjs';
import { BoardRenderer } from './board-renderer';

export class BackgroundImageRenderer extends BoardRenderer {
  override name: string = BackgroundImageRenderer.name;
  override canvasObjects$ = of([]);

  backgroundImage$ = this.boardService.backgroundImageUri$;

  image: HTMLImageElement = new Image();

  constructor() {
    super();

    this.subscriptions.add(
      this.backgroundImage$.subscribe(backgroundImage => {
        this.image.src = backgroundImage;
      })
    );
  }

  override render(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void {
    const imageWidth = this.image.width;
    const imageHeight = this.image.height;

    context.drawImage(
      this.image,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight
    );
  }
}
