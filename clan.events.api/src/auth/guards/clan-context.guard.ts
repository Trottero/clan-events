import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClanService } from 'src/clan/clan.service';

@Injectable()
export class ClanContextGuard implements CanActivate {
  constructor(private readonly clanService: ClanService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clanName = request.params.clanName;
    const clan = await this.clanService.getClanByName(clanName);

    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    request['clan'] = clan;
    return true;
  }
}
