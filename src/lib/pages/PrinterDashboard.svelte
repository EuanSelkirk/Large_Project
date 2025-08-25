<script lang="ts">
  import PanelHeader from '$lib/components/ui/PanelHeader.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import Pill from '$lib/components/ui/Pill.svelte';
  import { selectedPrinter, selectedTelemetry } from '$lib/stores/printerStore';
  import type { Printer } from '$lib/types';

  const statusType = (status: Printer['status'] | undefined): 'default' | 'accent' | 'danger' => {
    if (status === 'printing') return 'accent';
    if (status === 'error') return 'danger';
    return 'default';
  };

  const statusLabel = (status: Printer['status'] | undefined) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
</script>

<PanelHeader title="Printer Dashboard" />
<p class="subtitle">{$selectedPrinter ? $selectedPrinter.name : 'No device selected'}</p>

{#if $selectedPrinter && $selectedTelemetry}
  <div class="dashboard">
    <Card>
      <div class="top-row">
        <Pill type={statusType($selectedPrinter.status)}>{statusLabel($selectedPrinter.status)}</Pill>
        <span class="job-name">{$selectedTelemetry.stateText || '—'}</span>
        <div class="progress">
          <div class="progress-bar">
            <div class="bar" style="width: {$selectedTelemetry.progress}%"></div>
          </div>
          <span class="percent">{Math.round($selectedTelemetry.progress)}%</span>
        </div>
      </div>
    </Card>

    <div class="temp-grid">
      <Card>
        <div class="temp-header">Nozzle</div>
        <div class="temps">
          <span class="current">{Math.round($selectedTelemetry.nozzleTemp)}</span>
          <span>/</span>
          <span class="target">{Math.round($selectedTelemetry.targetNozzle)}</span>
        </div>
        <div class="temp-bar">
          <div class="fill" style="width: {$selectedTelemetry.targetNozzle ? Math.min(100, ($selectedTelemetry.nozzleTemp / $selectedTelemetry.targetNozzle) * 100) : 0}%"></div>
        </div>
      </Card>

      <Card>
        <div class="temp-header">Bed</div>
        <div class="temps">
          <span class="current">{Math.round($selectedTelemetry.bedTemp)}</span>
          <span>/</span>
          <span class="target">{Math.round($selectedTelemetry.targetBed)}</span>
        </div>
        <div class="temp-bar">
          <div class="fill" style="width: {$selectedTelemetry.targetBed ? Math.min(100, ($selectedTelemetry.bedTemp / $selectedTelemetry.targetBed) * 100) : 0}%"></div>
        </div>
      </Card>
    </div>

    <Card className="alerts">
      <div class="alerts-header">Alerts</div>
      {#if $selectedTelemetry.alerts.length}
        <ul class="alert-list">
          {#each $selectedTelemetry.alerts as alert}
            <li class="alert-item">{alert}</li>
          {/each}
        </ul>
      {:else}
        <p class="empty">No alerts</p>
      {/if}
    </Card>

    <div class="controls">
      <button disabled>Pause</button>
      <button disabled>Resume</button>
      <button disabled>Stop</button>
    </div>
  </div>
{:else}
  <Card className="empty-state">
    <p>No device selected. <a href="/devices">Choose one</a>.</p>
  </Card>
{/if}

<style>
  .subtitle {
    color: var(--muted);
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
  }

  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .top-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .job-name {
    flex: 1;
    font-size: 0.875rem;
    color: var(--muted);
  }

  .progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .progress-bar {
    flex: 1;
    height: 0.5rem;
    background: var(--border);
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .progress-bar .bar {
    height: 100%;
    background: var(--accent);
    border-radius: 0.25rem;
    transition: width 0.3s ease;
  }

  .percent {
    font-family: monospace;
    font-size: 0.75rem;
  }

  .temp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .temp-header {
    font-weight: 600;
  }

  .temps {
    display: flex;
    gap: 0.25rem;
    font-family: monospace;
    font-size: 0.875rem;
    align-items: baseline;
  }

  .temp-bar {
    width: 100%;
    height: 0.5rem;
    background: var(--border);
    border-radius: 0.25rem;
    overflow: hidden;
  }

  .temp-bar .fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.3s ease;
  }

  .alerts-header {
    font-weight: 600;
  }

  .alert-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .alert-item {
    padding: 0.25rem 0.5rem;
    border-left: 3px solid var(--danger);
    background: var(--panel);
  }

  .alerts .empty {
    color: var(--muted);
    font-size: 0.875rem;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .controls button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    background: var(--panel);
    border-radius: 0.5rem;
    color: var(--muted);
  }

  .empty-state {
    text-align: center;
  }

  @media (max-width: 420px) {
    .temp-grid {
      grid-template-columns: 1fr;
    }

    .top-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .controls {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
