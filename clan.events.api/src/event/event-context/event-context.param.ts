import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EventContext } from './event-context.model';

export const EventContextParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.event as EventContext;
  },
);
