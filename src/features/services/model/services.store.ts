
import { create } from 'zustand';

export type ServiceModalType = 'none' | 'create' | 'provision';

interface ServicesState {
  viewMode: 'table' | 'cards';
  selectedServiceId: string | null;
  drawerOpen: boolean;
  activeModal: ServiceModalType;
  filters: {
    search: string;
    lifecycleStatus: string;
    serviceType: string;
    planVersionId: string;
    clientId: string;
    billingDay: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectService: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: ServiceModalType) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  viewMode: 'table',
  selectedServiceId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: { search: '', lifecycleStatus: '', serviceType: '', planVersionId: '', clientId: '', billingDay: '' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectService: (id) => set({ selectedServiceId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedServiceId: open ? undefined : null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { search: '', lifecycleStatus: '', serviceType: '', planVersionId: '', clientId: '', billingDay: '' } }),
}));
