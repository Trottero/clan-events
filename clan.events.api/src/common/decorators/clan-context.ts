import { Clan } from 'src/database/schemas/clan.schema';

export interface ClanRequestContext extends Clan {
  id: string;
}
