import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" [class.show]="isOpen" (click)="backdropClick($event)">
      <div class="modal-container bg-neutral rounded-md" [ngClass]="className" #modalContainer [class.show]="isOpen">
        <div class="flex justify-between items-center p-4 text-white">
          <h3 class="font-bold text-lg">{{ title }}</h3>
          <button class="btn btn-ghost text-lg font-bold" (click)="close()" *ngIf="showCloseButton">
            x
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }

    .modal-backdrop.show {
      opacity: 1;
      visibility: visible;
    }

    .modal-container {
      display: flex;
      flex-direction: column;
      transform: scale(0.8);
      opacity: 0;
      transition: transform 0.3s, opacity 0.3s;
      overflow: hidden;
    }

    .modal-container.show {
      transform: scale(1);
      opacity: 1;
    }
  `]
})
export class ModalComponent implements AfterViewInit {
  @Input() title: string = 'Modal';
  @Input() isOpen: boolean = false;
  @Input() showCloseButton: boolean = true;
  @Input() showFooter: boolean = false;
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string = 'Cancelar';
  @Input() closeOnBackdropClick: boolean = true;
  @Input() className: string = 'w-auto h-auto';
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @ViewChild('modalContainer') modalContainer!: ElementRef;

  ngAfterViewInit(): void {
    // Prevenir que los clics dentro del modal se propaguen al backdrop
    this.modalContainer.nativeElement.addEventListener('click', (event: Event) => {
      event.stopPropagation();
    });
    console.log(this.className);
  }

  open(): void {
    this.isOpen = true;
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
  }

  close(): void {
    this.isOpen = false;
    document.body.style.overflow = ''; // Restaurar scroll del body
    this.closed.emit();
  }

  confirm(): void {
    this.confirmed.emit();
    this.close();
  }

  backdropClick(event: Event): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }
}
