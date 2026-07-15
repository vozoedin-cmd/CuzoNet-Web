
"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { ContentContainer } from "./ContentContainer"
import { AiAssistantDrawer } from "@/features/ai-assistant"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <Topbar />
        <ContentContainer>
          {children}
        </ContentContainer>
      </div>
      <AiAssistantDrawer />
    </div>
  )
}
