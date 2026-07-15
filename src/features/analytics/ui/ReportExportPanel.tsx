
import * as React from "react"
import { FileText, FileSpreadsheet } from "lucide-react"

export function ReportExportPanel() {
  return (
    <div className="bg-card border rounded-xl p-6 flex flex-col items-center justify-center text-center">
      <h3 className="font-bold text-lg mb-2">Exportar Reportes</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">Genera archivos descargables con los cortes analíticos del periodo seleccionado.</p>
      
      <div className="flex gap-4">
        <button disabled className="opacity-50 cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-sm font-bold transition-all relative group">
          <FileText className="w-4 h-4" /> Exportar PDF
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Próximamente</span>
        </button>
        <button disabled className="opacity-50 cursor-not-allowed flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-md text-sm font-bold transition-all relative group">
          <FileSpreadsheet className="w-4 h-4" /> Exportar CSV
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Próximamente</span>
        </button>
      </div>
    </div>
  )
}
