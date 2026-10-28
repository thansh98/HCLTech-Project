import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROUTES } from '../../constants';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import greengridIcon from '../../assets/branding/greengrid-icon.png';

export default function HomePage() {
  const { user } = useAuth();
  const [meterReading, setMeterReading] = useState(842.6);

  // Live Smart Meter jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 0.5;
      setMeterReading(+(842.6 + jitter).toFixed(1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const dashboardTarget = user ? ROUTES.DASHBOARD : ROUTES.REGISTER;
  const formattedMeterReading = `0${meterReading.toFixed(1)}`;

  return (
    <div className="space-y-16 md:space-y-24 pb-20 overflow-hidden">
      {/* =========================================================================
          1. HERO SECTION (Matching Image 3: Smarter Energy. Better Management. Greener Future.)
         ========================================================================= */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-2 pb-10 overflow-hidden">
        {/* Ambient Dark Canvas with subtle grid matrix */}
        <div className="max-w-7xl mx-auto rounded-3xl bg-[#070e1c] border border-cyan-500/20 shadow-2xl p-6 sm:p-8 lg:p-12 relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Background Blueprint Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.18) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
            
            {/* Left Column: Pill Badge, Main Headline, Description, Get Started & Sign In */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Pill Badge matching Image 3 */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#05231f]/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-sm">
                <img
                  src={greengridIcon}
                  alt="GreenGrid"
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span className="tracking-wide">GreenGrid &bull; Smart Energy Management</span>
              </div>

              {/* Main Headline matching Image 3 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Smarter Energy. <br />
                Better Management. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">
                  Greener Future.
                </span>
              </h1>

              {/* Description Copy matching Image 3 */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                GreenGrid is a smart Energy Management Information System designed to help facilities monitor energy consumption, manage smart meters, track energy costs, identify peak demand, and understand renewable energy performance from one simple platform.
              </p>

              {/* Action Buttons: [ Get Started -> ] and [ Sign In ] matching Image 3 */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link to={dashboardTarget}>
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{user ? 'Open Dashboard' : 'Get Started'}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </Link>

                {!user && (
                  <Link to={ROUTES.LOGIN}>
                    <button
                      type="button"
                      className="px-7 py-3.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Working 60 FPS SVG Telemetry & Smart Grid Animation */}
            <div className="lg:col-span-7 relative w-full flex items-center justify-center">
              <svg
                viewBox="0 0 840 450"
                className="w-full h-auto max-h-[460px] drop-shadow-2xl select-none"
              >
                <defs>
                  {/* Neon Glow Filter */}
                  <filter id="svgCircuitGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Gradient for Power Curve Flow */}
                  <linearGradient id="powerLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="45%" stopColor="#10b981" />
                    <stop offset="75%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>

                  {/* Sun Radial Glow */}
                  <radialGradient id="sunRadialGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                    <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Blueprint watermark 'POWER GRID' */}
                <text x="30" y="240" fill="#334155" opacity="0.35" fontSize="12" fontWeight="900" letterSpacing="4">
                  POWER GRID
                </text>
                <line x1="25" y1="248" x2="135" y2="248" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />

                {/* ================= 1. SUN & SOLAR ARRAY ================= */}
                {/* Radiant Glowing Sun */}
                <g transform="translate(470, 52)">
                  {/* Ambient Halo */}
                  <circle cx="0" cy="0" r="28" fill="url(#sunRadialGlow)" opacity="0.45" className="animate-pulse" />
                  {/* Core Sun Circle */}
                  <circle cx="0" cy="0" r="14" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" filter="url(#svgCircuitGlow)" />
                  {/* Rotating Sunburst Rays */}
                  <g className="animate-spin-slow">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                      <line
                        key={angle}
                        x1="0"
                        y1="-18"
                        x2="0"
                        y2="-24"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        transform={`rotate(${angle})`}
                      />
                    ))}
                  </g>
                </g>

                {/* Solar Panel Array Grid */}
                <g transform="translate(470, 128)">
                  {/* Solar Panel Body */}
                  <polygon
                    points="-44,14 0,-14 44,14 0,38"
                    fill="#0f2b48"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    filter="url(#svgCircuitGlow)"
                  />
                  {/* Internal Grid Lines on Solar Panel */}
                  <line x1="-22" y1="0" x2="22" y2="26" stroke="#0284c7" strokeWidth="1.2" />
                  <line x1="0" y1="-14" x2="0" y2="38" stroke="#0284c7" strokeWidth="1.2" />
                  <line x1="22" y1="0" x2="-22" y2="26" stroke="#0284c7" strokeWidth="1.2" />
                  <circle cx="0" cy="14" r="3" fill="#38bdf8" />
                </g>

                {/* Sun -> Solar Conduit line */}
                <line
                  x1="470"
                  y1="67"
                  x2="470"
                  y2="114"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-dash-flow"
                />

                {/* Solar -> Main Power Curve Conduit line */}
                <path
                  d="M 470 166 L 470 205 Q 470 235 500 245"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-dash-flow"
                  opacity="0.85"
                />
                <circle cx="470" cy="205" r="3" fill="#f59e0b" className="animate-pulse" />

                {/* ================= 2. MAIN PEAK LOAD POWER CURVE ================= */}
                {/* Background Wide Glow */}
                <path
                  d="M 20 375 C 160 375, 230 365, 320 325 C 380 295, 440 250, 495 245 C 545 240, 580 345, 640 375 C 675 385, 705 370, 735 340"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="7"
                  opacity="0.35"
                  filter="url(#svgCircuitGlow)"
                />

                {/* Crisp Electric Flow Line */}
                <path
                  id="telemetryWavePath"
                  d="M 20 375 C 160 375, 230 365, 320 325 C 380 295, 440 250, 495 245 C 545 240, 580 345, 640 375 C 675 385, 705 370, 735 340"
                  fill="none"
                  stroke="url(#powerLineGrad)"
                  strokeWidth="3.2"
                  strokeDasharray="12 8"
                  className="animate-dash-flow"
                  strokeLinecap="round"
                />

                {/* Animated Flowing Electricity Packets */}
                <circle r="4" fill="#34d399" filter="url(#svgCircuitGlow)">
                  <animateMotion
                    repeatCount="indefinite"
                    dur="3.4s"
                    path="M 20 375 C 160 375, 230 365, 320 325 C 380 295, 440 250, 495 245 C 545 240, 580 345, 640 375 C 675 385, 705 370, 735 340"
                  />
                </circle>
                <circle r="3.5" fill="#38bdf8" filter="url(#svgCircuitGlow)">
                  <animateMotion
                    repeatCount="indefinite"
                    dur="3.4s"
                    begin="1.7s"
                    path="M 20 375 C 160 375, 230 365, 320 325 C 380 295, 440 250, 495 245 C 545 240, 580 345, 640 375 C 675 385, 705 370, 735 340"
                  />
                </circle>

                {/* ================= 3. INLINE SMART METER ================= */}
                <g transform="translate(305, 248)">
                  {/* Outer Housing Box */}
                  <rect
                    x="0"
                    y="0"
                    width="88"
                    height="58"
                    rx="8"
                    fill="#051224"
                    stroke="#0ea5e9"
                    strokeWidth="1.8"
                    filter="url(#svgCircuitGlow)"
                  />
                  {/* Pulsing Green Status Indicator LED */}
                  <circle cx="14" cy="14" r="3" fill="#10b981" />
                  <circle cx="14" cy="14" r="5" fill="#10b981" opacity="0.4" className="animate-ping" />
                  
                  {/* Digital Meter LCD Readout Display */}
                  <rect x="8" y="22" width="72" height="20" rx="3" fill="#020814" stroke="#1e293b" />
                  <text
                    x="44"
                    y="36"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="900"
                  >
                    {formattedMeterReading}
                  </text>
                  <text x="68" y="32" fill="#64748b" fontSize="6.5" fontFamily="monospace">
                    kWh
                  </text>

                  {/* Label under display */}
                  <text
                    x="44"
                    y="50"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7.5"
                    fontWeight="bold"
                    letterSpacing="1.2"
                  >
                    SMART METER
                  </text>

                  {/* Connection terminal pins linking to power curve */}
                  <line x1="44" y1="58" x2="44" y2="78" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="2 2" />
                  <circle cx="44" cy="78" r="3" fill="#0ea5e9" />
                </g>

                {/* ================= 4. PEAK DEMAND (PEAK LOAD) ================= */}
                {/* Guide Drop-line from Peak to Timeline */}
                <line
                  x1="495"
                  y1="250"
                  x2="495"
                  y2="395"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  opacity="0.6"
                />

                {/* Peak Node Point */}
                <circle cx="495" cy="245" r="7" fill="#f59e0b" opacity="0.6" className="animate-ping" />
                <circle cx="495" cy="245" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

                {/* PEAK LOAD Badge */}
                <g transform="translate(495, 212)">
                  <rect
                    x="-34"
                    y="0"
                    width="68"
                    height="18"
                    rx="4"
                    fill="#3f1e06"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="8"
                    fontWeight="900"
                    letterSpacing="0.8"
                  >
                    PEAK LOAD
                  </text>
                </g>

                {/* ================= 5. SMART FACILITY ================= */}
                <g transform="translate(685, 120)">
                  {/* Multi-story High-Rise Tower Facade */}
                  <rect
                    x="0"
                    y="25"
                    width="100"
                    height="250"
                    rx="8"
                    fill="#08142b"
                    stroke="#0284c7"
                    strokeWidth="2"
                    filter="url(#svgCircuitGlow)"
                  />
                  {/* Left Lower Wing Annex */}
                  <rect
                    x="-35"
                    y="165"
                    width="35"
                    height="110"
                    rx="4"
                    fill="#050e1f"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />

                  {/* Window Grid Array (4 cols x 7 rows) */}
                  {[
                    ['#10b981', '#06b6d4', '#1e293b', '#38bdf8'],
                    ['#38bdf8', '#10b981', '#06b6d4', '#1e293b'],
                    ['#1e293b', '#38bdf8', '#10b981', '#06b6d4'],
                    ['#06b6d4', '#1e293b', '#38bdf8', '#10b981'],
                    ['#10b981', '#06b6d4', '#10b981', '#38bdf8'],
                    ['#38bdf8', '#10b981', '#1e293b', '#06b6d4'],
                    ['#06b6d4', '#38bdf8', '#10b981', '#10b981'],
                  ].map((row, rIdx) =>
                    row.map((color, cIdx) => (
                      <rect
                        key={`${rIdx}-${cIdx}`}
                        x={14 + cIdx * 19}
                        y={42 + rIdx * 28}
                        width="13"
                        height="16"
                        rx="2"
                        fill={color}
                        opacity={color === '#1e293b' ? 0.35 : 0.85}
                        className={color !== '#1e293b' ? 'animate-pulse' : ''}
                        style={{
                          animationDuration: `${2.5 + (rIdx + cIdx) * 0.4}s`,
                        }}
                      />
                    ))
                  )}

                  {/* Rooftop IoT Wireless Antenna Mast */}
                  <line x1="50" y1="25" x2="50" y2="-12" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="50" cy="-12" r="3.5" fill="#38bdf8" filter="url(#svgCircuitGlow)" />
                  {/* Expanding Wireless Waves */}
                  <path
                    d="M 38 -20 A 15 15 0 0 1 62 -20"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-wifi-pulse-1"
                  />
                  <path
                    d="M 30 -27 A 25 25 0 0 1 70 -27"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-wifi-pulse-2"
                  />
                  <path
                    d="M 22 -34 A 35 35 0 0 1 78 -34"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="animate-wifi-pulse-3"
                  />

                  {/* Building Label */}
                  <text
                    x="50"
                    y="290"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8.5"
                    fontWeight="bold"
                    letterSpacing="1.8"
                  >
                    SMART FACILITY
                  </text>
                </g>

                {/* ================= 6. TIMELINE & TELEMETRY STREAM STATUS ================= */}
                {/* Horizontal Baseline Axis */}
                <line
                  x1="30"
                  y1="395"
                  x2="810"
                  y2="395"
                  stroke="#1e293b"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                />

                {/* Time Markings */}
                <text x="60" y="415" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="600">
                  00:00
                </text>
                <text x="280" y="415" fill="#64748b" fontSize="9" fontFamily="monospace" fontWeight="600">
                  08:00
                </text>
                <text
                  x="495"
                  y="415"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  14:00 (PEAK)
                </text>

                {/* Live Telemetry Status Readout */}
                <g transform="translate(560, 415)">
                  <circle cx="0" cy="-3" r="2.5" fill="#10b981" />
                  <circle cx="0" cy="-3" r="5" fill="#10b981" opacity="0.4" className="animate-ping" />
                  <text
                    x="10"
                    y="0"
                    fill="#2dd4bf"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="1.2"
                  >
                    ENERGY MONITORING &amp; ANALYTICS // TELEMETRY STREAM
                  </text>
                </g>
              </svg>

              {/* Custom CSS Animation Keyframes for Smooth 60 FPS Flow */}
              <style>{`
                @keyframes dashMove {
                  to {
                    stroke-dashoffset: -40;
                  }
                }
                .animate-dash-flow {
                  animation: dashMove 1.2s linear infinite;
                }
                @keyframes spinSlow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  transform-origin: 0px 0px;
                  animation: spinSlow 18s linear infinite;
                }
                @keyframes wifiWave {
                  0%, 100% { opacity: 0.2; transform: scale(0.96); }
                  50% { opacity: 1; transform: scale(1.04); }
                }
                .animate-wifi-pulse-1 {
                  animation: wifiWave 1.6s ease-in-out infinite;
                }
                .animate-wifi-pulse-2 {
                  animation: wifiWave 1.6s ease-in-out infinite 0.3s;
                }
                .animate-wifi-pulse-3 {
                  animation: wifiWave 1.6s ease-in-out infinite 0.6s;
                }
              `}</style>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. KEY FEATURES SUITE
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="success" className="mb-2">Enterprise Capabilities</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Complete Facility Energy Governance &amp; Decarbonization
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3">
            Hardware-agnostic IoT telemetry, high-resolution time-series data, and automated demand flexibility to turn utility costs into a strategic advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Smart Meter Management
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Centralized Device Fleet</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track smart meters across buildings. Monitor communication status, model types, serial numbers, and calibration intervals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
              Thresholds &amp; Instant Alerts
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Anomaly Protection</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Define custom thresholds with severity grades (info, warning, critical). Automatically generate audit-tracked alerts when limits are breached.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-sky-600 dark:text-sky-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
              Renewable Energy Mix
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Clean Power Tracking</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitor solar PV generation, wind power yields, and geothermal systems. Track total clean kWh generated and net facility offset.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-purple-600 dark:text-purple-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
              Tariff &amp; Billing Engine
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Automated Utility Audit</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate utility cost schedules, verify supplier billing accuracy, and compare actual metered usage with historical billing invoices in INR (₹).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-teal-600 dark:text-teal-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
              ESG &amp; Carbon Accounting
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Auditable Compliance</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export verified time-series CSV datasets, generate boardroom-ready executive summaries, and track GHG Scope 1 &amp; Scope 2 protocols.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-brand-surface border border-brand-border transition-colors duration-200">
            <div className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
              Two-Factor &amp; Role-Based Access
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">Multi-Tier Security</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict data isolation for Administrators, Facility Managers, and Viewers. Verified two-factor email OTP and tamper-proof audit trails.
            </p>
          </div>
        </div>
      </section>



      {/* =========================================================================
          5. CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-[#101b3b] dark:via-[#16234b] dark:to-[#101b3b] border border-brand-border p-8 sm:p-12 lg:p-16 text-center overflow-hidden transition-colors duration-200 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to Transform Your Organization's Energy Profile?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Join leading facilities using GreenGrid to lower utility bills, ensure compliance, and achieve authentic net-zero operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to={user ? ROUTES.DASHBOARD : ROUTES.REGISTER} className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 text-base shadow-xl shadow-emerald-500/25 rounded-full"
                >
                  {user ? 'Explore Dashboard' : 'Registration'}
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto justify-center border-brand-border text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#16234b] px-8 py-3 text-base rounded-full"
                >
                  Speak with an Energy Specialist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
