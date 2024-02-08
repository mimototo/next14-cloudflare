import { PrismaClient } from "@prisma/client/extension";

declare global {
  // biome-ignore lint/style/noVar: <explanation>
  var prisma: PrismaClient | undefined
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export const db = prisma

