export interface TileResponse {
  id: string;
  name: string;
  nextTileId?: string;

  // canvas
  image?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
}
