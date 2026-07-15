import { create } from 'zustand';

import type { ClientStatus } from '../api/clients.service';

export type ClientModalType = 'none' | 'create' | 'edit' | 'archive';
export type ClientViewMode = 'table' | 'cards';

interface ClientFilters {
  search: string;
  status: ClientStatus | '';
}

interface ClientsState {
  viewMode: ClientViewMode;
  selectedClientId: string | null;
  drawerOpen: boolean;
  activeModal: ClientModalType;
  filters: ClientFilters;
  setViewMode: (mode: ClientViewMode) => void;
  selectClient: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: ClientModalType) => void;
  setFilter: <TKey extends keyof ClientFilters>(
    key: TKey,
    value: ClientFilters[TKey],
  ) => void;
  clearFilters: () => void;
}

const emptyFilters: ClientFilters = { search: '', status: '' };

export const useClientsStore = create<ClientsState>((set) => ({
  viewMode: 'table',
  selectedClientId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: emptyFilters,

  setViewMode: (viewMode) => set({ viewMode }),
  selectClient: (selectedClientId) =>
    set({ selectedClientId, drawerOpen: selectedClientId !== null }),
  setDrawerOpen: (drawerOpen) =>
    set((state) => ({
      drawerOpen,
      selectedClientId: drawerOpen ? state.selectedClientId : null,
    })),
  setActiveModal: (activeModal) => set({ activeModal }),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: emptyFilters }),
}));
