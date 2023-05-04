import { EventListItem } from 'clan.events.common/events';
import { PaginatedModel, PaginationModel } from 'clan.events.common/responses';
import { EventDocument } from '../../database/schemas/event.schema';

export function convertToEventListResponse(
  events: EventDocument[],
  pagination: PaginationModel,
): PaginatedModel<EventListItem> {
  return {
    items: events.map(convertToEventResponse),
    ...pagination,
  };
}

function convertToEventResponse(event: EventDocument): EventListItem {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    numberOfParticipants: event.participants.length,
  };
}
