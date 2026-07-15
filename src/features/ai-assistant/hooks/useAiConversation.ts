"use client"
import { useMutation } from '@tanstack/react-query';
import { aiAssistantService, AiQueryRequest, AiMessage } from '../api/ai-assistant.service';
import { useAiAssistantStore } from '../model/ai-assistant.store';
import { usePathname } from 'next/navigation';

export function useAiConversation() {
  const { addMessage, activeConversationId, setActiveConversationId, setComposerText } = useAiAssistantStore();
  const currentRoute = usePathname() || '/';

  return useMutation({
    mutationFn: async (text: string) => {
      const userMsg: AiMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMsg);
      setComposerText('');

      const req: AiQueryRequest = {
        message: text,
        conversationId: activeConversationId || undefined,
        context: {
          currentRoute,
        }
      };

      return aiAssistantService.sendQuery(req);
    },
    onSuccess: (data) => {
      if (!activeConversationId) {
        setActiveConversationId(data.conversationId);
      }
      
      const assistantMsg: AiMessage = {
        id: data.messageId,
        role: 'assistant',
        content: data.answer,
        createdAt: data.createdAt,
        sources: data.sources,
      };
      addMessage(assistantMsg);
    },
    onError: (error: Error) => {
      const errorMsg: AiMessage = {
        id: crypto.randomUUID(),
        role: 'system_notice',
        content: `Error: ${error.message}`,
        createdAt: new Date().toISOString(),
        isError: true,
      };
      addMessage(errorMsg);
    }
  });
}
