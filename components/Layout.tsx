import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
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
  Palette,
  Eraser
} from 'lucide-react';
import { ToolType } from '../types';

interface LayoutProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (t: 'light' | 'dark' | 'system') => void;
}

export const Layout: React.FC<LayoutProps> = ({ theme, setTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Apply Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);
    const listener = () => { if (theme === 'system') applyTheme('system'); };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const tools = [
    { path: '/image/bg-remover', id: 'bg-remover', name: 'Background Remover', icon: Eraser, color: 'bg-purple-600' },
    { path: '/image/metadata', id: 'metadata', name: 'Metadata', icon: ScanLine, color: 'bg-google-blue' },
    { path: '/image/converter', id: 'converter', name: 'Converter', icon: ArrowRightLeft, color: 'bg-google-red' },
    { path: '/image/compressor', id: 'compressor', name: 'Compressor', icon: Minimize2, color: 'bg-google-yellow' },
    { path: '/image/cropper', id: 'cropper', name: 'Cropper', icon: Crop, color: 'bg-google-green' },
    { path: '/image/palette', id: 'palette', name: 'Palette', icon: Palette, color: 'bg-pink-500' },
  ];

  return (
    <div className="flex h-screen bg-surface-container-high md:bg-surface text-surface-on overflow-hidden font-sans">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-[280px] shrink-0 p-4 h-full">
        <div className="px-5 py-5 flex items-center gap-3">
          <div className="w-11 h-11 rounded-m3-lg bg-primary flex items-center justify-center shadow-m3-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm3.5-6h-3V9c0-.28-.22-.5-.5-.5s-.5.22-.5.5v4c0 .28.22.5.5.5h3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
            </svg>
          </div>
          <span className="text-[22px] font-medium text-surface-on font-display tracking-tight">Tuls</span>
        </div>

        <div className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          <NavButton to="/" icon={<LayoutDashboard size={24} />} label="Dashboard" />
          
          <div className="mt-6 mb-2 px-4">
            <span className="text-sm font-medium text-surface-onVariant">Image Tools</span>
          </div>

          {tools.map(tool => (
            <NavButton key={tool.id} to={tool.path} icon={<tool.icon size={24} />} label={tool.name} />
          ))}

          <div className="mt-auto pt-4 pb-3">
            <NavButton to="/settings" icon={<SettingsIcon size={24} />} label="Settings" />
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 pt-2 bg-surface z-40 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-m3-sm bg-primary flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm3.5-6h-3V9c0-.28-.22-.5-.5-.5s-.5.22-.5.5v4c0 .28.22.5.5.5h3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" />
            </svg>
          </div>
          <span className="font-medium text-xl text-surface-on font-display tracking-tight">Tuls</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-highest text-surface-onVariant">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/40 z-50" onClick={() => setMobileMenuOpen(false)} />}
      <div className={clsx("md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-surface-container-low z-[51] transition-transform duration-300 shadow-m3-4", mobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-4 flex items-center justify-between">
            <span className="text-lg font-medium font-display ml-2">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
        </div>
        <div className="px-3 py-2">
            <NavButton to="/" icon={<LayoutDashboard size={24} />} label="Dashboard" />
            <div className="my-3 px-4 border-t border-outline-variant/30 pt-3"><span className="text-sm font-medium text-surface-onVariant">Tools</span></div>
            {tools.map(tool => (
                <NavButton key={tool.id} to={tool.path} icon={<tool.icon size={24} />} label={tool.name} />
            ))}
            <div className="my-3 px-4 border-t border-outline-variant/30 pt-3"><span className="text-sm font-medium text-surface-onVariant">App</span></div>
            <NavButton to="/settings" icon={<SettingsIcon size={24} />} label="Settings" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col pt-20 md:pt-0">
        <div className="md:p-4 md:pl-0 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 md:rounded-m3-xl md:bg-surface-container overflow-hidden md:shadow-m3-1">
            <div className="h-full overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth bg-surface md:bg-transparent">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => clsx(
      "flex items-center gap-4 px-4 h-14 rounded-full transition-all duration-200 w-full text-left m3-ripple group mb-1",
      isActive ? "bg-secondary-container text-secondary-onContainer font-medium" : "text-surface-onVariant hover:bg-surface-on/5"
    )}
  >
    {({ isActive }) => (
        <>
            <div className={clsx("transition-transform duration-200", !isActive && "group-hover:scale-110")}>{icon}</div>
            <span className="text-sm tracking-wide font-medium">{label}</span>
        </>
    )}
  </NavLink>
);