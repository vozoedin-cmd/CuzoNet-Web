
import { create } from 'zustand';

interface AlertingState {
  viewMode: 'table' | 'cards';
  selectedAlertId: string | null;
  drawerOpen: boolean;
  filters: {
    severity: string;
    status: string;
    category: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectAlert: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilter: (key: 'severity' | 'status' | 'category', value: string) => void;
  clearFilters: () => void;
}

export const useAlertingStore = create<AlertingState>((set) => ({
  viewMode: 'table',
  selectedAlertId: null,
  drawerOpen: false,
  filters: {
    severity: '',
    status: '',
    category: '',
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectAlert: (id) => set({ selectedAlertId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedAlertId: open ? undefined : null }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { severity: '', status: '', category: '' } }),
}));
