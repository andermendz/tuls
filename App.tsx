import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  ScanLine,
  ArrowRightLeft,
  Minimize2,
  Crop,
  Menu,
  X,
  Settings as SettingsIcon,
  Sparkles,
  Zap,
  Palette,
  Eraser
} from 'lucide-react';
import { MetadataTool } from './features/MetadataTool';
import { ConverterTool } from './features/ConverterTool';
import { CompressorTool } from './features/CompressorTool';
import { CropperTool } from './features/CropperTool';
import { ColorTool } from './features/ColorTool';
import { BackgroundRemoverTool } from './features/BackgroundRemoverTool';
import { Settings } from './features/Settings';
import { ToolType } from './types';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      root.classList.remove('light', 'dark');

      if (t === 'system') {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.add('light');
        }
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);

    const listener = () => {
      if (theme === 'system') applyTheme('system');
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const tools = [
    { id: 'bg-remover', name: 'Background Remover', icon: Eraser, desc: 'Remove backgrounds with AI', color: 'bg-purple-600' },
    { id: 'metadata', name: 'Metadata', icon: ScanLine, desc: 'Inspect & remove EXIF data', color: 'bg-google-blue' },
    { id: 'converter', name: 'Converter', icon: ArrowRightLeft, desc: 'Change image formats', color: 'bg-google-red' },
    { id: 'compressor', name: 'Compressor', icon: Minimize2, desc: 'Reduce file size', color: 'bg-google-yellow' },
    { id: 'cropper', name: 'Cropper', icon: Crop, desc: 'Resize & crop images', color: 'bg-google-green' },
    { id: 'palette', name: 'Palette', icon: Palette, desc: 'Extract color schemes', color: 'bg-pink-500' },
  ];

  const renderContent = () => {
    switch (activeTool) {
      case 'bg-remover': return <BackgroundRemoverTool />;
      case 'metadata': return <MetadataTool />;
      case 'converter': return <ConverterTool />;
      case 'compressor': return <CompressorTool />;
      case 'cropper': return <CropperTool />;
      case 'palette': return <ColorTool />;
      case 'settings': return <Settings theme={theme} onThemeChange={setTheme} />;
      default: return (
        <div className="max-w-5xl mx-auto py-6 md:py-12 animate-slide-up px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-primary-onContainer text-sm font-medium mb-6 shadow-m3-1">
              <Sparkles size={16} />
              <span>100% Client-side Processing</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal text-surface-on mb-6 font-display tracking-tight leading-tight">
              Image tools,{' '}
              <span className="text-primary">simplified.</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-onVariant max-w-2xl leading-relaxed md:leading-relaxed">
              Fast, secure, and private image processing right in your browser. No uploads, no servers — your files never leave your device.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {tools.map((tool, index) => (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ToolType)}
                style={{ animationDelay: `${index * 80}ms` }}
                className="group relative bg-surface-container-low hover:bg-surface-container rounded-m3-xl p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-m3-2 active:scale-[0.98] m3-ripple animate-slide-up"
              >
                {/* Background Icon */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-6">
                  <tool.icon size={160} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon Badge */}
                  <div className={clsx(
                    "w-14 h-14 rounded-m3-lg flex items-center justify-center text-white mb-6 shadow-m3-1 transition-all duration-300 group-hover:shadow-m3-2 group-hover:scale-105",
                    tool.color
                  )}>
                    <tool.icon size={26} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="mt-auto">
                    <h3 className="text-xl md:text-2xl font-medium text-surface-on font-display mb-2 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-surface-onVariant text-sm md:text-base">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Features */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {['No sign-up required', 'Works offline', 'Free forever'].map((feature, i) => (
              <div
                key={feature}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container text-surface-onVariant text-sm font-medium border border-outline-variant/50"
              >
                <Zap size={14} className="text-primary" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-surface-container-high md:bg-surface text-surface-on overflow-hidden font-sans">

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-[280px] shrink-0 p-4 h-full">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-m3-lg bg-primary flex items-center justify-center shadow-m3-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm3.5-6h-3V9c0-.28-.22-.5-.5-.5s-.5.22-.5.5v4c0 .28.22.5.5.5h3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
            </svg>
          </div>
          <span className="text-[22px] font-medium text-surface-on font-display tracking-tight">Tuls</span>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          <NavButton
            active={activeTool === 'dashboard'}
            onClick={() => setActiveTool('dashboard')}
            icon={<LayoutDashboard size={24} />}
            label="Dashboard"
          />

          <div className="mt-6 mb-2 px-4">
            <span className="text-sm font-medium text-surface-onVariant">Utilities</span>
          </div>

          {tools.map(tool => (
            <NavButton
              key={tool.id}
              active={activeTool === tool.id}
              onClick={() => setActiveTool(tool.id as ToolType)}
              icon={<tool.icon size={24} />}
              label={tool.name}
              color={tool.color}
            />
          ))}

          <div className="mt-auto pt-4 pb-3">
            <NavButton
              active={activeTool === 'settings'}
              onClick={() => setActiveTool('settings')}
              icon={<SettingsIcon size={24} />}
              label="Settings"
            />
          </div>
        </div>
      </nav>

      {/* Mobile Header - Taller with more spacing */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 pt-2 bg-surface z-40 flex items-center justify-between px-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-m3-sm bg-primary flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm3.5-6h-3V9c0-.28-.22-.5-.5-.5s-.5.22-.5.5v4c0 .28.22.5.5.5h3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
            </svg>
          </div>
          <span className="font-medium text-xl text-surface-on font-display tracking-tight">Tuls</span>
        </div>

        {/* Menu Toggle - Top Right - Floating Card Style (Squared with Rounded Corners) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-highest text-surface-onVariant shadow-m3-1 hover:bg-surface-container hover:shadow-m3-2 active:scale-95 transition-all duration-200 m3-ripple"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay (Scrim) - Solid color with opacity, no blur */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-50 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer - Solid Surface */}
      <div className={clsx(
        "md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-surface-container-low z-[51] transform transition-transform duration-300 ease-out shadow-m3-4 rounded-r-m3-xl flex flex-col",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 min-h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-m3 bg-primary flex items-center justify-center shadow-m3-1">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm3.5-6h-3V9c0-.28-.22-.5-.5-.5s-.5.22-.5.5v4c0 .28.22.5.5.5h3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-medium text-surface-on font-display">Tuls</span>
              <span className="text-xs text-surface-onVariant">Utility Platform</span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-surface-onVariant rounded-full hover:bg-surface-container active:bg-surface-container-high m3-ripple"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-3 py-2 overflow-y-auto flex-1">
          <button
            onClick={() => { setActiveTool('dashboard'); setMobileMenuOpen(false); }}
            className={clsx(
              "w-full h-14 px-4 rounded-full text-left flex items-center gap-4 mb-2 m3-ripple transition-all",
              activeTool === 'dashboard'
                ? "bg-secondary-container text-secondary-onContainer font-medium"
                : "text-surface-onVariant hover:bg-surface-container-high"
            )}
          >
            <LayoutDashboard size={24} />
            <span className="font-medium text-sm">Dashboard</span>
          </button>

          <div className="my-3 px-4 border-t border-outline-variant/30 pt-3">
            <span className="text-sm font-medium text-surface-onVariant">Tools</span>
          </div>

          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => { setActiveTool(tool.id as ToolType); setMobileMenuOpen(false); }}
              className={clsx(
                "w-full h-14 px-4 rounded-full text-left flex items-center gap-4 mb-1 m3-ripple transition-all",
                activeTool === tool.id
                  ? "bg-secondary-container text-secondary-onContainer font-medium"
                  : "text-surface-onVariant hover:bg-surface-container-high"
              )}
            >
              <tool.icon size={24} />
              <span className="font-medium text-sm">{tool.name}</span>
            </button>
          ))}

          <div className="my-3 px-4 border-t border-outline-variant/30 pt-3">
            <span className="text-sm font-medium text-surface-onVariant">App</span>
          </div>

          <button
            onClick={() => { setActiveTool('settings'); setMobileMenuOpen(false); }}
            className={clsx(
              "w-full h-14 px-4 rounded-full text-left flex items-center gap-4 m3-ripple transition-all",
              activeTool === 'settings'
                ? "bg-secondary-container text-secondary-onContainer font-medium"
                : "text-surface-onVariant hover:bg-surface-container-high"
            )}
          >
            <SettingsIcon size={24} />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col pt-20 md:pt-0">
        <div className="md:p-4 md:pl-0 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 md:rounded-m3-xl md:bg-surface-container overflow-hidden md:shadow-m3-1">
            <div key={activeTool} className="h-full overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth bg-surface md:bg-transparent">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean,
  onClick: () => void,
  icon: React.ReactNode,
  label: string,
  color?: string
}> = ({ active, onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-4 px-4 h-14 rounded-full transition-all duration-200 w-full text-left m3-ripple group",
      active
        ? "bg-secondary-container text-secondary-onContainer font-medium"
        : "text-surface-onVariant hover:bg-surface-on/5"
    )}
  >
    <div className={clsx(
      "transition-transform duration-200",
      active ? "scale-100" : "group-hover:scale-110"
    )}>
      {icon}
    </div>
    <span className="text-sm tracking-wide font-medium">{label}</span>
  </button>
);

export default App;