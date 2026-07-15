import * as React from "react"
import { useAiAssistantStore } from "../model/ai-assistant.store"
import { useAiConversation } from "../hooks/useAiConversation"
import { Send, Loader2 } from "lucide-react"

export function AiComposer() {
  const { composerText, setComposerText } = useAiAssistantStore();
  const { mutate, isPending } = useAiConversation();

  const handleSend = () => {
    if (!composerText.trim() || isPending) return;
    mutate(composerText.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card border rounded-xl p-2 relative shadow-sm focus-within:ring-1 focus-within:ring-primary">
      <textarea
        value={composerText}
        onChange={(e) => setComposerText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Consulta sobre la red, clientes o facturación..."
        className="w-full bg-transparent resize-none outline-none text-sm p-2 min-h-[60px] max-h-[150px]"
        disabled={isPending}
      />
      <div className="flex justify-between items-center px-2 pb-1">
        <span className="text-[10px] text-muted-foreground">Shift + Enter para nueva línea</span>
        <button
          onClick={handleSend}
          disabled={!composerText.trim() || isPending}
          className="bg-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center disabled:opacity-50 transition-opacity"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
