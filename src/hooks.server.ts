import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { router } from '$lib/server/trpc/router';
import { createContext } from '$lib/server/trpc/context';

export const handle: Handle = createTRPCHandle({ router, createContext });
