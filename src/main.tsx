import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/mobile-consolidated.css';
import './styles/enhanced-consolidated.css';
import './styles/performance-consolidated.css';
import { initPerformanceOptimizations } from './utils/performance';
import { initGoogleAnalytics, trackPerformance } from './utils/analytics';
import { initWebPerformanceOptimizations } from './utils/webPerformance';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Initialize all optimizations
initGoogleAnalytics();
trackPerformance();
initWebPerformanceOptimizations();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Bọc toàn bộ ứng dụng bằng GoogleOAuthProvider + BrowserRouter + HelmetProvider */}
    <HelmetProvider>
      <GoogleOAuthProvider clientId="1234567890-abcxyz.apps.googleusercontent.com">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
