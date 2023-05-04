import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { BoardType } from 'src/database/schemas/board.schema';
import {
  EventAction,
  EventActionType,
  MoveEventAction,
  RollDiceEventAction,
} from 'src/database/schemas/event-action.schema';
import { Event } from 'src/database/schemas/event.schema';
import {
  ItemRequirement,
  RequirementType,
} from 'src/database/schemas/requirements.schema';
import { Tile } from 'src/database/schemas/tile.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {
  public constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly userService: UserService,
    private readonly clanService: ClanService,
  ) {}

  public async createRandomEvent(): Promise<Event> {
    const finalTile = this.createTile('Final Tile');
    const nextTile = this.createTile('Next Tile');
    const startingTile = this.createTile('Starting Tile');

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

    result.actions.push({
      type: EventActionType.RollDice,
      roll: 2,
      actor: result.participants[0].members[0],
      team: result.participants[0],
      performedAt: new Date(),
    } as RollDiceEventAction & EventAction);

    result.actions.push({
      type: EventActionType.Move,
      destination: result.board.tiles[2],
      actor: result.participants[0].members[0],
      team: result.participants[0],
      performedAt: new Date(),
    } as MoveEventAction);

    const id = await result.save().then((result) => result._id);
    return this.eventModel.findById(id).exec();
  }

  public async getAllEvents(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  private createTile(name: string): Tile {
    return {
      name,
      challenges: [],
      canvas: {
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        borderWidth: 1,
        borderColor: '#000000',
      },
    };
  }
}
