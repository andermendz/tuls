import React, { useState, useEffect } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { downloadBlob, resizeImage } from '../utils/imageUtils'; // Import resizeImage
import { Eraser, Download, RefreshCw, Layers, Loader2, Sparkles, ShieldCheck, Zap, Lock, Eye, EyeOff } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { clsx } from 'clsx';

export const BackgroundRemoverTool: React.FC = () => {
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [viewMode, setViewMode] = useState<'original' | 'removed'>('removed');

    useEffect(() => {
        if (processedBlob) {
            const url = URL.createObjectURL(processedBlob);
            setProcessedUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [processedBlob]);

    const processImage = async () => {
        if (!fileData) return;

        setIsProcessing(true);
        setProcessedBlob(null);
        setViewMode('removed');

        try {
            // Resize image to max 1024px to prevent browser freeze
            const resizedBlob = await resizeImage(fileData.file, 1024);

            const blob = await removeBackground(resizedBlob, {
                model: 'isnet',
                output: {
                    format: 'image/png',
                    quality: 0.8
                }
            });
            setProcessedBlob(blob);
        } catch (err) {
            console.error("Background removal failed", err);
            alert("Failed to remove background. Please try a different image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (processedBlob && fileData) {
            const newName = fileData.name.substring(0, fileData.name.lastIndexOf('.')) + '_no_bg.png';
            downloadBlob(processedBlob, newName);
        }
    };

    if (!fileData) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
                <div className="text-center md:text-left space-y-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium">
                        <Eraser size={16} />
                        <span>AI Tool</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
                        Background Remover
                    </h2>
                    <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
                        Remove image backgrounds instantly using client-side AI. High precision, no server uploads.
                    </p>

                    {/* Initial Privacy Disclaimer */}
                    <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl bg-surface-container max-w-2xl text-left">
                        <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h3 className="font-medium text-surface-on text-sm">100% Private & Offline</h3>
                            <p className="text-xs text-surface-onVariant mt-0.5">
                                Processing happens locally on your device. Your images are never uploaded to any server.
                            </p>
                        </div>
                    </div>
                </div>
                <FileUpload onFileSelect={setFileData} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-0">
            <style>{`
        @keyframes scan-material {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-material {
          animation: scan-material 2s ease-in-out infinite;
        }
      `}</style>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview Area */}
                <Card variant="elevated" className="lg:col-span-2 p-4 flex flex-col min-h-[500px]">
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

                        {/* Image Layer */}
                        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                            <img
                                src={viewMode === 'original' || !processedUrl ? fileData.previewUrl : processedUrl}
                                alt="Preview"
                                className="max-h-[500px] max-w-full object-contain transition-all duration-300"
                            />
                        </div>

                        {/* Material Design Processing State */}
                        {isProcessing && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface-container-lowest/50 backdrop-blur-[2px]">
                                {/* Subtle Scan Line */}
                                <div className="absolute inset-x-0 h-0.5 bg-primary/80 animate-scan-material z-10" />

                                {/* Material Card */}
                                <div className="bg-surface-container-high p-6 rounded-m3-xl shadow-m3-3 flex flex-col items-center gap-4 max-w-xs mx-4 animate-m3-scale-in">
                                    <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center shadow-sm">
                                        <Loader2 size={24} className="text-primary-onContainer animate-spin" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-lg font-medium text-surface-on font-display">Removing Background</h3>
                                        <p className="text-sm text-surface-onVariant">Processing locally on device...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Material Segmented Button Toggle */}
                        {processedUrl && !isProcessing && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-m3-slide-up">
                                <div className="flex p-1 rounded-full bg-surface-container-high shadow-m3-2">
                                    <button
                                        onClick={() => setViewMode('original')}
                                        className={clsx(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                                            viewMode === 'original'
                                                ? "bg-secondary-container text-secondary-onContainer shadow-sm"
                                                : "text-surface-onVariant hover:text-surface-on hover:bg-surface-on/5"
                                        )}
                                    >
                                        <Eye size={16} />
                                        Original
                                    </button>
                                    <button
                                        onClick={() => setViewMode('removed')}
                                        className={clsx(
                                            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                                            viewMode === 'removed'
                                                ? "bg-secondary-container text-secondary-onContainer shadow-sm"
                                                : "text-surface-onVariant hover:text-surface-on hover:bg-surface-on/5"
                                        )}
                                    >
                                        <EyeOff size={16} />
                                        Removed
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Controls Area */}
                <div className="space-y-4">
                    <Card variant="elevated" className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-m3 flex items-center justify-center">
                                <Sparkles size={20} className="text-purple-700 dark:text-purple-300" />
                            </div>
                            <div>
                                <h3 className="font-medium text-surface-on">AI Processing</h3>
                                <p className="text-sm text-surface-onVariant">Automatic background detection</p>
                            </div>
                        </div>

                        {/* Sidebar Privacy Disclaimer */}
                        <div className="p-3 rounded-lg bg-surface-container text-xs text-surface-onVariant flex gap-3 leading-relaxed">
                            <ShieldCheck size={16} className="shrink-0 text-primary mt-0.5" />
                            <div>
                                <span className="font-medium text-surface-on">Privacy First:</span> This tool runs 100% locally in your browser. Your image is never uploaded to any server.
                            </div>
                        </div>

                        <div className="space-y-3">
                            {!processedUrl ? (
                                <Button
                                    onClick={processImage}
                                    disabled={isProcessing}
                                    size="lg"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-900/20"
                                    icon={isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Layers size={20} />}
                                >
                                    {isProcessing ? 'Processing...' : 'Remove Background'}
                                </Button>
                            ) : (
                                <div className="p-4 bg-success-container/30 rounded-m3 text-center animate-fade-in">
                                    <p className="text-success font-medium flex items-center justify-center gap-2">
                                        <Sparkles size={16} /> Background Removed
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-2">
                        <Button
                            onClick={handleDownload}
                            disabled={!processedUrl || isProcessing}
                            size="lg"
                            className="w-full"
                            icon={<Download size={20} />}
                        >
                            Download PNG
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setFileData(null);
                                setProcessedBlob(null);
                                setProcessedUrl(null);
                                setViewMode('removed');
                            }}
                            className="w-full"
                            icon={<RefreshCw size={18} />}
                        >
                            Start Over
                        </Button>
                    </div>

                    {/* Tips */}
                    {!processedUrl && (
                        <div className="px-2">
                            <p className="text-xs text-surface-onVariant text-center flex items-center justify-center gap-1.5">
                                <Zap size={12} className="text-yellow-600" />
                                <span>Works best on images with clear subjects</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};