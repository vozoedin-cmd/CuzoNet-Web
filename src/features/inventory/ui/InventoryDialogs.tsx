
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useInventoryStore } from "../model/inventory.store"
import { useInventoryMutations } from "../hooks/useInventoryMutations"
import { EquipmentStatus } from "../api/inventory.service"

// --- Componente base sencillo tipo Dialog nativo para no trabarse con Radix si no está exportado igual ---
function SimpleDialog({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border shadow-xl rounded-xl w-full max-w-md p-6 animate-in zoom-in-95">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">X</button>
      </div>
    </div>
  )
}

const inputClass = "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

// 1. EquipmentFormDialog
const equipSchema = z.object({
  manufacturer: z.string().min(1, "Requerido"),
  model: z.string().min(1, "Requerido"),
  serialNumber: z.string().min(1, "Requerido"),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "MAC inválida"),
  type: z.enum(['router', 'access_point', 'switch', 'cpe', 'ptp_radio', 'battery', 'solar_panel', 'generic_equipment']),
  role: z.enum(['core', 'distribution', 'access', 'client']),
  location: z.string().min(1, "Requerido"),
})

export function EquipmentFormDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal } = useInventoryStore();
  const { createEq } = useInventoryMutations(companyId);
  
  const isCreate = activeModal === 'create';
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<z.infer<typeof equipSchema>>({
    resolver: zodResolver(equipSchema),
    defaultValues: { type: 'cpe', role: 'client' }
  });

  const onSubmit = (data: z.infer<typeof equipSchema>) => {
    if (isCreate) {
      createEq.mutate(data, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={isCreate || activeModal === 'edit'} onClose={() => setActiveModal('none')} title={isCreate ? "Registrar Equipo" : "Editar Equipo"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Fabricante</label>
            <input {...register("manufacturer")} className={inputClass} />
            {errors.manufacturer && <p className="text-[10px] text-red-500 mt-1">{errors.manufacturer.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">Modelo</label>
            <input {...register("model")} className={inputClass} />
            {errors.model && <p className="text-[10px] text-red-500 mt-1">{errors.model.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Serial</label>
            <input {...register("serialNumber")} className={inputClass} />
            {errors.serialNumber && <p className="text-[10px] text-red-500 mt-1">{errors.serialNumber.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium">MAC Base</label>
            <input {...register("macAddress")} className={inputClass} />
            {errors.macAddress && <p className="text-[10px] text-red-500 mt-1">{errors.macAddress.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium">Tipo</label>
            <select {...register("type")} className={inputClass} disabled={!isCreate}>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="access_point">Access Point</option>
              <option value="ptp_radio">PTP Radio</option>
              <option value="battery">Battery</option>
              <option value="solar_panel">Solar Panel</option>
              <option value="generic_equipment">Generic Equipment</option>
              <option value="cpe">CPE</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium">Rol</label>
            <select {...register("role")} className={inputClass}>
              <option value="core">Core</option>
              <option value="distribution">Distribution</option>
              <option value="access">Access</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium">Ubicación</label>
          <input {...register("location")} className={inputClass} />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button type="submit" disabled={!isValid} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Guardar</button>
        </div>
      </form>
    </SimpleDialog>
  )
}

// 2. Status Dialog
export function EquipmentStatusDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedEquipmentId } = useInventoryStore();
  const { changeStatus } = useInventoryMutations(companyId);
  const [status, setStatus] = React.useState<EquipmentStatus>('active');

  const onConfirm = () => {
    if (selectedEquipmentId) {
      changeStatus.mutate({ id: selectedEquipmentId, status }, { onSuccess: () => setActiveModal('none') });
    }
  }

  return (
    <SimpleDialog open={activeModal === 'status'} onClose={() => setActiveModal('none')} title="Cambiar Estado Operativo">
      <div className="space-y-4">
        <select value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus)} className={inputClass}>
          <option value="active">Activar</option>
          <option value="inactive">Desactivar</option>
          <option value="retired">Retirar (Baja)</option>
        </select>
        <p className="text-xs text-muted-foreground">Nota: Retirar un equipo no lo elimina de la base de datos, lo marca para descarte.</p>
        <div className="pt-4 flex justify-end gap-2">
          <button onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm">Confirmar Cambio</button>
        </div>
      </div>
    </SimpleDialog>
  )
}

export function EquipmentAssignmentDialog({ companyId }: { companyId: string }) {
  const { activeModal, setActiveModal, selectedEquipmentId } = useInventoryStore();
  const { assignEq } = useInventoryMutations(companyId);
  const [targetType, setTargetType] = React.useState<'client' | 'service'>('client');
  const [targetId, setTargetId] = React.useState('');
  const [reason, setReason] = React.useState('');

  const onConfirm = () => {
    if (selectedEquipmentId && targetId && reason) {
      assignEq.mutate(
        { id: selectedEquipmentId, targetType, targetId, reason },
        { onSuccess: () => setActiveModal('none') }
      );
    }
  }

  return (
    <SimpleDialog open={activeModal === 'assign'} onClose={() => setActiveModal('none')} title="Asignar Equipo">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium">Destino de la Asignación</label>
          <select value={targetType} onChange={(e) => setTargetType(e.target.value as 'client' | 'service')} className={inputClass}>
            <option value="client">Cliente</option>
            <option value="service">Servicio</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">ID del Destino</label>
          <input value={targetId} onChange={(e) => setTargetId(e.target.value)} className={inputClass} placeholder="Ej. cli-123" />
        </div>
        <div>
          <label className="text-xs font-medium">Motivo</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass} placeholder="Ej. Instalación nueva" />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          <button onClick={() => setActiveModal('none')} className="px-4 py-2 border rounded-md text-sm">Cancelar</button>
          <button onClick={onConfirm} disabled={!targetId || !reason} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50">Confirmar</button>
        </div>
      </div>
    </SimpleDialog>
  )
}
