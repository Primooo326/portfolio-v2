// qr-code.component.ts
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.scss'
})
export class QrCodeComponent implements OnChanges {
  private _qrData: string = 'https://primooo.web.app';

  @Input()
  set qrData(value: string) {
    this._qrData = value;
    // Regenerar QR cuando cambia el valor desde fuera
    if (this.qrCanvas?.nativeElement) {
      this.generateQR();
    }
  }

  get qrData(): string {
    return this._qrData;
  }

  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['qrData']) {
      this.generateQR();
    }
  }

  ngAfterViewInit() {
    this.generateQR();
  }

  generateQR(): void {
    if (this._qrData && this.qrCanvas?.nativeElement) {
      QRCode.toCanvas(this.qrCanvas.nativeElement, this._qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (error: any) => {
        if (error) console.error('Error generando QR:', error);
      });
    }
  }

  downloadQR(): void {
    const canvas = this.qrCanvas.nativeElement;
    const dataURL = canvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = 'codigo-qr.png';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  async shareQR(): Promise<void> {
    try {
      const canvas = this.qrCanvas.nativeElement;

      // Convertir el canvas a un Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            throw new Error('No se pudo convertir el canvas a Blob');
          }
        }, 'image/png');
      });

      // Crear un archivo a partir del Blob
      const file = new File([blob], 'codigo-qr.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Compartir la imagen y el texto
        await navigator.share({
          title: 'Código QR Compartido',
          text: 'Aquí está el código QR para: ' + this._qrData,
          url: this._qrData,
          files: [file]
        });
        console.log('Compartido con éxito');
      } else if (navigator.share) {
        // Si no se puede compartir archivos, compartir solo el texto y la URL
        await navigator.share({
          title: 'Código QR Compartido',
          text: 'Aquí está el código QR para: ' + this._qrData,
          url: this._qrData
        });
        console.log('Compartido con éxito (sin imagen)');
      } else {
        // Fallback para navegadores que no soportan Web Share API
        const dataUrl = canvas.toDataURL('image/png');
        alert('La funcionalidad de compartir no está disponible en este navegador.\n\nPuedes copiar: ' + this._qrData + '\n\nO guardar la imagen manualmente.');

        // Opcionalmente, abrir la imagen en una nueva pestaña
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(`<img src="${dataUrl}" alt="Código QR"><p>${this._qrData}</p>`);
        }
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('No se pudo compartir el código QR. ' + (error instanceof Error ? error.message : ''));
    }
  }

  // Método para actualizar el QR cuando cambia el input
  onInputChange(): void {
    this.generateQR();
  }
}
