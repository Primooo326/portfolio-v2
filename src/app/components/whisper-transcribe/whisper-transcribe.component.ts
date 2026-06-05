import { Component, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import JSZip from 'jszip';

export interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: string; // Formatted size (e.g. "1.2 MB")
  sizeBytes: number;
  status: 'ready' | 'transcribing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  transcript?: string;
  audioUrl?: string;
  responseFormat: string; // The format it was transcribed with
}

@Component({
  selector: 'app-whisper-transcribe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whisper-transcribe.component.html',
  styleUrl: './whisper-transcribe.component.scss'
})
export class WhisperTranscribeComponent implements OnDestroy {
  // Groq API Key state
  apiKey = signal<string>(localStorage.getItem('groq_api_key') || '');
  showApiKey = signal<boolean>(false);
  apiKeySaved = signal<boolean>(!!localStorage.getItem('groq_api_key'));

  // Transcription parameters
  model = signal<string>('whisper-large-v3-turbo');
  language = signal<string>(''); // Default: auto-detect
  responseFormat = signal<string>('json'); // json, verbose_json, text, srt, vtt
  prompt = signal<string>('');
  temperature = signal<number>(0.0);
  taskType = signal<'transcribe' | 'translate'>('transcribe'); // transcribe vs translate (to English)

  // Files state
  audioFiles = signal<AudioFile[]>([]);
  selectedFile = signal<AudioFile | null>(null);
  isProcessing = signal<boolean>(false);

  // Drag and Drop visual state
  isDragging = signal<boolean>(false);

  // Computed state
  hasFiles = computed(() => this.audioFiles().length > 0);
  completedCount = computed(() => this.audioFiles().filter(f => f.status === 'completed').length);
  hasCompletedTranscripts = computed(() => this.audioFiles().some(f => f.status === 'completed' && !!f.transcript));
  
  // Available models
  models = [
    { value: 'whisper-large-v3-turbo', label: 'Whisper Large v3 Turbo (Recomendado - Rápido)' },
    { value: 'whisper-large-v3', label: 'Whisper Large v3 (Alta Precisión)' }
  ];

