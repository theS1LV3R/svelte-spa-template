<script lang="ts">
  import { pageName } from '$lib/stores/pageName';

  $: title = $pageName ? `${$pageName} - Svelte Template` : 'Svelte Template';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
