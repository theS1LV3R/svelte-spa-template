<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';

  onMount(async () => {
    await invalidateAll()
    await goto('/auth/login');
  });
</script>
