import { redirect } from '@sveltejs/kit';
import { Role } from '@prisma/client';
import { toastStore } from '@skeletonlabs/skeleton';
import type { LayoutLoad } from './$types';
import { checkRoles } from '$lib/util';

export const load: LayoutLoad = async ({ parent }) => {
  const { user } = await parent();

  if (!user) throw redirect(302, '/auth/login');

  if (!checkRoles(user, Role.ADMIN)) {
    toastStore.trigger({
      message: 'Missing required role',
      background: 'variant-filled-error',
    });
    throw redirect(302, '/');
  }

  return { user };
};
