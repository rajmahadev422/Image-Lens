export interface AnalysisResult {
  description: string;
  labels: string[];
  colors: string[];
  mood: string;
  objects: string[];
  confidence: number;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'analyzing' | 'done' | 'error';
  result?: AnalysisResult;
  error?: string;
}

export type Theme = 'dark' | 'light';
