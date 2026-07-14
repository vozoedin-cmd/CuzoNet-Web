
import { create } from 'zustand';

export type ClientModalType = 'none' | 'create' | 'edit' | 'archive';

interface ClientsState {
  viewMode: 'table' | 'cards';
  selectedClientId: string | null;
  drawerOpen: boolean;
  activeModal: ClientModalType;
  filters: {
    search: string;
    status: string;
    type: string;
    document: string;
    phone: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectClient: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: ClientModalType) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  viewMode: 'table',
  selectedClientId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: { search: '', status: '', type: '', document: '', phone: '' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectClient: (id) => set({ selectedClientId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedClientId: open ? undefined : null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { search: '', status: '', type: '', document: '', phone: '' } }),
}));
