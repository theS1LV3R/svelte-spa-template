import { toastStore } from '@skeletonlabs/skeleton';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, parent }) => {
  const { user } = await parent();

  if (user !== null) {
    toastStore.trigger({
      message: 'You are already signed in',
      autohide: true,
    });
    throw redirect(302, '/');
  }

  return {
    callback: url.searchParams.get('callback'),
  };
};
