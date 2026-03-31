import { Injectable, computed, signal } from '@angular/core';
import { StudyLogEntry } from '../models';

const STORAGE_KEY = 'mypantrypal-study-log';

@Injectable({ providedIn: 'root' })
export class StudyLogService {
  private readonly logsSignal = signal<StudyLogEntry[]>(this.load());

  readonly logs = computed(() => [...this.logsSignal()].sort((a, b) => b.timestamp.localeCompare(a.timestamp)));

  add(entry: StudyLogEntry): void {
    this.persist([...this.logsSignal(), entry]);
  }

  clear(): void {
    this.persist([]);
  }

  exportJson(): string {
    return JSON.stringify(this.logs(), null, 2);
  }

  private load(): StudyLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as StudyLogEntry[];
    } catch {
      return [];
    }
  }

  private persist(items: StudyLogEntry[]): void {
    this.logsSignal.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
