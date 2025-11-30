import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Eraser, ScanLine, ArrowRightLeft, Minimize2, Crop, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
    const navigate = useNavigate();

    const tools = [
        { path: '/image/bg-remover', name: 'Background Remover', icon: Eraser, desc: 'Remove backgrounds with AI', color: 'bg-purple-600' },
        { path: '/image/metadata', name: 'Metadata', icon: ScanLine, desc: 'Inspect & remove EXIF data', color: 'bg-google-blue' },
        { path: '/image/converter', name: 'Converter', icon: ArrowRightLeft, desc: 'Change image formats', color: 'bg-google-red' },
        { path: '/image/compressor', name: 'Compressor', icon: Minimize2, desc: 'Reduce file size', color: 'bg-google-yellow' },
        { path: '/image/cropper', name: 'Cropper', icon: Crop, desc: 'Resize & crop images', color: 'bg-google-green' },
        { path: '/image/palette', name: 'Palette', icon: Palette, desc: 'Extract color schemes', color: 'bg-pink-500' },
    ];

    return (
        <div className="max-w-5xl mx-auto py-6 md:py-12 animate-slide-up px-4">
            <SEO
                title="Free Online Image Tools"
                description="Fast, secure, and private image processing in your browser. Compress, convert, crop, and remove backgrounds without uploading files."
                keywords={['image tools', 'compressor', 'converter', 'background remover', 'privacy first']}
            />

            <div className="mb-16 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-primary-onContainer text-sm font-medium mb-6 shadow-m3-1">
                    <Sparkles size={16} />
                    <span>100% Client-side Processing</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-surface-on mb-6 font-display tracking-tight leading-tight">
                    Image tools, <span className="text-primary">simplified.</span>
                </h1>
                <p className="text-lg md:text-xl text-surface-onVariant max-w-2xl leading-relaxed">
                    Fast, secure, and private image processing right in your browser. No uploads, no servers — your files never leave your device.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {tools.map((tool, index) => (
                    <div
                        key={tool.path}
                        onClick={() => navigate(tool.path)}
                        style={{ animationDelay: `${index * 80}ms` }}
                        className="group relative bg-surface-container-low hover:bg-surface-container rounded-m3-xl p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-m3-2 active:scale-[0.98] m3-ripple animate-slide-up"
                    >
                        <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-6">
                            <tool.icon size={160} strokeWidth={1} />
                        </div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className={clsx("w-14 h-14 rounded-m3-lg flex items-center justify-center text-white mb-6 shadow-m3-1 transition-all duration-300 group-hover:shadow-m3-2 group-hover:scale-105", tool.color)}>
                                <tool.icon size={26} strokeWidth={2} />
                            </div>
                            <div className="mt-auto">
                                <h3 className="text-xl md:text-2xl font-medium text-surface-on font-display mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                                <p className="text-surface-onVariant text-sm md:text-base">{tool.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-3">
                {['No sign-up required', 'Works offline', 'Free forever'].map((feature) => (
                    <div key={feature} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container text-surface-onVariant text-sm font-medium border border-outline-variant/50">
                        <Zap size={14} className="text-primary" />
                        {feature}
                    </div>
                ))}
            </div>
        </div>
    );
};