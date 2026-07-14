
import * as React from "react"
import { Filter, Maximize, Eye, EyeOff, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNetworkMapStore } from "../model/network-map.store"

export function NetworkMapToolbar({ onCenter }: { onCenter: () => void }) {
  const { showLinks, showLabels, statusFilter, toggleLinks, toggleLabels, setStatusFilter } = useNetworkMapStore();

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
      <Button variant="ghost" size="icon" onClick={onCenter} title="Centrar Mapa">
        <Maximize className="h-4 w-4" />
      </Button>
      <div className="h-px bg-border my-1" />
      <Button variant={showLinks ? "secondary" : "ghost"} size="icon" onClick={toggleLinks} title="Enlaces">
        {showLinks ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 opacity-50" />}
      </Button>
      <Button variant={showLabels ? "secondary" : "ghost"} size="icon" onClick={toggleLabels} title="Etiquetas">
        <Tag className="h-4 w-4" />
      </Button>
      <div className="h-px bg-border my-1" />
      <Button 
        variant={statusFilter === 'offline' ? "destructive" : "ghost"} 
        size="icon" 
        onClick={() => setStatusFilter(statusFilter === 'offline' ? null : 'offline')}
        title="Filtrar Caídos"
      >
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
