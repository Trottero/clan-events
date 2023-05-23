import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClanContext } from './clan-context.model';

export const ClanContextParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.clan as ClanContext;
  },
);
