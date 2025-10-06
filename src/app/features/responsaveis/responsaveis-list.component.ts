import { ChangeDetectionStrategy, Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SlidingDetailModalComponent } from '../../components/sliding-detail-modal.component';
import { ResponsaveisService } from '../../services/responsaveis.service';
import { AlunoResponse, ResponsavelResponse } from '../../types/api.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-responsaveis-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SlidingDetailModalComponent],
  template: `
    <a routerLink="/" class="btn btn-outline">← Voltar</a>
    <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0 1rem 0;">
      <h2 style="margin:0;">Responsáveis</h2>
      <span style="flex:1 1 auto"></span>
      <a routerLink="/responsaveis/novo" class="btn">Novo Responsável</a>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Nome</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">CPF</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Email</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Telefone</th>
          <th style="text-align:left;border-bottom:1px solid #e5e7eb;padding:8px;">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let r of responsaveis()" (click)="goTo(r.id)" style="cursor:pointer;">
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.nome }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.cpf }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.email }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.telefone }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">Editar</td>
        </tr>
      </tbody>
    </table>

    <app-sliding-detail-modal
      [open]="modalOpen"
      [title]="'Detalhes do Responsável'"
      mode="responsavel"
      [responsavel]="selectedResp"
      [relatedAlunos]="relatedAlunos"
      (close)="modalOpen=false"
      (edit)="selectedResp && router.navigate(['/responsaveis', selectedResp.id])">
    </app-sliding-detail-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsaveisListComponent implements OnInit {
  private readonly service = inject(ResponsaveisService);
  protected readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly responsaveis = signal<ResponsavelResponse[]>([]);
  protected modalOpen = false;
  protected selectedResp: ResponsavelResponse | null = null;
  protected relatedAlunos: AlunoResponse[] | null = null;

  ngOnInit(): void {
    this.service.list().subscribe(this.responsaveis.set);
  }

  goTo(id: string): void {
    const r = this.responsaveis().find(x => x.id === id) || null;
    this.selectedResp = r;
    this.service.listWithAlunos(id).subscribe({
      next: (alunos) => {
        this.relatedAlunos = alunos;
        this.modalOpen = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.relatedAlunos = [];
        this.modalOpen = true;
        this.cdr.markForCheck();
      }
    });
  }
}


