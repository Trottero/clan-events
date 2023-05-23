import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserClanRole } from './user-clan-role.model';

export const UserClanRoleParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserClanRole;
  },
);
