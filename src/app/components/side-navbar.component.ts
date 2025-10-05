import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hotzone" (mouseenter)="expanded=true" (mouseleave)="expanded=false"></div>
    <aside class="sidenav" [class.expanded]="expanded" (mouseenter)="expanded=true" (mouseleave)="expanded=false">
      <nav>
        <a routerLink="/alunos">Alunos</a>
        <a routerLink="/responsaveis">Responsável</a>
      </nav>
    </aside>
  `,
  styles: [
    `
    :host { position: fixed; top: 0; left: 0; height: 100vh; z-index: 5; }
    .hotzone { position: fixed; top:0; left:0; height:100vh; width:20vw; max-width: 320px; min-width: 80px; opacity:0; }
    .sidenav { position: fixed; top:64px; left:0; height:calc(100vh - 64px); width: 240px; transform: translateX(-240px); transition: transform .25s ease; background: var(--bg); border-right: 1px solid var(--border); box-shadow: 0 2px 12px rgba(0,0,0,.08); padding: 1rem; }
    .sidenav.expanded { transform: translateX(0); }
    nav { display: grid; gap: .5rem; }
    a { text-decoration: none; padding: .5rem .75rem; border-radius: .5rem; display:block; }
    a:hover { background: var(--accent-ghost); }
    @media (max-width: 640px) { .hotzone { width: 30vw; } }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavbarComponent {
  expanded = false;
}


