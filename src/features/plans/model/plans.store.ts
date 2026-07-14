
import { create } from 'zustand';

export type PlanModalType = 'none' | 'create_plan' | 'create_version' | 'publish_version' | 'change_status';

interface PlansState {
  viewMode: 'table' | 'cards';
  selectedPlanId: string | null;
  selectedVersionId: string | null;
  drawerOpen: boolean;
  activeModal: PlanModalType;
  filters: {
    search: string;
    status: string;
    compatibleServiceType: string;
    currencyCode: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectPlan: (id: string | null) => void;
  selectVersion: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: PlanModalType) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const usePlansStore = create<PlansState>((set) => ({
  viewMode: 'table',
  selectedPlanId: null,
  selectedVersionId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: { search: '', status: '', compatibleServiceType: '', currencyCode: '' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectPlan: (id) => set({ selectedPlanId: id, drawerOpen: !!id }),
  selectVersion: (id) => set({ selectedVersionId: id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedPlanId: open ? undefined : null, selectedVersionId: null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { search: '', status: '', compatibleServiceType: '', currencyCode: '' } }),
}));
