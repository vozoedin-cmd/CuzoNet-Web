
"use client"

import * as React from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { 
  useNetworkTopology, 
  NetworkMap, 
  NetworkMapSkeleton, 
  NetworkMapError, 
  NetworkMapEmpty 
} from "@/features/network"
import { Card, CardContent } from "@/components/ui/card"
import { ServerCrash, ShieldCheck, Activity } from "lucide-react"

export default function NetworkPage() {
  const companyId = "mock-company";
  const { data, isLoading, isError, error } = useNetworkTopology(companyId);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        title="Topología de Red" 
        description="Visualización geográfica y estado en tiempo real de nodos y enlaces"
        breadcrumb={[{ label: "Red" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nodos Activos</p>
              <h3 className="text-2xl font-bold">{data ? data.nodes.filter(n => n.status === 'active').length : '--'}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Activity className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Degradados</p>
              <h3 className="text-2xl font-bold">{data ? data.nodes.filter(n => n.status === 'degraded').length : '--'}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <ServerCrash className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Caídos</p>
              <h3 className="text-2xl font-bold">{data ? data.nodes.filter(n => n.status === 'offline').length : '--'}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading && <NetworkMapSkeleton />}
      {isError && <NetworkMapError error={error as Error} />}
      {!isLoading && !isError && (!data || data.nodes.length === 0) && <NetworkMapEmpty />}
      {!isLoading && !isError && data && data.nodes.length > 0 && <NetworkMap data={data} />}
    </div>
  )
}
