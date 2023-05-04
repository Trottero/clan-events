import { EventResponse } from 'clan.events.common/events';
import { EventDocument } from 'src/database/schemas/event.schema';

export function convertToEventResponse(event: EventDocument): EventResponse {
  return {
    id: event.id.toString(),
    name: event.name,
    description: event.description,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    board: event.board,
    participants: event.participants.map((participant) => ({
      name: participant.name,
      members: participant.members.map((member) => ({
        name: member.name,
      })),
    })),
  };
}
