import { describe, expect, it } from 'vitest';

import {
  billingKeys,
  getRegisterPaymentInvalidationKeys,
} from './useBilling';
import { decimalAmountToCents } from '../ui/BillingFormatting';

describe('Billing query contracts', () => {
  it('usa query keys estables para pagos y cuenta', () => {
    const filters = { page: 1, pageSize: 20 };
    expect(billingKeys.payments(filters)).toEqual([
      'billing',
      'payments',
      filters,
    ]);
    expect(billingKeys.account('client-1')).toEqual([
      'billing',
      'accounts',
      'client-1',
    ]);
  });

  it('invalida la lista de pagos y la cuenta del cliente registrado', () => {
    expect(getRegisterPaymentInvalidationKeys('client-1')).toEqual([
      ['billing', 'payments'],
      ['billing', 'accounts', 'client-1'],
    ]);
  });

  it('convierte decimales visibles a centavos sin errores de escala', () => {
    expect(decimalAmountToCents('100.05')).toBe(10_005);
    expect(decimalAmountToCents('0.1')).toBe(10);
    expect(() => decimalAmountToCents('12.345')).toThrow();
  });
});
