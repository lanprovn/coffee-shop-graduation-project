import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-[#f8f4f0] via-[#faf7f5] to-[#f3ede8] text-neutral-800">
      {/* Navbar cố định */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto pt-24 pb-12 px-2 sm:px-4 lg:px-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-3 sm:p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
