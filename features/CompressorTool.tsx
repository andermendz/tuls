import React, { useState, useEffect, useMemo } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { compressImage, downloadBlob, formatBytes } from '../utils/imageUtils';
import { Download, RefreshCw, Sliders, TrendingDown, Loader2, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export const CompressorTool: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!fileData) return;

    const timer = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const blob = await compressImage(fileData.file, quality);
        setCompressedBlob(blob);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fileData, quality]);

  const savings = useMemo(() => {
    if (!fileData || !compressedBlob) return 0;
    return Math.max(0, fileData.size - compressedBlob.size);
  }, [fileData, compressedBlob]);

  const savingsPercent = useMemo(() => {
    if (!fileData || !savings) return 0;
    return Math.round((savings / fileData.size) * 100);
  }, [fileData, savings]);

  const handleDownload = () => {
    if (compressedBlob && fileData) {
      const ext = compressedBlob.type === 'image/png' ? 'png' : (compressedBlob.type === 'image/webp' ? 'webp' : 'jpg');
      const newName = fileData.name.substring(0, fileData.name.lastIndexOf('.')) + '_compressed.' + ext;
      downloadBlob(compressedBlob, newName);
    }
  };

  if (!fileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <div className="text-center md:text-left space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-yellow/10 text-yellow-700 dark:text-google-yellow text-sm font-medium">
            <TrendingDown size={16} />
            <span>Optimization Tool</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
            Smart Compressor
          </h2>
          <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
            Reduce file size while preserving visual quality. Perfect for web optimization and faster loading times.
          </p>
        </div>
        <FileUpload onFileSelect={setFileData} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Area */}
        <Card variant="elevated" className="lg:col-span-2 p-4 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-[400px] bg-surface-container-low rounded-m3-lg overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
              style={{
                backgroundImage: `
                     linear-gradient(45deg, var(--color-surface-container-highest) 25%, transparent 25%), 
                     linear-gradient(-45deg, var(--color-surface-container-highest) 25%, transparent 25%), 
                     linear-gradient(45deg, transparent 75%, var(--color-surface-container-highest) 75%), 
                     linear-gradient(-45deg, transparent 75%, var(--color-surface-container-highest) 75%)
                   `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            <img
              src={fileData.previewUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain relative z-10 shadow-m3-2 rounded-m3-lg"
            />
          </div>

          {/* File info */}
          <div className="mt-4 flex items-center justify-between text-sm bg-surface-container rounded-m3 px-4 py-3">
            <span className="font-medium text-surface-on truncate max-w-[200px]">{fileData.name}</span>
            <span className="text-surface-onVariant">{fileData.dimensions?.width} × {fileData.dimensions?.height}</span>
          </div>
        </Card>

        {/* Controls Area */}
        <div className="space-y-4">
          {/* Quality Slider Card */}
          <Card variant="elevated" className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-google-yellow/10 rounded-m3 flex items-center justify-center">
                <Sliders size={20} className="text-yellow-700 dark:text-google-yellow" />
              </div>
              <div>
                <h3 className="font-medium text-surface-on">Quality</h3>
                <p className="text-sm text-surface-onVariant">Adjust compression level</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-medium text-surface-onVariant uppercase tracking-wider">
                <span>Max Quality</span>
                <span>Min Size</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-4xl font-medium text-primary font-display">
                  {Math.round(quality * 100)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Results Card */}
          <Card variant="elevated" className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-google-green/10 rounded-m3 flex items-center justify-center">
                <Zap size={20} className="text-google-green" />
              </div>
              <h3 className="font-medium text-surface-on">Results</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-surface-onVariant">Original</span>
                <span className="font-mono font-medium text-surface-on">{formatBytes(fileData.size)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-surface-onVariant">Compressed</span>
                <span className="font-mono font-medium text-primary">
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : compressedBlob ? formatBytes(compressedBlob.size) : '—'}
                </span>
              </div>

              {savings > 0 && !isProcessing && (
                <div className="flex items-center justify-center gap-2 py-3 bg-success-container rounded-m3-lg">
                  <TrendingDown size={18} className="text-success" />
                  <span className="font-medium text-success">
                    {formatBytes(savings)} saved ({savingsPercent}%)
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleDownload}
              disabled={!compressedBlob || isProcessing}
              size="lg"
              className="w-full"
              icon={isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            >
              {isProcessing ? 'Compressing...' : 'Download'}
            </Button>

            <Button
              variant="outlined"
              onClick={() => { setFileData(null); setCompressedBlob(null); }}
              className="w-full"
              icon={<RefreshCw size={18} />}
            >
              Compress Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};