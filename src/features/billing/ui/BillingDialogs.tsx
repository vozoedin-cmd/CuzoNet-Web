import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';

import { useRegisterPayment } from '../hooks/useBilling';
import { useBillingStore } from '../model/billing.store';
import {
  decimalAmountToCents,
  formatMoney,
} from './BillingFormatting';
import { BillingApiErrorNotice } from './BillingStates';

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

const paymentSchema = z.object({
  amount: z
    .string()
    .regex(/^\d+(?:\.\d{1,2})?$/, 'Usa un monto con máximo dos decimales.')
    .refine((value) => {
      try {
        return decimalAmountToCents(value) > 0;
      } catch {
        return false;
      }
    }, 'El monto debe ser mayor que cero.'),
  clientId: z.string().uuid('Debe ser un UUID válido.'),
  currencyCode: z.string().regex(/^[A-Z]{3}$/, 'Usa tres letras mayúsculas.'),
  externalReference: z.string().max(120),
  method: z.enum(['cash', 'transfer', 'card', 'online', 'other']),
  receivedAt: z
    .string()
    .datetime({ offset: true, message: 'Usa una fecha RFC3339 con zona horaria.' }),
});

type PaymentForm = z.infer<typeof paymentSchema>;

function paymentDefaults(clientId: string): PaymentForm {
  return {
    amount: '',
    clientId,
    currencyCode: 'GTQ',
    externalReference: '',
    method: 'cash',
    receivedAt: new Date().toISOString(),
  };
}

export function RegisterPaymentDialog({
  defaultClientId,
}: {
  defaultClientId: string;
}) {
  const activeModal = useBillingStore((state) => state.activeModal);
  const setActiveModal = useBillingStore((state) => state.setActiveModal);
  const registerPayment = useRegisterPayment();
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentDefaults(defaultClientId),
    mode: 'onChange',
  });
  const amount = useWatch({ control, name: 'amount' });
  const currencyCode = useWatch({ control, name: 'currencyCode' });

  let convertedAmount: string | null = null;
  try {
    const cents = decimalAmountToCents(amount);
    if (cents > 0 && /^[A-Z]{3}$/.test(currencyCode)) {
      convertedAmount =
        formatMoney(cents, currencyCode) + ' · payload: ' + cents + ' centavos';
    }
  } catch {
    convertedAmount = null;
  }

  const onSubmit = (data: PaymentForm) => {
    const externalReference = data.externalReference.trim();

    registerPayment.mutate(
      {
        data: {
          amountCents: decimalAmountToCents(data.amount),
          clientId: data.clientId,
          currencyCode: data.currencyCode,
          ...(externalReference.length === 0 ? {} : { externalReference }),
          method: data.method,
          receivedAt: data.receivedAt,
        },
      },
      {
        onSuccess: () => {
          reset(paymentDefaults(defaultClientId));
          setActiveModal('none');
        },
      },
    );
  };

  return (
    <SimpleDialog
      open={activeModal === 'register_payment'}
      onClose={() => setActiveModal('none')}
      title="Registrar pago"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="rounded-md border border-blue-500/20 bg-blue-500/10 p-3 text-xs">
          El monto visible se convierte explícitamente a centavos antes de
          enviar el payload.
        </p>
        <div>
          <label htmlFor="payment-client" className="text-xs font-medium">
            Client ID
          </label>
          <input
            id="payment-client"
            {...register('clientId')}
            className={inputClass}
          />
          {errors.clientId && <FieldError message={errors.clientId.message} />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="payment-amount" className="text-xs font-medium">
              Monto decimal
            </label>
            <input
              id="payment-amount"
              inputMode="decimal"
              {...register('amount')}
              className={inputClass}
              placeholder="100.00"
            />
            {errors.amount && <FieldError message={errors.amount.message} />}
            {convertedAmount !== null && (
              <p className="text-xs text-green-600 mt-1">{convertedAmount}</p>
            )}
          </div>
          <div>
            <label htmlFor="payment-currency" className="text-xs font-medium">
              Moneda
            </label>
            <input
              id="payment-currency"
              {...register('currencyCode')}
              className={inputClass}
              maxLength={3}
            />
            {errors.currencyCode && (
              <FieldError message={errors.currencyCode.message} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="payment-method" className="text-xs font-medium">
              Método
            </label>
            <select
              id="payment-method"
              {...register('method')}
              className={inputClass}
            >
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
              <option value="online">En línea</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label htmlFor="payment-reference" className="text-xs font-medium">
              Referencia externa
            </label>
            <input
              id="payment-reference"
              {...register('externalReference')}
              className={inputClass}
            />
            {errors.externalReference && (
              <FieldError message={errors.externalReference.message} />
            )}
          </div>
        </div>
        <div>
          <label htmlFor="payment-received-at" className="text-xs font-medium">
            Fecha recibida (RFC3339)
          </label>
          <input
            id="payment-received-at"
            {...register('receivedAt')}
            className={inputClass}
            placeholder="2026-07-15T14:30:00.000Z"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Incluye explícitamente Z o un offset de zona horaria.
          </p>
          {errors.receivedAt && (
            <FieldError message={errors.receivedAt.message} />
          )}
        </div>

        {registerPayment.isError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
            <BillingApiErrorNotice error={registerPayment.error} />
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
            disabled={!isValid || registerPayment.isPending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm disabled:opacity-50"
          >
            {registerPayment.isPending ? 'Registrando…' : 'Registrar pago'}
          </button>
        </div>
      </form>
    </SimpleDialog>
  );
}

function FieldError({ message }: { message: string | undefined }) {
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}
