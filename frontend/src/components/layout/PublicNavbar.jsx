import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ROUTES } from '../../constants';
import BrandLogo from '../common/BrandLogo';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPath, setPrevPath] = useState('');
  const { user } = useAuth();
  const location = useLocation();

  // Reset menu when route changes
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsOpen(false);
  }

  // Track scroll position for subtle shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Contact', path: ROUTES.CONTACT },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-[#070e1c]/95 backdrop-blur-md border-b border-[#18274d] text-white ${
        scrolled ? 'shadow-lg shadow-black/50' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Official GreenGrid Mark (matching footer dark version) */}
        <BrandLogo variant="horizontal" size="md" to={ROUTES.HOME} forceDark={true} />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isCurrent = (
              link.path === ROUTES.HOME
                ? location.pathname === ROUTES.HOME
                : location.pathname.startsWith(link.path)
            );

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isCurrent
                    ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 font-semibold'
                    : 'text-slate-300 hover:text-emerald-400 hover:bg-[#101b3b]/70'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth / CTA Actions + Theme Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          <ThemeToggle onDark={true} />
          {user ? (
            <Link to={ROUTES.DASHBOARD}>
              <button
                type="button"
                className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  className="px-5 py-2 rounded-full text-sm font-semibold border border-[#18274d] bg-[#101b3b] text-slate-200 hover:bg-[#16234b] hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Login
                </button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <button
                  type="button"
                  className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Get Started</span>
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions: Theme Toggle + Hamburger Toggle Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle onDark={true} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#101b3b] border border-[#18274d] focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#070e1c] border-b border-[#18274d] px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] text-slate-300 hover:text-emerald-400 hover:bg-[#101b3b]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#18274d] flex flex-col space-y-2.5">
            {user ? (
              <Link to={ROUTES.DASHBOARD} className="w-full" onClick={() => setIsOpen(false)}>
                <button
                  type="button"
                  className="w-full justify-center py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 min-h-[48px] transition-all flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="w-full" onClick={() => setIsOpen(false)}>
                  <button
                    type="button"
                    className="w-full justify-center py-3 rounded-full border border-[#18274d] bg-[#101b3b] text-slate-200 hover:bg-[#16234b] hover:text-white text-base font-semibold min-h-[48px] transition-all"
                  >
                    Login
                  </button>
                </Link>
                <Link to={ROUTES.REGISTER} className="w-full" onClick={() => setIsOpen(false)}>
                  <button
                    type="button"
                    className="w-full justify-center py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 min-h-[48px] transition-all flex items-center"
                  >
                    <span>Get Started</span>
                    <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
