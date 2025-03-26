import api from '../services/api';

export interface Upload {
  id: string;
  talhaoId: string;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  status: 'in_progress' | 'completed' | 'failed' | 'partial';
  errors: string[];
}

export interface UploadFile {
  formData: FormData;
  fileName: string;
}

type UploadListener = (uploads: Upload[]) => void;

class UploadService {
  private static instance: UploadService;
  private uploads: Upload[] = [];
  private listeners: UploadListener[] = [];

  private constructor() {
    // Singleton
  }

  public static getInstance(): UploadService {
    if (!UploadService.instance) {
      UploadService.instance = new UploadService();
    }
    return UploadService.instance;
  }

  public getUploads(): Upload[] {
    return [...this.uploads];
  }

  public addListener(listener: UploadListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    const uploads = this.getUploads();
    this.listeners.forEach(listener => listener(uploads));
  }

  public startUpload(uploadId: string, talhaoId: string, files: UploadFile[]): void {
    // Criar um novo registro de upload
    const newUpload: Upload = {
      id: uploadId,
      talhaoId,
      totalFiles: files.length,
      completedFiles: 0,
      failedFiles: 0,
      status: 'in_progress',
      errors: []
    };

    // Adicionar à lista de uploads
    this.uploads.push(newUpload);
    this.notifyListeners();

    // Iniciar o upload de cada arquivo em segundo plano
    this.processUpload(newUpload, files);
  }

  private async processUpload(upload: Upload, files: UploadFile[]): Promise<void> {
    // Para cada arquivo, tentar fazer o upload
    const uploadPromises = files.map(async (file, index) => {
      try {
        await api.addPlotAnalysis(upload.talhaoId, file.formData);
        
        // Atualizar o contador de arquivos com sucesso
        upload.completedFiles++;
      } catch (error) {
        // Registrar o erro e incrementar o contador de falhas
        upload.failedFiles++;
        upload.errors.push(`Erro ao enviar ${file.fileName}: ${error}`);
      } finally {
        // Notificar os ouvintes sobre o progresso
        this.notifyListeners();
      }
    });

    // Aguardar todos os uploads terminarem
    await Promise.allSettled(uploadPromises);

    // Atualizar o status do upload
    if (upload.failedFiles === upload.totalFiles) {
      upload.status = 'failed';
    } else if (upload.failedFiles > 0) {
      upload.status = 'partial';
    } else {
      upload.status = 'completed';
    }

    // Notificar os ouvintes sobre a conclusão
    this.notifyListeners();

    // Remover o upload da lista após algum tempo 
    // (para que os ouvintes tenham tempo de ler o status final)
    setTimeout(() => {
      this.uploads = this.uploads.filter(u => u.id !== upload.id);
      this.notifyListeners();
    }, 60000); // 1 minuto
  }
}

export default UploadService.getInstance(); 