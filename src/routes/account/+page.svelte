<script lang="ts">
  import { modalStore, type ModalSettings, toastStore } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import EditUserModal from '$lib/client/components/EditUserModal.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { safeTrpc } from '$lib/trpc-client/client';
  import { page } from '$app/stores';

  export let data: PageData;

  async function deleteUser() {
    if (data.user.id === 1) {
      return toastStore.trigger({
        message: 'Cannot delete user ID 1',
        background: 'variant-filled-error',
        autohide: true,
      });
    }

    const modal: ModalSettings = {
      type: 'confirm',
      title: 'Delete user?',
      body: 'Are you sure you want to delete?',
      response(res) {
        if (!res) return;

        safeTrpc($page, async (t) => {
          await t.users.delete.query(data.user.id);

          goto('/api/clearSession', { invalidateAll: true });
        });
      },
    };
    modalStore.trigger(modal);
  }

  async function editUser() {
    const modal: ModalSettings = {
      type: 'component',
      component: { ref: EditUserModal, props: { user: data.user } },
      response: async (res) => {
        if (!res) return;

        await invalidateAll();
      },
    };
    modalStore.trigger(modal);
  }
</script>

<div class="mx-auto max-w-4xl">
  <div class="card p-4 mt-2">
    <h1>
      {data.user.username}
      <span class="opacity-70 float-right">{data.user.roles.join(', ')}</span>
    </h1>
    <p>First name: {data.user.firstName ?? ''}</p>
    <p>Last name: {data.user.lastName ?? ''}</p>
    <p>Registered: {data.user.registrationDate}</p>
    <p>Last updated: {data.user.lastUpdated}</p>
    <p>User ID: {data.user.id}</p>
  </div>

  <button class="btn variant-filled-error" on:click={deleteUser}>Delete account</button>
  <button class="btn variant-filled-secondary" on:click={editUser}>Edit user</button>
  <a class="btn variant-filled-tertiary" href="/api/clearSession">Log out</a>
</div>
