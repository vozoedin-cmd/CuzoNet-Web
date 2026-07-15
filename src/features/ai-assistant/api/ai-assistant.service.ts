// import { apiClient } from '@/services/api/api-client'; // Reserved for future use

export interface AiContextReference {
  currentRoute: string;
  selectedEntityId?: string;
}

export interface AiQueryRequest {
  message: string;
  conversationId?: string;
  context: AiContextReference;
}

export interface AiSource {
  id: string;
  type: 'Dashboard' | 'Monitoring' | 'Billing' | 'Network' | 'Inventory' | 'Alerting';
  title: string;
  summary: string;
}

export interface AiSuggestedQuestion {
  id: string;
  text: string;
}

export interface AiQueryResponse {
  conversationId: string;
  messageId: string;
  answer: string;
  sources: AiSource[];
  suggestedQuestions: AiSuggestedQuestion[];
  createdAt: string;
}

export type AiMessageRole = 'user' | 'assistant' | 'system_notice';

export interface AiMessage {
  id: string;
  role: AiMessageRole;
  content: string;
  createdAt: string;
  sources?: AiSource[];
  isError?: boolean;
}

export interface AiConversation {
  id: string;
  messages: AiMessage[];
  updatedAt: string;
}

export type AiAssistantStatus = 'idle' | 'sending' | 'streaming' | 'completed' | 'failed' | 'cancelled';

const isDemo = () => process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

export const aiAssistantService = {
  sendQuery: async (request: AiQueryRequest): Promise<AiQueryResponse> => {
    if (isDemo()) {
      const { processDemoQuery } = await import('../model/demo-ai.fixture');
      return processDemoQuery(request);
    }
    // El backend real no expone /ai/query todavía.
    throw new Error('Integración de IA pendiente');
  }
};
