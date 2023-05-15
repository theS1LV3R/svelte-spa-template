import { randomBytes } from 'crypto';
import type { User } from '@prisma/client';
import prisma from '$lib/server/prisma';

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function genSession(userId: User['id']) {
  const now = new Date();
  await prisma.session.deleteMany({ where: { expiresAt: { lt: now } } });

  let key = randomBytes(64).toString('hex');

  while ((await prisma.session.findUnique({ where: { key } })) !== null) {
    console.log('Generated key already taken, regenerating');

    key = randomBytes(64).toString('hex');
  }

  const expiresAt = new Date();
  expiresAt.setUTCMinutes(expiresAt.getUTCMinutes() + 60);

  await prisma.session.create({
    data: {
      userId,
      expiresAt,
      key,
    },
  });

  return key;
}

// Exclude keys from user
export function exclude<T, Key extends keyof T>(object: T, keys: Key[]): Omit<T, Key> {
  for (const key of keys) {
    delete object[key];
  }
  return object;
}
