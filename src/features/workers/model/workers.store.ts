
import { create } from 'zustand';

interface WorkersState {
  viewMode: 'table' | 'cards';
  selectedWorkerId: string | null;
  selectedOperationId: string | null;
  drawerOpen: boolean;
  filters: {
    search: string;
    role: string;
    status: string;
    workerId: string;
    timeRange: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectWorker: (id: string | null) => void;
  selectOperation: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useWorkersStore = create<WorkersState>((set) => ({
  viewMode: 'cards',
  selectedWorkerId: null,
  selectedOperationId: null,
  drawerOpen: false,
  filters: { search: '', role: '', status: '', workerId: '', timeRange: '1h' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectWorker: (id) => set({ selectedWorkerId: id, drawerOpen: !!id }),
  selectOperation: (id) => set({ selectedOperationId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedWorkerId: open ? undefined : null, selectedOperationId: open ? undefined : null }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { search: '', role: '', status: '', workerId: '', timeRange: '1h' } }),
}));
