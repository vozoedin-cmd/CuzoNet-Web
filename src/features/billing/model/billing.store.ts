import { create } from 'zustand';

export type BillingModalType = 'none' | 'register_payment' | 'client_account';

interface BillingFilters {
  clientId: string;
  from: string;
  to: string;
}

interface BillingState {
  activeModal: BillingModalType;
  drawerOpen: boolean;
  filters: BillingFilters;
  page: number;
  pageSize: number;
  selectedClientId: string | null;
  selectedPaymentId: string | null;
  viewMode: 'table' | 'cards';
  clearFilters: () => void;
  selectPayment: (paymentId: string | null) => void;
  setActiveModal: (modal: BillingModalType) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilters: (filters: BillingFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSelectedClientId: (clientId: string | null) => void;
  setViewMode: (mode: 'table' | 'cards') => void;
}

const emptyFilters: BillingFilters = {
  clientId: '',
  from: '',
  to: '',
};

export const useBillingStore = create<BillingState>((set) => ({
  activeModal: 'none',
  drawerOpen: false,
  filters: emptyFilters,
  page: 1,
  pageSize: 20,
  selectedClientId: null,
  selectedPaymentId: null,
  viewMode: 'table',

  clearFilters: () => set({ filters: emptyFilters, page: 1 }),
  selectPayment: (selectedPaymentId) =>
    set({ drawerOpen: selectedPaymentId !== null, selectedPaymentId }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setDrawerOpen: (drawerOpen) =>
    set((state) => ({
      drawerOpen,
      selectedPaymentId: drawerOpen ? state.selectedPaymentId : null,
    })),
  setFilters: (filters) => set({ filters, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ page: 1, pageSize }),
  setSelectedClientId: (selectedClientId) => set({ selectedClientId }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
