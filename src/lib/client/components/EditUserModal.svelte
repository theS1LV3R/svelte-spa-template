<script lang="ts">
  import { page } from '$app/stores';
  import { safeTrpc } from '$lib/trpc-client/client';
  import type { BetterOmit } from '$lib/types';
  import type { User } from '@prisma/client';
  import { modalStore } from '@skeletonlabs/skeleton';

  export let user: BetterOmit<User, 'passwordHash'>;

  let validation = '';

  const formData = {
    firstName: user.firstName?.toString() ?? null,
    lastName: user.lastName?.toString() ?? null,
    username: user.username.toString(),
    password: '',
    confirmPassword: '',
  };

  async function validate(): Promise<string | undefined> {
    if (formData.password.length < 8 && formData.password.length > 0)
      return (validation = 'Password should be at least 8 characters long.');

    if (formData.confirmPassword !== formData.password)
      return (validation = 'Passwords do not match.');

    if (
      user.username !== formData.username &&
      (await safeTrpc($page, (t) => t.users.checkUserExistsUsername.query(formData.username)))
    )
      return (validation = 'Username taken.');
  }

  let isSubmitting = false;
  async function submit() {
    isSubmitting = true;
    if (await validate()) return (isSubmitting = false);

    await safeTrpc($page, (t) => t.users.updateUser.query({ userId: user.id, ...formData }));

    if ($modalStore[0].response) $modalStore[0].response(true);
    modalStore.close();
  }

  function close() {
    modalStore.close();
  }

  const clearValidation = () => (validation = '');
</script>

<div class="card p-4 w-modal shadow-xl space-y-4">
  <header class="text-2xl font-bold">Edit user</header>
  <form class="modal-form p-4 pt-0 space-y-4 rounded-container-token">
    <label class="label">
      <span>Username</span>
      <input type="text" class="input" bind:value={formData.username} on:input={clearValidation} />
    </label>
    <label class="label">
      <span>First name</span>
      <input type="text" class="input" bind:value={formData.firstName} on:input={clearValidation} />
    </label>
    <label class="label">
      <span>Last name</span>
      <input type="text" class="input" bind:value={formData.lastName} on:input={clearValidation} />
    </label>
    <label class="label">
      <span>Password</span>
      <input
        class="input"
        type="password"
        bind:value={formData.password}
        on:input={clearValidation}
      />
    </label>
    <label class="label">
      <span>Confirm password</span>
      <input
        class="input"
        type="password"
        bind:value={formData.confirmPassword}
        on:input={clearValidation}
      />
    </label>
    {#if validation !== ''}
      <p class="text-error-600">
        {validation}
      </p>
    {/if}
    <button on:click|preventDefault={close} class="btn variant-filled-surface">Close</button>
    <button
      on:click|preventDefault={submit}
      disabled={isSubmitting}
      class="btn variant-filled-success">Submit</button
    >
  </form>
</div>
