import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTileRequest } from '@common/events';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { Event } from 'src/database/schemas/event.schema';
import { UserService } from 'src/user/user.service';
import { Tile } from 'src/database/schemas/tile.schema';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Tile.name) private tileModel: Model<Tile>,
    private readonly userService: UserService,
    private readonly clanService: ClanService,
  ) {}

  async getTiles(clanName: string, eventId: string) {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    return event.board.tiles;
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
}
