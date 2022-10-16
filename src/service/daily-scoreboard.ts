import {
  addDailyRecord,
  createUserRecord,
  countUserActivityLastDays,
} from "#/repository/db";
import { DailyRecord } from "@prisma/client";

export async function computeDaily(username: string, name = "") {
  const record = await addDailyRecord({ name, username });

  if (await shouldAddExtraPoint(record)) {
    await createUserRecord(record.userId);
  }
}

const EXTRA_POINT_STANDUP_COUNT = 5;

enum Weekday {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

async function shouldAddExtraPoint(record: DailyRecord) {
  const weekday = new Date().getDay();
  if (weekday < Weekday.Thursday) return false;

  const count = await countUserActivityLastDays(record.userId, 1);
  if (count !== EXTRA_POINT_STANDUP_COUNT) return false;

  return true;
}
