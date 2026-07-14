
import { create } from 'zustand';

interface NotificationsState {
  viewMode: 'table' | 'cards';
  selectedNotificationId: string | null;
  drawerOpen: boolean;
  filters: {
    status: string;
    channel: string;
    recipient: string;
    templateCode: string;
    dateFrom: string;
    dateTo: string;
  };

  setViewMode: (mode: 'table' | 'cards') => void;
  selectNotification: (id: string | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  viewMode: 'table',
  selectedNotificationId: null,
  drawerOpen: false,
  filters: {
    status: '',
    channel: '',
    recipient: '',
    templateCode: '',
    dateFrom: '',
    dateTo: '',
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  selectNotification: (id) => set({ selectedNotificationId: id, drawerOpen: !!id }),
  setDrawerOpen: (open) => set({ drawerOpen: open, selectedNotificationId: open ? undefined : null }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ 
    filters: { status: '', channel: '', recipient: '', templateCode: '', dateFrom: '', dateTo: '' } 
  }),
}));
