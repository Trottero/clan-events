import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventRequest, UpdateEventRequest } from '@common/events';
import { Model } from 'mongoose';
import { JwtTokenContent } from '@common/auth';
import { ClanService } from 'src/clan/clan.service';
import { Event, EventDocument } from 'src/database/schemas/event.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly userService: UserService,
    private readonly clanService: ClanService,
  ) {}

  async countEventsForUser(user: JwtTokenContent): Promise<number> {
    const userObj = await this.userService.getUserByUsername(user.username);

    return this.eventModel
      .countDocuments({
        'participants.members': {
          $eq: userObj.id,
        },
      })
      .exec();
  }

  async getPaginatedEventsForUser(
    user: JwtTokenContent,
    page: number,
    pageSize: number,
  ): Promise<EventDocument[]> {
    const userObj = await this.userService.getUserByUsername(user.username);

    const events = await this.eventModel
      .find({
        'participants.members': {
          $eq: userObj.id,
        },
      })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(page * pageSize)
      .exec();

    return events;
  }

  async getEventById(
    user: JwtTokenContent,
    id: string,
  ): Promise<EventDocument | null> {
    const userObj = await this.userService.getUserByUsername(user.username);

    const hasAccess = await this.eventModel.exists({
      _id: id,
      'participants.members': {
        $eq: userObj.id,
      },
    });

    if (!hasAccess) return null;

    return this.eventModel.findById(id).populate('participants.members').exec();
  }

  async createEvent(
    user: JwtTokenContent,
    event: CreateEventRequest,
  ): Promise<EventDocument> {
    const userObj = await this.userService.getUserByUsername(user.username);

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
          members: [userObj.id],
        },
      ],
    });

    const result: EventDocument = await newEvent.save();
    result.populate('participants.members');

    return result;
  }

  /**
   * Deletes an event by id
   * @param user the user requesting the event to be deleted
   * @param id the id of the event to be deleted
   */
  deleteEventById(user: JwtTokenContent, id: string) {
    // TODO: check if user is admin of the clan
    return this.eventModel.deleteOne({ _id: id }).exec();
  }

  async updateEvent(
    id: string,
    event: UpdateEventRequest,
  ): Promise<EventDocument> {
    const oldEvent = await this.eventModel.findById(id).exec();

    if (!oldEvent) {
      throw new NotFoundException('Event not found');
    }

    oldEvent.name = event.name;
    oldEvent.description = event.description;
    oldEvent.startsAt = event.startsAt;
    oldEvent.endsAt = event.endsAt;
    oldEvent.board.type = event.boardType;

    const result: EventDocument = await oldEvent.save();
    result.populate('participants.members');

    return result;
  }
}
