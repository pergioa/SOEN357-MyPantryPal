import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PantryService } from '../core/services/pantry.service';
import { addDays, daysLeft, daysLeftText, toIsoLocalDate } from '../core/utils/date-utils';
import { normalizeName } from '../core/utils/scoring-utils';
import { FreshnessBadgeComponent } from '../shared/components/freshness-badge.component';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog.component';
import { IngredientItem } from '../core/models';

const INGREDIENT_SUGGESTIONS = [
  'eggs',
  'milk',
  'chicken',
  'rice',
  'pasta',
  'tomato',
  'onion',
  'garlic',
  'spinach',
  'beans',
  'tortillas',
  'cheese',
  'yogurt',
  'banana',
  'berries'
];

@Component({
  selector: 'app-pantry-page',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FreshnessBadgeComponent
  ],
  template: `
    <section class="shell page-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">My Pantry</p>
          <h1>Track ingredients and expiry dates</h1>
          <p class="subtle">Items are sorted by soonest expiration so urgent ingredients stay visible.</p>
        </div>
        <button mat-stroked-button color="warn" (click)="confirmClear()" [disabled]="!pantryItems().length">
          Clear Pantry
        </button>
      </div>

      <div class="pantry-grid">
        <mat-card class="form-card">
          <form [formGroup]="form" (ngSubmit)="saveItem()">
            <h2>{{ editingItem() ? 'Edit pantry item' : 'Add pantry item' }}</h2>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Ingredient</mat-label>
                <input
                  type="text"
                  matInput
                  formControlName="name"
                  [matAutocomplete]="ingredientAuto"
                  aria-label="Ingredient name"
                >
                <mat-autocomplete #ingredientAuto="matAutocomplete">
                  <mat-option *ngFor="let option of filteredSuggestions()" [value]="option">
                    {{ option | titlecase }}
                  </mat-option>
                </mat-autocomplete>
                <mat-error *ngIf="form.controls.name.hasError('required')">Ingredient name is required.</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Quantity (optional)</mat-label>
                <input matInput formControlName="quantity" aria-label="Quantity">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Expiration date</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  [value]="pickerDate()"
                  (dateChange)="setDateFromPicker($event.value)"
                  aria-label="Expiration date"
                >
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.controls.expiresOn.hasError('required')">Expiration date is required.</mat-error>
              </mat-form-field>
            </div>

            <div class="quick-row">
              <button type="button" mat-stroked-button (click)="setQuickDate(1)">+1 day</button>
              <button type="button" mat-stroked-button (click)="setQuickDate(3)">+3 days</button>
              <button type="button" mat-stroked-button (click)="setQuickDate(7)">+7 days</button>
            </div>

            <div class="action-row">
              <button mat-flat-button color="primary" type="submit">{{ editingItem() ? 'Update item' : 'Save item' }}</button>
              <button *ngIf="editingItem()" mat-button type="button" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </mat-card>

        <div class="list-area">
          <mat-card *ngIf="!pantryItems().length" class="empty-state">
            <mat-icon>kitchen</mat-icon>
            <h2>Your pantry is empty</h2>
            <p>Add a few items manually or load sample ingredients to start the study flow quickly.</p>
            <button mat-flat-button color="primary" (click)="pantryService.setSampleItems()">Add sample items</button>
          </mat-card>

          <mat-card *ngFor="let item of pantryItems()" class="pantry-item">
            <div class="item-main">
              <div>
                <h3>{{ item.name | titlecase }}</h3>
                <p *ngIf="item.quantity">{{ item.quantity }}</p>
                <p class="date-line">
                  Expires {{ item.expiresOn }} · {{ daysText(item.expiresOn) }}
                </p>
              </div>
              <app-freshness-badge [expiresOn]="item.expiresOn"></app-freshness-badge>
            </div>
            <div class="item-actions">
              <button mat-stroked-button (click)="startEdit(item)">Edit</button>
              <button mat-button color="warn" (click)="deleteItem(item.id)">Delete</button>
            </div>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 1rem;
      padding-top: 1rem;
    }

    .section-heading {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .eyebrow {
      margin: 0 0 0.4rem;
      color: var(--app-accent);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1, h2, h3 {
      margin: 0;
    }

    .subtle,
    .date-line,
    .pantry-item p {
      color: var(--app-muted);
    }

    .pantry-grid {
      display: grid;
      gap: 1rem;
    }

    .form-card,
    .pantry-item,
    .empty-state {
      padding: 1.1rem;
      border-radius: 26px;
      background: rgba(252, 249, 242, 0.9);
    }

    .form-grid {
      display: grid;
      gap: 0.75rem;
    }

    .quick-row,
    .action-row,
    .item-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .quick-row {
      margin: 0.5rem 0 1rem;
    }

    .list-area {
      display: grid;
      gap: 0.85rem;
    }

    .pantry-item {
      box-shadow: 0 18px 40px rgba(17, 38, 53, 0.06);
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .pantry-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 50px rgba(17, 38, 53, 0.1);
    }

    .item-main {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .empty-state {
      display: grid;
      justify-items: start;
      gap: 0.75rem;
      background:
        linear-gradient(180deg, rgba(252, 249, 242, 0.96), rgba(255, 249, 241, 0.88));
    }

    .empty-state mat-icon {
      width: 48px;
      height: 48px;
      font-size: 48px;
      color: var(--app-accent);
    }

    @media (min-width: 900px) {
      .section-heading {
        flex-direction: row;
        justify-content: space-between;
        align-items: end;
      }

      .pantry-grid {
        grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
      }

      .item-main {
        flex-direction: row;
        justify-content: space-between;
        align-items: start;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PantryPageComponent {
  readonly pantryService = inject(PantryService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  readonly pantryItems = this.pantryService.pantry;
  readonly editingItem = signal<IngredientItem | null>(null);
  readonly suggestions = INGREDIENT_SUGGESTIONS;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    quantity: [''],
    expiresOn: ['', Validators.required]
  });

  private readonly nameValue = toSignal(this.form.controls.name.valueChanges, {
    initialValue: this.form.controls.name.value
  });

  readonly filteredSuggestions = computed(() => {
    const query = normalizeName(this.nameValue() ?? '');
    if (!query) {
      return this.suggestions.slice(0, 8);
    }
    return this.suggestions.filter((item) => item.includes(query)).slice(0, 8);
  });

  pickerDate(): Date | null {
    const value = this.form.controls.expiresOn.value;
    return value ? new Date(`${value}T00:00:00`) : null;
  }

  setDateFromPicker(date: Date | null): void {
    if (!date) {
      return;
    }
    this.form.controls.expiresOn.setValue(toIsoLocalDate(date));
  }

  setQuickDate(days: number): void {
    this.form.controls.expiresOn.setValue(toIsoLocalDate(addDays(new Date(), days)));
  }

  saveItem(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const editing = this.editingItem();
    const result = this.pantryService.addOrUpdate(payload, editing?.id);

    if (result.duplicate && !editing) {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Duplicate ingredient',
          message: `Update the existing ${result.duplicate.name} item with this expiration date and quantity?`,
          confirmLabel: 'Update item'
        }
      });

      ref.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.pantryService.addOrUpdate(payload, result.duplicate?.id);
          this.resetForm();
        }
      });
      return;
    }

    this.resetForm();
  }

  startEdit(item: IngredientItem): void {
    this.editingItem.set(item);
    this.form.setValue({
      name: item.name,
      quantity: item.quantity ?? '',
      expiresOn: item.expiresOn
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteItem(id: string): void {
    this.pantryService.delete(id);
    if (this.editingItem()?.id === id) {
      this.resetForm();
    }
  }

  confirmClear(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Clear pantry?',
        message: 'This removes all pantry items stored on this device.',
        confirmLabel: 'Clear pantry'
      }
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.pantryService.clear();
        this.resetForm();
      }
    });
  }

  daysText(expiresOn: string): string {
    return daysLeftText(daysLeft(expiresOn));
  }

  private resetForm(): void {
    this.editingItem.set(null);
    this.form.reset({ name: '', quantity: '', expiresOn: '' });
  }
}
