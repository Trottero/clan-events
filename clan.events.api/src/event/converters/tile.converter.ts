import { TileResponse } from '@common/events';
import { InternalServerErrorException } from '@nestjs/common';
import { Tile, TileDocument } from 'src/database/schemas/tile.schema';

export function convertToTileResponse(tile: TileDocument): TileResponse {
  if (!tile.id) {
    throw new InternalServerErrorException("Tile doesn't have an id");
  }

  return {
    id: tile.id.toString(),
    name: tile.name,
    borderColor: tile.canvas.borderColor,
    borderWidth: tile.canvas.borderWidth,
    fillColor: tile.canvas.fillColor,
    height: tile.canvas.height,
    width: tile.canvas.width,
    x: tile.canvas.x,
    y: tile.canvas.y,
    image: tile.canvas.image,
    nextTileId: tile.nextTile?.toString(),
    challenges: tile.challenges.map((challenge) => ({
      id: challenge.id.toString(),
      description: challenge.description,
      nextTile: challenge.nextTile?.toString(),
    })),
  };
}
