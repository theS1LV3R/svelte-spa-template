<script lang="ts">
  import '../app.scss';

  import {
    AppBar,
    AppRail,
    AppRailTile,
    AppShell,
    Avatar,
    Modal,
    Toast,
    storePopup,
  } from '@skeletonlabs/skeleton';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { derived } from 'svelte/store';
  import { Home, Shield } from 'lucide-svelte';
  import { page } from '$app/stores';
  import Title from '$lib/client/components/Title.svelte';
  import type { PageData } from './$types';
  import { pageName } from '$lib/stores';
  import type { ComponentType } from 'svelte';
  import { checkRoles } from '$lib/util';
  import { Role } from '@prisma/client';

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  $: title = $pageName ?? 'Svelte thing';

  export let data: PageData;

  const pages: { label: string; icon?: ComponentType; href: string; condition?: () => boolean }[] =
    [
      { label: 'Home', icon: Home, href: '/' },
      {
        label: 'Admin',
        icon: Shield,
        href: '/admin',
        condition: () => checkRoles(data.user, Role.ADMIN),
      },
    ];

  const selected = derived(page, ($page) => {
    const first = $page.url.pathname.split('/')[1];
    return `/${first}`;
  });
</script>

<Title />
<Toast />
<Modal />

<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="/">
          <h1>{title}</h1>
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if !$page.data.user}
          <a href="/auth/login" class="btn variant-filled">Login</a>
          <a href="/auth/register" class="btn variant-soft">Register</a>
        {:else}
          <a class="btn variant-filled" href="/account">Account</a>
        {/if}
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    {#if data.user}
      <AppRail {selected}>
        {#each pages as page}
          {#if page.condition ? page.condition() : true}
            <AppRailTile label={page.label} href={page.href}>
              <svelte:component this={page.icon} />
            </AppRailTile>
          {/if}
        {/each}
      </AppRail>
    {/if}
  </svelte:fragment>

  <div class="p-4 h-full">
    <slot />
  </div>
</AppShell>
