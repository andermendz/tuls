import React, { useState, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Loader2 } from 'lucide-react';
import { initGA, logPageView } from './utils/analytics';

// Lazy Imports
const MetadataTool = React.lazy(() => import('./features/MetadataTool').then(module => ({ default: module.MetadataTool })));
const ConverterTool = React.lazy(() => import('./features/ConverterTool').then(module => ({ default: module.ConverterTool })));
const CompressorTool = React.lazy(() => import('./features/CompressorTool').then(module => ({ default: module.CompressorTool })));
const CropperTool = React.lazy(() => import('./features/CropperTool').then(module => ({ default: module.CropperTool })));
const ColorTool = React.lazy(() => import('./features/ColorTool').then(module => ({ default: module.ColorTool })));
const BackgroundRemoverTool = React.lazy(() => import('./features/BackgroundRemoverTool').then(module => ({ default: module.BackgroundRemoverTool })));
const Settings = React.lazy(() => import('./features/Settings').then(module => ({ default: module.Settings })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full w-full min-h-[50vh]">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
  </div>
);

// Component to track page views on route change
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Initialize Google Analytics once when the app mounts
  useEffect(() => {
    initGA();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* AnalyticsTracker must be inside BrowserRouter to use useLocation */}
        <AnalyticsTracker />

        <Routes>
          <Route path="/" element={<Layout theme={theme} setTheme={setTheme} />}>
            <Route index element={<Home />} />

            <Route path="image">
              <Route path="compressor" element={<Suspense fallback={<LoadingFallback />}><CompressorTool /></Suspense>} />
              <Route path="converter" element={<Suspense fallback={<LoadingFallback />}><ConverterTool /></Suspense>} />
              <Route path="cropper" element={<Suspense fallback={<LoadingFallback />}><CropperTool /></Suspense>} />
              <Route path="metadata" element={<Suspense fallback={<LoadingFallback />}><MetadataTool /></Suspense>} />
              <Route path="palette" element={<Suspense fallback={<LoadingFallback />}><ColorTool /></Suspense>} />
              <Route path="bg-remover" element={<Suspense fallback={<LoadingFallback />}><BackgroundRemoverTool /></Suspense>} />
            </Route>

            <Route path="settings" element={<Suspense fallback={<LoadingFallback />}><Settings theme={theme} onThemeChange={setTheme} /></Suspense>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;