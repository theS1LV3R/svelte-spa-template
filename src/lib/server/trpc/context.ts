import type { User } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';

export type Context = { userId: User['id'] | null };

export async function createContext(req: RequestEvent): Promise<Context> {
  const key = req.cookies.get('sessionKey');
  if (key === undefined) return { userId: null };

  const session = await prisma.session.findUnique({ where: { key } });
  if (session === null) return { userId: null };

  return { userId: session.userId };
}
