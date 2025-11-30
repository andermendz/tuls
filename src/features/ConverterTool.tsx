import React, { useState } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { convertImageFormat, downloadBlob } from '../utils/imageUtils';
import { FileOutput, ArrowRight, RefreshCw, Loader2, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';

const FORMATS = [
  { mime: 'image/jpeg', label: 'JPEG', ext: 'jpg', desc: 'Best for photos' },
  { mime: 'image/png', label: 'PNG', ext: 'png', desc: 'Lossless quality' },
  { mime: 'image/webp', label: 'WebP', ext: 'webp', desc: 'Modern & efficient' },
];

export const ConverterTool: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    try {
      // @ts-ignore
      const blob = await convertImageFormat(fileData.file, selectedFormat.mime);
      const newName = fileData.name.substring(0, fileData.name.lastIndexOf('.')) + '.' + selectedFormat.ext;
      downloadBlob(blob, newName);
    } catch (e) {
      console.error(e);
      alert("Conversion failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <SEO
          title="Image Converter"
          description="Convert images between JPG, PNG, and WebP formats instantly in your browser. Free, secure, and no uploads required."
          canonical="/image/converter"
          keywords={['image converter', 'convert jpg to png', 'convert png to jpg', 'webp converter', 'image format changer']}
        />
        <div className="text-center md:text-left space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-red/10 text-google-red text-sm font-medium">
            <FileOutput size={16} />
            <span>Format Tool</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
            Format Converter
          </h2>
          <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
            Convert your images between modern formats instantly. Perfect for optimizing file types for web or print.
          </p>
        </div>
        <FileUpload onFileSelect={setFileData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20 md:pb-0">
      <SEO title={`Convert to ${selectedFormat.label}`} description="Converting your image format." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Source Preview */}
        <Card variant="elevated" className="p-0 overflow-hidden">
          <div className="relative aspect-video bg-surface-container-low flex items-center justify-center">
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
              alt="Source"
              className="max-h-[85%] max-w-[85%] object-contain relative z-10 shadow-m3-2 rounded-m3-lg"
            />
          </div>
          <div className="p-5 border-t border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-surface-on truncate max-w-[200px]">{fileData.name}</p>
                <p className="text-sm text-surface-onVariant mt-0.5">
                  Current: <span className="font-medium text-surface-on uppercase">{fileData.type.split('/')[1]}</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                <ArrowRight size={20} className="text-surface-onVariant" />
              </div>
            </div>
          </div>
        </Card>

        {/* Conversion Options */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-surface-onVariant uppercase tracking-wider mb-4">
              Select Output Format
            </h3>
            <div className="space-y-3">
              {FORMATS.map(f => (
                <button
                  key={f.mime}
                  onClick={() => setSelectedFormat(f)}
                  className={clsx(
                    "w-full p-4 rounded-m3-lg border-2 transition-all duration-200 text-left flex items-center gap-4 group",
                    selectedFormat.mime === f.mime
                      ? 'border-primary bg-primary-container/30'
                      : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/50 hover:bg-surface-container'
                  )}
                >
                  <div className={clsx(
                    "w-12 h-12 rounded-m3 flex items-center justify-center font-bold text-lg transition-all",
                    selectedFormat.mime === f.mime
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-high text-surface-onVariant group-hover:bg-primary/10 group-hover:text-primary'
                  )}>
                    {selectedFormat.mime === f.mime ? <Check size={24} /> : f.ext.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-lg text-surface-on block">{f.label}</span>
                    <span className="text-sm text-surface-onVariant">{f.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleConvert}
              disabled={isProcessing}
              size="lg"
              className="w-full"
              icon={isProcessing ? <Loader2 size={20} className="animate-spin" /> : <FileOutput size={20} />}
            >
              {isProcessing ? 'Converting...' : `Convert to ${selectedFormat.label}`}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setFileData(null)}
              className="w-full"
              icon={<RefreshCw size={18} />}
            >
              Choose Different Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};