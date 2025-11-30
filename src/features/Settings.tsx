import React from 'react';
import { Card } from '../components/ui/Card';
import { Moon, Sun, Monitor, Palette, Info, Github, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { SEO } from '../components/SEO';
import { logEvent } from '../utils/analytics';

interface SettingsProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const Settings: React.FC<SettingsProps> = ({ theme, onThemeChange }) => {

  const ThemeOption = ({
    value,
    label,
    icon: Icon,
    description
  }: {
    value: 'light' | 'dark' | 'system',
    label: string,
    icon: React.ElementType,
    description: string
  }) => (
    <button
      onClick={() => {
        onThemeChange(value);
        // Track theme change
        logEvent('Settings', 'Change Theme', value);
      }}
      className={clsx(
        "flex items-center gap-4 p-4 rounded-m3-lg transition-all duration-200 w-full text-left group",
        theme === value
          ? "bg-primary-container text-primary-onContainer"
          : "bg-surface-container-low hover:bg-surface-container"
      )}
    >
      <div className={clsx(
        "w-12 h-12 rounded-m3 flex items-center justify-center transition-all",
        theme === value
          ? "bg-primary text-white"
          : "bg-surface-container-high text-surface-onVariant group-hover:bg-primary/10 group-hover:text-primary"
      )}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <span className="font-medium text-surface-on block">{label}</span>
        <span className="text-sm text-surface-onVariant">{description}</span>
      </div>
      {theme === value && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up pb-20 md:pb-0">
      <SEO
        title="Settings"
        description="Configure your Tuls experience. Change themes and view app information."
        canonical="/settings"
      />
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-normal text-surface-on font-display tracking-tight">Settings</h2>
        <p className="text-lg text-surface-onVariant">Customize your Tuls experience.</p>
      </div>

      {/* Appearance Section */}
      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="p-5 flex items-center gap-4 bg-surface-container-low/30">
          <div className="w-11 h-11 bg-primary-container rounded-m3-lg flex items-center justify-center">
            <Palette size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-surface-on">Appearance</h3>
            <p className="text-sm text-surface-onVariant">Choose your preferred theme</p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <ThemeOption
            value="light"
            label="Light"
            icon={Sun}
            description="Bright and clean interface"
          />
          <ThemeOption
            value="dark"
            label="Dark"
            icon={Moon}
            description="Easy on the eyes at night"
          />
          <ThemeOption
            value="system"
            label="System"
            icon={Monitor}
            description="Match your device settings"
          />
        </div>
      </Card>

      {/* About Section */}
      <Card variant="elevated" className="p-0 overflow-hidden">
        <div className="p-5 flex items-center gap-4 bg-surface-container-low/30">
          <div className="w-11 h-11 bg-tertiary-container rounded-m3-lg flex items-center justify-center">
            <Info size={22} className="text-tertiary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-surface-on">About Tuls</h3>
            <p className="text-sm text-surface-onVariant">Version 1.2.0</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-surface-onVariant leading-relaxed">
            Tuls is a privacy-first utility platform. All operations happen locally in your browser — your files never leave your device.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm text-surface-onVariant">
              100% Client-side
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm text-surface-onVariant">
              No data collection
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-container text-sm text-surface-onVariant">
              Works offline
            </span>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center py-8 space-y-2">
        <p className="text-sm text-surface-onVariant flex items-center justify-center gap-1.5">
          Made with <Heart size={14} className="text-google-red fill-google-red" /> using Material You
        </p>
        <p className="text-xs text-surface-onVariant/60">
          © 2025 Tuls
        </p>
      </div>
    </div>
  );
};