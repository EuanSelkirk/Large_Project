<script lang="ts">
  import PanelHeader from '$lib/components/ui/PanelHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Pill from '$lib/components/ui/Pill.svelte';
  import { printers, selectedId, selectPrinter } from '$lib/stores/printerStore';
  import type { Printer } from '$lib/types';

  const statusType = (status: Printer['status']): 'default' | 'accent' | 'danger' => {
    if (status === 'printing') return 'accent';
    if (status === 'error') return 'danger';
    return 'default';
  };

  const statusLabel = (status: Printer['status']) =>
    status.charAt(0).toUpperCase() + status.slice(1);
</script>

<PanelHeader title="Devices" />
<p class="subtitle">Select a printer</p>

<div class="grid">
  {#each $printers as printer}
    <Card
      className={`printer-card ${$selectedId === printer.id ? 'selected' : ''}`}
      on:click={() => selectPrinter(printer.id)}
    >
      <div class="header">
        <h3>{printer.name}</h3>
        <div class="status">
          <Pill type={statusType(printer.status)}>{statusLabel(printer.status)}</Pill>
        </div>
      </div>
      <div class="meta">{printer.material} / {printer.profile}</div>
    </Card>
  {/each}
</div>

<select
  class="device-select"
  value={$selectedId ?? ''}
  on:change={(e) => selectPrinter((e.target as HTMLSelectElement).value)}
>
  {#each $printers as p}
    <option value={p.id}>{p.name}</option>
  {/each}
</select>

<style>
  .subtitle {
    color: var(--muted);
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .printer-card {
    cursor: pointer;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .printer-card:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .printer-card.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .meta {
    font-size: 0.875rem;
    color: var(--muted);
  }

  .status :global(.pill.default) {
    background: var(--muted);
    color: var(--panel);
  }

  .device-select {
    display: none;
    margin-top: 1rem;
    background: var(--panel);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  @media (max-width: 420px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .device-select {
      display: block;
    }
  }
</style>
