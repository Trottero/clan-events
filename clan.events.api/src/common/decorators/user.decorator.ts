import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenContent } from 'clan.events.common/auth';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtTokenContent;
  },
);
