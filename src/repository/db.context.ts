import { PrismaClient } from "@prisma/client";
import { subDays } from "date-fns";

const prisma = new PrismaClient();

export function createContext() {
  return { prisma, subDays };
}

export type Context = ReturnType<typeof createContext>;
