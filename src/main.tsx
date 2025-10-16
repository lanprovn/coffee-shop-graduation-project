import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceOptimizations } from './utils/performance';
import { initGoogleAnalytics, trackPerformance } from './utils/analytics';
import { initWebPerformanceOptimizations } from './utils/webPerformance';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Initialize all optimizations
initGoogleAnalytics();
trackPerformance();
initWebPerformanceOptimizations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Simplified for POS - No authentication needed */}
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
