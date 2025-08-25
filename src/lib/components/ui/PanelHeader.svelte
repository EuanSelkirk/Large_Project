<script lang="ts">
  export let title = '';
</script>

<header class="panel-header">
  <h2>{title}</h2>
  <div class="actions">
    <slot />
  </div>
</header>

<style>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.panel-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}
</style>
