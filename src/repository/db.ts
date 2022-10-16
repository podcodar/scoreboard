import { PrismaClient, User } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

interface AddDailyRecord {
  name: string;
  username: string;
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
