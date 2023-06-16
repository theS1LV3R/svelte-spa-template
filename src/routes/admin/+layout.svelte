<script lang="ts">
  import { page } from '$app/stores';
  import { pageName } from '$lib/stores';
  import { AppShell } from '@skeletonlabs/skeleton';
  import { Users } from 'lucide-svelte';
  import type { ComponentType } from 'svelte';

  $pageName = 'Admin';

  const pages: { label: string; icon?: ComponentType; href: string }[] = [
    { label: 'Users', icon: Users, href: '/admin/users' },
  ];

  $: classesActive = (href: string) =>
    $page.url.pathname === href ? 'bg-primary-active-token' : '';
</script>

<AppShell>
  <svelte:fragment slot="header"><h2>Admin</h2></svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <nav class="list-nav">
      <ul>
        {#each pages as { href, label, icon }}
          <li on:keypress>
            <a {href} class={classesActive(href)} data-sveltekit-preload-data="hover">
              <span class="flex-auto">{@html label}</span>
              {#if icon}<svelte:component this={icon} />{/if}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </svelte:fragment>
  <div class="mx-3">
    <slot />
  </div>
</AppShell>
