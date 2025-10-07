import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#f8f4f0] via-[#faf7f5] to-[#f3ede8] text-neutral-800">
      {/* Navbar cố định */}
      <Navbar />

      {/* Nội dung chính - Mobile Optimized */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-8 lg:pb-12 px-1 sm:px-2 lg:px-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-2 sm:p-3 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