  // Common languages for dropdown
  languages = [
    { code: '', name: 'Detectar automáticamente' },
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'Inglés' },
    { code: 'pt', name: 'Portugués' },
    { code: 'fr', name: 'Francés' },
    { code: 'de', name: 'Alemán' },
    { code: 'it', name: 'Italiano' },
    { code: 'zh', name: 'Chino' },
    { code: 'ja', name: 'Japonés' },
    { code: 'ru', name: 'Ruso' }
  ];

  // Response formats
  formats = [
    { value: 'json', label: 'Texto Simple (JSON)' },
    { value: 'verbose_json', label: 'Detallado con metadatos (JSON)' },
    { value: 'text', label: 'Texto Plano' },
    { value: 'srt', label: 'Subtítulos SubRip (SRT)' },
    { value: 'vtt', label: 'Subtítulos WebVTT (VTT)' }
  ];

  ngOnDestroy() {
    // Clean up object URLs to prevent memory leaks
    this.audioFiles().forEach(f => {
      if (f.audioUrl) {
        URL.revokeObjectURL(f.audioUrl);
      }
    });
  }

  // Save/Remove API Key
  saveApiKey() {
    const trimmed = this.apiKey().trim();
    if (trimmed) {
      localStorage.setItem('groq_api_key', trimmed);
      this.apiKey.set(trimmed);
      this.apiKeySaved.set(true);
    }
  }

  removeApiKey() {
    localStorage.removeItem('groq_api_key');
    this.apiKey.set('');
    this.apiKeySaved.set(false);
  }

  // Handle Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  // Handle File Input Change
  onFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.processFiles(files);
      // Clear input value so same file can be selected again
      input.value = '';
    }
  }

  private processFiles(fileList: FileList) {
    const newFiles: AudioFile[] = [];
    const maxSizeBytes = 25 * 1024 * 1024; // 25 MB

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Audio MIME type checks or common extensions
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'webm', 'mpeg', 'mpga'];
      const isValidExtension = extension && validExtensions.includes(extension);
      const isAudioType = file.type.startsWith('audio/') || isValidExtension;

      if (!isAudioType) {
        alert(`El archivo "${file.name}" no parece ser un archivo de audio compatible.`);
        continue;
      }

      const formattedSize = this.formatBytes(file.size);
      const audioUrl = URL.createObjectURL(file);

      const audioFile: AudioFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: file,
        name: file.name,
        size: formattedSize,
        sizeBytes: file.size,
        status: 'ready',
        progress: 0,
        audioUrl: audioUrl,
        responseFormat: this.responseFormat()
      };

      if (file.size > maxSizeBytes) {
        audioFile.status = 'failed';
        audioFile.error = 'El archivo supera el límite de 25 MB permitido por la API de Groq.';
      }

      newFiles.push(audioFile);
    }

    if (newFiles.length > 0) {
      this.audioFiles.update(current => [...current, ...newFiles]);
      // Auto select the first newly added file if nothing is selected
      if (!this.selectedFile()) {
        this.selectedFile.set(newFiles[0]);
      }
    }
  }

  removeFile(fileId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const fileToRemove = this.audioFiles().find(f => f.id === fileId);
    if (fileToRemove?.audioUrl) {
      URL.revokeObjectURL(fileToRemove.audioUrl);
    }

    this.audioFiles.update(current => current.filter(f => f.id !== fileId));
    
    if (this.selectedFile()?.id === fileId) {
      const remaining = this.audioFiles();
      this.selectedFile.set(remaining.length > 0 ? remaining[0] : null);
    }
  }

  clearFiles() {
    this.audioFiles().forEach(f => {
      if (f.audioUrl) URL.revokeObjectURL(f.audioUrl);
    });
    this.audioFiles.set([]);
    this.selectedFile.set(null);
  }

  // Transcribe a single file
  async transcribeFile(fileId: string): Promise<void> {
    const fileIndex = this.audioFiles().findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    const audioFile = this.audioFiles()[fileIndex];
    if (audioFile.status === 'transcribing') return;

    const key = this.apiKey().trim();
    if (!key) {
      alert('Por favor, ingresa tu API Key de Groq.');
      return;
    }

    // Update status to transcribing
    this.updateFileStatus(fileId, 'transcribing', 20);

    try {
      const formData = new FormData();
      formData.append('file', audioFile.file);
      formData.append('model', this.model());
      
      if (this.language()) {
        formData.append('language', this.language());
      }
      if (this.prompt()) {
        formData.append('prompt', this.prompt());
      }
      formData.append('temperature', this.temperature().toString());
      formData.append('response_format', this.responseFormat());

      const endpoint = this.taskType() === 'translate' 
        ? 'https://api.groq.com/openai/v1/audio/translations'
        : 'https://api.groq.com/openai/v1/audio/transcriptions';

      this.updateFileStatus(fileId, 'transcribing', 50);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`
        },
        body: formData
      });

      this.updateFileStatus(fileId, 'transcribing', 80);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Error de API: ${response.status} ${response.statusText}`;
        try {
          const parsed = JSON.parse(errorText);
          errorMessage = parsed.error?.message || errorMessage;
        } catch (_) {
          if (errorText) errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      let textResult = '';
      const format = this.responseFormat();

      if (format === 'json' || format === 'verbose_json') {
        const jsonResult = await response.json();
        if (format === 'verbose_json') {
          // Keep formatting for verbose json
          textResult = JSON.stringify(jsonResult, null, 2);
        } else {
          textResult = jsonResult.text || '';
        }
      } else {
        textResult = await response.text();
      }

      this.audioFiles.update(current => 
        current.map(f => f.id === fileId ? {
          ...f,
          status: 'completed',
          progress: 100,
          transcript: textResult,
          responseFormat: format
        } : f)
      );

      // Update selected file if it's the one we just transcribed
      if (this.selectedFile()?.id === fileId) {
        const updated = this.audioFiles().find(f => f.id === fileId);
        if (updated) this.selectedFile.set(updated);
      }

    } catch (err: any) {
      console.error('Transcription error:', err);
      this.audioFiles.update(current => 
        current.map(f => f.id === fileId ? {
          ...f,
          status: 'failed',
          progress: 0,
          error: err.message || 'Error desconocido al transcribir.'
        } : f)
      );

      if (this.selectedFile()?.id === fileId) {
        const updated = this.audioFiles().find(f => f.id === fileId);
        if (updated) this.selectedFile.set(updated);
      }
    }
  }

  // Transcribe all files sequentially
  async transcribeAll() {
    const filesToTranscribe = this.audioFiles().filter(f => f.status === 'ready' || f.status === 'failed');
    if (filesToTranscribe.length === 0) return;

    if (!this.apiKey().trim()) {
      alert('Por favor, ingresa tu API Key de Groq.');
      return;
    }

    this.isProcessing.set(true);

    for (const audioFile of filesToTranscribe) {
      // Extra size safety
      if (audioFile.sizeBytes > 25 * 1024 * 1024) continue;
      
      await this.transcribeFile(audioFile.id);
      
      // Delay slightly between requests to respect Groq rate limits
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    this.isProcessing.set(false);
  }

  private updateFileStatus(fileId: string, status: AudioFile['status'], progress: number) {
    this.audioFiles.update(current =>
      current.map(f => f.id === fileId ? { ...f, status, progress } : f)
    );
    if (this.selectedFile()?.id === fileId) {
      const updated = this.audioFiles().find(f => f.id === fileId);
      if (updated) this.selectedFile.set(updated);
    }
  }

  // Copy transcript to clipboard
  copyTranscript(file: AudioFile) {
    if (!file.transcript) return;
    navigator.clipboard.writeText(file.transcript).then(
      () => {
        alert('Transcripción copiada al portapapeles.');
      },
      (err) => {
        console.error('Error al copiar:', err);
      }
    );
  }

  // Download individual transcript
  downloadTranscript(file: AudioFile) {
    if (!file.transcript) return;
    const extension = this.getExtensionForFormat(file.responseFormat);
    const fileName = `${this.removeExtension(file.name)}.${extension}`;
    const blob = new Blob([file.transcript], { type: 'text/plain;charset=utf-8' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  // Download all transcripts as a ZIP
  async downloadAllZip() {
    const completedFiles = this.audioFiles().filter(f => f.status === 'completed' && f.transcript);
    if (completedFiles.length === 0) return;

    const zip = new JSZip();

    completedFiles.forEach(file => {
      if (file.transcript) {
        const extension = this.getExtensionForFormat(file.responseFormat);
        const fileName = `${this.removeExtension(file.name)}.${extension}`;
        zip.file(fileName, file.transcript);
      }
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `transcripciones_groq_${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Error al generar ZIP:', err);
      alert('Ocurrió un error al generar el archivo ZIP.');
    }
  }

  // Helper: Format bytes to human-readable size
  private formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Helper: Get file extension based on response format
  private getExtensionForFormat(format: string): string {
    switch (format) {
      case 'srt': return 'srt';
      case 'vtt': return 'vtt';
      case 'json':
      case 'verbose_json': return 'json';
      case 'text':
      default: return 'txt';
    }
  }

  // Helper: Remove original file extension
  private removeExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length > 1) {
      parts.pop();
    }
    return parts.join('.');
  }
}
