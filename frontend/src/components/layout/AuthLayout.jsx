import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import BrandLogo from '../common/BrandLogo';
import ThemeToggle from '../common/ThemeToggle';
import GridVisualBackground from '../common/GridVisualBackground';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      <GridVisualBackground />

      {/* Return to Home link at top-left & ThemeToggle at top-right */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900/60"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Public Home
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md pt-8 sm:pt-0">
        {/* Brand header using BrandLogo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandLogo variant="full" size="xl" to={ROUTES.HOME} className="mb-4" />
          {title && <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs text-center">{subtitle}</p>}
        </div>

        {/* Card content */}
        <div className="bg-brand-surface/90 backdrop-blur-md border border-brand-border p-6 sm:p-8 rounded-2xl shadow-xl transition-colors duration-200">
          {children}
        </div>

        {/* Auth footer */}
        <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-6">
          Protected by GreenGrid Enterprise JWT &amp; Role-Based Access Control.
        </p>
      </div>
    </div>
  );
}
