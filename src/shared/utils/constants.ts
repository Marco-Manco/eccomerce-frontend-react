export const API_BASE = import.meta.env.VITE_API_URL || '';
export const ROLES = { CLIENTE: 'CLIENTE', ADMIN: 'ADMIN' } as const;

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' });
}
