import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useCreateService, useRequestProvisioning } from '../hooks/useServices';
import { useServicesStore } from '../model/services.store';
import { ApiErrorNotice } from './ServicesStates';

function SimpleDialog({
  children,
  onClose,
  open,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative bg-card border shadow-xl rounded-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

const createSchema = z.object({
  billingDay: z.number().int().min(1).max(28),
  planVersionId: z.string().trim().min(1, 'Requerido'),
  serviceType: z.enum(['simple_queue', 'pppoe', 'hotspot']),
});

type CreateServiceForm = z.infer<typeof createSchema>;

export function CreateServiceDialog() {
  const activeModal = useServicesStore((state) => state.activeModal);
  const selectedClientId = useServicesStore((state) => state.selectedClientId);
  const setActiveModal = useServicesStore((state) => state.setActiveModal);
  const createService = useCreateService(selectedClientId);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateServiceForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      billingDay: 1,
      planVersionId: '',
      serviceType: 'simple_queue',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: CreateServiceForm) => {
    createService.mutate(
      { data },
      {
        onSuccess: () => {
          reset();
          setActiveModal('none');
        },
      },
    );
  };

  return (
    <SimpleDialog
      open={activeModal === 'create'}
      onClose={() => setActiveModal('none')}
      title="Nuevo contrato de servicio"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md text-xs">
          Crea el contrato lógico en estado pending. No aprovisiona hardware.
        </div>
        <div>
          <label className="text-xs font-medium">Client ID seleccionado</label>
          <p className="font-mono text-sm break-all">
            {selectedClientId ?? 'No disponible'}
          </p>
        </div>
        <div>
          <label htmlFor="service-plan-version" className="text-xs font-medium">
            Plan version ID
          </label>
          <input
            id="service-plan-version"
            {...register('planVersionId')}
            className={inputClass}
          />
          {errors.planVersionId && (
            <p className="text-xs text-destructive mt-1">
              {errors.planVersionId.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="service-type" className="text-xs font-medium">
              Tipo
            </label>
            <select
              id="service-type"
              {...register('serviceType')}
              className={inputClass}
            >
              <option value="simple_queue">Simple Queue</option>
              <option value="pppoe">PPPoE</option>
              <option value="hotspot">Hotspot</option>
            </select>
          </div>
          <div>
            <label htmlFor="service-billing-day" className="text-xs font-medium">
              Día de facturación
            </label>
            <input
              id="service-billing-day"
              type="number"
              min={1}
              max={28}
              {...register('billingDay', { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.billingDay && (
              <p className="text-xs text-destructive mt-1">
                {errors.billingDay.message}
              </p>
            )}
          </div>
        </div>

        {createService.isError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <ApiErrorNotice error={createService.error} />
          </div>
        )}

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!isValid || selectedClientId === null || createService.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
          >
            {createService.isPending ? 'Creando…' : 'Crear contrato'}
          </button>
        </div>
      </form>
    </SimpleDialog>
  );
}

export function RequestProvisioningDialog() {
  const activeModal = useServicesStore((state) => state.activeModal);
  const selectedServiceId = useServicesStore(
    (state) => state.selectedServiceId,
  );
  const setActiveModal = useServicesStore((state) => state.setActiveModal);
  const setActiveOperationId = useServicesStore(
    (state) => state.setActiveOperationId,
  );
  const requestProvisioning = useRequestProvisioning(selectedServiceId);
  const [routerId, setRouterId] = React.useState('');

  const onConfirm = () => {
    if (selectedServiceId === null || routerId.trim().length === 0) return;

    requestProvisioning.mutate(
      { data: { routerId: routerId.trim(), type: 'provision' } },
      {
        onSuccess: (accepted) => {
          setActiveOperationId(accepted.operationId);
          setRouterId('');
          setActiveModal('none');
        },
      },
    );
  };

  return (
    <SimpleDialog
      open={activeModal === 'provision'}
      onClose={() => setActiveModal('none')}
      title="Aprovisionamiento técnico"
    >
      <div className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs">
          La respuesta confirma una operación en cola; el resultado se consulta
          después mediante polling.
        </div>
        <div>
          <label htmlFor="provision-router" className="text-xs font-medium">
            Router ID
          </label>
          <input
            id="provision-router"
            value={routerId}
            onChange={(event) => setRouterId(event.target.value)}
            className={inputClass}
          />
        </div>

        {requestProvisioning.isError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <ApiErrorNotice error={requestProvisioning.error} />
          </div>
        )}

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="px-4 py-2 border rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              selectedServiceId === null ||
              routerId.trim().length === 0 ||
              requestProvisioning.isPending
            }
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
          >
            {requestProvisioning.isPending ? 'Encolando…' : 'Encolar operación'}
          </button>
        </div>
      </div>
    </SimpleDialog>
  );
}
