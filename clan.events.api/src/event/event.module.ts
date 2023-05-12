import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/database/schemas/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ClanModule } from 'src/clan/clan.module';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './modules/tiles/board.controller';
import { BoardService } from './modules/tiles/board.service';
import { Board, BoardSchema } from 'src/database/schemas/board.schema';
import { Tile, TileSchema } from 'src/database/schemas/tile.schema';
import {
  Challenge,
  ChallengeSchema,
} from 'src/database/schemas/challenge.schema';
import { CanvasTile } from 'src/database/schemas/canvas-tile.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      {
        name: Board.name,
        schema: BoardSchema,
      },
      {
        name: Tile.name,
        schema: TileSchema,
      },
      {
        name: Challenge.name,
        schema: ChallengeSchema,
      },
    ]),
    ClanModule,
    UserModule,
    AuthModule,
  ],
  controllers: [EventController, BoardController],
  providers: [EventService, BoardService],
  exports: [EventService, BoardService],
})
export class EventModule {}
