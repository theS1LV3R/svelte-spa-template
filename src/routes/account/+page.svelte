<script lang="ts">
  import { Avatar } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.user == null}
  <div />
{:else}
  <div class="card p-4 mt-2">
    <Avatar initials={data.user.username.slice(0, 2)} />
    <h1>
      {data.user.username}
      <span class="opacity-70 float-right">{data.user.roles.join(', ')}</span>
    </h1>
    <p>Registered: {data.user.registrationDate}</p>
    <p>Last updated: {data.user.lastUpdated}</p>
    <p>User ID: {data.user.id}</p>
  </div>

  <a class="btn variant-filled" href="/api/clearSession">Log out</a>
{/if}
