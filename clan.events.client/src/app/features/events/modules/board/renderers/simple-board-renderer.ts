import { TileResponse } from '@common/events';
import { Observable, combineLatest, map } from 'rxjs';
import { filterMapSuccess } from 'src/app/core/common/operators/loadable';
import { Theme } from 'src/app/core/components/theming/theme';
import { BoardCanvasObject } from './board-canvas-object';
import { BoardRenderer } from './board-renderer';
import { GridRenderer } from './grid-renderer';

export class SimpleBoardRenderer extends BoardRenderer {
  override name: string = SimpleBoardRenderer.name;

  tiles$ = this.boardService.tiles$.pipe(filterMapSuccess(x => x.value));

  override canvasObjects$: Observable<BoardCanvasObject[]> = this.tiles$.pipe(
    map(tiles => tiles.data.map(mapTileToCanvasObject))
  );

  lineColor$ = this.themingService.theme$.pipe(
    map(state => (state.theme === Theme.Light ? '#e4e4e4' : '#524f6a'))
  );

  textColor$ = this.themingService.theme$.pipe(
    map(state => (state.theme === Theme.Light ? '#333333de' : '#e2d7ec'))
  );

  private state = {
    tiles: [] as TileResponse[],
    lineColor: '#000000',
    textColor: '#000000',
  };

  constructor() {
    super();

    this.subscriptions.add(
      combineLatest([this.tiles$, this.lineColor$, this.textColor$]).subscribe(
        ([tiles, lineColor, textColor]) => {
          this.state = {
            tiles: tiles.data,
            lineColor,
            textColor,
          };
        }
      )
    );
  }

  override onGrabEnd(index: number, x: number, y: number): void {
    const tile = this.state.tiles[index];
    // snap to grid
    tile.x = x - (x % GridRenderer.GRID_HALF_SIZE);
    tile.y = y - (y % GridRenderer.GRID_HALF_SIZE);
    this.boardService.updateTilePosition(tile.id, tile.x, tile.y);
  }

  override onGrabMove(index: number, x: number, y: number): void {
    const tile = this.state.tiles[index];
    // snap to grid
    tile.x = x - (x % GridRenderer.GRID_HALF_SIZE);
    tile.y = y - (y % GridRenderer.GRID_HALF_SIZE);
  }

  override render(context: CanvasRenderingContext2D): void {
    this.renderEdges(context);
    this.renderTiles(context);
  }

  override selectCanvasObject(index?: number): void {
    const id =
      index !== undefined && index > -1
        ? this.state.tiles[index].id
        : undefined;
    this.boardService.setSelectedTileId(id ?? null);
  }

  private renderEdges(context: CanvasRenderingContext2D): void {
    for (const object of this.state.tiles) {
      if (!object.nextTileId) {
        continue;
      }

      const nextObject = this.state.tiles.find(
        x => x.id === object.nextTileId
      ) as TileResponse;

      if (!nextObject) {
        continue;
      }

      context.beginPath();
      context.moveTo(object.x + object.width / 2, object.y + object.height / 2);
      context.lineTo(
        nextObject.x + nextObject.width / 2,
        nextObject.y + nextObject.height / 2
      );
      context.strokeStyle = this.state.lineColor;
      context.lineWidth = 5;
      context.stroke();
    }
  }

  private renderTiles(context: CanvasRenderingContext2D): void {
    // set shadow
    context.shadowColor = 'rgba(0, 0, 0, 0.1)';
    context.shadowBlur = 10;
    context.shadowOffsetX = -2;
    context.shadowOffsetY = 5;

    // draw lines between objects

    for (const object of this.state.tiles) {
      context.fillStyle = object.fillColor;
      context.fillRect(object.x, object.y, object.width, object.height);
      context.strokeStyle = object.borderColor;
      context.lineWidth = object.borderWidth;

      if (object.borderWidth > 0) {
        context.strokeRect(
          object.x + object.borderWidth / 2,
          object.y + object.borderWidth / 2,
          object.width - object.borderWidth,
          object.height - object.borderWidth
        );
      }

      // draw text
      context.fillStyle = this.state.textColor;
      context.font = '500 16px "Roboto"';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(
        object.name,
        object.x + object.width / 2,
        object.y + object.height + 20
      );
    }
  }
}

function mapTileToCanvasObject(tile: TileResponse): BoardCanvasObject {
  return {
    x: tile.x,
    y: tile.y,
    width: tile.width,
    height: tile.height,
  };
}
