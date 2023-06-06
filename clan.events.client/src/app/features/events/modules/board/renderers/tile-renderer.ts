import { GridRenderer } from './grid-renderer';
import { ReadonlyTileRenderer } from './readonly-tile-renderer';

export class TileRenderer extends ReadonlyTileRenderer {
  override name: string = TileRenderer.name;

  override onGrabEnd(index: number, x: number, y: number): void {
    const tile = this.state.tiles[index];
    // snap to grid
    if (this.state.isGridEnabled) {
      tile.x = x - (x % GridRenderer.GRID_HALF_SIZE);
      tile.y = y - (y % GridRenderer.GRID_HALF_SIZE);
    } else {
      tile.x = x;
      tile.y = y;
    }
    this.boardService.updateTilePosition(tile.id, tile.x, tile.y);
  }

  override onGrabMove(index: number, x: number, y: number): void {
    const tile = this.state.tiles[index];
    // snap to grid
    if (this.state.isGridEnabled) {
      tile.x = x - (x % GridRenderer.GRID_HALF_SIZE);
      tile.y = y - (y % GridRenderer.GRID_HALF_SIZE);
    } else {
      tile.x = x;
      tile.y = y;
    }
  }
}
