import { map, of, share, shareReplay } from 'rxjs';
import { Theme } from 'src/app/core/components/theming/theme';
import { BoardRenderer } from './board-renderer';

export class GridRenderer extends BoardRenderer {
  override name: string = GridRenderer.name;

  public static readonly GRID_SIZE = 50;
  public static readonly GRID_HALF_SIZE = GridRenderer.GRID_SIZE / 2;

  canvasObjects$ = of([]);

  lineColor$ = this.themingService.theme$.pipe(
    map(state => (state.theme === Theme.Light ? '#e4e4e4' : '#524f6a'))
  );

  private state = {
    lineColor: '#000000',
  };

  constructor() {
    super();

    this.subscriptions.add(
      this.lineColor$.subscribe(lineColor => {
        this.state = {
          lineColor,
        };
      })
    );
  }

  override render(
    context: CanvasRenderingContext2D,
    cameraOffset: { x: number; y: number }
  ): void {
    context.fillStyle = this.state.lineColor;
    // draw grid
    const gridStartX = cameraOffset.x % GridRenderer.GRID_SIZE;
    const gridStartY = cameraOffset.y % GridRenderer.GRID_SIZE;

    for (
      let x = gridStartX;
      x < context.canvas.width;
      x += GridRenderer.GRID_SIZE
    ) {
      context.fillRect(
        -cameraOffset.x + x,
        -cameraOffset.y,
        1,
        context.canvas.height
      );
    }

    for (
      let y = gridStartY;
      y < context.canvas.height;
      y += GridRenderer.GRID_SIZE
    ) {
      context.fillRect(
        -cameraOffset.x,
        -cameraOffset.y + y,
        context.canvas.width,
        1
      );
    }
  }
}
