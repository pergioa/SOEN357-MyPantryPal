const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(base: Date, days: number): Date {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

export function daysLeft(isoDate: string, now = new Date()): number {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = parseLocalDate(isoDate);
  return Math.round((target.getTime() - startOfToday.getTime()) / MS_PER_DAY);
}

export type FreshnessTone = 'danger' | 'warn' | 'ok';
export type FreshnessLabel = 'Expired' | 'Use today' | 'Use soon' | 'Fresh';

export function freshnessLabel(days: number): FreshnessLabel {
  if (days < 0) {
    return 'Expired';
  }
  if (days === 0) {
    return 'Use today';
  }
  if (days <= 3) {
    return 'Use soon';
  }
  return 'Fresh';
}

export function freshnessTone(days: number): FreshnessTone {
  if (days <= 1) {
    return 'danger';
  }
  if (days <= 3) {
    return 'warn';
  }
  return 'ok';
}

export function isSoonToExpire(isoDate: string): boolean {
  const remaining = daysLeft(isoDate);
  return remaining <= 3;
}

export function daysLeftText(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  }
  if (days === 0) {
    return 'Today';
  }
  return `${days} day${days === 1 ? '' : 's'} left`;
}
