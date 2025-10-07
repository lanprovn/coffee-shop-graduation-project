import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/responsive.css';
import './styles/mobile.css';
import './styles/performance.css';
import './styles/high-refresh.css';
import './styles/native.css';
import './styles/mobile-first.css';
import { initPerformanceOptimizations } from './utils/performance';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Bọc toàn bộ ứng dụng bằng GoogleOAuthProvider + BrowserRouter */}
    <GoogleOAuthProvider clientId="1234567890-abcxyz.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
