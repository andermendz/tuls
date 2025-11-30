import React, { useRef, useState } from 'react';
import { Upload, ImagePlus, FileImage } from 'lucide-react';
import { readFileAsDataURL } from '../../utils/imageUtils';
import { FileData } from '../../types';

interface FileUploadProps {
  onFileSelect: (data: FileData) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = "image/*" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    try {
      const previewUrl = await readFileAsDataURL(file);
      const img = new Image();
      img.onload = () => {
        onFileSelect({
          file,
          previewUrl,
          name: file.name,
          type: file.type,
          size: file.size,
          dimensions: { width: img.width, height: img.height }
        });
      };
      img.src = previewUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div 
      className={`
        relative group 
        border-2 border-dashed rounded-m3-xl 
        p-12 md:p-16 text-center 
        transition-all duration-300 
        cursor-pointer
        ${isDragOver 
          ? 'border-primary bg-primary-container/30 scale-[1.01]' 
          : 'border-outline-variant/50 bg-surface-container-lowest hover:border-primary/50 hover:bg-surface-container-low'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        onChange={handleChange} 
        className="hidden" 
      />
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-m3-xl pointer-events-none">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl" />
      </div>
      
      <div className="relative flex flex-col items-center gap-6 text-surface-onVariant">
        {/* Icon container */}
        <div className={`
          w-20 h-20 rounded-m3-lg 
          flex items-center justify-center 
          transition-all duration-300 
          ${isDragOver 
            ? 'bg-primary text-white scale-110 shadow-m3-3' 
            : 'bg-primary-container text-primary-onContainer shadow-m3-1 group-hover:shadow-m3-2 group-hover:scale-105'
          }
        `}>
          {isDragOver ? <FileImage size={36} /> : <ImagePlus size={36} />}
        </div>
        
        {/* Text */}
        <div className="space-y-2">
          <h3 className={`
            text-xl md:text-2xl font-medium font-display
            transition-colors
            ${isDragOver ? 'text-primary' : 'text-surface-on'}
          `}>
            {isDragOver ? 'Drop to upload' : 'Drop your image here'}
          </h3>
          <p className="text-sm md:text-base text-surface-onVariant">
            or <span className="text-primary font-medium hover:underline">browse files</span>
          </p>
        </div>
        
        {/* Supported formats */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {['JPG', 'PNG', 'WebP', 'GIF'].map((format) => (
            <span 
              key={format}
              className="px-3 py-1 rounded-full bg-surface-container text-surface-onVariant text-xs font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};