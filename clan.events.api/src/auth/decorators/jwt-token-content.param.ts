import { JwtTokenContent } from '@common/auth';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const JwtTokenContentParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtTokenContent;
  },
);
