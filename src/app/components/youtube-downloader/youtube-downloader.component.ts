import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface FailedVideo {
  id?: string;
  reason: string;
}

export interface JobStatusResponse {
  id: string;
  status: 'pending' | 'downloading' | 'zipping' | 'completed' | 'failed';
  progress: number;
  eta: string;
  currentItem?: number;
  totalItems?: number;
  failedVideos?: FailedVideo[];
  failedCount?: number;
  error?: string;
}

@Component({
  selector: 'app-youtube-downloader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './youtube-downloader.component.html',
  styleUrl: './youtube-downloader.component.scss'
})
export class YoutubeDownloaderComponent implements OnInit, OnDestroy {
  // Configuración de API
  readonly apiUrl = environment.youtubeApiUrl;
  
  // Parámetros de descarga
  youtubeUrl = '';
  mode: 'video' | 'audio' = 'video';
  quality = 'best';
  format = 'mp4';
  downloadPlaylist = false;

  // Opciones de calidad disponibles
  qualityOptions = [
    { value: 'best', label: 'Mejor disponible' },
    { value: '1080p', label: '1080p Full HD' },
    { value: '720p', label: '720p HD' },
    { value: '480p', label: '480p SD' },
    { value: '360p', label: '360p' }
  ];

  // Opciones de formato según el modo
  get formatOptions() {
    if (this.mode === 'video') {
      return [
        { value: 'mp4', label: 'MP4' },
        { value: 'mkv', label: 'MKV' },
        { value: 'webm', label: 'WebM' }
      ];
    } else {
      return [
        { value: 'mp3', label: 'MP3 (Audio)' },
        { value: 'm4a', label: 'M4A (Audio)' },
        { value: 'wav', label: 'WAV (Audio)' }
      ];
    }
  }

  // Estado del trabajo activo
  jobId: string | null = null;
  status: 'pending' | 'downloading' | 'zipping' | 'completed' | 'failed' | null = null;
  progress = 0;
  eta = '';
  currentItem: number | null = null;
  totalItems: number | null = null;
  failedVideos: FailedVideo[] = [];
  failedCount = 0;

  /** Progreso basado en vídeos procesados si es playlist, o el % del servidor si es un solo vídeo */
  get displayProgress(): number {
    if (this.status === 'completed') return 100;
    if (this.currentItem != null && this.totalItems && this.totalItems > 0) {
      return Math.round((this.currentItem / this.totalItems) * 100);
    }
    return this.progress;
  }
  error: string | null = null;

  // Control de interfaz
  loading = false;
  private pollIntervalId: any = null;

  ngOnInit() {
    // Cargar Job ID activo si existe en localStorage para reanudar el polling
    const savedJobId = localStorage.getItem('yt_downloader_job_id');
    if (savedJobId) {
      this.jobId = savedJobId;
      this.status = 'pending';
      this.startPolling();
    }
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  onModeChange() {
    // Restablecer el formato por defecto al cambiar de modo
    this.format = this.mode === 'video' ? 'mp4' : 'mp3';
  }



  async startDownload() {
    if (!this.youtubeUrl.trim()) {
      alert('Por favor ingresa una URL válida de YouTube.');
      return;
    }

    const cleanedUrl = this.youtubeUrl.trim();
    if (!cleanedUrl.includes('youtube.com/') && !cleanedUrl.includes('youtu.be/')) {
      alert('Por favor ingresa un enlace de YouTube válido.');
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(`${this.apiUrl}/youtube/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: cleanedUrl,
          mode: this.mode,
          quality: this.quality,
          format: this.format,
          downloadPlaylist: this.downloadPlaylist
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.jobId) {
        this.jobId = data.jobId;
        this.status = 'pending';
        this.progress = 0;
        this.eta = '';
        this.currentItem = null;
        this.totalItems = null;
        this.failedVideos = [];
        this.failedCount = 0;

        // Persistir en localStorage
        localStorage.setItem('yt_downloader_job_id', this.jobId!);

        this.startPolling();
      } else {
        throw new Error('No se recibió un ID de trabajo (jobId) del servidor.');
      }
    } catch (err: any) {
      console.error('Error al iniciar descarga:', err);
      if (err instanceof TypeError && (err.message === 'Failed to fetch' || err.message?.includes('NetworkError'))) {
        this.error = `No se pudo conectar con el servidor (${this.apiUrl}). Verifica que el servidor esté corriendo y tenga CORS habilitado.`;
      } else {
        this.error = err.message || 'Ocurrió un error inesperado al conectar con el servidor.';
      }
    } finally {
      this.loading = false;
    }
  }

  private startPolling() {
    this.stopPolling();
    
    // Ejecutar verificación inmediata
    this.pollStatus();

    // Configurar polling cada 2 segundos
    this.pollIntervalId = setInterval(() => {
      this.pollStatus();
    }, 2000);
  }

  private stopPolling() {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }

  async pollStatus() {
    if (!this.jobId) return;

    try {
      const response = await fetch(`${this.apiUrl}/youtube/status/${this.jobId}`);
      if (response.status === 404) {
        // El trabajo no existe o expiró
        this.stopPolling();
        this.error = 'El trabajo de descarga no fue encontrado o ha expirado en el servidor.';
        this.status = 'failed';
        this.removeJobFromLocalStorage();
        return;
      }

      if (!response.ok) {
        throw new Error(`Error al verificar estado: ${response.status}`);
      }

      const data: JobStatusResponse = await response.json();
      
      this.status = data.status;
      this.progress = data.progress ?? 0;
      this.eta = data.eta || '';
      this.currentItem = data.currentItem ?? null;
      this.totalItems = data.totalItems ?? null;
      this.failedVideos = data.failedVideos || [];
      this.failedCount = data.failedCount ?? 0;
      
      if (data.error) {
        this.error = data.error;
      }

      if (this.status === 'completed' || this.status === 'failed') {
        this.stopPolling();
      }
    } catch (err: any) {
      console.error('Error durante polling:', err);
      // No detenemos el polling inmediatamente por un error de red transitorio, 
      // pero si el error persiste, eventualmente se informará al usuario.
    }
  }

  downloadFile() {
    if (!this.jobId || this.status !== 'completed') return;

    const fileUrl = `${this.apiUrl}/youtube/file/${this.jobId}`;
    
    // Crear enlace temporal para forzar la descarga
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', `youtube_download_${this.jobId}.zip`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpiar localStorage tras iniciar la descarga, tal como se solicitó
    this.removeJobFromLocalStorage();

    // Restablecer el estado
    this.resetState();
  }

  cancelOrReset() {
    this.stopPolling();
    this.removeJobFromLocalStorage();
    this.resetState();
  }

  private removeJobFromLocalStorage() {
    localStorage.removeItem('yt_downloader_job_id');
  }

  private resetState() {
    this.jobId = null;
    this.status = null;
    this.progress = 0;
    this.eta = '';
    this.currentItem = null;
    this.totalItems = null;
    this.failedVideos = [];
    this.failedCount = 0;
    this.error = null;
    this.youtubeUrl = '';
  }
}
