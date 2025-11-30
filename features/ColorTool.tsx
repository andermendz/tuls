import React, { useState, useEffect } from 'react';
import { FileData } from '../types';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { extractColors, Color, getContrastColor, copyToClipboard } from '../utils/colorUtils';
import { Palette, RefreshCw, Copy, Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';

export const ColorTool: React.FC = () => {
    const [fileData, setFileData] = useState<FileData | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    useEffect(() => {
        if (!fileData) return;

        const processImage = async () => {
            setIsProcessing(true);
            try {
                const extracted = await extractColors(fileData.previewUrl, 8);
                setColors(extracted);
            } catch (err) {
                console.error("Failed to extract colors", err);
            } finally {
                setIsProcessing(false);
            }
        };

        processImage();
    }, [fileData]);

    const handleCopy = async (hex: string) => {
        const success = await copyToClipboard(hex);
        if (success) {
            setCopiedHex(hex);
            setTimeout(() => setCopiedHex(null), 2000);
        }
    };

    if (!fileData) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
                <SEO
                    title="Image Palette Generator"
                    description="Extract beautiful color palettes and hex codes from your images instantly. Perfect for designers and artists."
                    canonical="/image/palette"
                    keywords={['color palette', 'extract colors', 'image to hex', 'color picker', 'design tool']}
                />
                <div className="text-center md:text-left space-y-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/10 text-google-blue text-sm font-medium">
                        <Palette size={16} />
                        <span>Design Tool</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-normal text-surface-on font-display tracking-tight">
                        Palette Generator
                    </h2>
                    <p className="text-lg text-surface-onVariant max-w-2xl leading-relaxed">
                        Extract beautiful color palettes from your images instantly. Perfect for designers and artists.
                    </p>
                </div>
                <FileUpload onFileSelect={setFileData} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in pb-20 md:pb-0">
            <SEO title="Extracted Palette" description="View your extracted color palette." />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Preview Area */}
                <Card variant="elevated" className="lg:col-span-1 p-3 flex flex-col h-fit">
                    <div className="flex-1 flex items-center justify-center min-h-[200px] bg-surface-container-low rounded-m3-lg overflow-hidden relative">
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
                            className="max-h-[400px] w-full object-contain relative z-10 shadow-m3-2 rounded-m3-lg"
                        />
                    </div>

                    <div className="mt-4">
                        <Button
                            variant="outlined"
                            onClick={() => { setFileData(null); setColors([]); }}
                            className="w-full"
                            icon={<RefreshCw size={18} />}
                        >
                            New Image
                        </Button>
                    </div>
                </Card>

                {/* Palette Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium text-surface-on font-display">Extracted Palette</h3>
                        {isProcessing && <div className="flex items-center gap-2 text-surface-onVariant text-sm"><Loader2 size={16} className="animate-spin" /> Extracting...</div>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {colors.map((color, index) => {
                            const textColor = getContrastColor(color.hex);
                            const isCopied = copiedHex === color.hex;

                            return (
                                <div
                                    key={index}
                                    className="group relative h-24 rounded-m3-xl overflow-hidden shadow-m3-1 hover:shadow-m3-2 transition-all cursor-pointer m3-ripple"
                                    onClick={() => handleCopy(color.hex)}
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex flex-col" style={{ color: textColor }}>
                                            <span className="font-bold text-lg tracking-wider">{color.hex.toUpperCase()}</span>
                                            <span className="text-sm opacity-80">rgb({color.r}, {color.g}, {color.b})</span>
                                        </div>
                                        <div className={clsx(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200",
                                            isCopied ? "scale-100" : "scale-90"
                                        )} style={{ backgroundColor: textColor, color: color.hex }}>
                                            {isCopied ? <Check size={20} /> : <Copy size={20} />}
                                        </div>
                                    </div>

                                    {/* Always visible label for mobile/touch or just ease of use */}
                                    <div className="absolute bottom-3 left-4 md:opacity-0 md:group-hover:opacity-0 transition-opacity" style={{ color: textColor }}>
                                        <span className="font-medium">{color.hex.toUpperCase()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!isProcessing && colors.length === 0 && (
                        <div className="p-8 text-center text-surface-onVariant bg-surface-container-low rounded-m3-xl border border-outline-variant/20">
                            <p>No colors extracted. Try a different image.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};