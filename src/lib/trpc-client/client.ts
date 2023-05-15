import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import { toastStore } from '@skeletonlabs/skeleton';
import { TRPCClientError } from '@trpc/client';
import type { Router } from '$lib/server/trpc/router';
import { goto } from '$app/navigation';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpcClient(init?: TRPCClientInit) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;

  const client = createTRPCClient<Router>({ init });
  if (isBrowser) browserClient = client;

  return client;
}

export async function safeTrpc<T>(
  init: (TRPCClientInit & { url: { pathname: string } }) | undefined,
  callback: (trpc: ReturnType<typeof trpcClient>) => Promise<T>,
): Promise<T> {
  try {
    return await callback(trpcClient(init));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { stack, ...errWithoutStack } = e;
    console.log(errWithoutStack);

    if (!(e instanceof TRPCClientError)) throw e;

    if (e.data.code === 'UNAUTHORIZED') {
      toastStore.trigger({
        message: 'Unauthorized.',
        background: 'variant-filled-error',
      });
      throw goto('/auth/login');
    }

    if (e.data.code === 'FORBIDDEN') {
      toastStore.trigger({
        message: 'Forbidden.',
        background: 'variant-filled-warning',
      });
    }
    throw e;
  }
}
