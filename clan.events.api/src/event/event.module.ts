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
import { TileController } from './modules/tile/tile.controller';
import { TileService } from './modules/tile/tile.service';
import { TeamsService } from './modules/teams/teams.service';
import { TeamsController } from './modules/teams/teams.controller';
import {
  EventTeam,
  EventTeamSchema,
} from 'src/database/schemas/event-team.schema';
import { Image, ImageSchema } from 'src/database/schemas/image.schema';

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
      {
        name: Image.name,
        schema: ImageSchema,
      },
    ]),
    ClanModule,
    UserModule,
    AuthModule,
  ],
  controllers: [
    EventController,
    BoardController,
    TileController,
    TeamsController,
  ],
  providers: [EventService, BoardService, TileService, TeamsService],
  exports: [EventService, BoardService, TeamsService],
})
export class EventModule {}
