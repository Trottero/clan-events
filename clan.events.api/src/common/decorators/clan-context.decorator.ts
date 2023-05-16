import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClanRequestContext } from './clan-context';

export const ClanContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.clan as ClanRequestContext;
  },
);
