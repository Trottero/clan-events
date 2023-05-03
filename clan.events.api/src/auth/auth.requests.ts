import { DiscordUser } from 'src/discord/models/discord.user';
import { DiscordAccessTokenResponse } from './auth.service';

export interface CodeRedeemRequest {
  code: string;
}

export interface CodeRedeemResponse extends DiscordAccessTokenResponse {
  user: DiscordUser;
}
