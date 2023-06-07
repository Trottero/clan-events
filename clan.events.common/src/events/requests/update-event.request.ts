import { BoardType } from '../enums/board-type.enum';
import { EventVisibility } from '../enums/event-visibility.enum';

export interface UpdateEventParams {
  eventId: string;
}

export interface UpdateEventRequest {
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  boardType: BoardType;
  visibility: EventVisibility;
  startingTile?: string;
}
