import * as dotenv from "dotenv";

// Load .env configs
dotenv.config();

export const {
  BOT_ID = "",
  DAILY_CHANNEL = "",
  DISCORD_TOKEN = "",
} = process.env;

export const SCOREBOARD_TITLE = "\n**Scoreboard - %date**\n\n";

export const MAX_NAME_LENGTH = 25;

export const EXTRA_POINT_STANDUP_COUNT = 5;

export enum Weekday {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
