import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="overlay" (click)="onCancel()">
      <div class="box" (click)="$event.stopPropagation()">
        <h3 class="title">{{ title }}</h3>
        <p class="message">{{ message }}</p>
        <div class="actions">
          <button class="btn" (click)="onConfirm()" *ngIf="ok">{{ confirmText }}</button>
          <button class="btn btn-outline" (click)="onCancel()">{{ cancelText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .box { background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 12px; padding: 1rem; width: min(480px, 92vw); box-shadow: 0 20px 60px rgba(0,0,0,.25); }
    .title { margin: 0 0 .5rem 0; }
    .message { margin: 0; }
    .actions { display: flex; gap: .5rem; justify-content: flex-end; margin-top: 1rem; }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackModalComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() message = '';
  @Input() ok = true;
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Fechar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }
}


