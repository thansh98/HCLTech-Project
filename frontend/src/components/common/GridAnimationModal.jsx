import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Badge from './Badge';

export default function GridAnimationModal({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [solarBoost, setSolarBoost] = useState(false);
  const [windBoost, setWindBoost] = useState(false);
  const [demandSpike, setDemandSpike] = useState(false);
  const [telemetry, setTelemetry] = useState({
    solar: 6.1,
    wind: 4.2,
    hydro: 2.1,
    load: 8.7,
    battery: 84,
    savings: 14250,
  });

  // Animation cycle
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const solarBase = solarBoost ? 9.8 : 6.1;
        const windBase = windBoost ? 7.4 : 4.2;
        const loadBase = demandSpike ? 13.5 : 8.7;

        const jitter = (Math.random() - 0.5) * 0.2;
        const currentSolar = Math.max(1, +(solarBase + jitter).toFixed(2));
        const currentWind = Math.max(1, +(windBase + jitter).toFixed(2));
        const currentHydro = +(2.1 + (Math.random() - 0.5) * 0.1).toFixed(2);
        const currentLoad = Math.max(2, +(loadBase + jitter).toFixed(2));
        const totalGen = currentSolar + currentWind + currentHydro;
        const netFlow = totalGen - currentLoad;

        let newBattery = prev.battery;
        if (netFlow > 0) {
          newBattery = Math.min(100, +(prev.battery + 0.1 * simulationSpeed).toFixed(1));
        } else {
          newBattery = Math.max(15, +(prev.battery - 0.15 * simulationSpeed).toFixed(1));
        }

        const newSavings = Math.round(prev.savings + totalGen * 2.8 * simulationSpeed);

        return {
          solar: currentSolar,
          wind: currentWind,
          hydro: currentHydro,
          load: currentLoad,
          battery: newBattery,
          savings: newSavings,
        };
      });
    }, 800 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, simulationSpeed, solarBoost, windBoost, demandSpike]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalGeneration = +(telemetry.solar + telemetry.wind + telemetry.hydro).toFixed(2);
  const cleanEnergyRatio = Math.min(100, Math.round((totalGeneration / telemetry.load) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-5xl bg-[#0a1128] border border-brand-border rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-borderSubtle bg-brand-surface/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  GreenGrid Live Telemetry &amp; Power Flow Simulation
                </h3>
                <Badge variant="active">60 FPS Real-Time</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive IoT smart meter dispatch &bull; Real-time renewable grid balancing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close interactive simulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Interactive Canvas / SVG Graphic Arena */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Live Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-400 font-semibold block uppercase">Total Clean Generation</span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block">
                {totalGeneration} <span className="text-xs font-normal text-slate-400">MW</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
              <span className="text-[11px] text-cyan-400 font-semibold block uppercase">Active Grid Demand</span>
              <span className="text-2xl font-black text-cyan-300 mt-1 block">
                {telemetry.load} <span className="text-xs font-normal text-slate-400">MW</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[11px] text-amber-400 font-semibold block uppercase">Renewable Offset</span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">
                {cleanEnergyRatio}%
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
              <span className="text-[11px] text-purple-400 font-semibold block uppercase">Est. Utility Savings</span>
              <span className="text-2xl font-black text-purple-300 mt-1 block">
                ₹{telemetry.savings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* SVG Diagram with Pulsing Grid Flow */}
          <div className="relative rounded-2xl bg-[#070d1f] border border-brand-border p-4 sm:p-6 overflow-hidden">
            <svg
              viewBox="0 0 900 420"
              className="w-full h-auto max-h-[380px] drop-shadow-2xl select-none"
            >
              <defs>
                <linearGradient id="flowEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="flowCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="flowAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <filter id="glowEffect">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid Connection Lines with Animated Flow Dasharray */}
              {/* Solar -> Center */}
              <line
                x1="160"
                y1="90"
                x2="450"
                y2="210"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.85"
                filter="url(#glowEffect)"
              />
              {/* Wind -> Center */}
              <line
                x1="160"
                y1="210"
                x2="450"
                y2="210"
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.85"
                filter="url(#glowEffect)"
              />
              {/* Hydro -> Center */}
              <line
                x1="160"
                y1="330"
                x2="450"
                y2="210"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.85"
                filter="url(#glowEffect)"
              />

              {/* Center -> Commercial HQ */}
              <line
                x1="450"
                y1="210"
                x2="740"
                y2="90"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.9"
                filter="url(#glowEffect)"
              />
              {/* Center -> Industrial Hub */}
              <line
                x1="450"
                y1="210"
                x2="740"
                y2="210"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.9"
                filter="url(#glowEffect)"
              />
              {/* Center -> Residential Eco-Complex */}
              <line
                x1="450"
                y1="210"
                x2="740"
                y2="330"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeDasharray="8 6"
                className={isPlaying ? 'animate-dash' : ''}
                opacity="0.9"
                filter="url(#glowEffect)"
              />

              {/* ================= NODES ================= */}
              {/* 1. Solar Generation Node */}
              <g transform="translate(160, 90)">
                <circle r="46" fill="#101b3b" stroke="#f59e0b" strokeWidth="2.5" />
                <circle r="52" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                <text y="-8" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">☀️ Solar Array</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">{telemetry.solar} MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Photovoltaic</text>
              </g>

              {/* 2. Wind Farm Node */}
              <g transform="translate(160, 210)">
                <circle r="46" fill="#101b3b" stroke="#06b6d4" strokeWidth="2.5" />
                <circle r="52" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                <text y="-8" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">💨 Wind Turbines</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">{telemetry.wind} MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Offshore &amp; Hill</text>
              </g>

              {/* 3. Hydroelectric Dam Node */}
              <g transform="translate(160, 330)">
                <circle r="46" fill="#101b3b" stroke="#3b82f6" strokeWidth="2.5" />
                <circle r="52" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                <text y="-8" textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="bold">💧 Hydro Dam</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">{telemetry.hydro} MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Flow Telemetry</text>
              </g>

              {/* 4. Central Smart Grid Substation */}
              <g transform="translate(450, 210)">
                <circle r="68" fill="#16234b" stroke="#10b981" strokeWidth="3.5" filter="url(#glowEffect)" />
                <circle r="78" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin-slow" />
                <text y="-22" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="bold">GREENGRID HUB</text>
                <text y="0" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">{totalGeneration} MW</text>
                <text y="18" textAnchor="middle" fill="#94a3b8" fontSize="11">Net Inflow</text>
                <text y="34" textAnchor="middle" fill="#a7f3d0" fontSize="10">Battery {telemetry.battery}%</text>
              </g>

              {/* 5. Destination: Commercial Campus */}
              <g transform="translate(740, 90)">
                <circle r="46" fill="#101b3b" stroke="#10b981" strokeWidth="2.5" />
                <text y="-8" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold">🏢 Commercial HQ</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">4.8 MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Smart Meters 12</text>
              </g>

              {/* 6. Destination: Industrial Farm */}
              <g transform="translate(740, 210)">
                <circle r="46" fill="#101b3b" stroke="#06b6d4" strokeWidth="2.5" />
                <text y="-8" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">🏭 Industrial Hub</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">3.2 MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Smart Meters 8</text>
              </g>

              {/* 7. Destination: Residential Complex */}
              <g transform="translate(740, 330)">
                <circle r="46" fill="#101b3b" stroke="#8b5cf6" strokeWidth="2.5" />
                <text y="-8" textAnchor="middle" fill="#a78bfa" fontSize="13" fontWeight="bold">🏘️ Eco Residences</text>
                <text y="14" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">0.7 MW</text>
                <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">Smart Meters 24</text>
              </g>
            </svg>

            {/* Custom Animation CSS helper */}
            <style>{`
              @keyframes dashFlow {
                to {
                  stroke-dashoffset: -40;
                }
              }
              .animate-dash {
                animation: dashFlow 1.2s linear infinite;
              }
              @keyframes spinSlow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                transform-origin: center;
                animation: spinSlow 20s linear infinite;
              }
            `}</style>
          </div>

          {/* Interactive Control Deck */}
          <div className="p-4 rounded-2xl bg-brand-surface/60 border border-brand-borderSubtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Simulation Speed:</span>
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimulationSpeed(spd)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    simulationSpeed === spd
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="ml-2 border-brand-border text-slate-200"
              >
                {isPlaying ? '⏸ Pause Flow' : '▶ Resume Flow'}
              </Button>
            </div>

            {/* Quick Scenario Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSolarBoost(!solarBoost)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  solarBoost
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                ☀️ Solar Peak (+60%)
              </button>
              <button
                onClick={() => setWindBoost(!windBoost)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  windBoost
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                💨 Wind Surge (+75%)
              </button>
              <button
                onClick={() => setDemandSpike(!demandSpike)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  demandSpike
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                ⚡ Demand Spike (+50%)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-brand-borderSubtle bg-brand-surface/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            GreenGrid OS &bull; Telemetry Engine v2.0 Live Dispatch
          </span>
          <Button size="sm" onClick={onClose}>
            Close Simulation
          </Button>
        </div>
      </div>
    </div>
  );
}
