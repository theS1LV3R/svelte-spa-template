import type { PageLoad } from './$types';
import { safeTrpc } from '$lib/trpc-client/client';

export const load: PageLoad = async (page) => {
  const users = await safeTrpc(page, (t) => t.users.getUsers.query());
  const roles = await safeTrpc(page, (t) => t.users.getRoles.query());

  const originalUsers = JSON.parse(JSON.stringify(users)) as typeof users;

  return { users, originalUsers, roles };
};
