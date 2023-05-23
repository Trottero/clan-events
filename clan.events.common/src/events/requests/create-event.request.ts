import { BoardType } from '../enums/board-type.enum';
import { EventVisibility } from '../enums/event-visibility.enum';

export interface CreateEventRequest {
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  eventVisibility: EventVisibility;
  boardType: BoardType;
}
