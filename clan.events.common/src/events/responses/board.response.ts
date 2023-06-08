import { BoardType } from '../enums/board-type.enum';
import { TileResponse } from './tile.response';

export interface BoardResponse {
  type: BoardType;
  startingTileId?: string;
  tiles: TileResponse[];
}
