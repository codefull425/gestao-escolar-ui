import { ChangeDetectionStrategy, Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeedbackModalComponent } from '../../components/feedback-modal.component';
import { ResponsaveisService } from '../../services/responsaveis.service';
import { ResponsavelRequest } from '../../types/api.models';

@Component({
  selector: 'app-responsavel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FeedbackModalComponent],
  template: `
    <a routerLink="/">← Voltar</a>
    <h2 style="margin-top:0;">{{ isEdit() ? 'Editar Responsável' : 'Novo Responsável' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid;gap:0.75rem;max-width:560px;">
      <label>
        <div>Nome</div>
        <input formControlName="nome" />
        <div class="form-error" *ngIf="submitted && form.controls.nome.invalid">
          O nome é obrigatório e deve ter até 120 caracteres.
        </div>
      </label>
      <label>
        <div>CPF</div>
        <input formControlName="cpf" maxlength="11" />
        <div class="form-error" *ngIf="submitted && form.controls.cpf.invalid">
          CPF é obrigatório e deve conter 11 dígitos.
        </div>
      </label>
      <label>
        <div>Email</div>
        <input type="email" formControlName="email" />
        <div class="form-error" *ngIf="submitted && form.controls.email.errors as e">
          <ng-container *ngIf="e['required']">Email é obrigatório.</ng-container>
          <ng-container *ngIf="e['maxlength']">No máximo 120 caracteres.</ng-container>
          <ng-container *ngIf="e['pattern']">Formato inválido. Ex.: maria.oliveira@example.com</ng-container>
        </div>
      </label>
      <label>
        <div>Telefone</div>
        <input formControlName="telefone" />
        <div class="form-error" *ngIf="submitted && form.controls.telefone.invalid">
          Telefone é obrigatório.
        </div>
      </label>
      <label style="display:flex;gap:0.5rem;align-items:center;">
        <input type="checkbox" formControlName="ativo" /> Ativo
      </label>

      <div style="display:flex;gap:0.5rem;">
        <button class="btn" type="submit">Salvar</button>
        <button type="button" (click)="onDelete()" *ngIf="isEdit()">Excluir</button>
      </div>
    </form>
    <app-feedback-modal
      [open]="modalOpen"
      [title]="modalTitle"
      [message]="modalMessage"
      [ok]="modalOk"
      (confirm)="router.navigate(['/responsaveis'])"
      (close)="modalOpen=false">
    </app-feedback-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsavelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly nfb = this.fb.nonNullable;
  private readonly service = inject(ResponsaveisService);
  private readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly isEdit = signal(false);
  protected readonly saving = signal(false);
  protected readonly responsavelId = signal<string | null>(null);
  protected submitted = false;
  protected modalOpen = false;
  protected modalTitle = '';
  protected modalMessage = '';
  protected modalOk = false;

  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  form = this.nfb.group({
    nome: this.nfb.control('', [Validators.required, Validators.maxLength(120)]),
    cpf: this.nfb.control('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    email: this.nfb.control('', [Validators.required, Validators.maxLength(120), Validators.pattern(this.emailPattern)]),
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
    this.submitted = true;
    if (this.form.invalid) return;
    this.saving.set(true);
    const payload: ResponsavelRequest = this.form.getRawValue();
    const id = this.responsavelId();
    const obs = id ? this.service.update(id, payload) : this.service.create(payload);
    obs.subscribe({
      next: () => { this.saving.set(false); this.modalOpen = true; this.modalOk = true; this.modalTitle = 'Sucesso'; this.modalMessage = 'Responsável salvo com sucesso.'; this.cdr.markForCheck(); },
      error: (err) => { this.saving.set(false); this.modalOpen = true; this.modalOk = false; this.modalTitle = `Erro ${err?.status ?? ''}`.trim(); this.modalMessage = this.extractErrorMessage(err) || 'Não foi possível salvar o responsável.'; this.cdr.markForCheck(); }
    });
  }

  private extractErrorMessage(err: any): string {
    const e = err?.error;
    const raw = typeof e === 'string' ? e : (typeof e?.message === 'string' ? e.message : (typeof err?.message === 'string' ? err.message : ''));
    if (raw && raw.toLowerCase().includes('duplicate entry')) {
      return 'esse CPF já foi cadastrado';
    }
    return raw;
  }

  onDelete(): void {
    const id = this.responsavelId();
    if (!id) return;
    if (!confirm('Confirmar exclusão?')) return;
    this.service.delete(id).subscribe(() => this.router.navigate(['/responsaveis']));
  }
}


