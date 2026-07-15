import * as React from "react"
import { useAiAssistantStore } from "../model/ai-assistant.store"
import { AiMessageBubble } from "./AiMessageBubble"
import { AiAssistantEmpty, AiSafetyNotice, AiIntegrationPending } from "./AiAssistantStates"
import { AiComposer } from "./AiComposer"
import { Sparkles, Trash2 } from "lucide-react"

export function AiChatPanel() {
  const { messages, clearMessages } = useAiAssistantStore();
  const chatRef = React.useRef<HTMLDivElement>(null);

  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  React.useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="border-b px-4 py-3 flex justify-between items-center bg-card shrink-0">
        <div className="flex items-center gap-2 font-bold">
          <Sparkles className="h-4 w-4 text-primary" />
          NOC Assistant
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1">
            <Trash2 className="h-3 w-3" /> Limpiar
          </button>
        )}
      </div>

      {!isDemo ? (
        <AiIntegrationPending />
      ) : (
        <>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.length === 0 ? (
              <AiAssistantEmpty />
            ) : (
              <div className="flex flex-col">
                {messages.map(m => <AiMessageBubble key={m.id} message={m} />)}
              </div>
            )}
          </div>
          
          <div className="p-4 bg-background border-t shrink-0 flex flex-col gap-2">
            <AiSafetyNotice />
            <AiComposer />
          </div>
        </>
      )}
    </div>
  )
}
