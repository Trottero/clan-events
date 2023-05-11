import { BoardType } from '../enums/board-type.enum';

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
}

export interface BoardDto {
  type: BoardType;
}

export interface EventTeamDto {
  name: string;
  members: EventTeamMemberDto[];
}

export interface EventTeamMemberDto {
  name: string;
}
