import { create } from 'zustand';
import { AiMessage } from '../api/ai-assistant.service';

interface AiAssistantState {
  isDrawerOpen: boolean;
  composerText: string;
  activeConversationId: string | null;
  messages: AiMessage[];
  
  openDrawer: () => void;
  closeDrawer: () => void;
  setComposerText: (text: string) => void;
  setActiveConversationId: (id: string | null) => void;
  addMessage: (msg: AiMessage) => void;
  clearMessages: () => void;
}

export const useAiAssistantStore = create<AiAssistantState>((set) => ({
  isDrawerOpen: false,
  composerText: '',
  activeConversationId: null,
  messages: [],
  
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setComposerText: (text) => set({ composerText: text }),
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [], activeConversationId: null }),
}));
