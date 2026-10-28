import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-auto py-5 px-4 sm:px-6 border-t border-[#18274d] text-center text-xs text-slate-400 bg-[#070e1c] transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <p>&copy; {CURRENT_YEAR} GreenGrid &ndash; Smart Energy Management. All rights reserved.</p>
        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>Smart Grid Telemetry &bull; Decarbonization OS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-emerald-400 font-medium">System Online</span>
        </div>
      </div>
    </footer>
  );
}
