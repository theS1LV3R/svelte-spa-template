import { Role } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import prisma from '$lib/server/prisma';
import { t } from '$lib/server/trpc/t';

export const roleFilter = (
  roles: Role | Role[] | 'ignore',
  mode: 'exact' | 'any' | 'none' = 'any',
) => {
  return t.middleware(async ({ ctx, next }) => {
    if (ctx.userId === null) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing User ID' });
    }

    const user = await prisma.user.findUnique({ where: { id: ctx.userId } });
    if (user === null) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    if (user.roles.includes(Role.ADMIN)) {
      return next({
        ctx: { user },
      });
    }

    let failed = false;

    if (roles === 'ignore') {
      // We do not care about roles in this case
    } else if (Array.isArray(roles)) {
      switch (mode) {
        case 'exact': {
          // For every role the user has, if the role isn't amongst the ones required, change the value to true and set failed to true
          if (
            user.roles.reduce((prev, cur) => prev ?? (!roles.includes(cur) ? true : false), false)
          )
            failed = true;
          break;
        }
        case 'any': {
          if (roles.reduce((prev, val) => prev ?? user.roles.includes(val), false)) break;

          failed = true;
          break;
        }
        case 'none': {
          if (roles.reduce((prev, val) => prev ?? user.roles.includes(val), false)) failed = true;
          break;
        }
      }
    } else {
      switch (mode) {
        case 'exact': {
          if (user.roles.length !== 1 || user.roles[0] === roles) failed = true;
          break;
        }
        case 'any': {
          if (!user.roles.includes(roles)) failed = true;
          break;
        }
        case 'none': {
          if (user.roles.includes(roles)) break;
          failed = true;
          break;
        }
      }
    }

    if (failed) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Role filter failed.' });
    }

    return next({ ctx: { user } });
  });
};
export const needsAuth = roleFilter('ignore');
