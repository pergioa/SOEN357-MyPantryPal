import { Injectable, signal } from '@angular/core';
import { StudyMode } from '../models';

const STORAGE_KEY = 'mypantrypal-study-mode';

@Injectable({ providedIn: 'root' })
export class StudyModeService {
  readonly mode = signal<StudyMode>(this.load());

  setMode(mode: StudyMode): void {
    this.mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }

  toggle(mode: boolean): void {
    this.setMode(mode ? 'B' : 'A');
  }

  private load(): StudyMode {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'B' ? 'B' : 'A';
  }
}
