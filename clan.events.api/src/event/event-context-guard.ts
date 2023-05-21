import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';

@Injectable()
export class EventContextGuard implements CanActivate {
  constructor(private readonly eventService: EventService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clanName = request.params.clanName;
    const eventId = request.params.eventId;

    if (!clanName) {
      throw new NotFoundException('Clanname not supplied');
    }

    if (!eventId) {
      throw new NotFoundException('Eventid not supplied');
    }

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
      console.error(ex);
      throw new NotFoundException(ex.message);
    }
  }
}

export function GuardEventContext() {
  return applyDecorators(UseGuards(ApiTokenGuard, EventContextGuard));
}
