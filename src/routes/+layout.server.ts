import type { LayoutServerLoad } from './$types';
import { safeTrpc } from '$lib/trpc-client/client';

export const load: LayoutServerLoad = async (event) => {
  event.depends('app:user');
  return { user: await safeTrpc(event, (t) => t.users.user.query()) };
};
