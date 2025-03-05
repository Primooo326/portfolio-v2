import { Injectable, ComponentRef, createComponent, ApplicationRef, Injector, Type, EnvironmentInjector } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: Array<{
    modalRef: ComponentRef<ModalComponent>,
    contentRef?: ComponentRef<any>,
    hostElement: HTMLElement
  }> = [];
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) { }

  // Abrir un modal con contenido dinámico
  open(options: {
    title?: string;
    component?: Type<any>;
    componentInputs?: Record<string, any>;
    htmlContent?: string;
    showFooter?: boolean;
    confirmText?: string;
    cancelText?: string;
    closeOnBackdropClick?: boolean;
  }): ComponentRef<ModalComponent> {
    // Crear el elemento host para el modal
    const modalHost = document.createElement('div');
    modalHost.className = 'modal-host-container';
    document.body.appendChild(modalHost);

    // Crear el componente modal
    const modalComponentRef = createComponent(ModalComponent, {
      hostElement: modalHost,
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });

    // Configurar el modal
    const modalInstance = modalComponentRef.instance;
    if (options.title) modalInstance.title = options.title;
    if (options.showFooter !== undefined) modalInstance.showFooter = options.showFooter;
    if (options.confirmText) modalInstance.confirmText = options.confirmText;
    if (options.cancelText) modalInstance.cancelText = options.cancelText;
    if (options.closeOnBackdropClick !== undefined) modalInstance.closeOnBackdropClick = options.closeOnBackdropClick;

    // Objeto para almacenar la referencia del componente de contenido
    let contentRef: ComponentRef<any> | undefined;

    // Manejar el contenido
    if (options.htmlContent) {
      // Esperar a que el componente se renderice
      setTimeout(() => {
        const modalBody = modalHost.querySelector('.modal-body');
        if (modalBody) {
          const contentElement = document.createElement('div');
          contentElement.innerHTML = options.htmlContent || '';
          modalBody.appendChild(contentElement);
        }
      }, 0);
    } else if (options.component) {
      // Esperar a que el componente se renderice
      setTimeout(() => {
        const modalBody = modalHost.querySelector('.modal-body');
        if (modalBody) {
          // Crear el componente de contenido
          contentRef = createComponent(options.component as any, {
            hostElement: document.createElement('div'),
            environmentInjector: this.environmentInjector,
            elementInjector: this.injector
          });

          // Configurar inputs del componente
          if (options.componentInputs) {
            Object.entries(options.componentInputs).forEach(([key, value]) => {
              contentRef!.instance[key] = value;
            });
          }

          // Añadir el componente al cuerpo del modal
          const contentElement = contentRef.location.nativeElement;
          modalBody.appendChild(contentElement);

          // Detectar cambios en el componente
          contentRef.changeDetectorRef.detectChanges();
        }
      }, 0);
    }

    // Manejar el cierre del modal
    const subscription = modalInstance.closed.subscribe(() => {
      this.removeModal(modalComponentRef);
      subscription.unsubscribe(); // Evitar múltiples llamadas
    });

    // Abrir el modal
    modalInstance.open();

    // Detectar cambios
    modalComponentRef.changeDetectorRef.detectChanges();

    // Guardar referencias
    this.modals.push({
      modalRef: modalComponentRef,
      contentRef,
      hostElement: modalHost
    });

    return modalComponentRef;
  }

  // Cerrar un modal específico
  close(modalRef: ComponentRef<ModalComponent>): void {
    modalRef.instance.close();
  }

  // Cerrar todos los modales
  closeAll(): void {
    // Crear una copia para evitar problemas al modificar el array mientras lo recorremos
    const modalsToClose = [...this.modals];
    modalsToClose.forEach(modal => modal.modalRef.instance.close());
  }

  private removeModal(modalRef: ComponentRef<ModalComponent>): void {
    // Encontrar el índice del modal en nuestra lista
    const index = this.modals.findIndex(m => m.modalRef === modalRef);

    if (index > -1) {
      const modalData = this.modals[index];

      try {
        // Destruir primero el componente de contenido si existe
        if (modalData.contentRef) {
          modalData.contentRef.destroy();
        }

        // Destruir el componente modal
        modalData.modalRef.destroy();

        // Eliminar el elemento host del DOM de forma segura
        if (modalData.hostElement && document.body.contains(modalData.hostElement)) {
          document.body.removeChild(modalData.hostElement);
        } else if (modalData.hostElement) {
          // Alternativa usando el método remove()
          modalData.hostElement.remove();
        }
      } catch (error) {
        console.warn('Error al eliminar el modal del DOM:', error);
      } finally {
        // Eliminar de la lista de modales
        this.modals.splice(index, 1);
      }
    }
  }
}
