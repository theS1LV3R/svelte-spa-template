import { t } from '$lib/server/trpc/t';
import users from '$lib/server/trpc/routes/users';
import auth from '$lib/server/trpc/routes/auth';
export const router = t.router({
  users,
  auth,
});

export type Router = typeof router;
