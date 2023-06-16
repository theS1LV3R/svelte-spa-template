import prisma from '$lib/server/prisma';
import { checkUserMiddleware, roleFilter } from '$lib/server/trpc/middleware';
import { t } from '$lib/server/trpc/t';
import type { BetterOmit } from '$lib/types';
import { checkRoles, exclude } from '$lib/util';
import { Role, type User, type Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { genSaltSync, hashSync } from 'bcrypt';
import { z } from 'zod';

const zodRoleEnum = z.enum([Role.ADMIN, ...Object.values(Role)]);

export default t.router({
  user: t.procedure.query(async ({ ctx: { userId } }) => {
    if (userId === null) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user === null) return null;

    return exclude(user, ['passwordHash']);
  }),

  getUsers: t.procedure
    .use(roleFilter(Role.ADMIN))
    .query(async (): Promise<Omit<User, 'passwordHash'>[]> => {
      const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });

      return users.map((user) => exclude(user, ['passwordHash']));
    }),

  getRoles: t.procedure.query(async (): Promise<Role[]> => {
    return Object.values(Role);
  }),

  resetPassword: t.procedure
    .input(
      z.object({
        password: z.string().min(8),
        userId: z.number(),
      }),
    )
    .use(roleFilter(Role.ADMIN))
    .query(async ({ input: { password, userId } }) => {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashSync(password, genSaltSync(10)),
        },
      });
    }),

  updateUser: t.procedure
    .input(
      z.object({
        userId: z.number(),
        username: z.string().optional(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        roles: z.array(zodRoleEnum).optional(),
      }),
    )
    .use(roleFilter(Role.ADMIN))
    .query(async ({ input }) => {
      const { userId, ...newUserData } = input;

      let user = await prisma.user.findFirst({ where: { id: userId } });

      if (!user) return;

      user = { ...user, ...newUserData };

      const newUser = await prisma.user.update({
        data: user,
        where: { id: userId },
      });
      return exclude(newUser, ['passwordHash']);
    }),

  delete: t.procedure
    .input(z.number())
    .use(checkUserMiddleware)
    .query(async ({ input: id, ctx }) => {
      if (ctx.user.id !== id && !checkRoles(ctx.user, Role.ADMIN))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can delete users that are not themselves.',
        });

      const user = await prisma.user.delete({ where: { id } });
    }),

  getWhere: t.procedure
    .input(
      z
        .object({
          id: z.number(),
          username: z.string(),
          roles: z.array(zodRoleEnum),
        })
        .partial(),
    )
    .query(async ({ input: { id, username, roles } }) => {
      const users = await prisma.user.findMany({
        where: {
          id,
          username,
          roles: { hasSome: roles },
        },
      });

      return users;
    }),

  checkUserExistsUsername: t.procedure.input(z.string()).query(async ({ input: username }) => {
    const user = await prisma.user.findFirst({ where: { username } });

    return !!user;
  }),
});
