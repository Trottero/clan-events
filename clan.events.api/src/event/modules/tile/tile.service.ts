import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateChallengeRequest,
  CreateTileRequest,
  UpdateChallengeRequest,
} from '@common/events';
import { Model } from 'mongoose';
import { ClanService } from 'src/clan/clan.service';
import { Event } from 'src/database/schemas/event.schema';
import { TileDocument } from 'src/database/schemas/tile.schema';
import { ChallengeDocument } from 'src/database/schemas/challenge.schema';

@Injectable()
export class TileService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private readonly clanService: ClanService,
  ) {}

  async getChallenges(
    clanName: string,
    eventId: string,
    tileId: string,
  ): Promise<ChallengeDocument[]> {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    return tile.challenges as ChallengeDocument[];
  }

  async createChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    challenge: CreateChallengeRequest,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    const nextTile = challenge.nextTile
      ? event.board.tiles.find(
          (tile) => (tile as TileDocument).id === challenge.nextTile,
        )
      : null;

    tile.challenges.push({
      description: challenge.description,
      nextTile: nextTile ? (nextTile as TileDocument).id : null,
    });

    await event.updateOne({
      board: event.board,
    });
  }

  async updateChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    challengeId: string,
    challenge: UpdateChallengeRequest,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    const challengeToUpdate = tile.challenges.find(
      (challenge) => (challenge as ChallengeDocument).id === challengeId,
    );

    if (!challengeToUpdate) {
      throw new NotFoundException();
    }

    const nextTile = challenge.nextTile
      ? (
          event.board.tiles.find(
            (tile) => (tile as TileDocument).id === challenge.nextTile,
          ) as TileDocument
        )?.id
      : null;

    challengeToUpdate.description = challenge.description;
    challengeToUpdate.nextTile = nextTile;

    await event.save();
  }

  async deleteChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    challengeId: string,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    const challengeToDelete = tile.challenges.find(
      (challenge) => (challenge as ChallengeDocument).id === challengeId,
    );

    if (!challengeToDelete) {
      throw new NotFoundException();
    }

    tile.challenges = tile.challenges.filter(
      (challenge) => (challenge as ChallengeDocument).id !== challengeId,
    );

    await event.save();
  }

  async updateTile(
    clanName: string,
    eventId: string,
    tileId: string,
    body: CreateTileRequest,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    // get next tile in event
    const nextTile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === body.nextTileId,
    ) as TileDocument | undefined;

    tile.name = body.name;
    tile.nextTile = nextTile?.id;
    tile.canvas = {
      x: body.x,
      y: body.y,
      borderColor: body.borderColor,
      borderWidth: body.borderWidth,
      fillColor: body.fillColor,
      height: body.height,
      width: body.width,
      image: body.image,
    };

    await event.save();
    return tile;
  }

  async patchTile(
    clanName: string,
    eventId: string,
    tileId: string,
    body: Partial<CreateTileRequest>,
  ) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    // get next tile in event
    const nextTile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === body.nextTileId,
    ) as TileDocument | undefined;

    tile.name = body.name ?? tile.name;
    tile.nextTile = body.nextTileId ? nextTile?.id : tile.nextTile;
    tile.canvas = {
      x: body.x ?? tile.canvas.x,
      y: body.y ?? tile.canvas.y,
      borderColor: body.borderColor ?? tile.canvas.borderColor,
      borderWidth: body.borderWidth ?? tile.canvas.borderWidth,
      fillColor: body.fillColor ?? tile.canvas.fillColor,
      height: body.height ?? tile.canvas.height,
      width: body.width ?? tile.canvas.width,
      image: body.image ?? tile.canvas.image,
    };

    await event.save();
    return tile;
  }

  async deleteTile(clanName: string, eventId: string, tileId: string) {
    const event = await this.getEventWithTile(clanName, eventId, tileId);

    const tile = event.board.tiles.find(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!tile) {
      throw new NotFoundException();
    }

    event.board.tiles = event.board.tiles.filter(
      (tile) => (tile as TileDocument).id !== tileId,
    );

    await event.save();
  }

  private async getEventWithTile(
    clanName: string,
    eventId: string,
    tileId: string,
  ) {
    const clan = await this.clanService.getClanByName(clanName);
    const event = await this.eventModel
      .findOne({ _id: eventId, owner: clan.id })
      .populate('board.tiles')
      .exec();

    if (!event) {
      throw new NotFoundException();
    }

    const eventHasTile = event.board.tiles.some(
      (tile) => (tile as TileDocument).id === tileId,
    );

    if (!eventHasTile) {
      throw new NotFoundException();
    }

    return event;
  }
}
