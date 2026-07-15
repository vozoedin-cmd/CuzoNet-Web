import { create } from 'zustand';

import type {
  ServiceLifecycleStatus,
  ServiceType,
} from '../api/services.service';

export type ServiceModalType = 'none' | 'create' | 'provision';

interface ServiceFilters {
  billingDay: string;
  lifecycleStatus: ServiceLifecycleStatus | '';
  search: string;
  serviceType: ServiceType | '';
}

interface ServicesState {
  activeModal: ServiceModalType;
  activeOperationId: string | null;
  drawerOpen: boolean;
  filters: ServiceFilters;
  selectedClientId: string | null;
  selectedServiceId: string | null;
  viewMode: 'table' | 'cards';
  clearFilters: () => void;
  selectService: (serviceId: string | null) => void;
  setActiveModal: (modal: ServiceModalType) => void;
  setActiveOperationId: (operationId: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilter: <TKey extends keyof ServiceFilters>(
    key: TKey,
    value: ServiceFilters[TKey],
  ) => void;
  setSelectedClientId: (clientId: string | null) => void;
  setViewMode: (mode: 'table' | 'cards') => void;
}

const emptyFilters: ServiceFilters = {
  billingDay: '',
  lifecycleStatus: '',
  search: '',
  serviceType: '',
};

export const useServicesStore = create<ServicesState>((set) => ({
  activeModal: 'none',
  activeOperationId: null,
  drawerOpen: false,
  filters: emptyFilters,
  selectedClientId: null,
  selectedServiceId: null,
  viewMode: 'table',

  clearFilters: () => set({ filters: emptyFilters }),
  selectService: (selectedServiceId) =>
    set({
      activeOperationId: null,
      drawerOpen: selectedServiceId !== null,
      selectedServiceId,
    }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setActiveOperationId: (activeOperationId) => set({ activeOperationId }),
  setDrawerOpen: (drawerOpen) =>
    set((state) => ({
      drawerOpen,
      selectedServiceId: drawerOpen ? state.selectedServiceId : null,
      ...(drawerOpen ? {} : { activeOperationId: null }),
    })),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setSelectedClientId: (selectedClientId) =>
    set({
      activeOperationId: null,
      drawerOpen: false,
      selectedClientId,
      selectedServiceId: null,
    }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
