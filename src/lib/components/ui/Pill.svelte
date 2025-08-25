<script lang="ts">
  export let type: 'default' | 'accent' | 'success' | 'warning' | 'danger' = 'default';
</script>

<span class={`pill ${type}`}><slot /></span>

<style>
.pill {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  background: var(--border);
  color: var(--text);
}

.pill.accent {
  background: var(--accent);
  color: var(--panel);
}

.pill.success {
  background: var(--success);
  color: var(--panel);
}

.pill.warning {
  background: var(--warning);
  color: var(--panel);
}

.pill.danger {
  background: var(--danger);
  color: var(--panel);
}
</style>
