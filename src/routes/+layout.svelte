<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-crimson.css';
  import '@skeletonlabs/skeleton/styles/skeleton.css';

  import '../app.scss';

  import { AppBar, AppRail, AppRailTile, AppShell, Avatar, Toast } from '@skeletonlabs/skeleton';
  import { derived } from 'svelte/store';
  import { Home, Shield } from 'lucide-svelte';
  import { page } from '$app/stores';
  import Title from '$lib/client/components/Title.svelte';
  import type { PageData } from './$types';
  import { Role } from '@prisma/client';

  export let data: PageData;

  const selected = derived(page, ($page) => {
    const first = $page.url.pathname.split('/')[1];
    return `/${first}`;
  });
</script>

<Title />
<Toast />

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/">
          <h1>Svelte template</h1>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if !$page.data.user}
          <a href="/auth/login" class="btn variant-filled">Login</a>
          <a href="/auth/register" class="btn variant-soft">Register</a>
        {:else}
          <a class="btn" href="/account">
            <Avatar initials={$page.data.user.username.slice(0, 2)} />
          </a>
        {/if}
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <AppRail {selected}>
      {#if data.user}
        <AppRailTile label="Needs auth" href="/needsAuth"><Home /></AppRailTile>
        {#if data.user.roles.includes(Role.ADMIN)}
          <AppRailTile label="Admin" href="/admin"><Shield /></AppRailTile>
        {/if}
      {/if}
    </AppRail>
  </svelte:fragment>

  <div class="p-4 h-full">
    <slot />
  </div>
</AppShell>
