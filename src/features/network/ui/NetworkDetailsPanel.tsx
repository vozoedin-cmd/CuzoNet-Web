
import * as React from "react"
import { X, Activity, Users, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNetworkMapStore } from "../model/network-map.store"
import { TopologyNode, TopologyLink } from "../api/network.service"

interface NetworkDetailsPanelProps {
  nodes: TopologyNode[];
  links: TopologyLink[];
}

export function NetworkDetailsPanel({ nodes, links }: NetworkDetailsPanelProps) {
  const { selectedNodeId, selectedLinkId, resetSelection } = useNetworkMapStore();

  if (!selectedNodeId && !selectedLinkId) return null;

  const node = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null;
  const link = selectedLinkId ? links.find(l => l.id === selectedLinkId) : null;

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'text-green-500';
    if (status === 'degraded') return 'text-amber-500';
    if (status === 'offline') return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-80 bg-background/95 backdrop-blur-md rounded-xl border shadow-lg overflow-hidden flex flex-col max-h-[calc(100%-2rem)]">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-bold truncate">{node ? node.name : 'Enlace Troncal'}</h3>
        <Button variant="ghost" size="icon" onClick={resetSelection} className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {node && (
          <>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">Tipo</span>
              <span className="text-sm font-medium uppercase">{node.type}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">Estado</span>
              <span className={"text-sm font-bold uppercase " + getStatusColor(node.status)}>{node.status}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Disp.</span>
              <span className="text-sm font-medium">{node.availability}%</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Afectados</span>
              <span className="text-sm font-medium">{node.affectedClients} clientes</span>
            </div>
          </>
        )}

        {link && (
          <>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">Estado</span>
              <span className={"text-sm font-bold uppercase " + getStatusColor(link.status)}>{link.status}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Zap className="h-3 w-3" /> Capacidad</span>
              <span className="text-sm font-medium">{link.capacityGbps} Gbps</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3" /> Uso</span>
              <span className="text-sm font-medium">{link.usagePercentage}%</span>
            </div>
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Latencia</span>
              <span className="text-sm font-medium">{link.latencyMs} ms</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
