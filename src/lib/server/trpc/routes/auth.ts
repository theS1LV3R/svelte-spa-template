import prisma from '$lib/server/prisma';
import { t } from '$lib/server/trpc/t';
import { genSession } from '$lib/server/util';
import { fail } from '@sveltejs/kit';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { z } from 'zod';

export default t.router({
  login: t.procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .query(async ({ input: { password, username } }) => {
      try {
        const user = await prisma.user.findFirst({
          where: { username },
          select: { id: true, passwordHash: true },
        });

        if (user === null || !compareSync(password, user.passwordHash)) {
          return fail(401, { message: 'Invalid username or password.' });
        }

        return await genSession(user.id);
      } catch (e: unknown) {
        return fail(500, { message: 'Authentication failed.', details: e });
      }
    }),

  register: t.procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        repeatPassword: z.string(),
      }),
    )
    .query(async ({ input: { username, password, repeatPassword } }) => {
      try {
        if (password !== repeatPassword) {
          return fail(400, { error: 'Passwords do not match.' });
        }

        const existingUser = await prisma.user.findFirst({
          where: { username },
        });

        if (existingUser) {
          return fail(400, { error: 'User already exists.' });
        }

        // TODO: Finish implementing
        await prisma.user.create({
          data: {
            username,
            passwordHash: hashSync(password, genSaltSync(10)),
          },
        });
      } catch (e: unknown) {
        return fail(500, { error: 'Registration failed.', details: e });
      }
    }),
});
