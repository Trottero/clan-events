import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTileRequest } from '@common/events';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { Event } from 'src/database/schemas/event.schema';
import { Tile, TileDocument } from 'src/database/schemas/tile.schema';
import { Image } from 'src/database/schemas/image.schema';
import { Board } from 'src/database/schemas/board.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Tile.name) private tileModel: Model<Tile>,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    private readonly clanService: ClanService,
  ) {}

  async getBoard(clanName: string, eventId: string): Promise<Board> {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    return event.board as Board;
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

  async updateBackground(
    name: string,
    eventId: string,
    file: Express.Multer.File,
  ) {
    const clan = await this.clanService.getClanByName(name);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    const image = new this.imageModel<Image>({
      mimeType: file.mimetype,
      buffer: file.buffer,
    });

    event.board.background = image;

    await event.save();

    return image;
  }

  async getBackground(name: string, eventId: string) {
    const clan = await this.clanService.getClanByName(name);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    return event.board.background;
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
