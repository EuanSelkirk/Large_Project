export interface Printer {
  id: string;
  name: string;
  status: 'idle' | 'printing' | 'error';
  profile: string;
  material: string;
}

export interface Telemetry {
  nozzleTemp: number;
  bedTemp: number;
  targetNozzle: number;
  targetBed: number;
  progress: number; // 0-100
  stateText: string;
  alerts: string[];
}

export interface MaintenanceItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface LogLine {
  timestamp: string;
  message: string;
  level?: 'info' | 'warn' | 'error';
}
