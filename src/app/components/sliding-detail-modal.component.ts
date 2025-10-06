import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlunoResponse, ResponsavelResponse, ResponsavelSummary } from '../types/api.models';

@Component({
  selector: 'app-sliding-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="overlay" (click)="onClose()">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="panel-header">
          <h3 class="panel-title">{{ title }}</h3>
          <button class="btn btn-outline" (click)="onClose()">Fechar</button>
        </div>
        <div class="panel-content">
          <div class="col">
            <ng-container *ngIf="mode === 'aluno' && aluno as a">
              <div><strong>Nome:</strong> {{ a.nome }}</div>
              <div><strong>Matrícula:</strong> {{ a.matricula }}</div>
              <div><strong>Nascimento:</strong> {{ a.dataNascimento || '-' }}</div>
              <div><strong>Ativo:</strong> {{ a.ativo ? 'Sim' : 'Não' }}</div>
            </ng-container>
            <ng-container *ngIf="mode === 'responsavel' && responsavel as r">
              <div><strong>Nome:</strong> {{ r.nome }}</div>
              <div><strong>CPF:</strong> {{ r.cpf }}</div>
              <div><strong>Email:</strong> {{ r.email }}</div>
              <div><strong>Telefone:</strong> {{ r.telefone }}</div>
              <div><strong>Ativo:</strong> {{ r.ativo ? 'Sim' : 'Não' }}</div>
            </ng-container>
          </div>
          <div class="col">
            <ng-container *ngIf="mode === 'aluno' && relatedResponsaveis as rr">
              <h4 style="margin-top:0;">Responsáveis</h4>
              <ul class="list">
                <li *ngFor="let r of rr">{{ r.nome }} - {{ r.cpf }}</li>
                <li *ngIf="!rr?.length">Nenhum responsável vinculado.</li>
              </ul>
            </ng-container>
            <ng-container *ngIf="mode === 'responsavel' && relatedAlunos as ra">
              <h4 style="margin-top:0;">Alunos</h4>
              <ul class="list">
                <li *ngFor="let a of ra">{{ a.nome }} — {{ a.matricula }}</li>
                <li *ngIf="!ra?.length">Nenhum aluno vinculado.</li>
              </ul>
            </ng-container>
          </div>
        </div>
        <div class="panel-footer">
          <button class="btn" (click)="edit.emit()">Editar</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); display:flex; justify-content:flex-end; z-index: 1000; }
    .panel { width: 50vw; min-width: 320px; max-width: 720px; height: 100vh; background: var(--bg); color: var(--fg); border-left: 1px solid var(--border); box-shadow: -20px 0 60px rgba(0,0,0,.25); display:flex; flex-direction: column; animation: slideIn .25s ease; }
    @keyframes slideIn { from { transform: translateX(100%);} to { transform: translateX(0);} }
    .panel-header, .panel-footer { padding: .75rem 1rem; border-bottom: 1px solid var(--border); display:flex; align-items:center; gap:.5rem; }
    .panel-footer { border-top: 1px solid var(--border); border-bottom: 0; margin-top: auto; }
    .panel-title { margin: 0; flex: 1 1 auto; }
    .panel-content { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; padding: 1rem; overflow: auto; }
    .col { display: grid; gap: .5rem; align-content: start; }
    .list { margin: 0; padding-left: 1rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlidingDetailModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() mode: 'aluno' | 'responsavel' = 'aluno';
  @Input() aluno: AlunoResponse | null = null;
  @Input() responsavel: ResponsavelResponse | null = null;
  @Input() relatedResponsaveis: ResponsavelSummary[] | null = null;
  @Input() relatedAlunos: AlunoResponse[] | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

  onClose(): void { this.close.emit(); }
}


