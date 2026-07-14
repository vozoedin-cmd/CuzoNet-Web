
import * as React from "react"
import { ClientDto } from "../api/clients.service"
import { ClientStatusBadge, ClientTypeBadge } from "./ClientBadges"
import { useClientsStore } from "../model/clients.store"

export function ClientTable({ clients }: { clients: ClientDto[] }) {
  const { selectClient } = useClientsStore();

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString();
  }
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  }

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Documento</th>
            <th className="px-4 py-3 font-medium">Contacto</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Servicios</th>
            <th className="px-4 py-3 font-medium">Deuda/Saldo</th>
            <th className="px-4 py-3 font-medium">Creado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {clients.map(cli => (
            <tr 
              key={cli.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectClient(cli.id)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <ClientTypeBadge type={cli.type} />
                </div>
                <p className="font-semibold">{cli.legalName}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-mono text-xs">{cli.documentId}</p>
              </td>
              <td className="px-4 py-3">
                <p className="text-xs">{cli.primaryPhone}</p>
                <p className="text-xs text-muted-foreground">{cli.primaryEmail}</p>
              </td>
              <td className="px-4 py-3">
                <ClientStatusBadge status={cli.status} />
              </td>
              <td className="px-4 py-3 text-xs font-semibold">
                {cli.servicesCount}
              </td>
              <td className="px-4 py-3 text-xs">
                <span className={cli.balance > 0 ? "text-red-500 font-bold" : "text-green-500"}>
                  {formatCurrency(cli.balance)}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(cli.createdAt)}</td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron clientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
