import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClanContext } from 'src/auth/user-clan-context';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserClanContext;
  },
);
