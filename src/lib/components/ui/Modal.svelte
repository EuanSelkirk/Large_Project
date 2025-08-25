<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let open = false;
  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

{#if open}
<div class="overlay" on:click={close}>
  <div class="modal" on:click|stopPropagation>
    <slot />
  </div>
</div>
{/if}

<style>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  min-width: 300px;
}
</style>
