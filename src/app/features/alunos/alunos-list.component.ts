import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SlidingDetailModalComponent } from '../../components/sliding-detail-modal.component';
import { AlunosService } from '../../services/alunos.service';
import { AlunoResponse } from '../../types/api.models';

@Component({
  selector: 'app-alunos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SlidingDetailModalComponent],
  template: `
    <a routerLink="/" class="btn btn-outline">← Voltar</a>
    <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0 1rem 0;">
      <h2 style="margin:0;">Alunos</h2>
      <span style="flex:1 1 auto"></span>
      <a routerLink="/alunos/novo" class="btn">Novo aluno</a>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Nome</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Matrícula</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Nascimento</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of alunos()" (click)="goTo(a.id)" style="cursor:pointer;">
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ a.nome }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ a.matricula }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ a.dataNascimento || '-' }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">Editar</td>
        </tr>
      </tbody>
    </table>

    <app-sliding-detail-modal
      [open]="modalOpen"
      [title]="'Detalhes do Aluno'"
      mode="aluno"
      [aluno]="selectedAluno"
      [relatedResponsaveis]="selectedAluno?.responsaveis || null"
      (close)="modalOpen=false"
      (edit)="selectedAluno && router.navigate(['/alunos', selectedAluno.id])">
    </app-sliding-detail-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlunosListComponent implements OnInit {
  private readonly service = inject(AlunosService);
  protected readonly router = inject(Router);
  protected readonly alunos = signal<AlunoResponse[]>([]);
  protected modalOpen = false;
  protected selectedAluno: AlunoResponse | null = null;

  ngOnInit(): void {
    this.service.list().subscribe(this.alunos.set);
  }

  goTo(id: string): void {
    const aluno = this.alunos().find(a => a.id === id) || null;
    this.selectedAluno = aluno;
    this.modalOpen = true;
  }
}


