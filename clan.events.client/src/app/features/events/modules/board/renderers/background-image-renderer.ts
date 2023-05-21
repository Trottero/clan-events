import { map, of, share, shareReplay } from 'rxjs';
import { Theme } from 'src/app/core/components/theming/theme';
import { BoardRenderer } from './board-renderer';

export class BackgroundImageRenderer extends BoardRenderer {
  override name: string = BackgroundImageRenderer.name;
  canvasObjects$ = of([]);

  backgroundImage$ = this.boardService.backgroundImageUri$;

  private state = {
    backgroundImage: '',
  };

  constructor() {
    super();

    this.subscriptions.add(
      this.backgroundImage$.subscribe(backgroundImage => {
        this.state = {
          backgroundImage,
        };
      })
    );
  }

  override render(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void {
    // center image around origin
    const image = new Image();
    image.src = this.state.backgroundImage;

    const imageWidth = image.width;
    const imageHeight = image.height;

    context.drawImage(
      image,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight
    );
  }
}
