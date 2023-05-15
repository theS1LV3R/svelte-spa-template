<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidate } from '$app/navigation';
  import { page } from '$app/stores';

  onMount(async () => {
    await invalidate('app:user');

    const callback = $page.url.searchParams.get('callback');
    await goto($page.url.origin + (callback !== null ? callback : ''));
  });
</script>
