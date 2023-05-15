<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidate } from '$app/navigation';

  onMount(async () => {
    await invalidate('app:user');
    await goto('/auth/login');
  });
</script>
