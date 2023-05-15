<script lang="ts">
  import { page } from '$app/stores';
  import { safeTrpc, trpcClient } from '$lib/trpc-client/client';
  import { pageName } from '$lib/stores/pageName';

  let greeting = 'press the button to load data';
  let loading = false;

  $pageName = 'Authenticated page';

  const loadData = async () => {
    loading = true;
    greeting = await safeTrpc($page, (trpc) => trpc.greeting.query());
    loading = false;
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a
  href="#load"
  role="button"
  class="btn variant-filled"
  aria-busy={loading}
  on:click|preventDefault={loadData}
>
  Load
</a>
<p>{greeting}</p>
