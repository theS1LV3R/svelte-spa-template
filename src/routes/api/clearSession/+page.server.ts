import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete('sessionKey', {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });
};
