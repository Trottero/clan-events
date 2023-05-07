import { BoardType } from '../enums/board-type.enum';

export interface CreateEventRequest {
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  boardType: BoardType;
}
