import { createContext } from "./db.context";

export interface AddDailyRecord {
  name: string;
  username: string;
}

export type TimeRange = [Date, Date];

const { prisma, subDays } = createContext();

export async function getScoreboard(range: TimeRange, limit = 10) {
  const [from, to] = range;
  const res = await prisma.dailyRecord.groupBy({
    by: ["userId"],
    _sum: { userId: true },
    where: {
      createdAt: { gt: from, lte: to },
    },
  });
  console.log(res);
}

export async function createUserRecord(userId: number) {
  const record = await prisma.dailyRecord.create({ data: { userId: userId } });
  if (record == null) throw new Error("Cannot create record");
  return record;
}

export async function addDailyRecord({ username, name }: AddDailyRecord) {
  let user = await prisma.user.findFirst({ where: { username } });

  if (user == null) {
    user = await prisma.user.create({ data: { username, name } });
    if (user == null) throw new Error("Cannot create user");
  }

  const record = await prisma.dailyRecord.findFirst({
    orderBy: { createdAt: "desc" },
    where: {
      userId: user.id,
      createdAt: { gt: subDays(Date.now(), 1) },
    },
  });

  if (record != null) return record;
  return createUserRecord(user.id);
}

export async function countUserActivityLastDays(
  userId: number,
  days: number
): Promise<number> {
  const limitDate = subDays(Date.now(), days);

  return await prisma.dailyRecord.count({
    where: {
      userId,
      createdAt: { gte: limitDate },
    },
  });
}
