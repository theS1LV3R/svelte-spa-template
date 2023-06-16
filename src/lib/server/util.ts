import { randomBytes } from 'crypto';
import type { User } from '@prisma/client';
import prisma from '$lib/server/prisma';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function genSession(userId: User['id']) {
  const now = new Date();
  await prisma.session.deleteMany({ where: { expiresAt: { lt: now } } });

  let key = '';
  while ((key = randomBytes(64).toString('hex'))) {
    if ((await prisma.session.findUnique({ where: { key } })) === null) break;

    console.log('Generated key already taken, regenerating');
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

export const fileUploadPath = resolve(fileURLToPath(import.meta.url), '../../../../uploads');
