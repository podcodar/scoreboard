import { createContext } from "./db.context";

export interface AddDailyRecord {
  username: string;
}

export type TimeRange = [Date, Date];

const { prisma, subDays } = createContext();

export async function getScoreboard(range: TimeRange, limit = 10) {
  const [from, to] = range;
  const userScoreboard = await prisma.user.findMany({
    select: {
      username: true,
      _count: {
        select: {
          dailyRecords: {
            where: {
              createdAt: { gt: from, lte: to },
            },
          },
        },
      },
    },
    orderBy: {
      dailyRecords: { _count: "desc" },
    },
    take: limit,
  });

  return userScoreboard.map((user) => ({
    name: user.username,
    points: user._count.dailyRecords,
  }));
}

export async function createUserRecord(userId: number) {
  const record = await prisma.dailyRecord.create({ data: { userId: userId } });
  if (record == null) throw new Error("Cannot create record");
  return record;
}

export async function addDailyRecord({ username }: AddDailyRecord) {
  let user = await prisma.user.findFirst({ where: { username } });

  if (user == null) {
    user = await prisma.user.create({ data: { username } });
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

export async function countUserActivityLastDays(userId: number, days: number) {
  const limitDate = subDays(Date.now(), days);
  return await prisma.dailyRecord.count({
    where: {
      userId,
      createdAt: { gte: limitDate },
    },
  });
}
