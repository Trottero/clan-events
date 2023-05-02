import { Controller, Get } from '@nestjs/common';
import { ClanService } from './clan.service';
import { Clan } from 'src/database/schemas/clan.schema';

@Controller('clan')
export class ClanController {
  constructor(private readonly clanService: ClanService) {}

  @Get()
  async getAllClans(): Promise<Clan[]> {
    return await this.clanService.getAllClans();
  }

  @Get('random')
  async createRandomClan(): Promise<Clan> {
    const res = await this.clanService.createRandomClan();
    return res;
  }
}
