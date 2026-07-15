export function decimalAmountToCents(value: string): number {
  const normalized = value.trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (match === null) {
    throw new Error('El monto debe tener como máximo dos decimales.');
  }

  const whole = BigInt(match[1]);
  const fraction = BigInt((match[2] ?? '').padEnd(2, '0'));
  const cents = whole * BigInt(100) + fraction;
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('El monto excede el máximo seguro.');
  }
  return Number(cents);
}

export function formatMoney(cents: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('es-GT', {
      currency: currencyCode,
      style: 'currency',
    }).format(cents / 100);
  } catch {
    return (
      new Intl.NumberFormat('es-GT', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(cents / 100) +
      ' ' +
      currencyCode
    );
  }
}

export function formatPaymentDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No disponible';

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZoneName: 'short',
  }).format(date);
}

export function formatAccountDate(value: string | null): string {
  if (value === null) return 'No disponible';
  const date = new Date(value + 'T00:00:00.000Z');
  if (Number.isNaN(date.getTime())) return 'No disponible';

  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(date);
}
