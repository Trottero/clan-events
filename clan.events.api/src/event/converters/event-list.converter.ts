import { PaginatedModel, PaginationModel } from '@common/responses';
import { EventListItem } from '@common/events';
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
