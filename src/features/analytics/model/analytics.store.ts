
import { create } from 'zustand';

interface AnalyticsState {
  timeRange: 'today' | '7d' | '30d' | '90d' | 'ytd';
  selectedSection: 'overview' | 'revenue' | 'network' | 'clients';
  
  setTimeRange: (range: 'today' | '7d' | '30d' | '90d' | 'ytd') => void;
  setSelectedSection: (section: 'overview' | 'revenue' | 'network' | 'clients') => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  timeRange: '30d',
  selectedSection: 'overview',
  
  setTimeRange: (timeRange) => set({ timeRange }),
  setSelectedSection: (selectedSection) => set({ selectedSection }),
}));
