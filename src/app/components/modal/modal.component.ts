// modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in"
        (click)="onBackdropClick($event)"
      >
        <div
          [class]="'bg-neutral rounded-lg shadow-xl animate-scale-in max-w-[90vw] max-h-[90vh] overflow-y-auto scroll ' + containerClass"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          @if (showHeader) {
            <div class="flex justify-between items-center p-4 border-b border-gray-600">
              <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
              @if (showCloseButton) {
                <button
                  class="text-gray-400 hover:text-white transition-colors"
                  (click)="close()"
                >
                  ✕
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div [class]="bodyClass">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
            <div class="flex justify-end gap-2 p-4 border-t border-gray-600">
              @if (showCancelButton) {
                <button
                  class="px-4 py-2 text-sm rounded bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                  (click)="close()"
                >
                  {{ cancelText }}
                </button>
              }
              <button
                class="px-4 py-2 text-sm rounded bg-primary hover:bg-primary-focus text-white transition-colors"
                (click)="onConfirm()"
              >
                {{ confirmText }}
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }

    .animate-scale-in {
      animation: scaleIn 0.2s ease-out;
    }
  `]
})
export class ModalComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() showHeader = true;
  @Input() showFooter = false;
  @Input() showCloseButton = true;
  @Input() showCancelButton = true;
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() containerClass = 'w-[800px]';
  @Input() bodyClass = 'p-4';
  @Input() closeOnBackdropClick = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  close(): void {
    this.isVisible = false;
    this.visibleChange.emit(false);
  }

  onConfirm(): void {
    this.confirmed.emit();
  }
}
