import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="home-grid">
      <div class="card">
        <h2 class="card-title">Responsáveis</h2>
        <p class="card-desc">Gerencie os responsáveis dos alunos.</p>
        <div class="actions">
          <a routerLink="/responsaveis/novo" class="btn">Cadastrar novo responsável</a>
          <a routerLink="/responsaveis" class="btn btn-outline">Ver lista de responsáveis</a>
        </div>
      </div>
      <div class="card">
        <h2 class="card-title">Alunos</h2>
        <p class="card-desc">Gerencie os alunos da instituição.</p>
        <div class="actions">
          <a routerLink="/alunos" class="btn btn-outline">Ver lista de alunos</a>
          <a routerLink="/alunos/novo" class="btn">Cadastrar novo aluno</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
    .home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 900px) { .home-grid { grid-template-columns: 1fr; } }
    .card { border: 1px solid var(--border); background: var(--surface); border-radius: 12px; padding: 1rem; min-height: 240px; display: flex; flex-direction: column; }
    .card-title { margin: 0 0 .25rem 0; }
    .card-desc { margin: 0 0 1rem 0; color: var(--muted); }
    .actions { margin-top: auto; display: grid; gap: .5rem; grid-template-columns: 1fr 1fr; }
    .btn { text-align: center; text-decoration: none; padding: .6rem .85rem; border-radius: .6rem; background: var(--accent); color: var(--accent-contrast); border: 1px solid transparent; }
    .btn:hover { filter: brightness(1.05); }
    .btn-outline { background: transparent; color: var(--fg); border-color: var(--border); }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}


