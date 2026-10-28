import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

/**
 * LiveGridTelemetryCard
 * Unique Interactive Smart Grid Telemetry & Dispatch component for the GreenGrid Dashboard.
 * Integrates real-time IoT smart meters, solar/wind generation feeds, and peak load wave dynamics.
 */
export default function LiveGridTelemetryCard({ summary }) {
  const [activeSource, setActiveSource] = useState('all'); // 'all' | 'solar' | 'wind'
  const [meterJitter, setMeterJitter] = useState(842.6);
  const [instantGen, setInstantGen] = useState(11.2);
  const [gridDemand, setGridDemand] = useState(8.4);

  // Live telemetry pulse animation & subtle metric jitter
  useEffect(() => {
    const timer = setInterval(() => {
      const jitter = (Math.random() - 0.5) * 0.4;
      setMeterJitter((prev) => +(842.6 + jitter).toFixed(1));
      setInstantGen((prev) => +(11.2 + (Math.random() - 0.5) * 0.3).toFixed(1));
      setGridDemand((prev) => +(8.4 + (Math.random() - 0.5) * 0.2).toFixed(1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const netSurplus = +(instantGen - gridDemand).toFixed(1);
  const cleanRatio = Math.min(100, Math.round((instantGen / gridDemand) * 100));

  return (
    <Card className="overflow-hidden border-emerald-500/20 bg-[#070e1c]/90 backdrop-blur-xl shadow-xl mt-6">
      {/* Card Header with Live Dispatch Status */}
      <div className="p-4 sm:p-6 border-b border-brand-borderSubtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Live Smart Grid Telemetry &amp; Dispatch Stream
            </h3>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              50.0 Hz SYNCED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous sub-minute telemetry from managed physical facilities, IoT smart meters, and on-site renewables.
          </p>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-brand-borderSubtle self-start md:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveSource('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSource === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            All Feeds
          </button>
          <button
            type="button"
            onClick={() => setActiveSource('solar')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSource === 'solar'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            ☀️ Solar PV
          </button>
          <button
            type="button"
            onClick={() => setActiveSource('wind')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSource === 'wind'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            💨 Wind
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Arena */}
      <div className="p-4 sm:p-6">
        <div className="relative rounded-2xl bg-[#040914] border border-cyan-500/20 p-3 sm:p-4 overflow-hidden shadow-inner">
          
          {/* Subtle Grid Matrix Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.25) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <svg
            viewBox="0 0 920 330"
            className="w-full h-auto max-h-[300px] select-none drop-shadow-xl"
          >
            <defs>
              <filter id="dashGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="dashWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="40%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* 1. Renewable Sources (Left Side) */}
            {/* Solar Array Node */}
            <g
              transform="translate(85, 75)"
              className={`transition-opacity duration-300 ${activeSource === 'wind' ? 'opacity-30' : 'opacity-100'}`}
            >
              <circle r="36" fill="#081b33" stroke="#f59e0b" strokeWidth="2" filter="url(#dashGlow)" />
              <circle cx="0" cy="0" r="12" fill="#fbbf24" opacity="0.85" />
              <text y="-8" textAnchor="middle" fill="#fbbf24" fontSize="10.5" fontWeight="bold">☀️ Solar Array</text>
              <text y="10" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">6.4 MW</text>
              <text y="22" textAnchor="middle" fill="#94a3b8" fontSize="7.5">PV Telemetry</text>
            </g>

            {/* Wind Turbines Node */}
            <g
              transform="translate(85, 235)"
              className={`transition-opacity duration-300 ${activeSource === 'solar' ? 'opacity-30' : 'opacity-100'}`}
            >
              <circle r="36" fill="#081b33" stroke="#06b6d4" strokeWidth="2" filter="url(#dashGlow)" />
              <text y="-8" textAnchor="middle" fill="#38bdf8" fontSize="10.5" fontWeight="bold">💨 Wind Turbines</text>
              <text y="10" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">4.8 MW</text>
              <text y="22" textAnchor="middle" fill="#94a3b8" fontSize="7.5">Active Turbines</text>
            </g>

            {/* Renewable Conduits connecting to Center Wave */}
            <path
              d="M 125 75 C 200 75, 250 145, 310 160"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-conduit-flow"
              opacity={activeSource === 'wind' ? 0.2 : 0.85}
            />
            <path
              d="M 125 235 C 200 235, 250 175, 310 160"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-conduit-flow"
              opacity={activeSource === 'solar' ? 0.2 : 0.85}
            />

            {/* 2. Main Electric Wave & Telemetry Curve */}
            {/* Background Glow */}
            <path
              d="M 310 160 C 390 145, 430 85, 490 80 C 550 75, 590 200, 680 230 C 720 240, 755 220, 790 180"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="6"
              opacity="0.3"
              filter="url(#dashGlow)"
            />

            {/* Sharp Electric Path */}
            <path
              d="M 310 160 C 390 145, 430 85, 490 80 C 550 75, 590 200, 680 230 C 720 240, 755 220, 790 180"
              fill="none"
              stroke="url(#dashWaveGrad)"
              strokeWidth="3"
              strokeDasharray="10 6"
              className="animate-conduit-flow"
              strokeLinecap="round"
            />

            {/* Traveling Power Pulse Particles */}
            <circle r="3.5" fill="#34d399" filter="url(#dashGlow)">
              <animateMotion
                repeatCount="indefinite"
                dur="3s"
                path="M 310 160 C 390 145, 430 85, 490 80 C 550 75, 590 200, 680 230 C 720 240, 755 220, 790 180"
              />
            </circle>

            {/* 3. Inline Smart Meter Unit */}
            <g transform="translate(320, 190)">
              <rect
                x="0"
                y="0"
                width="84"
                height="54"
                rx="8"
                fill="#071329"
                stroke="#0ea5e9"
                strokeWidth="1.8"
                filter="url(#dashGlow)"
              />
              {/* Pulsing Status LED */}
              <circle cx="12" cy="12" r="3" fill="#10b981" />
              <circle cx="12" cy="12" r="5" fill="#10b981" opacity="0.4" className="animate-ping" />

              {/* Digital Meter LCD Display */}
              <rect x="8" y="20" width="68" height="18" rx="2" fill="#020814" stroke="#1e293b" />
              <text x="38" y="33" textAnchor="middle" fill="#34d399" fontSize="10.5" fontFamily="monospace" fontWeight="900">
                0{meterJitter.toFixed(1)}
              </text>
              <text x="64" y="29" fill="#64748b" fontSize="6" fontFamily="monospace">
                kWh
              </text>

              <text x="42" y="47" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="bold" letterSpacing="1">
                SMART METER
              </text>
            </g>

            {/* 4. Peak Load Warning Badge at Wave Apex */}
            <g transform="translate(490, 48)">
              <rect
                x="-34"
                y="0"
                width="68"
                height="18"
                rx="4"
                fill="#422006"
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
              <text x="0" y="12" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="900" letterSpacing="0.8">
                PEAK LOAD
              </text>
              <circle cx="0" cy="32" r="6" fill="#f59e0b" className="animate-ping" opacity="0.6" />
              <circle cx="0" cy="32" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="0" y1="36" x2="0" y2="280" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            </g>

            {/* 5. Smart Facility Dispatch Hub (Right Side) */}
            <g transform="translate(770, 70)">
              {/* High-Rise Facade */}
              <rect
                x="0"
                y="20"
                width="85"
                height="190"
                rx="8"
                fill="#09152b"
                stroke="#0284c7"
                strokeWidth="2"
                filter="url(#dashGlow)"
              />
              {/* Window Grid Array */}
              {[
                ['#10b981', '#06b6d4', '#38bdf8'],
                ['#38bdf8', '#10b981', '#1e293b'],
                ['#06b6d4', '#38bdf8', '#10b981'],
                ['#10b981', '#06b6d4', '#38bdf8'],
                ['#38bdf8', '#1e293b', '#06b6d4'],
              ].map((row, rIdx) =>
                row.map((color, cIdx) => (
                  <rect
                    key={`${rIdx}-${cIdx}`}
                    x={12 + cIdx * 22}
                    y={35 + rIdx * 28}
                    width="15"
                    height="17"
                    rx="2"
                    fill={color}
                    opacity={color === '#1e293b' ? 0.35 : 0.85}
                  />
                ))
              )}

              {/* Antenna Mast & Wireless Radio Waves */}
              <line x1="42" y1="20" x2="42" y2="-10" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="42" cy="-10" r="3.5" fill="#38bdf8" filter="url(#dashGlow)" />
              <path d="M 32 -18 A 12 12 0 0 1 52 -18" fill="none" stroke="#38bdf8" strokeWidth="1.5" className="animate-pulse" />
              <path d="M 25 -25 A 22 22 0 0 1 59 -25" fill="none" stroke="#06b6d4" strokeWidth="1.5" className="animate-pulse" />

              <text x="42" y="228" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold" letterSpacing="1.5">
                SMART FACILITY
              </text>
            </g>

            {/* 6. Timeline Axis Marks */}
            <line x1="40" y1="280" x2="880" y2="280" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="6 4" />
            <text x="60" y="300" fill="#64748b" fontSize="8.5" fontFamily="monospace">00:00 BASELINE</text>
            <text x="320" y="300" fill="#64748b" fontSize="8.5" fontFamily="monospace">08:00 INGESTION</text>
            <text x="490" y="300" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
              14:00 (PEAK LOAD)
            </text>
            <g transform="translate(680, 300)">
              <circle cx="0" cy="-3" r="2.5" fill="#10b981" />
              <circle cx="0" cy="-3" r="5" fill="#10b981" opacity="0.4" className="animate-ping" />
              <text x="10" y="0" fill="#2dd4bf" fontSize="8" fontFamily="monospace" fontWeight="bold">
                TELEMETRY ACTIVE
              </text>
            </g>
          </svg>

          {/* CSS for Conduit Flow */}
          <style>{`
            @keyframes conduitFlow {
              to {
                stroke-dashoffset: -36;
              }
            }
            .animate-conduit-flow {
              animation: conduitFlow 1.2s linear infinite;
            }
          `}</style>
        </div>

        {/* Live Grid Metrics Bar below visual */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-brand-borderSubtle">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-brand-borderSubtle">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Clean Power Ratio</span>
            <div className="text-base sm:text-lg font-extrabold text-emerald-500 font-mono mt-0.5">
              {cleanRatio}%
            </div>
            <span className="text-[10px] text-emerald-400">Self-Powered Grid</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-brand-borderSubtle">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Instant Renewable Feed</span>
            <div className="text-base sm:text-lg font-extrabold text-cyan-500 font-mono mt-0.5">
              {instantGen} MW
            </div>
            <span className="text-[10px] text-cyan-400">Solar + Wind Mix</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-brand-borderSubtle">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Facility Grid Demand</span>
            <div className="text-base sm:text-lg font-extrabold text-amber-500 font-mono mt-0.5">
              {gridDemand} MW
            </div>
            <span className="text-[10px] text-amber-400">Balanced Load</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-brand-borderSubtle">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Net Surplus Dispatch</span>
            <div className="text-base sm:text-lg font-extrabold text-teal-400 font-mono mt-0.5">
              +{netSurplus} MW
            </div>
            <span className="text-[10px] text-teal-300">BESS Stored / Export</span>
          </div>
        </div>

      </div>
    </Card>
  );
}
