import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { PlanDto } from '../api/plans.service';
import { useCreatePlan, useRevisePlan } from '../hooks/usePlans';
import { usePlansStore } from '../model/plans.store';
import { PlanApiErrorNotice } from './PlansStates';

function SimpleDialog({
  children,
  onClose,
  open,
  title,
}: {
  children: ReactNode;
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

const createPlanSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z0-9_-]{2,32}$/, 'Usa 2-32 caracteres A-Z, 0-9, _ o -.'),
  downloadKbps: z.number().int().positive(),
  name: z.string().min(2).max(120),
  priceCents: z.number().int().min(0),
  serviceType: z.enum(['simple_queue', 'pppoe', 'hotspot']),
  uploadKbps: z.number().int().positive(),
});

type CreatePlanForm = z.infer<typeof createPlanSchema>;

export function CreatePlanDialog() {
  const activeModal = usePlansStore((state) => state.activeModal);
  const setActiveModal = usePlansStore((state) => state.setActiveModal);
  const createPlan = useCreatePlan();
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<CreatePlanForm>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      code: '',
      downloadKbps: 10000,
      name: '',
      priceCents: 0,
      serviceType: 'simple_queue',
      uploadKbps: 5000,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: CreatePlanForm) => {
    createPlan.mutate(
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
      title="Crear plan y primera versión"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
          El backend crea la identidad comercial y la versión 1 de forma atómica.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="plan-code" className="text-xs font-medium">
              Código
            </label>
            <input
              id="plan-code"
              {...register('code')}
              className={inputClass}
              placeholder="HOME_20"
            />
            {errors.code && (
              <p className="text-xs text-destructive mt-1">
                {errors.code.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="plan-service-type" className="text-xs font-medium">
              Tipo de servicio
            </label>
            <select
              id="plan-service-type"
              {...register('serviceType')}
              className={inputClass}
            >
              <option value="simple_queue">Simple Queue</option>
              <option value="pppoe">PPPoE</option>
              <option value="hotspot">Hotspot</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="plan-name" className="text-xs font-medium">
            Nombre
          </label>
          <input
            id="plan-name"
            {...register('name')}
            className={inputClass}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberField
            error={errors.priceCents?.message}
            id="plan-price"
            label="Precio (centavos)"
            registration={register('priceCents', { valueAsNumber: true })}
          />
          <NumberField
            error={errors.uploadKbps?.message}
            id="plan-upload"
            label="Subida (Kbps)"
            registration={register('uploadKbps', { valueAsNumber: true })}
          />
          <NumberField
            error={errors.downloadKbps?.message}
            id="plan-download"
            label="Bajada (Kbps)"
            registration={register('downloadKbps', { valueAsNumber: true })}
          />
        </div>

        {createPlan.isError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <PlanApiErrorNotice error={createPlan.error} />
          </div>
        )}

        <DialogActions
          isPending={createPlan.isPending}
          isValid={isValid}
          onCancel={() => setActiveModal('none')}
          submitLabel="Crear plan"
        />
      </form>
    </SimpleDialog>
  );
}

const revisePlanSchema = z.object({
  downloadKbps: z.number().int().positive(),
  effectiveFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato YYYY-MM-DD.'),
  isActive: z.boolean(),
  priceCents: z.number().int().min(0),
  uploadKbps: z.number().int().positive(),
});

type RevisePlanForm = z.infer<typeof revisePlanSchema>;

export function RevisePlanDialog({ plan }: { plan: PlanDto | undefined }) {
  const activeModal = usePlansStore((state) => state.activeModal);
  const setActiveModal = usePlansStore((state) => state.setActiveModal);
  const revisePlan = useRevisePlan();
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<RevisePlanForm>({
    resolver: zodResolver(revisePlanSchema),
    mode: 'onChange',
    values: {
      downloadKbps: plan?.currentVersion.downloadKbps ?? 1,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      isActive: plan?.isActive ?? false,
      priceCents: plan?.currentVersion.priceCents ?? 0,
      uploadKbps: plan?.currentVersion.uploadKbps ?? 1,
    },
  });

  const onSubmit = (data: RevisePlanForm) => {
    if (plan === undefined) return;

    revisePlan.mutate(
      { data, planId: plan.id },
      { onSuccess: () => setActiveModal('none') },
    );
  };

  return (
    <SimpleDialog
      open={activeModal === 'revise'}
      onClose={() => setActiveModal('none')}
      title="Revisar plan"
    >
      {plan === undefined ? (
        <p className="text-sm text-muted-foreground">
          El plan seleccionado no está disponible.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
            Este único flujo crea una nueva versión y puede cambiar isActive.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberField
              error={errors.priceCents?.message}
              id="revise-price"
              label="Precio (centavos)"
              registration={register('priceCents', { valueAsNumber: true })}
            />
            <NumberField
              error={errors.uploadKbps?.message}
              id="revise-upload"
              label="Subida (Kbps)"
              registration={register('uploadKbps', { valueAsNumber: true })}
            />
            <NumberField
              error={errors.downloadKbps?.message}
              id="revise-download"
              label="Bajada (Kbps)"
              registration={register('downloadKbps', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label htmlFor="revise-effective-from" className="text-xs font-medium">
              Vigente desde
            </label>
            <input
              id="revise-effective-from"
              type="date"
              {...register('effectiveFrom')}
              className={inputClass}
            />
            {errors.effectiveFrom && (
              <p className="text-xs text-destructive mt-1">
                {errors.effectiveFrom.message}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isActive')} />
            Plan activo
          </label>

          {revisePlan.isError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
              <PlanApiErrorNotice error={revisePlan.error} />
            </div>
          )}

          <DialogActions
            isPending={revisePlan.isPending}
            isValid={isValid}
            onCancel={() => setActiveModal('none')}
            submitLabel="Guardar revisión"
          />
        </form>
      )}
    </SimpleDialog>
  );
}

function NumberField({
  error,
  id,
  label,
  registration,
}: {
  error: string | undefined;
  id: string;
  label: string;
  registration: ReturnType<ReturnType<typeof useForm>['register']>;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium">
        {label}
      </label>
      <input id={id} type="number" step={1} {...registration} className={inputClass} />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function DialogActions({
  isPending,
  isValid,
  onCancel,
  submitLabel,
}: {
  isPending: boolean;
  isValid: boolean;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="pt-4 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded-md text-sm"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={!isValid || isPending}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
      >
        {isPending ? 'Guardando…' : submitLabel}
      </button>
    </div>
  );
}
