<script lang="ts">
  import { InputChip, modalStore, type ModalSettings, Paginator } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import ResetPasswordModal from '$lib/client/components/ResetPasswordModal.svelte';
  import { safeTrpc } from '$lib/trpc-client/client';
  import { page } from '$app/stores';
  import type { PaginationSettings } from '@skeletonlabs/skeleton/dist/components/Paginator/types';

  export let data: PageData;

  let pagination: PaginationSettings = {
    offset: 0,
    limit: 10,
    size: data.users.length,
    amounts: [2, 5, 10, 50],
  };

  $: paginatedUsers = data.users.slice(
    pagination.offset * pagination.limit,
    pagination.offset * pagination.limit + pagination.limit,
  );

  const hasChanged = (id: number): boolean => {
    if (
      JSON.stringify(data.users.find((user) => user.id === id)) !==
      JSON.stringify(data.originalUsers.find((user) => user.id === id))
    )
      return true;

    return false;
  };

  async function saveChanges() {
    data.users.map(
      async (user) =>
        await safeTrpc($page, (trpc) => trpc.users.updateUser.query({ userId: user.id, ...user })),
    );

    data.originalUsers = JSON.parse(JSON.stringify(data.users));
  }

  const resetChanges = async () =>
    (data.users = JSON.parse(JSON.stringify(data.originalUsers)) as typeof data.users);

  function resetPassword(userId: number) {
    const modal: ModalSettings = {
      type: 'component',
      component: { ref: ResetPasswordModal },
      response: (password: string | false | undefined) => {
        if (password === false || password === undefined) return;

        safeTrpc($page, (t) => t.users.resetPassword.query({ password, userId }));
      },
    };
    modalStore.trigger(modal);
  }

  async function deleteUser(userId: number, username: string) {
    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Delete user',
      body: `Are you sure you want to delete user ${username} (ID ${userId})`,
      response: (res: boolean) => {
        if (res) safeTrpc($page, async (t) => t.users.delete.query(userId));
      },
    };
    modalStore.trigger(modal);
  }
</script>

<div class="flex flex-row flex-wrap justify-between">
  <h2>Users</h2>
  <div>
    <button class="variant-filled-success btn" on:click|preventDefault={saveChanges}>Save</button>
    <button class="variant-filled-warning btn" on:click|preventDefault={resetChanges}>Reset</button>
  </div>
</div>

<div class="table-container">
  <table class="table table-hover table-compact">
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Roles (valid: {data.roles.join(',')})</th>
        <th class="table-cell-fit">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each paginatedUsers as user}
        <tr class:table-row-checked={hasChanged(user.id)}>
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>
            <InputChip
              bind:value={user.roles}
              name="Roles"
              placeholder="Roles"
              whitelist={data.roles}
              allowUpperCase
            />
          </td>
          <td class="flex flex-wrap flex-row gap-1 table-cell-fit">
            <button
              class="btn btn-sm variant-filled"
              on:click|preventDefault={() => resetPassword(user.id)}
            >
              Reset password
            </button>
            <button
              class="btn btn-sm variant-filled-error"
              on:click|preventDefault={() => deleteUser(user.id, user.username)}
            >
              Delete user
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Paginator bind:settings={pagination} />
</div>

<style lang="scss">
  table th {
    @apply p-3;
  }
</style>
