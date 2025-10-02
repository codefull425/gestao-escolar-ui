import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-bottom:1px solid #e5e7eb;">
      <img *ngIf="logoUrl" [src]="logoUrl" alt="Logo" style="height:32px;width:auto;object-fit:contain;" />
      <strong style="font-size:1.1rem;">{{ companyName }}</strong>
      <span style="flex:1 1 auto;"></span>
      <span style="font-variant-numeric: tabular-nums;min-width:6.5ch;text-align:right;">{{ timeString() }}</span>
      <button type="button" (click)="toggleTheme()" style="margin-left:0.75rem;">
        {{ theme() === 'dark' ? '☀️ Light' : '🌙 Dark' }}
      </button>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  @Input() companyName: string = 'Sua Empresa';
  @Input() logoUrl: string | null = null;

  private intervalId: any;

  protected readonly now = signal<Date>(new Date());
  protected readonly timeString = computed(() => {
    const d = this.now();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  });

  protected readonly theme = signal<Theme>('light');

  ngOnInit(): void {
    // Clock
    this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
    // Theme init
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    if (isBrowser) {
      const saved = window.localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');
      this.applyTheme(initial);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  private applyTheme(t: Theme): void {
    this.theme.set(t);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', t);
    }
  }
}


