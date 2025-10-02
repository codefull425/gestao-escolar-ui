import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlunosService } from '../../services/alunos.service';
import { ResponsaveisService } from '../../services/responsaveis.service';
import { AlunoRequest, AlunoResponse, ResponsavelResponse } from '../../types/api.models';

@Component({
  selector: 'app-aluno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/alunos">← Voltar</a>
    <h2 style="margin-top:0;">{{ isEdit() ? 'Editar Aluno' : 'Novo Aluno' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid;gap:0.75rem;max-width:560px;">
      <label>
        <div>Nome</div>
        <input formControlName="nome" />
      </label>
      <label>
        <div>Matrícula</div>
        <input formControlName="matricula" />
      </label>
      <label>
        <div>Data de Nascimento</div>
        <input type="date" formControlName="dataNascimento" />
      </label>
      <label style="display:flex;gap:0.5rem;align-items:center;">
        <input type="checkbox" formControlName="ativo" /> Ativo
      </label>
      <label>
        <div>Responsáveis</div>
        <select formControlName="responsavelIds" multiple size="5" style="width:100%;">
          <option *ngFor="let r of responsaveis()" [value]="r.id">{{ r.nome }} - {{ r.cpf }}</option>
        </select>
      </label>

      <div style="display:flex;gap:0.5rem;">
        <button type="submit" [disabled]="form.invalid || saving()">Salvar</button>
        <button type="button" (click)="onDelete()" *ngIf="isEdit()">Excluir</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlunoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly nfb = this.fb.nonNullable;
  private readonly alunos = inject(AlunosService);
  private readonly responsaveisSrv = inject(ResponsaveisService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly saving = signal(false);
  protected readonly responsaveis = signal<ResponsavelResponse[]>([]);
  protected readonly alunoId = signal<string | null>(null);

  form = this.nfb.group({
    nome: this.nfb.control('', [Validators.required, Validators.maxLength(120)]),
    matricula: this.nfb.control('', [Validators.required, Validators.maxLength(30)]),
    dataNascimento: this.nfb.control(''),
    ativo: this.nfb.control(true),
    responsavelIds: this.nfb.control<string[]>([])
  });

  ngOnInit(): void {
    this.responsaveisSrv.list().subscribe(this.responsaveis.set);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.alunoId.set(id);
      this.alunos.get(id).subscribe((a) => {
        this.form.patchValue({
          nome: a.nome,
          matricula: a.matricula,
          dataNascimento: a.dataNascimento ?? '',
          ativo: a.ativo ?? true,
          responsavelIds: (a.responsaveis ?? []).map(r => r.id)
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload: AlunoRequest = this.form.getRawValue();
    const id = this.alunoId();
    const obs = id ? this.alunos.update(id, payload) : this.alunos.create(payload);
    obs.subscribe({
      next: () => this.router.navigate(['/alunos']),
      error: () => this.saving.set(false)
    });
  }

  onDelete(): void {
    const id = this.alunoId();
    if (!id) return;
    if (!confirm('Confirmar exclusão?')) return;
    this.alunos.delete(id).subscribe(() => this.router.navigate(['/alunos']));
  }
}


