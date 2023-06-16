import { Role, type User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import prisma from '$lib/server/prisma';
import { t } from '$lib/server/trpc/t';
import { checkRoles } from '$lib/util';
import type { roleCheckModes } from '$lib/types';

const checkUser = async (userId: number | null) => {
  if (userId === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing User ID' });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
  }

  return user;
};

export const checkUserMiddleware = t.middleware(async ({ ctx: { userId }, next }) =>
  next({ ctx: { user: await checkUser(userId) } }),
);

export const roleFilter = (roles: Role | Role[] | 'ignore', mode: roleCheckModes = 'either') =>
  t.middleware(async ({ ctx, next }) => {
    const user = await checkUser(ctx.userId);

    if (checkRoles(user, Role.ADMIN)) {
      return next({ ctx: { user } });
    }

    if (checkRoles(user, roles, mode)) {
      return next({ ctx: { user } });
    }

    throw new TRPCError({ code: 'FORBIDDEN', message: 'Role filter failed.' });
  });

export const needsAuth = roleFilter('ignore');
