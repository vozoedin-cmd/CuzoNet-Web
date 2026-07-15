import * as React from "react"
import { Bot, AlertCircle } from "lucide-react"

export function AiIntegrationPending() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
      <Bot className="h-12 w-12 mb-4 opacity-50" />
      <h3 className="font-bold text-lg mb-2 text-foreground">Integración de IA Pendiente</h3>
      <p className="text-sm max-w-sm">El motor predictivo y conversacional aún no se encuentra disponible en este entorno.</p>
    </div>
  )
}

export function AiAssistantEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
      <Bot className="h-12 w-12 mb-4 opacity-50" />
      <h3 className="font-bold text-lg mb-2 text-foreground">¿En qué puedo ayudarte?</h3>
      <p className="text-sm max-w-sm mb-6">Realiza consultas sobre la red, clientes, servicios o estado financiero.</p>
    </div>
  )
}

export function AiSafetyNotice() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] px-3 py-1.5 rounded-md flex items-center gap-2 font-medium">
      <AlertCircle className="h-3 w-3 shrink-0" />
      Modo consulta: el asistente no puede modificar la red ni ejecutar acciones.
    </div>
  )
}
