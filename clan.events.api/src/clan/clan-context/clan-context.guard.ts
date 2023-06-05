import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClanService } from 'src/clan/clan.service';

/**
 * This guard is used to ensure that the clan exists in the database and automatically adds the clan to the request object with the key 'clan'.
 * The clan is of type @see @link{ClanContext}
 *
 * Use this in conjunction with the @see @link{ClanContextParam} parameter decorator in order to grab it from the request.
 *
 * @example
 * Use this guard in your route handler like this:
 * ```ts
 * \@Get(':clanName')
 * \@UseGuards(ClanContextGuard)
 * async getClan(\@ClanContextParam() clanContext: ClanContext) {
 *    ...
 * }
 * ```
 */
@Injectable()
export class ClanContextGuard implements CanActivate {
  constructor(private readonly clanService: ClanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clanName = request.params.clanName;

    if (!clanName) {
      throw new NotFoundException('Clan not found');
    }

    const clan = await this.clanService.getClanByName(clanName);

    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    request['clan'] = clan;
    return true;
  }
}
