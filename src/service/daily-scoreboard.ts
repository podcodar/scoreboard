import {
  EXTRA_POINT_STANDUP_COUNT,
  MAX_NAME_LENGTH,
  SCOREBOARD_TITLE,
  Weekday,
} from "#/constants";
import {
  addDailyRecord,
  createUserRecord,
  countUserActivityLastDays,
  getScoreboard,
} from "#/repository/db";
import { DailyRecord } from "@prisma/client";
import { format } from "date-fns";

export async function makeScoreboardContent(limit = 10) {
  const now = new Date();
  const codeQuote = "```\n";
  const monthStartsAt = new Date();
  monthStartsAt.setDate(1);

  let content = SCOREBOARD_TITLE.replace("%date", format(now, "dd MMMM yyyy"));
  content += codeQuote;

  const scoreboard = await getScoreboard([monthStartsAt, now], limit);

  for (const idx in scoreboard) {
    const user = scoreboard[idx]!;
    const spaces = " ".repeat(MAX_NAME_LENGTH - user.name.length);
    const name = `${user.name} ${spaces}`;
    content += `${parseInt(idx) + 1}. ${name} | ${user.points}\n`;
  }

  content += codeQuote;
  return content;
}

export async function computeDaily(username: string, name = "") {
  const record = await addDailyRecord({ name, username });

  if (await shouldAddExtraPoint(record)) {
    await createUserRecord(record.userId);
  }
}

async function shouldAddExtraPoint(record: DailyRecord) {
  const weekday = new Date().getDay();
  if (weekday < Weekday.Thursday) return false;

  const count = await countUserActivityLastDays(record.userId, 1);
  if (count !== EXTRA_POINT_STANDUP_COUNT) return false;

  return true;
}
