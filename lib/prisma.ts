import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import "dotenv/config";

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL biến môi trường chưa được nạp!");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter: adapter});
};

// Khai báo global để tránh bị mất kết nối khi Hot Reload
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;