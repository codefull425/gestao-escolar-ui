import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResponsaveisService } from '../../services/responsaveis.service';
import { ResponsavelResponse } from '../../types/api.models';

@Component({
  selector: 'app-responsaveis-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/" class="btn btn-outline">← Voltar</a>
    <div style="display:flex;align-items:center;gap:0.5rem;margin:0.5rem 0 1rem 0;">
      <h2 style="margin:0;">Responsáveis</h2>
      <span style="flex:1 1 auto"></span>
      <a routerLink="/responsaveis/novo" class="btn">Novo</a>
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
        <tr *ngFor="let r of responsaveis()">
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.nome }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.cpf }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.email }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">{{ r.telefone }}</td>
          <td style="border-bottom:1px solid #f3f4f6;padding:8px;">
            <a [routerLink]="['/responsaveis', r.id]">Editar</a>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsaveisListComponent implements OnInit {
  private readonly service = inject(ResponsaveisService);
  protected readonly responsaveis = signal<ResponsavelResponse[]>([]);

  ngOnInit(): void {
    this.service.list().subscribe(this.responsaveis.set);
  }
}


