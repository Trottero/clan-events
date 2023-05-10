import { ClanPermissions } from '../../auth';
import { Clan } from './clan';

export interface ClanWithMembers extends Clan {
  members: ClanPermissions[];
}
