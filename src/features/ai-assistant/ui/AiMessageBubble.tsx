import * as React from "react"
import { AiMessage } from "../api/ai-assistant.service"
import { User, Bot, AlertTriangle, ShieldCheck } from "lucide-react"

export function AiMessageBubble({ message }: { message: AiMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system_notice';

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${message.isError ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'}`}>
          <AlertTriangle className="h-3 w-3" />
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm ${isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
          {message.content}
        </div>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-col gap-1 w-full">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Fuentes Consultadas
            </span>
            <div className="flex flex-wrap gap-2">
              {message.sources.map(s => (
                <div key={s.id} className="bg-card border rounded p-1.5 text-xs flex flex-col max-w-[200px]">
                  <span className="font-bold">{s.title} ({s.type})</span>
                  <span className="text-muted-foreground truncate">{s.summary}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
