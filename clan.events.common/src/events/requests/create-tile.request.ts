export interface CreateTileRequest {
  name: string;
  nextTileId?: string;

  // canvas
  image?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  borderWidth: number;
  borderColor: string;
}
