<script lang="ts">
  import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

  let validation = '';

  const formData = {
    password: '',
    confirmPassword: '',
  };

  function validate(): string | undefined {
    if (formData.password.length < 8)
      return (validation = 'Password should be at least 8 characters long.');

    if (formData.confirmPassword !== formData.password)
      return (validation = 'Passwords do not match.');
  }

  function submit() {
    if (validate()) return;

    if ($modalStore[0].response) $modalStore[0].response(formData.password);
    modalStore.close();
  }

  function close() {
    modalStore.close();
  }
</script>

<div class="card p-4 w-modal shadow-xl space-y-4">
  <header class="text-2xl font-bold">Reset password</header>
  <form class="modal-form p-4 space-y-4 rounded-container-token">
    <label class="label">
      <span>Password</span>
      <input
        class="input"
        type="password"
        name="password"
        id="password"
        bind:value={formData.password}
        on:input={() => (validation = '')}
      />
    </label>
    <label class="label">
      <span>Confirm password</span>
      <input
        class="input"
        type="password"
        name="confirm_password"
        id="confirm_password"
        bind:value={formData.confirmPassword}
        on:input={() => (validation = '')}
      />
    </label>
    {#if validation !== ''}
      <p class="text-error-600">
        {validation}
      </p>
    {/if}
    <button on:click|preventDefault={close} class="btn variant-filled-surface">Close</button>
    <button on:click|preventDefault={submit} class="btn variant-filled-success">Submit</button>
  </form>
</div>
