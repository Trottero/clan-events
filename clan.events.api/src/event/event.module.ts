import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/database/schemas/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { ClanModule } from 'src/clan/clan.module';
import { UserModule } from 'src/user/user.module';
import { BoardController } from './modules/board/board.controller';
import { BoardService } from './modules/board/board.service';
import { Tile, TileSchema } from 'src/database/schemas/tile.schema';
import { AuthModule } from 'src/auth/auth.module';
import { TeamsService } from './modules/teams/teams.service';
import { TeamsController } from './modules/teams/teams.controller';
import {
  EventTeam,
  EventTeamSchema,
} from 'src/database/schemas/event-team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      {
        name: Tile.name,
        schema: TileSchema,
      },
      {
        name: EventTeam.name,
        schema: EventTeamSchema,
      },
    ]),
    ClanModule,
    UserModule,
    AuthModule,
  ],
  controllers: [EventController, BoardController, TeamsController],
  providers: [EventService, BoardService, TeamsService],
  exports: [EventService, BoardService, TeamsService],
})
export class EventModule {}
