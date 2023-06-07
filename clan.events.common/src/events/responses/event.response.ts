import { BoardType } from '../enums/board-type.enum';
import { EventVisibility } from '../enums/event-visibility.enum';

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  participants: EventTeamDto[];
  board: BoardDto;
  clanName: string;
  clanDisplayName: string;
  visibility: EventVisibility;
}

export interface BoardDto {
  type: BoardType;
  startingTile?: string;
}

export interface EventTeamDto {
  name: string;
  members: EventTeamMemberDto[];
}

export interface EventTeamMemberDto {
  name: string;
}
