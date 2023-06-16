<script lang="ts">
  import { toastStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import { safeTrpc } from '$lib/trpc-client/client';
  import { pageName } from '$lib/stores/pageName';

  let username = '';
  let password = '';
  let repeatPassword = '';

  $pageName = 'Register';

  async function submit() {
    const res = await safeTrpc($page, (t) =>
      t.auth.register.query({
        username,
        password,
        repeatPassword,
      }),
    );

    if (typeof res !== 'undefined') {
      toastStore.trigger({
        message: res.data.error,
        autohide: false,
        background: 'variant-filled-error',
      });
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
    <label class="label">
      <span>Repeat password</span>
      <input
        class="input"
        title="Repeat password"
        type="password"
        bind:value={repeatPassword}
        required
      />
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
