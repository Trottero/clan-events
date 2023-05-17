import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventService } from './event.service';

@Injectable()
export class EventContextGuard implements CanActivate {
  constructor(private readonly eventService: EventService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clanName = request.params.clanName;
    const eventId = request.params.id;

    try {
      const event = await this.eventService.getEventById(
        request.user,
        clanName,
        eventId,
      );

      // We can't tell from this method if the user is authorized to access the event or if it was simply not found..
      if (!event) {
        throw new UnauthorizedException(
          'You are not authorized to access this event',
        );
      }

      request['event'] = event;
      return true;
    } catch (ex: any) {
      throw new NotFoundException(ex.message);
    }
  }
}
