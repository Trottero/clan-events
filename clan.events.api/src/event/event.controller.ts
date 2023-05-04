import { Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/database/schemas/event.schema';

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
}
