
import * as React from "react"
import { EquipmentType, EquipmentRole, EquipmentStatus } from "../api/inventory.service"
import { Router, Server, Wifi, Antenna, Battery, Sun, Box } from "lucide-react"

export function EquipmentTypeBadge({ type }: { type: EquipmentType }) {
  const cfg = {
    router: { icon: Router, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    switch: { icon: Server, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
    access_point: { icon: Wifi, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    cpe: { icon: Router, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    ptp_radio: { icon: Antenna, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
    battery: { icon: Battery, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
    solar_panel: { icon: Sun, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    generic_equipment: { icon: Box, color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20' },
  };

  const Icon = cfg[type].icon;

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] uppercase font-medium ${cfg[type].color}`} title={type}>
      <Icon className="h-3 w-3" /> {type}
    </div>
  )
}

export function EquipmentRoleBadge({ role }: { role: EquipmentRole }) {
  const colors = {
    core: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    distribution: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    access: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    client: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${colors[role]}`}>
      {role}
    </span>
  )
}

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  const colors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    inactive: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    retired: 'bg-red-500/10 text-red-500 border-red-500/20',
    assigned: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border uppercase tracking-wider ${colors[status]}`}>
      {status}
    </span>
  )
}
