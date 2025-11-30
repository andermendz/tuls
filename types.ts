export type ToolType = 'dashboard' | 'metadata' | 'converter' | 'compressor' | 'cropper' | 'palette' | 'bg-remover' | 'settings';

export interface FileData {
  file: File;
  previewUrl: string;
  name: string;
  type: string;
  size: number;
  dimensions?: { width: number; height: number };
}

export interface ExifData {
  [key: string]: any;
}