export function formatMinorUnits(cents: number): string {
  return new Intl.NumberFormat('es-GT', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('es-GT', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value);
}
