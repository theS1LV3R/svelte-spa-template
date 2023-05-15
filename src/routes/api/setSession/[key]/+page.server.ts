import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }) => {
  cookies.set('sessionKey', params.key, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });
};
