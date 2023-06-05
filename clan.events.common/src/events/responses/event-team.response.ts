import { EventTeamMemberResponse } from './event-team-member.response';

export interface EventTeamResponse {
  id: string;
  name: string;
  members: EventTeamMemberResponse[];
}
