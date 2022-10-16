import { addDailyRecord, countUserActivityLastDays } from "#/repository/db";
import { DailyRecord } from "@prisma/client";

export async function computeDaily(username: string, name = "") {
  const record = await addDailyRecord({ name, username });

  await computeExtraPoint(record);
}

async function computeExtraPoint(record: DailyRecord) {
  const count = await countUserActivityLastDays(record.userId, 1);
  // WIP: implement
  console.log({ count });
}
