
import { create } from 'zustand';

interface MonitoringState {
  timeRange: '1h' | '24h' | '7d';
  setTimeRange: (range: '1h' | '24h' | '7d') => void;
}

export const useMonitoringStore = create<MonitoringState>((set) => ({
  timeRange: '1h',
  setTimeRange: (range) => set({ timeRange: range }),
}));
