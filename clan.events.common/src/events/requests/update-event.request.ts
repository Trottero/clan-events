import { BoardType } from '../enums/board-type.enum';

export interface UpdateEventParams {
  id: string;
}

export interface UpdateEventRequest {
  name: string;
  description: string;
  startsAt: Date;
  endsAt: Date;
  boardType: BoardType;
}
