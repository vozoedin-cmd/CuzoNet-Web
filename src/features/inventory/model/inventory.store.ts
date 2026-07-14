
import { create } from 'zustand';

export type InventoryModalType = 'none' | 'create' | 'edit' | 'status' | 'interface' | 'assign';

interface InventoryState {
  viewMode: 'table' | 'cards';
  selectedEquipmentId: string | null;
  drawerOpen: boolean;
  activeModal: InventoryModalType;
  filters: {
    type: string;
    role: string;
    status: string;
    manufacturer: string;
    search: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectEquipment: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveModal: (modal: InventoryModalType) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  viewMode: 'table',
  selectedEquipmentId: null,
  drawerOpen: false,
  activeModal: 'none',
  filters: { type: '', role: '', status: '', manufacturer: '', search: '' },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectEquipment: (id) => set({ selectedEquipmentId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedEquipmentId: open ? undefined : null }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ filters: { type: '', role: '', status: '', manufacturer: '', search: '' } }),
}));
