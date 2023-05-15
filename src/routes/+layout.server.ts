import type { LayoutServerLoad } from './$types';
import { trpcClient } from '$lib/trpc-client/client';

export const load: LayoutServerLoad = async (event) => {
  event.depends('app:user');
  return { user: await trpcClient(event).user.query() };
};
