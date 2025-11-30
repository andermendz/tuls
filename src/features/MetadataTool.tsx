import React, { useState, useEffect } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { getExifData, scrubMetadata, downloadBlob } from '../utils/imageUtils';
import { ShieldCheck, Info, RefreshCw, AlertTriangle, ScanLine, Loader2, Camera, MapPin, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ToolContent } from '../components/ui/ToolContent';
import { logEvent } from '../utils/analytics';

export const MetadataTool: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (fileData) {
      setMetadata(null);
      setLoadingMetadata(true);
      getExifData(fileData.file)
        .then((data) => {
          setMetadata(data);
          // Track metadata view
          logEvent('Tool', 'View', 'Metadata Inspector');
        })
        .catch((e) => {
          console.error("Failed to load metadata", e);
          setMetadata({});
        })
        .finally(() => {
          setLoadingMetadata(false);
        });
    }
  }, [fileData]);

  const handleScrub = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    try {
      // Track scrub action
      logEvent('Tool', 'Process', 'Metadata Scrubber');

      const cleanBlob = await scrubMetadata(fileData.file);
      downloadBlob(cleanBlob, `clean_${fileData.name}`);
    } catch (e) {
      console.error(e);
      alert("Error scrubbing metadata");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatValue = (value: any): string | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'function') return null;

    try {
      if (value instanceof Number || value instanceof String || value instanceof Boolean) {
        return value.valueOf().toString();
      }

      if (Array.isArray(value) || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Float32Array || (value && value.buffer instanceof ArrayBuffer)) {
        const arr = Array.from(value as any[]);
        if (arr.length > 100) return `Binary Data (${arr.length} bytes)`;
        return arr.join(', ');
      }

      if (typeof value !== 'object') {
        return String(value);
      }

      const str = String(value);
      if (str !== '[object Object]') {
        return str;
      }

      const json = JSON.stringify(value);
      if (json === '{}') return null;
      return json.replace(/"/g, '').replace(/,/g, ', ');
    } catch (e) {
      return null;
    }
  };

  if (!fileData) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <SEO
          title="EXIF Viewer & Metadata Remover"
          description="View hidden EXIF data (location, camera settings) in your photos and strip it for better privacy. 100% client-side."
          canonical="/image/metadata"
          keywords={['exif viewer', 'remove metadata', 'scrub exif', 'photo privacy', 'image data viewer']}
        />
        <div className="space-y-4 mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/10 text-google-blue text-sm font-medium">
            <ScanLine size={16} />
            <span>Privacy Tool</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
            Metadata Inspector
          </h2>
          <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
            View hidden EXIF data in your photos — like location, camera, and date — then strip it for better privacy.
          </p>
        </div>
        <FileUpload onFileSelect={setFileData} />

        <ToolContent
          title="EXIF Metadata"
          sections={[
            {
              title: "What is EXIF?",
              content: "EXIF (Exchangeable Image File Format) data is hidden information stored in photos. It can include camera model, settings, date taken, and even precise GPS location."
            },
            {
              title: "Why Remove It?",
              content: "Sharing photos with GPS data online can reveal your home address or daily habits. Scrubbing metadata protects your privacy before posting to social media."
            },
            {
              title: "What We Remove",
              content: "Our scrubbing tool removes GPS coordinates, camera details, software information, and thumbnails, leaving just the visual image data intact."
            },
            {
              title: "Non-Destructive",
              content: "The scrubbing process creates a new copy of your image. Your original file on your device remains untouched and unchanged."
            }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-20 md:pb-0">
      <SEO title="Inspecting Metadata" description="Viewing image details." />
      {/* Left Column: Image & Actions */}
      <div className="lg:col-span-1 space-y-4 flex flex-col">
        <Card variant="elevated" className="p-3 flex-grow flex items-center justify-center relative overflow-hidden min-h-[280px] bg-surface-container-low">
          {/* Refined Checkered background */}
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
            className="max-h-[350px] w-full object-contain rounded-m3-lg relative z-10 shadow-m3-2"
          />
        </Card>

        {/* File info chip */}
        <div className="flex items-center justify-center gap-2 text-sm text-surface-onVariant bg-surface-container rounded-full px-4 py-2">
          <span className="font-medium truncate max-w-[200px]">{fileData.name}</span>
          <span className="text-outline">•</span>
          <span>{fileData.dimensions?.width} × {fileData.dimensions?.height}</span>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleScrub}
            disabled={isProcessing}
            size="lg"
            icon={isProcessing ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
            className="w-full"
          >
            {isProcessing ? 'Scrubbing...' : 'Scrub & Download'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setFileData(null); setMetadata(null); }}
            icon={<RefreshCw size={18} />}
            className="w-full"
          >
            Upload New
          </Button>
        </div>
      </div>

      {/* Right Column: Data Table */}
      <Card variant="elevated" className="lg:col-span-2 overflow-hidden flex flex-col p-0">
        <div className="flex items-center gap-4 p-5 bg-surface-container-low/50">
          <div className="w-11 h-11 bg-google-blue/10 rounded-m3-lg flex items-center justify-center text-google-blue">
            <Info size={22} />
          </div>
          <div>
            <h3 className="text-lg font-medium font-display text-surface-on">Image Details</h3>
            <p className="text-sm text-surface-onVariant">{fileData.type.split('/')[1].toUpperCase()} • {(fileData.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 relative">
          {loadingMetadata && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm z-10">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-surface-onVariant font-medium">Extracting metadata...</p>
            </div>
          )}

          {!loadingMetadata && (!metadata || Object.keys(metadata).length === 0) ? (
            <div className="flex flex-col items-center justify-center h-48 text-surface-onVariant">
              <div className="w-16 h-16 bg-warning-container rounded-m3-lg flex items-center justify-center mb-4">
                <AlertTriangle size={28} className="text-warning" />
              </div>
              <p className="font-medium text-lg text-surface-on mb-1">No EXIF metadata found</p>
              <p className="text-sm text-center max-w-xs">
                This image might be a PNG/WebP, or the metadata has already been removed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metadata && Object.entries(metadata).map(([key, value]) => {
                if (key === 'thumbnail') return null;

                const displayValue = formatValue(value);
                if (!displayValue) return null;

                return (
                  <div
                    key={key}
                    className="p-4 rounded-m3-lg bg-surface-container-low/50 hover:bg-surface-container transition-colors group"
                  >
                    <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1.5 block">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-surface-on break-all leading-relaxed">
                      {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};