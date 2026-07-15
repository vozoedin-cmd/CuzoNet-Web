import { create } from 'zustand';

import type { PlanServiceType } from '../api/plans.service';

export type PlanModalType = 'none' | 'create' | 'revise';

interface PlanFilters {
  isActive: '' | 'active' | 'inactive';
  search: string;
  serviceType: PlanServiceType | '';
}

interface PlansState {
  activeModal: PlanModalType;
  drawerOpen: boolean;
  filters: PlanFilters;
  selectedPlanId: string | null;
  viewMode: 'table' | 'cards';
  clearFilters: () => void;
  selectPlan: (planId: string | null) => void;
  setActiveModal: (modal: PlanModalType) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilter: <TKey extends keyof PlanFilters>(
    key: TKey,
    value: PlanFilters[TKey],
  ) => void;
  setViewMode: (mode: 'table' | 'cards') => void;
}

const emptyFilters: PlanFilters = {
  isActive: '',
  search: '',
  serviceType: '',
};

export const usePlansStore = create<PlansState>((set) => ({
  activeModal: 'none',
  drawerOpen: false,
  filters: emptyFilters,
  selectedPlanId: null,
  viewMode: 'table',

  clearFilters: () => set({ filters: emptyFilters }),
  selectPlan: (selectedPlanId) =>
    set({ drawerOpen: selectedPlanId !== null, selectedPlanId }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setDrawerOpen: (drawerOpen) =>
    set((state) => ({
      drawerOpen,
      selectedPlanId: drawerOpen ? state.selectedPlanId : null,
    })),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setViewMode: (viewMode) => set({ viewMode }),
}));
