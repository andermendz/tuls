import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getCroppedImg, downloadBlob } from '../utils/imageUtils';
import { Crop, Download, RefreshCw, Monitor, Smartphone, Square, RectangleHorizontal, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';

const ASPECT_OPTIONS = [
  { value: undefined, label: 'Free', icon: Crop },
  { value: 1, label: '1:1', icon: Square },
  { value: 16 / 9, label: '16:9', icon: Monitor },
  { value: 4 / 5, label: '4:5', icon: Smartphone },
  { value: 4 / 3, label: '4:3', icon: RectangleHorizontal },
];

export const CropperTool: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDownload = async () => {
    if (!fileData || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(fileData.previewUrl, croppedAreaPixels);
      downloadBlob(blob, `cropped_${fileData.name}`);
    } catch (e) {
      console.error(e);
      alert('Crop failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <SEO
          title="Image Cropper & Resizer"
          description="Crop and resize images online with pixel-perfect precision. Use preset aspect ratios for social media or freeform crop."
          canonical="/image/cropper"
          keywords={['image cropper', 'crop image', 'resize image', 'photo editor', 'aspect ratio']}
        />
        <div className="text-center md:text-left space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-green/10 text-google-green text-sm font-medium">
            <Crop size={16} />
            <span>Edit Tool</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
            Precision Cropper
          </h2>
          <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
            Crop and resize your images with pixel-perfect precision. Choose from preset ratios or go freeform.
          </p>
        </div>
        <FileUpload onFileSelect={setFileData} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-auto min-h-screen md:h-[calc(100vh-100px)] animate-fade-in pb-20 md:pb-0">
      <SEO title="Cropping Image" description="Adjust your crop selection." />
      {/* Cropper Container - Flexible height on mobile, flex-1 on desktop */}
      <div className="relative w-full h-[50vh] md:h-auto md:flex-1 bg-surface-container-high rounded-m3-xl overflow-hidden mb-4 shrink-0">
        <Cropper
          image={fileData.previewUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              background: 'var(--color-surface-container-high)',
            },
            cropAreaStyle: {
              border: '2px solid white',
              borderRadius: '4px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
            }
          }}
        />
      </div>

      {/* Controls */}
      <Card variant="elevated" className="p-4 shrink-0">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          {/* Aspect Ratio Chips */}
          <div className="flex-1 w-full overflow-hidden">
            <label className="text-xs font-medium text-surface-onVariant uppercase tracking-wider mb-3 block">
              Aspect Ratio
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {ASPECT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = aspect === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setAspect(opt.value)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0",
                      isActive
                        ? "bg-primary text-white shadow-m3-1"
                        : "bg-surface-container text-surface-onVariant hover:bg-surface-container-high"
                    )}
                  >
                    <Icon size={16} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="w-full lg:w-56">
            <label className="text-xs font-medium text-surface-onVariant uppercase tracking-wider mb-3 block">
              Zoom: {zoom.toFixed(1)}×
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex w-full lg:w-auto gap-3 shrink-0 pt-2 lg:pt-0">
            <Button
              variant="outlined"
              onClick={() => setFileData(null)}
              className="px-4"
            >
              <RefreshCw size={18} />
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isProcessing}
              className="flex-1 lg:flex-none"
              icon={isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            >
              {isProcessing ? 'Processing...' : 'Save Crop'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};