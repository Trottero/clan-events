export interface CreateTileRequest {
  name: string;

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
