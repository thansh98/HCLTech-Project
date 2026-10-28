import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

const SLIDES = [
  {
    id: 1,
    badge: 'Real-Time Telemetry',
    title: 'Smart Energy Monitoring',
    description: 'Monitor instantaneous power load and energy consumption across commercial and industrial facilities with continuous IoT synchronization.',
    metrics: [
      { label: 'Ingestion Rate', value: 'High-Frequency' },
      { label: 'Active Facilities', value: 'Multi-Site Grid' },
    ],
    accent: 'emerald',
    icon: (
      <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 2,
    badge: 'Clean Decarbonization',
    title: 'Renewable Integration',
    description: 'Track on-site solar PV and wind asset generation in real time. Calculate precise clean energy contribution ratios and net carbon abatement.',
    metrics: [
      { label: 'Clean Power Mix', value: 'Solar & Wind' },
      { label: 'ESG Reporting', value: 'Automated' },
    ],
    accent: 'teal',
    icon: (
      <svg className="w-12 h-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    badge: 'Automated Protection',
    title: 'Analytics & Anomaly Alerts',
    description: 'Identify demand surges before utility peak penalty charges trigger. Automated threshold evaluations alert operations teams immediately.',
    metrics: [
      { label: 'Detection Speed', value: 'Instantaneous' },
      { label: 'Audit Trail', value: '100% Traceable' },
    ],
    accent: 'sky',
    icon: (
      <svg className="w-12 h-12 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Login() {
  const [requestedRole, setRequestedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Auto-advance slider every 6 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Direct Sign In submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedRole) {
      setError('Please select your requested role.');
      return;
    }

    if (!email || !email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login({
        email: email.trim(),
        password,
        requested_role: requestedRole,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errData = err.response?.data;
      const errMsg =
        errData?.detail?.message ||
        errData?.error?.message ||
        errData?.message ||
        (typeof errData?.detail === 'string' ? errData?.detail : null) ||
        extractErrorMessage(err) ||
        'Invalid email, password, or requested role.';
      setError(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
    } finally {
      setSubmitting(false);
    }
  };

  const activeSlide = SLIDES[currentSlide];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-colors duration-200">
        
        {/* ================= LEFT SIDE: DYNAMIC FEATURE CAROUSEL ================= */}
        <div
          className="lg:col-span-6 bg-gradient-to-br from-[#0a1128] via-[#101b3b] to-[#16234b] p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Cyber Grid Matrix Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Ambient Decorative Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top: Pill Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{activeSlide.badge}</span>
            </div>
          </div>

          {/* Center: Slide Graphic, Title & Description */}
          <div className="relative z-10 my-auto py-6 space-y-4">
            <div className="p-3 w-fit rounded-2xl bg-[#0a1128]/80 border border-[#18274d] shadow-lg mb-2">
              {activeSlide.icon}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeSlide.title}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
              {activeSlide.description}
            </p>

            {/* Slide Stat Badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 max-w-sm">
              {activeSlide.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0a1128]/70 border border-[#18274d]">
                  <div className="text-[11px] text-slate-400">{m.label}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Carousel Controls & Indicator Dots */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-[#18274d]">
            <div className="flex items-center space-x-2">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === idx
                      ? 'w-7 h-2 bg-emerald-400'
                      : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${s.id}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#16234b] transition-colors"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#16234b] transition-colors"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: AUTHENTICATION FORM ================= */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-brand-surface transition-colors duration-200">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Sign in to continue to GreenGrid.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-3.5 py-2.5 rounded-xl mb-5 text-xs font-medium space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Quick Demo Fill Buttons */}
            <div className="mb-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-between">
                <span>Demo Accounts (1-Click Fill):</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Password: &lt;role&gt;123</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRequestedRole('manager');
                    setEmail('manager@greengrid.io');
                    setPassword('manager123');
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-surface border border-brand-border text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm"
                >
                  ⚡ Facility Manager
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRequestedRole('admin');
                    setEmail('admin@greengrid.io');
                    setPassword('admin123');
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-surface border border-brand-border text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm"
                >
                  🛡️ Administrator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRequestedRole('viewer');
                    setEmail('viewer@greengrid.io');
                    setPassword('viewer123');
                    setError('');
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-surface border border-brand-border text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-500 transition-colors shadow-sm"
                >
                  👁️ Viewer / Operator
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Requested Role * */}
              <div>
                <label htmlFor="login-requested-role" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Requested Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="login-requested-role"
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="" className="bg-[var(--color-input-bg)] text-slate-500">
                    Select your role
                  </option>
                  <option value="admin" className="bg-[var(--color-input-bg)] text-slate-900 dark:text-slate-100">
                    Administrator
                  </option>
                  <option value="manager" className="bg-[var(--color-input-bg)] text-slate-900 dark:text-slate-100">
                    Facility Manager
                  </option>
                  <option value="viewer" className="bg-[var(--color-input-bg)] text-slate-900 dark:text-slate-100">
                    Viewer / Operator
                  </option>
                </select>
              </div>

              {/* 2. Email Address * */}
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              {/* 3. Password * with Eye Toggle */}
              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 pr-11 py-2.5 min-h-[44px] bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to={ROUTES.FORGOT_PASSWORD || '/forgot-password'}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    Forgot your password? Reset Password
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center disabled:opacity-50 min-h-[46px]"
              >
                {submitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Bottom Registration CTA */}
            <div className="mt-8 pt-5 border-t border-brand-borderSubtle text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New to GreenGrid?{' '}
                <Link to={ROUTES.REGISTER} className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
