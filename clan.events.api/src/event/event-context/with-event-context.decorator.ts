import { UseGuards, applyDecorators } from '@nestjs/common';
import { EnsureApiTokenGuard } from 'src/auth/guards/ensure-api-token.guard';
import { ClanContextGuard } from 'src/clan/clan-context/clan-context.guard';
import { UserClanRoleGuard } from 'src/clan/clan-role/user-clan-role-guard';
import { EventContextGuard } from './event-context.guard';

export function WithEventContext() {
  return applyDecorators(
    UseGuards(
      EnsureApiTokenGuard,
      ClanContextGuard,
      UserClanRoleGuard,
      EventContextGuard,
    ),
  );
}
