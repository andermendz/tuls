import React, { useState, useEffect, useMemo } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { compressImage, downloadBlob, formatBytes } from '../utils/imageUtils';
import { Download, RefreshCw, Sliders, TrendingDown, Loader2, Zap, Image as ImageIcon, Gauge, Settings2, Check, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';
import { ToolContent } from '../components/ui/ToolContent';

const PRESETS = [
  {
    id: 'high',
    label: 'Best Quality',
    value: 0.9,
    desc: 'Hardly noticeable difference',
    icon: ImageIcon
  },
  {
    id: 'balanced',
    label: 'Balanced',
    value: 0.75,
    desc: 'Best for websites & social',
    icon: Zap
  },
  {
    id: 'low',
    label: 'Max Compression',
    value: 0.5,
    desc: 'Smallest possible file size',
    icon: Gauge
  }
];

export const CompressorTool: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [mode, setMode] = useState<'preset' | 'manual'>('preset');
  const [quality, setQuality] = useState(0.75);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'original' | 'compressed'>('original');

  // Handle compression
  useEffect(() => {
    if (!fileData) return;

    const timer = setTimeout(async () => {
      setIsProcessing(true);
      try {
        const blob = await compressImage(fileData.file, quality);
        setCompressedBlob(blob);
        setViewMode('compressed'); // Auto-switch to compressed view when done
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 400); // Slight delay to debounce slider inputs

    return () => clearTimeout(timer);
  }, [fileData, quality]);

  // Generate URL for compressed blob
  useEffect(() => {
    if (compressedBlob) {
      const url = URL.createObjectURL(compressedBlob);
      setCompressedUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCompressedUrl(null);
    }
  }, [compressedBlob]);

  const savings = useMemo(() => {
    if (!fileData || !compressedBlob) return 0;
    return Math.max(0, fileData.size - compressedBlob.size);
  }, [fileData, compressedBlob]);

  const savingsPercent = useMemo(() => {
    if (!fileData || !savings) return 0;
    return Math.round((savings / fileData.size) * 100);
  }, [fileData, savings]);

  const compressedSizeRatio = useMemo(() => {
    if (!fileData || !compressedBlob) return 100;
    return (compressedBlob.size / fileData.size) * 100;
  }, [fileData, compressedBlob]);

  const handleDownload = () => {
    if (compressedBlob && fileData) {
      const ext = compressedBlob.type === 'image/png' ? 'png' : (compressedBlob.type === 'image/webp' ? 'webp' : 'jpg');
      const newName = fileData.name.substring(0, fileData.name.lastIndexOf('.')) + '_compressed.' + ext;
      downloadBlob(compressedBlob, newName);
    }
  };

  const activePresetId = useMemo(() => {
    if (mode === 'manual') return null;
    return PRESETS.find(p => Math.abs(p.value - quality) < 0.01)?.id || 'custom';
  }, [quality, mode]);

  if (!fileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <SEO
          title="Image Compressor"
          description="Compress JPG, PNG, and WebP images online for free. Reduce file size without losing quality. 100% client-side privacy."
          canonical="/image/compressor"
          keywords={['image compressor', 'reduce image size', 'optimize images', 'compress jpg', 'compress png']}
        />
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

        <ToolContent
          title="Image Compression"
          sections={[
            {
              title: "How it works",
              content: "Our smart compressor analyzes your image and selectively reduces the number of colors and removes redundant data. This significantly reduces file size without a noticeable change in quality."
            },
            {
              title: "Privacy First",
              content: "Unlike other tools, Tuls runs entirely in your browser. Your photos are never uploaded to a server, ensuring 100% privacy and security for your personal data."
            },
            {
              title: "Supported Formats",
              content: "We support compression for JPG, PNG, and WebP formats. The tool automatically detects the best compression algorithm for your specific file type."
            },
            {
              title: "Why Compress?",
              content: "Compressed images load faster on websites, take up less storage space on your devices, and are easier to share via email or social media platforms."
            }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-0">
      <SEO title="Compressing Image..." description="Optimizing your image..." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Area */}
        <Card variant="elevated" className="lg:col-span-2 p-4 flex flex-col min-h-[400px] md:min-h-[500px]">
          <div className="flex-1 flex items-center justify-center bg-surface-container-low rounded-m3-lg overflow-hidden relative group">

            {/* Checkerboard Background */}
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

            {/* Image Display */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
              <img
                src={viewMode === 'original' || !compressedUrl ? fileData.previewUrl : compressedUrl}
                alt="Preview"
                className={clsx(
                  "max-h-[500px] max-w-full object-contain transition-opacity duration-200",
                  isProcessing ? "opacity-50 blur-[2px]" : "opacity-100"
                )}
              />
            </div>

            {/* Loading Indicator Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div className="bg-surface-container-high shadow-m3-2 px-6 py-3 rounded-full flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-primary" />
                  <span className="font-medium text-surface-on">Optimizing...</span>
                </div>
              </div>
            )}

            {/* View Toggle */}
            <div className="absolute bottom-4 right-4 z-20 animate-m3-slide-up max-w-[calc(100%-2rem)]">
              <div className="flex p-1 rounded-full bg-surface-container-high shadow-m3-2 overflow-hidden">
                <button
                  onClick={() => setViewMode('original')}
                  className={clsx(
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex-1 sm:flex-none whitespace-nowrap",
                    viewMode === 'original'
                      ? "bg-secondary-container text-secondary-onContainer shadow-sm"
                      : "text-surface-onVariant hover:text-surface-on hover:bg-surface-on/5"
                  )}
                >
                  <Eye size={16} className="shrink-0" />
                  Original
                </button>
                <button
                  onClick={() => setViewMode('compressed')}
                  disabled={!compressedUrl}
                  className={clsx(
                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex-1 sm:flex-none whitespace-nowrap",
                    viewMode === 'compressed'
                      ? "bg-secondary-container text-secondary-onContainer shadow-sm"
                      : "text-surface-onVariant hover:text-surface-on hover:bg-surface-on/5",
                    !compressedUrl && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <EyeOff size={16} className="shrink-0" />
                  Compressed
                </button>
              </div>
            </div>

            {/* Current View Label */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 rounded-m3 bg-surface-container-high text-surface-on text-xs font-medium shadow-sm">
                {viewMode === 'original' ? 'Original' : 'Compressed Result'}
              </span>
            </div>
          </div>
        </Card>

        {/* Controls Area */}
        <div className="space-y-4">

          {/* Controls Card */}
          <Card variant="elevated" className="space-y-5 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-google-yellow/10 rounded-m3 flex items-center justify-center">
                  <Sliders size={20} className="text-yellow-700 dark:text-google-yellow" />
                </div>
                <div>
                  <h3 className="font-medium text-surface-on">Settings</h3>
                  <p className="text-sm text-surface-onVariant">Adjust compression</p>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="bg-surface-container rounded-full p-1 flex relative">
              <button
                onClick={() => setMode('preset')}
                className={clsx(
                  "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 z-10",
                  mode === 'preset' ? "text-surface-on shadow-sm bg-surface" : "text-surface-onVariant hover:text-surface-on"
                )}
              >
                Smart Presets
              </button>
              <button
                onClick={() => setMode('manual')}
                className={clsx(
                  "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 z-10",
                  mode === 'manual' ? "text-surface-on shadow-sm bg-surface" : "text-surface-onVariant hover:text-surface-on"
                )}
              >
                Custom
              </button>
            </div>

            {/* Preset Options */}
            {mode === 'preset' && (
              <div className="space-y-2 animate-fade-in">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setQuality(preset.value)}
                      className={clsx(
                        "w-full p-3 rounded-m3-lg text-left flex items-center gap-3 transition-all duration-200 group relative overflow-hidden",
                        isActive
                          ? "bg-primary-container text-primary-onContainer shadow-sm"
                          : "bg-surface-container-low hover:bg-surface-container text-surface-on"
                      )}
                    >
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0",
                        isActive ? "bg-primary text-white" : "bg-surface-container-high text-surface-onVariant group-hover:bg-surface-container-highest"
                      )}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">
                            {preset.label}
                          </span>
                          {isActive && <Check size={16} className="text-primary shrink-0" />}
                        </div>
                        <span className={clsx("text-xs truncate block", isActive ? "text-primary-onContainer/70" : "text-surface-onVariant")}>
                          {preset.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Manual Slider */}
            {mode === 'manual' && (
              <div className="space-y-6 py-2 animate-fade-in">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-medium text-surface-onVariant uppercase tracking-wider">
                    <span>Low Quality</span>
                    <span>High Quality</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Settings2 size={16} />
                    <span className="text-xl font-medium font-display">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center text-surface-onVariant bg-surface-container p-3 rounded-lg">
                  Lower percentage = smaller file size but lower visual quality.
                </p>
              </div>
            )}
          </Card>

          {/* Results Card */}
          <Card variant="elevated" className="space-y-4 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-google-green/10 rounded-m3 flex items-center justify-center">
                <Zap size={20} className="text-google-green" />
              </div>
              <h3 className="font-medium text-surface-on">Results</h3>
            </div>

            {/* Visual Comparison Bars */}
            <div className="space-y-5">
              {/* Original Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-onVariant">Original</span>
                  <span className="font-mono font-medium text-surface-on">{formatBytes(fileData.size)}</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-surface-onVariant/30 w-full" />
                </div>
              </div>

              {/* Compressed Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-onVariant">Compressed</span>
                  <span className="font-mono font-medium text-primary flex items-center gap-2">
                    {isProcessing && <Loader2 size={12} className="animate-spin" />}
                    {compressedBlob ? formatBytes(compressedBlob.size) : '...'}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      "h-full transition-all duration-500 ease-out rounded-full",
                      isProcessing ? "w-full animate-pulse bg-primary/30" : "bg-primary"
                    )}
                    style={{ width: isProcessing ? '100%' : `${compressedSizeRatio}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Savings Banner */}
            <div
              className={clsx(
                "transition-all duration-500 ease-in-out overflow-hidden",
                (savings > 0 && !isProcessing) ? "max-h-24 opacity-100 pt-2" : "max-h-0 opacity-0 pt-0"
              )}
            >
              <div className="bg-success-container/40 rounded-xl p-3 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-success-container flex items-center justify-center text-success-onContainer">
                    <TrendingDown size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-surface-onVariant uppercase font-medium tracking-wide">Saved</span>
                    <span className="font-medium text-success-onContainer text-lg leading-none">
                      {savingsPercent}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-success-onContainer block">
                    {formatBytes(savings)}
                  </span>
                </div>
              </div>
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
              onClick={() => { setFileData(null); setCompressedBlob(null); setCompressedUrl(null); }}
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