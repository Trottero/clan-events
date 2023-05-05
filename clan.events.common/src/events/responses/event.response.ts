export interface EventResponse {
  id: string;
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  participants: EventTeamDto[];
  board: BoardDto;
}

export interface BoardDto {}

export interface EventTeamDto {
  name: string;
  members: EventTeamMemberDto[];
}

export interface EventTeamMemberDto {
  name: string;
}
