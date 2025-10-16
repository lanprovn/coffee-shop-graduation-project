import React from 'react';

interface KioskLayoutProps {
  children: React.ReactNode;
}

export default function KioskLayout({ children }: KioskLayoutProps) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}