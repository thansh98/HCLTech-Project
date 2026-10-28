import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ROUTES } from '../../constants';
import Button from '../common/Button';
import BrandLogo from '../common/BrandLogo';
import NotificationBell from '../../features/notifications/NotificationBell';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#070e1c]/95 backdrop-blur-md border-b border-[#18274d] sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 transition-colors duration-200">
      {/* Left: Mobile hamburger + Mobile Brand Logo + Desktop telemetry info */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-[#16234b] min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Open Navigation Sidebar"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand logo visible only on mobile/tablet when sidebar is collapsed */}
        <div className="lg:hidden flex items-center">
          <BrandLogo variant="mark" size="sm" to={ROUTES.DASHBOARD} forceDark={true} />
          <span className="ml-2 font-extrabold text-sm text-white tracking-tight sm:inline hidden">Green<span className="text-emerald-400">Grid</span></span>
        </div>

        {/* Telemetry status on larger screens */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-400 font-semibold">Telemetry Online</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            Enterprise OS &bull; Facility Telemetry Live
          </span>
        </div>
      </div>

      {/* Right: Public Portal link + Notification Bell + Theme Toggle + User Profile Badge + Sign Out */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link
          to={ROUTES.HOME}
          className="hidden md:inline-flex items-center text-xs text-slate-300 hover:text-emerald-400 px-2.5 py-1.5 rounded-lg bg-[#101b3b]/60 border border-[#18274d] hover:bg-[#16234b] transition-colors"
        >
          <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Public Portal
        </Link>

        {/* Notification Bell with Badge & Dropdown */}
        <NotificationBell />

        {/* Theme Toggle with onDark */}
        <ThemeToggle onDark={true} />

        {/* User Role Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#101b3b] border border-[#18274d] text-xs shadow-sm">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="font-semibold text-white capitalize">{user?.username}</span>
          <span className="text-[10px] text-emerald-400 uppercase font-mono px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {user?.role}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center border border-[#18274d] bg-[#101b3b]/80 hover:bg-[#16234b] text-slate-200 hover:text-white min-h-[38px] px-2.5 sm:px-3 text-xs rounded-xl transition-all"
        >
          <svg className="w-4 h-4 sm:mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
