// Path: apps/api/src/lib/prisma.ts
//
// Singleton Prisma client v7.
//
// Why singleton? In development, Next.js/tsx hot-reloads
// the module on every file save. Without this pattern,
// you'd create a NEW database connection on every reload
// and quickly exhaust Postgres's connection pool (default: 100).
//
// This pattern creates ONE client and reuses it. 

import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Grab the connection string from your environment variables
const connectionString = process.env.DATABASE_URL!;

// 2. Instantiate the Prisma Postgres adapter
const adapter = new PrismaPg({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // 3. Pass the adapter to the PrismaClient constructor
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] // log all SQL in dev
        : ['error'], // only errors in production
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;