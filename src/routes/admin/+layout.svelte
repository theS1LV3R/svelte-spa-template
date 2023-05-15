<script lang="ts">
  import { page } from '$app/stores';
  import { AppShell, Tab, TabGroup } from '@skeletonlabs/skeleton';
  import { Home, Users, type Icon, type IconEvents, type IconProps } from 'lucide-svelte';
  import type { SvelteComponentTyped } from 'svelte';
  import { writable } from 'svelte/store';

  const tabSet = writable(0);

  const pages: { label: string; href: string; icon: any }[] = [
    { label: 'Home', icon: Home, href: '/admin' },
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
  <slot />
</AppShell>
