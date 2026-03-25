import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { ModeToggleComponent } from './shared/components/mode-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ModeToggleComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="mobile-mode shell">
      <app-mode-toggle></app-mode-toggle>
    </div>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .mobile-mode {
      padding-top: 1rem;
    }

    .app-main {
      min-height: calc(100vh - 72px);
      padding-bottom: 6rem;
    }

    @media (min-width: 900px) {
      .mobile-mode {
        display: none;
      }

      .app-main {
        padding-bottom: 2rem;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
