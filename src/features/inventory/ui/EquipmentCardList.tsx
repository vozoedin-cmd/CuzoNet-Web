
import * as React from "react"
import { EquipmentDto } from "../api/inventory.service"
import { EquipmentTypeBadge, EquipmentRoleBadge, EquipmentStatusBadge } from "./InventoryBadges"
import { useInventoryStore } from "../model/inventory.store"

export function EquipmentCardList({ equipments }: { equipments: EquipmentDto[] }) {
  const { selectEquipment } = useInventoryStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {equipments.map(eq => (
        <div 
          key={eq.id} 
          className="p-4 rounded-xl border bg-card hover:border-primary/50 cursor-pointer transition-colors flex flex-col gap-3"
          onClick={() => selectEquipment(eq.id)}
        >
          <div className="flex items-center justify-between border-b pb-2">
            <EquipmentTypeBadge type={eq.type} />
            <EquipmentStatusBadge status={eq.status} />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{eq.manufacturer} {eq.model}</h4>
            <EquipmentRoleBadge role={eq.role} />
          </div>
          <div className="text-xs text-muted-foreground font-mono bg-muted/50 p-2 rounded border">
            SN: {eq.serialNumber} <br/>
            MAC: {eq.macAddress}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {eq.location}
          </div>
        </div>
      ))}
      {equipments.length === 0 && (
        <div className="col-span-1 sm:grid-cols-2 lg:col-span-3 text-center py-8 text-muted-foreground border rounded-xl border-dashed">
          No hay equipos
        </div>
      )}
    </div>
  )
}
