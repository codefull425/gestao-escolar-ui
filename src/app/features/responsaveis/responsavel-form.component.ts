import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResponsaveisService } from '../../services/responsaveis.service';
import { ResponsavelRequest } from '../../types/api.models';

@Component({
  selector: 'app-responsavel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/responsaveis">← Voltar</a>
    <h2 style="margin-top:0;">{{ isEdit() ? 'Editar Responsável' : 'Novo Responsável' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid;gap:0.75rem;max-width:560px;">
      <label>
        <div>Nome</div>
        <input formControlName="nome" />
      </label>
      <label>
        <div>CPF</div>
        <input formControlName="cpf" maxlength="11" />
      </label>
      <label>
        <div>Email</div>
        <input type="email" formControlName="email" />
      </label>
      <label>
        <div>Telefone</div>
        <input formControlName="telefone" />
      </label>
      <label style="display:flex;gap:0.5rem;align-items:center;">
        <input type="checkbox" formControlName="ativo" /> Ativo
      </label>

      <div style="display:flex;gap:0.5rem;">
        <button type="submit" [disabled]="form.invalid || saving()">Salvar</button>
        <button type="button" (click)="onDelete()" *ngIf="isEdit()">Excluir</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsavelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly nfb = this.fb.nonNullable;
  private readonly service = inject(ResponsaveisService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly saving = signal(false);
  protected readonly responsavelId = signal<string | null>(null);

  form = this.nfb.group({
    nome: this.nfb.control('', [Validators.required, Validators.maxLength(120)]),
    cpf: this.nfb.control('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    email: this.nfb.control('', [Validators.required, Validators.email, Validators.maxLength(120)]),
    telefone: this.nfb.control('', [Validators.required, Validators.maxLength(20)]),
    ativo: this.nfb.control(true)
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.responsavelId.set(id);
      this.service.get(id).subscribe((r) => {
        this.form.patchValue({
          nome: r.nome,
          cpf: r.cpf,
          email: r.email,
          telefone: r.telefone,
          ativo: r.ativo
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload: ResponsavelRequest = this.form.getRawValue();
    const id = this.responsavelId();
    const obs = id ? this.service.update(id, payload) : this.service.create(payload);
    obs.subscribe({
      next: () => this.router.navigate(['/responsaveis']),
      error: () => this.saving.set(false)
    });
  }

  onDelete(): void {
    const id = this.responsavelId();
    if (!id) return;
    if (!confirm('Confirmar exclusão?')) return;
    this.service.delete(id).subscribe(() => this.router.navigate(['/responsaveis']));
  }
}


