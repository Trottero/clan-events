import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventTeam } from 'src/database/schemas/event-team.schema';
import { EventDocument } from 'src/database/schemas/event.schema';
import { User } from 'src/database/schemas/user.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(EventTeam.name) private eventTeamModel: Model<EventTeam>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createTeam(
    event: EventDocument,
    eventTeam: EventTeam,
  ): Promise<EventTeam> {
    const newTeam = new this.eventTeamModel({
      members: [],
      name: eventTeam.name,
      tile: null,
    });

    event.participants.push(newTeam);
    await event.save();

    return eventTeam;
  }

  async updateTeam(
    event: EventDocument,
    eventTeamId: string,
    eventTeamName: string,
    eventTeamMembers: string[],
  ): Promise<EventTeam> {
    const team = event.participants.find((x) => (x as any).id === eventTeamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    team.name = eventTeamName;

    const users = await this.userModel
      .find({
        _id: { $in: eventTeamMembers },
      })
      .exec();

    team.members = users;
    await event.save();

    return team;
  }

  async deleteTeam(event: EventDocument, eventTeamId: string): Promise<void> {
    const team = event.participants.find((x) => (x as any).id === eventTeamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    event.participants = event.participants.filter(
      (x) => (x as any).id !== eventTeamId,
    );
    await event.save();
  }
}
