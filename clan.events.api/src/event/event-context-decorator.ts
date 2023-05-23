import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Event } from 'src/database/schemas/event.schema';

export const EventContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.event as EventRequestContext;
  },
);

export interface EventRequestContext extends Event {
  id: string;
}
