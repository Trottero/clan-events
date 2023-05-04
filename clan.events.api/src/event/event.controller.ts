import { Controller, Get, Param, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/database/schemas/event.schema';
import { EventModel } from 'clan.events.common';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return await this.eventService.getAllEvents();
  }

  @Get('random')
  async createRandomEvent(): Promise<Event> {
    return await this.eventService.createRandomEvent();
  }

  @Get(':id')
  async getEventById(@Param() params): Promise<EventModel> {
    const id = params.id;
    const event = await this.eventService.getEventById(id);
    return {
      id: event.id,
      name: event.name,
    };
  }
}
