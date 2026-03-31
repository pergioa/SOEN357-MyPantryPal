import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ModeToggleComponent } from './mode-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    ModeToggleComponent
  ],
  template: `
    <mat-toolbar class="app-toolbar">
      <a class="brand" routerLink="/">
        <span class="brand-mark">MP</span>
        <span>MyPantryPal</span>
      </a>

      <nav class="desktop-nav" aria-label="Primary">
        <a mat-button routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a mat-button routerLink="/pantry" routerLinkActive="active-link">My Pantry</a>
        <a mat-button routerLink="/recipes" routerLinkActive="active-link">Recipes</a>
        <a mat-button routerLink="/study-log" routerLinkActive="active-link">Study Log</a>
      </nav>

      <div class="toolbar-spacer"></div>
      <div class="desktop-mode">
        <app-mode-toggle></app-mode-toggle>
      </div>
    </mat-toolbar>

    <nav class="mobile-nav" aria-label="Mobile">
      <a routerLink="/" routerLinkActive="active-tab" [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <a routerLink="/pantry" routerLinkActive="active-tab">
        <mat-icon>kitchen</mat-icon>
        <span>Pantry</span>
      </a>
      <a routerLink="/recipes" routerLinkActive="active-tab">
        <mat-icon>restaurant_menu</mat-icon>
        <span>Recipes</span>
      </a>
      <a routerLink="/study-log" routerLinkActive="active-tab">
        <mat-icon>fact_check</mat-icon>
        <span>Logs</span>
      </a>
    </nav>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      gap: 1rem;
      min-height: 72px;
      padding: 0 1rem;
      color: var(--app-ink);
      background: rgba(252, 249, 242, 0.84);
      backdrop-filter: blur(18px) saturate(130%);
      border-bottom: 1px solid rgba(17, 38, 53, 0.07);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: inherit;
      text-decoration: none;
      font-family: var(--display-font);
      font-size: 1.15rem;
      font-weight: 700;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      color: white;
      background: linear-gradient(135deg, #2f6f53, #d9982d);
    }

    .desktop-nav {
      display: none;
      gap: 0.25rem;
      align-items: center;
    }

    .desktop-nav a {
      border-radius: 999px;
      font-weight: 700;
    }

    .toolbar-spacer {
      flex: 1;
    }

    .desktop-mode {
      display: none;
    }

    .active-link {
      font-weight: 700;
      background: rgba(47, 111, 83, 0.11);
    }

    .mobile-nav {
      position: fixed;
      left: 0.75rem;
      right: 0.75rem;
      bottom: 0.75rem;
      z-index: 30;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.25rem;
      padding: 0.5rem;
      background: rgba(252, 249, 242, 0.88);
      backdrop-filter: blur(18px) saturate(140%);
      border: 1px solid rgba(17, 38, 53, 0.08);
      border-radius: 24px;
      box-shadow: 0 16px 40px rgba(17, 38, 53, 0.12);
    }

    .mobile-nav a {
      min-height: 56px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      border-radius: 16px;
      color: var(--app-muted);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 700;
      transition: transform 180ms ease, background-color 180ms ease, color 180ms ease;
    }

    .active-tab {
      color: var(--app-ink);
      background: linear-gradient(180deg, rgba(47, 111, 83, 0.16), rgba(47, 111, 83, 0.08));
      box-shadow: inset 0 0 0 1px rgba(47, 111, 83, 0.1);
    }

    @media (min-width: 900px) {
      .desktop-nav,
      .desktop-mode {
        display: flex;
      }

      .mobile-nav {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {}
