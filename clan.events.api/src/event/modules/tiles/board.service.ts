import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTileRequest } from '@common/events';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { Event } from 'src/database/schemas/event.schema';
import { UserService } from 'src/user/user.service';
import { Tile, TileDocument } from 'src/database/schemas/tile.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Tile.name) private tileModel: Model<Tile>,
    private readonly userService: UserService,
    private readonly clanService: ClanService,
  ) {}

  async getTiles(clanName: string, eventId: string): Promise<TileDocument[]> {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    return event.board.tiles as TileDocument[];
  }

  async createTile(
    clanName: string,
    eventId: string,
    request: CreateTileRequest,
  ) {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    const tile = new this.tileModel({
      name: request.name,
      nextTile: request.nextTileId,
      canvas: {
        x: request.x,
        y: request.y,
        borderColor: request.borderColor,
        borderWidth: request.borderWidth,
        fillColor: request.fillColor,
        height: request.height,
        width: request.width,
        image: request.image,
      },
      challenges: [],
    });
    event.board.tiles.push(tile);

    await event.save();

    return tile;
  }

  async updateTile(
    clanName: string,
    eventId: string,
    tileId: string,
    body: CreateTileRequest,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    // get next tile in event
    const nextTile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === body.nextTileId,
    );

    tile.name = body.name;
    tile.nextTile = nextTile;
    tile.canvas = {
      x: body.x,
      y: body.y,
      borderColor: body.borderColor,
      borderWidth: body.borderWidth,
      fillColor: body.fillColor,
      height: body.height,
      width: body.width,
      image: body.image,
    };

    await event.save();
    return tile;
  }

  async patchTile(
    clanName: string,
    eventId: string,
    tileId: string,
    body: Partial<CreateTileRequest>,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    // get next tile in event
    const nextTile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === body.nextTileId,
    );

    tile.name = body.name ?? tile.name;
    tile.nextTile = body.nextTileId ? nextTile : tile.nextTile;
    tile.canvas = {
      x: body.x ?? tile.canvas.x,
      y: body.y ?? tile.canvas.y,
      borderColor: body.borderColor ?? tile.canvas.borderColor,
      borderWidth: body.borderWidth ?? tile.canvas.borderWidth,
      fillColor: body.fillColor ?? tile.canvas.fillColor,
      height: body.height ?? tile.canvas.height,
      width: body.width ?? tile.canvas.width,
      image: body.image ?? tile.canvas.image,
    };

    await event.save();
    return tile;
  }

  async deleteTile(clanName: string, eventId: string, tileId: string) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    event.board.tiles = event.board.tiles.filter(
      (tile) => (tile as TileDocument).id !== tileId,
    );

    await event.save();
  }

  private async getEventWithTile(
    clanName: string,
    eventId: string,
    tileId: string,
  ) {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .populate('board.tiles')
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    const eventHasTile = event.board.tiles.some(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!eventHasTile) {
      throw new NotFoundException();
    }

    return event;
  }
}
