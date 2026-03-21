import { Injectable, computed, signal } from '@angular/core';
import { IngredientItem } from '../models';
import { daysLeft } from '../utils/date-utils';
import { normalizeName } from '../utils/scoring-utils';

const STORAGE_KEY = 'mypantrypal-pantry';

export interface PantryDraft {
  name: string;
  quantity?: string;
  expiresOn: string;
}

@Injectable({ providedIn: 'root' })
export class PantryService {
  private readonly pantrySignal = signal<IngredientItem[]>(this.load());

  readonly pantry = computed(() =>
    [...this.pantrySignal()].sort((a, b) => daysLeft(a.expiresOn) - daysLeft(b.expiresOn))
  );

  readonly pantryNames = computed(() => this.pantry().map((item) => item.name));

  addOrUpdate(draft: PantryDraft, existingId?: string): { duplicate: IngredientItem | null } {
    const normalizedName = normalizeName(draft.name);
    const duplicate = this.pantrySignal().find(
      (item) => item.name === normalizedName && item.id !== existingId
    ) ?? null;

    if (duplicate && !existingId) {
      return { duplicate };
    }

    const nextItem: IngredientItem = {
      id: existingId ?? crypto.randomUUID(),
      name: normalizedName,
      quantity: draft.quantity?.trim() || undefined,
      expiresOn: draft.expiresOn
    };

    const nextPantry = existingId
      ? this.pantrySignal().map((item) => (item.id === existingId ? nextItem : item))
      : duplicate
        ? this.pantrySignal().map((item) => (item.id === duplicate.id ? { ...nextItem, id: duplicate.id } : item))
        : [...this.pantrySignal(), nextItem];

    this.persist(nextPantry);
    return { duplicate };
  }

  replaceItem(id: string, draft: PantryDraft): void {
    this.addOrUpdate(draft, id);
  }

  delete(id: string): void {
    this.persist(this.pantrySignal().filter((item) => item.id !== id));
  }

  clear(): void {
    this.persist([]);
  }

  setSampleItems(): void {
    const today = new Date();
    const sample: IngredientItem[] = [
      { id: crypto.randomUUID(), name: 'spinach', quantity: '1 bag', expiresOn: offsetDate(today, 1) },
      { id: crypto.randomUUID(), name: 'milk', quantity: '1 carton', expiresOn: offsetDate(today, 2) },
      { id: crypto.randomUUID(), name: 'eggs', quantity: '6', expiresOn: offsetDate(today, 7) },
      { id: crypto.randomUUID(), name: 'chicken', quantity: '2 breasts', expiresOn: offsetDate(today, 1) },
      { id: crypto.randomUUID(), name: 'rice', quantity: '2 cups', expiresOn: offsetDate(today, 30) },
      { id: crypto.randomUUID(), name: 'onion', quantity: '2', expiresOn: offsetDate(today, 10) },
      { id: crypto.randomUUID(), name: 'garlic', quantity: '1 bulb', expiresOn: offsetDate(today, 20) },
      { id: crypto.randomUUID(), name: 'cheese', quantity: '1 block', expiresOn: offsetDate(today, 8) }
    ];

    this.persist(sample);
  }

  private load(): IngredientItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as IngredientItem[];
    } catch {
      return [];
    }
  }

  private persist(items: IngredientItem[]): void {
    this.pantrySignal.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

function offsetDate(base: Date, days: number): string {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  const year = next.getFullYear();
  const month = `${next.getMonth() + 1}`.padStart(2, '0');
  const day = `${next.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}
