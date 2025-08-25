import { writable, derived } from 'svelte/store';
import type { Printer, Telemetry } from '$lib/types';

const initialPrinters: Printer[] = [
  { id: 'p1', name: 'Alpha', status: 'idle', profile: 'Standard', material: 'PLA' },
  { id: 'p2', name: 'Bravo', status: 'printing', profile: 'Fine', material: 'PETG' }
];

export const printers = writable<Printer[]>(initialPrinters);
export const selectedId = writable<string | null>('p1');

const initialTelemetry: Record<string, Telemetry> = {
  p1: {
    nozzleTemp: 25,
    bedTemp: 25,
    targetNozzle: 0,
    targetBed: 0,
    progress: 0,
    stateText: 'Idle',
    alerts: []
  },
  p2: {
    nozzleTemp: 200,
    bedTemp: 60,
    targetNozzle: 210,
    targetBed: 60,
    progress: 10,
    stateText: 'Printing',
    alerts: []
  }
};

export const telemetry = writable<Record<string, Telemetry>>(initialTelemetry);

export const selectedPrinter = derived([
  printers,
  selectedId
], ([$printers, $selectedId]) => $printers.find(p => p.id === $selectedId) || null);

export const selectedTelemetry = derived([
  telemetry,
  selectedId
], ([$telemetry, $selectedId]) => ($selectedId ? $telemetry[$selectedId] : null));

const loops: Record<string, ReturnType<typeof setInterval>> = {};

export function selectPrinter(id: string) {
  selectedId.set(id);
}

export function startSimulation(id: string) {
  stopSimulation(id);
  printers.update(ps => ps.map(p => p.id === id ? { ...p, status: 'printing' } : p));
  loops[id] = setInterval(() => {
    telemetry.update(t => {
      const current = t[id];
      if (!current) return t;
      const next: Telemetry = { ...current };
      if (next.nozzleTemp < next.targetNozzle) {
        next.nozzleTemp = Math.min(next.targetNozzle, next.nozzleTemp + Math.random() * 5);
      }
      if (next.bedTemp < next.targetBed) {
        next.bedTemp = Math.min(next.targetBed, next.bedTemp + Math.random() * 2);
      }
      next.progress = Math.min(100, next.progress + Math.random() * 5);
      if (next.progress >= 100) {
        next.stateText = 'Completed';
        printers.update(ps => ps.map(p => p.id === id ? { ...p, status: 'idle' } : p));
        stopSimulation(id);
      } else {
        next.stateText = 'Printing';
      }
      return { ...t, [id]: next };
    });
  }, 1000);
}

export function stopSimulation(id: string) {
  const loop = loops[id];
  if (loop) {
    clearInterval(loop);
    delete loops[id];
  }
}
