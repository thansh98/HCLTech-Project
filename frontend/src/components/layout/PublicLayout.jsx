import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import GridVisualBackground from '../common/GridVisualBackground';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative">
      <GridVisualBackground />
      <PublicNavbar />
      <main className="flex-1 pt-20 relative z-10">
        {children || <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
}
