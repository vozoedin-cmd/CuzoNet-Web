
import * as React from "react"
import { EquipmentDto } from "../api/inventory.service"
import { EquipmentTypeBadge, EquipmentRoleBadge, EquipmentStatusBadge } from "./InventoryBadges"
import { useInventoryStore } from "../model/inventory.store"

export function EquipmentTable({ equipments }: { equipments: EquipmentDto[] }) {
  const { selectEquipment } = useInventoryStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()}`;
  }

  return (
    <div className="w-full overflow-auto rounded-xl border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-b">
          <tr>
            <th className="px-4 py-3 font-medium">Equipo</th>
            <th className="px-4 py-3 font-medium">Fabricante/Modelo</th>
            <th className="px-4 py-3 font-medium">Identidad</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Ubicación</th>
            <th className="px-4 py-3 font-medium">Actualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {equipments.map(eq => (
            <tr 
              key={eq.id} 
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => selectEquipment(eq.id)}
            >
              <td className="px-4 py-3 space-y-1">
                <EquipmentTypeBadge type={eq.type} />
                <br/>
                <EquipmentRoleBadge role={eq.role} />
              </td>
              <td className="px-4 py-3">
                <p className="font-semibold">{eq.manufacturer}</p>
                <p className="text-xs text-muted-foreground">{eq.model}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-mono text-xs">SN: {eq.serialNumber}</p>
                <p className="font-mono text-xs text-muted-foreground">MAC: {eq.macAddress}</p>
              </td>
              <td className="px-4 py-3">
                <EquipmentStatusBadge status={eq.status} />
              </td>
              <td className="px-4 py-3 text-xs">
                {eq.location}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(eq.updatedAt)}</td>
            </tr>
          ))}
          {equipments.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                No se encontraron equipos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
