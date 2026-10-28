import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import BrandLogo from '../common/BrandLogo';

const CURRENT_YEAR = new Date().getFullYear();

export default function PublicFooter() {
  return (
    <footer className="relative z-10 bg-[#070e1c] border-t border-[#18274d] text-slate-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* 1. Brand Logo & Project Summary */}
          <div className="space-y-3.5 lg:col-span-1">
            <BrandLogo variant="horizontal" size="md" to={ROUTES.HOME} forceDark={true} />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              GreenGrid Smart Energy Management — Empowering organizations to monitor live meter telemetry, optimize renewable consumption, and cut utility costs.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* 2. Platform Navigation */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to={ROUTES.HOME} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Energy Dashboard
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About GreenGrid
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Account Access */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Access
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to={ROUTES.LOGIN} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FORGOT_PASSWORD || '/forgot-password'} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Reset Password
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Support & Connect */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Contact &amp; Connect
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              <p className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200">Email:</span>
                <span className="text-slate-400">support@greengrid.io</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200">Live Support:</span>
                <span className="text-slate-400">24/7 Energy Operations Desk</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200">Deployment:</span>
                <span className="text-emerald-400 font-mono">v2.4.0 (Active)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-[#18274d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>&copy; {CURRENT_YEAR} GreenGrid &ndash; Smart Energy Management. All rights reserved.</p>
          <div className="flex items-center space-x-5">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">System Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
