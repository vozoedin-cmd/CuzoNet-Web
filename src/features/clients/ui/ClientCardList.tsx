
import * as React from "react"
import { ClientDto } from "../api/clients.service"
import { ClientStatusBadge, ClientTypeBadge } from "./ClientBadges"
import { useClientsStore } from "../model/clients.store"

export function ClientCardList({ clients }: { clients: ClientDto[] }) {
  const { selectClient } = useClientsStore();
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(cli => (
        <div 
          key={cli.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3"
          onClick={() => selectClient(cli.id)}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <ClientTypeBadge type={cli.type} />
            <ClientStatusBadge status={cli.status} />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{cli.legalName}</h4>
            <p className="text-xs text-muted-foreground font-mono">{cli.documentId}</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border">
            {cli.primaryPhone} <br/>
            {cli.primaryEmail}
          </div>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">
              Servicios: {cli.servicesCount}
            </span>
            <span className={`text-xs font-bold ${cli.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(cli.balance)}
            </span>
          </div>
        </div>
      ))}
      {clients.length === 0 && (
        <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay clientes
        </div>
      )}
    </div>
  )
}
