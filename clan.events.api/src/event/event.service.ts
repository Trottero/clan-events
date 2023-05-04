import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { BoardType } from 'src/database/schemas/board.schema';
import { Event } from 'src/database/schemas/event.schema';
import {
  ItemRequirement,
  RequirementType,
} from 'src/database/schemas/requirements.schema';
import { Tile } from 'src/database/schemas/tile.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly userService: UserService,
    private readonly clanService: ClanService,
  ) {}

  public async createRandomEvent(): Promise<Event> {
    const finalTile: Tile = {
      name: 'Final Tile',
      challenges: [],
    };

    const nextTile: Tile = {
      name: 'Second Tile',
      challenges: [],
    };

    const startingTile: Tile = {
      name: 'Starting Tile',
      challenges: [],
    };

    const event = new this.eventModel({
      description: 'Test Event Description',
      name: 'Test Event',
      owner: await this.clanService.createRandomClan(),
      startsAt: new Date(),
      endsAt: new Date(),
      participants: [
        {
          name: 'Test Team',
          members: [await this.userService.createRandomUser()],
        },
      ],
      board: {
        name: 'Test Board',
        description: 'Test Board Description',
        type: BoardType.Tilerace,
        tiles: [startingTile, nextTile, finalTile],
      },
    });

    const result = await event.save();

    result.participants[0].tile = result.board.tiles[0];

    result.board.tiles[0].nextTile = result.board.tiles[1];
    result.board.tiles[0].challenges.push({
      nextTile: result.board.tiles[1],
      requirements: [
        {
          type: RequirementType.Item,
          amount: 1,
          itemId: 'Twisted Bow',
        } as ItemRequirement,
      ],
    });

    result.board.tiles[1].nextTile = result.board.tiles[2];
    result.board.tiles[1].challenges.push({
      nextTile: result.board.tiles[2],
      requirements: [
        {
          type: RequirementType.Item,
          amount: 1,
          itemId: 'Fang',
        } as ItemRequirement,
      ],
    });

    const id = await result.save().then((result) => result._id);
    return this.eventModel.findById(id).exec();
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
}
