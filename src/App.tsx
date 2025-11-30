import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Removed Navigate
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound'; // Import NotFound
import { Loader2 } from 'lucide-react';

// ... (Keep existing lazy imports)
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

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  return (
    <HelmetProvider>
      <BrowserRouter>
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

            {/* Updated 404 Handling */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;