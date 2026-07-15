"use client"
import * as React from "react"
import { AiChatPanel } from "./AiChatPanel"
import { AiAssistantDrawer } from "./AiAssistantDrawer"
import { Terminal } from "lucide-react"

export function AiAssistantOverview() {
  const isDemo = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === 'true';

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full border rounded-xl overflow-hidden shadow-sm">
      {/* Panel lateral sugerencias (desktop) */}
      <div className="hidden lg:flex w-64 bg-card border-r flex-col">
        <div className="p-4 border-b">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Contexto Activo
          </h3>
        </div>
        <div className="p-4 text-xs text-muted-foreground space-y-4">
          <div>
            <p className="font-bold text-foreground mb-1">Capacidades</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Métricas de red</li>
              <li>Facturación global</li>
              <li>Estado de nodos</li>
              <li>Alertas críticas</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-foreground mb-1">Restricciones</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>No modifica RouterOS</li>
              <li>No gestiona pagos</li>
              <li>Solo lectura</li>
            </ul>
          </div>
          {isDemo && (
            <div className="mt-4 bg-amber-500/10 text-amber-500 p-2 rounded border border-amber-500/20 font-bold uppercase text-center animate-pulse">
              Datos Demo
            </div>
          )}
        </div>
      </div>

      {/* Chat principal */}
      <div className="flex-1 bg-background relative">
        <AiChatPanel />
      </div>
      
      {/* Componente flotante global si se quisiera (aqui va montado para page) */}
      <AiAssistantDrawer />
    </div>
  )
}
