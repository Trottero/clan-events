import { DiscordUser } from 'src/discord/models/discord.user';
import { DiscordCodeRedeemResponse } from './auth.service';

export interface CodeRedeemRequest {
  code: string;
}

export interface CodeRedeemResponse extends DiscordCodeRedeemResponse {
  user: DiscordUser;
}
