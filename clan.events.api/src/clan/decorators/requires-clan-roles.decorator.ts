import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { EnsureApiTokenGuard } from '../../auth/guards/ensure-api-token.guard';
import { UserClanRoleGuard } from '../clan-role/user-clan-role-guard';
import { ClanContextGuard } from '../clan-context/clan-context.guard';
import { ClanRole } from '@common/auth/clan.role';

export const CLAN_ROLES_KEY = 'clan_roles';

/**
 * Combination of the following guards:
 * - @see @link{EnsureApiTokenGuard}
 * - @see @link{ClanContextGuard}
 * - @see @link{ClanRoleGuard}
 *
 * This guard is used to ensure that the user has the required roles in the clan.
 * @param roles The roles that are required to access the route
 * @returns
 * @example
 * \@RequiresClanRoles(ClanRole.Admin)
 * \@Get(':clanName')
 * async getClan(\@ClanContextParam() clanContext: ClanContext) {
 *   ...
 * }
 */
export function RequiresClanRoles(...roles: ClanRole[]) {
  return applyDecorators(
    SetMetadata(CLAN_ROLES_KEY, roles),
    UseGuards(EnsureApiTokenGuard, ClanContextGuard, UserClanRoleGuard),
  );
}
