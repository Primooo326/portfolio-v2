import { Component, signal, effect, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Compressor from 'compressorjs';
import JSZip from 'jszip';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
interface FilePreview {
  id: number;
  file: File;
  preview: string;
  compressed?: Blob;
  size: number;
  newSize?: number;
  compressionPercentage?: number;
  previewCompressed?: string;
}

@Component({
  selector: 'app-compressor-img',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './compressor-img.component.html',
  styleUrl: './compressor-img.component.scss'
})
export class CompressorImgComponent implements OnInit {
  fileInputs = signal<FilePreview[]>([]);
  quality = signal(0.45);
  currentFileCompressed = signal<FilePreview | null>(null);
  defaultImage = signal<FilePreview | null>(null);
  loading = signal(true)

  totalSavedBytes = computed(() => {
    const totalSavedBytes = this.fileInputs().reduce((acc, file) => {
      if (!file.compressed) return acc;

      const originalSizeMB = file.size;
      const compressedSizeMB = file.newSize || 0;
      return acc + (originalSizeMB - compressedSizeMB);
    }, 0);

    return this.formatFileSize(totalSavedBytes);
  });
  constructor(private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    await this.loadDefaultImage();
  }


  private createFilePreview(file: File, i: number): Promise<FilePreview> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          file,
          preview: e.target?.result as string,
          size: this.formatFileSize(file.size / (1024 * 1024)),
          id: i
        });
      };
      reader.readAsDataURL(file);
    });
  }

  private formatFileSize(size: number): number {
    return Number(size.toFixed(2));
  }

  private calculateCompressionPercentage(originalSize: number, newSize: number): number {
    return Number(((1 - (newSize / originalSize)) * 100).toFixed(2));
  }

  private getBase64FromBlob(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(blob);
    });
  }


  private downloadFile(content: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }


  private compressFile(filePreview: FilePreview): Promise<FilePreview> {
    return new Promise((resolve, reject) => {
      new Compressor(filePreview.file, {
        quality: this.quality(),
        success: async (result) => {
          try {
            const previewCompressed = await this.getBase64FromBlob(result);
            const newSize = result.size / (1024 * 1024);

            resolve({
              ...filePreview,
              compressed: result,
              newSize: this.formatFileSize(newSize),
              compressionPercentage: this.calculateCompressionPercentage(filePreview.file.size, result.size),
              previewCompressed
            });
          } catch (error) {
            reject(error);
          }
        },
        error: (err) => {
          console.error('Compression error:', err);
          reject(err);
        },
      });
    });
  }

  private async loadDefaultImage(): Promise<void> {
    try {
      this.loading.set(true);

      const blob = await firstValueFrom(
        this.http.get('/assets/img/coquito.jpg', { responseType: 'blob' })
      );

      const file = new File([blob], 'coquito.jpg', {
        type: 'image/jpeg',
        lastModified: new Date().getTime()
      });

      const filePreview = await this.createFilePreview(file, 0);
      this.defaultImage.set(filePreview); // Guardamos la imagen por defecto
      await this.compressDefaultImage();
      this.currentFileCompressed.set(this.defaultImage()); // Establecemos la imagen actual
    } catch (error) {
      console.error('Error loading default image:', error);
    } finally {
      this.loading.set(false);
    }
  }
  onChangeQuality(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuality = this.formatFileSize(Number(input.value) / 100);

    if (this.quality() !== newQuality) {
      this.quality.set(newQuality);

      // Comprimir imagen por defecto
      if (this.defaultImage()) {
        this.compressDefaultImage().then(() => {
          // Si no hay archivos cargados, actualizar currentFileCompressed con la imagen por defecto
          if (this.fileInputs().length === 0) {
            this.currentFileCompressed.set(this.defaultImage());
          }
        });
      }

      // Comprimir archivos cargados
      if (this.fileInputs().length > 0) {
        this.compressImage();
      }
    }
  }

  async onFileInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const filePromises = Array.from(files).map((file, i) => this.createFilePreview(file, i));
    const tempFileInput = await Promise.all(filePromises);

    this.fileInputs.set(tempFileInput);
    await this.compressImage();
    this.currentFileCompressed.set(this.fileInputs()[0]); // Seleccionar primer archivo cargado
  }

  async compressImage(): Promise<void> {
    try {
      this.loading.set(true);
      const files = this.fileInputs();
      if (!files.length) return;

      const compressPromises = files.map(file => this.compressFile(file));
      const newFiles = await Promise.all(compressPromises);

      this.fileInputs.set(newFiles);

      // Si no hay archivos cargados, mostrar la imagen por defecto
      if (this.fileInputs().length === 0) {
        this.currentFileCompressed.set(this.defaultImage());
      }

      // Actualizar el archivo actual solo si no es la imagen por defecto
      if (this.currentFileCompressed() && this.fileInputs().length > 0) {
        const currentFile = newFiles.find(file => file.id === this.currentFileCompressed()!.id);
        if (currentFile) {
          this.currentFileCompressed.set(currentFile);
        }
      }

    } catch (error) {
      console.error('Error compressing images:', error);
    } finally {
      this.loading.set(false);
    }
  }
  private async compressDefaultImage(): Promise<void> {
    if (!this.defaultImage()) return;

    try {
      const compressedImage = await this.compressFile(this.defaultImage()!);
      this.defaultImage.set(compressedImage);

      // Si no hay archivos cargados, actualizar currentFileCompressed
      if (this.fileInputs().length === 0) {
        this.currentFileCompressed.set(compressedImage);
      }
    } catch (error) {
      console.error('Error compressing default image:', error);
    }
  }

  removeFile(file: FilePreview): void {
    this.fileInputs.set(this.fileInputs().filter(f => f !== file));

    if (this.fileInputs().length > 0) {
      // Si aún hay archivos, seleccionar el primero
      this.currentFileCompressed.set(this.fileInputs()[0]);
    } else {
      // Si no hay archivos, mostrar la imagen por defecto
      this.currentFileCompressed.set(this.defaultImage());
    }
  }

  async downloadZip(): Promise<void> {
    const files = this.fileInputs();
    if (files.length === 0) return; // No descargar si solo está la imagen por defecto

    if (files.length === 1) {
      this.downloadFile(files[0].compressed!, 'compressed-image.jpg');
      return;
    } else {
      const zip = new JSZip();

      files.forEach(file => {
        if (file.compressed) {
          zip.file(file.file.name, file.compressed);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      this.downloadFile(content, 'compressed_images.zip');
    }
  }
}
