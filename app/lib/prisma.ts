import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Define a type for globalThis with prisma property
type GlobalWithPrisma = typeof globalThis & {
  prisma?: ReturnType<typeof prismaClientSingleton>;
};

declare global {
  let prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = ((globalThis as GlobalWithPrisma).prisma) ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') (globalThis as GlobalWithPrisma).prisma = prisma; 