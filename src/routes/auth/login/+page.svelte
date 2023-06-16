<script lang="ts">
  import { toastStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { safeTrpc } from '$lib/trpc-client/client';
  import { pageName } from '$lib/stores/pageName';

  let username = '';
  let password = '';

  export let data: PageData;

  $pageName = 'Login';

  async function submit() {
    const res = await safeTrpc($page, (t) =>
      t.auth.login.query({
        username,
        password,
      }),
    );

    if (typeof res === 'string') {
      await goto(
        `/api/setSession/${res}` + (data.callback === null ? '' : `?callback=${data.callback}`),
      );
    } else {
      toastStore.trigger({
        message: `${res.data.message} See console for details.`,
        autohide: false,
        background: 'variant-filled-error',
      });

      console.error(res.data);
    }
  }
</script>

<div class="h-full w-full flex flex-col items-center justify-center">
  <form on:submit|preventDefault={submit} class="max-w-md flex flex-col justify-center flex-grow-0">
    <label class="label">
      <span>Username</span>
      <input class="input" title="Username" type="text" bind:value={username} required />
    </label>
    <label class="label">
      <span>Password</span>
      <input class="input" title="Password" type="password" bind:value={password} required />
    </label>
    <div>
      <button
        class="btn variant-filled mt-4 flex-shrink flex-grow-0"
        title="Username"
        type="submit"
      >
        Submit
      </button>
    </div>
  </form>
</div>
