import * as React from "react"
import { useAiAssistantStore } from "../model/ai-assistant.store"
import { AiChatPanel } from "./AiChatPanel"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function AiAssistantDrawer() {
  const { isDrawerOpen, closeDrawer } = useAiAssistantStore();

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={closeDrawer}
        />
      )}
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full md:w-[450px] bg-background border-l z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <button 
          onClick={closeDrawer}
          className="absolute top-3 right-4 z-10 text-muted-foreground hover:text-foreground md:hidden"
        >
          <X className="h-5 w-5" />
        </button>
        <AiChatPanel />
      </div>
    </>
  )
}
