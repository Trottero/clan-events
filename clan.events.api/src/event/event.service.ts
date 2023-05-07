import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoardType, CreateEventRequest } from '@common/events';
import { Model } from 'mongoose';
import { JwtTokenContent } from 'src/auth/models/jwt.token';
import { ClanService } from 'src/clan/clan.service';
import {
  EventAction,
  EventActionType,
  MoveEventAction,
  RollDiceEventAction,
} from 'src/database/schemas/event-action.schema';
import { Event, EventDocument } from 'src/database/schemas/event.schema';
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

  public async countEventsForUser(user: JwtTokenContent): Promise<number> {
    return this.eventModel
      .countDocuments({
        'participants.name': user.username,
      })
      .exec();
  }

  public async getPaginatedEventsForUser(
    user: JwtTokenContent,
    page: number,
    pageSize: number,
  ): Promise<EventDocument[]> {
    return this.eventModel
      .find({
        'participants.name': user.username,
      })
      .limit(pageSize)
      .skip(page * pageSize)
      .exec();
  }

  public async getEventById(id: string): Promise<EventDocument> {
    return this.eventModel.findById(id).populate('participants.members').exec();
  }

  public async createEvent(
    user: JwtTokenContent,
    event: CreateEventRequest,
  ): Promise<EventDocument> {
    const newEvent = new this.eventModel<Event>({
      actions: [],
      board: {
        type: event.boardType,
        tiles: [],
      },
      description: event.description,
      startsAt: event.startsAt,
      endsAt: event.endsAt,
      name: event.name,
      participants: [
        {
          name: `${user.username}'s Team`,
          members: [await this.userService.getUserByUsername(user.username)],
        },
      ],
    });

    const result: EventDocument = await newEvent.save();
    result.populate('participants.members');
    return result;
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
