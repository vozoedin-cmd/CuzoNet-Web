
import { create } from 'zustand';

interface NetworkMapState {
  selectedNodeId: string | null;
  selectedLinkId: string | null;
  showLinks: boolean;
  showLabels: boolean;
  statusFilter: string | null; // 'active' | 'degraded' | 'offline' | null
  
  setSelectedNodeId: (id: string | null) => void;
  setSelectedLinkId: (id: string | null) => void;
  toggleLinks: () => void;
  toggleLabels: () => void;
  setStatusFilter: (status: string | null) => void;
  resetSelection: () => void;
}

export const useNetworkMapStore = create<NetworkMapState>((set) => ({
  selectedNodeId: null,
  selectedLinkId: null,
  showLinks: true,
  showLabels: true,
  statusFilter: null,

  setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedLinkId: null }),
  setSelectedLinkId: (id) => set({ selectedLinkId: id, selectedNodeId: null }),
  toggleLinks: () => set((state) => ({ showLinks: !state.showLinks })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  setStatusFilter: (status) => set({ statusFilter: status }),
  resetSelection: () => set({ selectedNodeId: null, selectedLinkId: null }),
}));
