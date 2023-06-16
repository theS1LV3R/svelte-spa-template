import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async (page) => {
  const { user } = await page.parent();

  if (!user) throw redirect(302, '/auth/login');

  return { user };
};
