
import { create } from 'zustand';

export type BillingModalType = 'none' | 'register_payment' | 'client_account';

interface BillingState {
  viewMode: 'table' | 'cards';
  selectedPaymentId: string | null;
  selectedClientId: string | null;
  drawerOpen: boolean;
  activeModal: BillingModalType;
  filters: {
    search: string;
    clientId: string;
    method: string;
    status: string;
    currencyCode: string;
    dateFrom: string;
    dateTo: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectPayment: (id: string | null) => void;
  selectClient: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: BillingModalType) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  viewMode: 'table',
  selectedPaymentId: null,
  selectedClientId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: { search: '', clientId: '', method: '', status: '', currencyCode: '', dateFrom: '', dateTo: '' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectPayment: (id) => set({ selectedPaymentId: id, drawerOpen: !!id }),
  selectClient: (id) => set({ selectedClientId: id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedPaymentId: open ? undefined : null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { search: '', clientId: '', method: '', status: '', currencyCode: '', dateFrom: '', dateTo: '' } }),
}));
