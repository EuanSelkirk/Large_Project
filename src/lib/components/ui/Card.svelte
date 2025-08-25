<script lang="ts">
  export let className = '';
</script>

<div class={`card ${className}`}>
  <slot />
</div>

<style>
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.2s ease;
}

.card:hover {
  border-color: var(--accent);
}

.card:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
