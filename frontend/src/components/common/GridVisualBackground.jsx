import React from 'react';

/**
 * Universal Ambient Smart Grid Visual Background
 * Renders an active, high-tech renewable-energy grid visual across every page:
 * - Animated electrical conduits & transmission bus-lines
 * - Flowing power current packets traveling along circuit paths
 * - Pulsing smart grid substations & telemetry sensor nodes
 * - Smooth sinusoidal AC power wave harmonics
 * - Ascending clean energy photon particles
 */
export default function GridVisualBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-50/80 dark:bg-[#070e1c] transition-colors duration-300"
    >
      {/* 1. Coordinate Dot Matrix */}
      <div
        className="absolute inset-0 opacity-40 dark:opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.22) 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* 2. Atmospheric Ambient Energy Radiance */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/12 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-cyan-500/10 dark:bg-cyan-500/12 rounded-full blur-[150px] animate-pulse-slower" />
      <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-teal-500/8 dark:bg-emerald-600/10 rounded-full blur-[130px]" />

      {/* 3. Full-Viewport Smart Grid Vector Circuits */}
      <svg
        className="absolute inset-0 w-full h-full opacity-65 dark:opacity-75"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="gridEnergyGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="gridEnergyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
            <stop offset="30%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="energyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= TRANSMISSION BUS-BAR CONDUITS ================= */}
        {/* Horizontal Upper Bus-bar */}
        <line
          x1="0"
          y1="140"
          x2="1440"
          y2="140"
          stroke="url(#gridEnergyGrad1)"
          strokeWidth="1.2"
          strokeDasharray="6 14"
          className="animate-flow-right"
        />

        {/* Horizontal Mid Grid Conduits */}
        <line
          x1="0"
          y1="420"
          x2="1440"
          y2="420"
          stroke="url(#gridEnergyGrad1)"
          strokeWidth="1.4"
          strokeDasharray="12 16"
          className="animate-flow-right"
        />
        <line
          x1="0"
          y1="700"
          x2="1440"
          y2="700"
          stroke="url(#gridEnergyGrad1)"
          strokeWidth="1.2"
          strokeDasharray="8 12"
          className="animate-flow-left"
        />

        {/* Vertical Distribution Feeders */}
        <line
          x1="220"
          y1="0"
          x2="220"
          y2="900"
          stroke="url(#gridEnergyGrad2)"
          strokeWidth="1.2"
          strokeDasharray="8 14"
          className="animate-flow-down"
        />
        <line
          x1="720"
          y1="0"
          x2="720"
          y2="900"
          stroke="url(#gridEnergyGrad2)"
          strokeWidth="1.5"
          strokeDasharray="12 18"
          className="animate-flow-down"
        />
        <line
          x1="1220"
          y1="0"
          x2="1220"
          y2="900"
          stroke="url(#gridEnergyGrad2)"
          strokeWidth="1.2"
          strokeDasharray="8 14"
          className="animate-flow-up"
        />

        {/* ================= FLOWING AC POWER FREQUENCY WAVE ================= */}
        <path
          d="M0 640 C240 600, 380 720, 600 660 C820 600, 960 740, 1180 670 C1300 630, 1380 650, 1440 640"
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="2.5"
          strokeDasharray="14 10"
          className="animate-flow-wave"
          filter="url(#energyGlow)"
        />

        {/* Secondary Harmonic Wave */}
        <path
          d="M0 680 C260 720, 420 610, 680 670 C940 730, 1080 620, 1440 680"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.2"
          strokeDasharray="8 8"
          opacity="0.45"
          className="animate-flow-left"
        />

        {/* ================= ELECTRIC PULSE PACKETS TRAVELING ON CONDUITS ================= */}
        {/* Packet 1: Traversing Mid Bus-bar */}
        <circle r="4" fill="#34d399" filter="url(#intenseGlow)">
          <animate
            attributeName="cx"
            from="-50"
            to="1490"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="420;420;420"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Packet 2: Offset packet on upper bus-bar */}
        <circle r="3.5" fill="#38bdf8" filter="url(#intenseGlow)">
          <animate
            attributeName="cx"
            from="-50"
            to="1490"
            begin="2.5s"
            dur="7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="140;140;140"
            begin="2.5s"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Packet 3: Traversing Central Feeder vertically */}
        <circle r="3.5" fill="#10b981" filter="url(#intenseGlow)">
          <animate
            attributeName="cx"
            values="720;720;720"
            dur="5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            from="-30"
            to="930"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Packet 4: Gliding on the power sine wave */}
        <circle r="4.5" fill="#06b6d4" filter="url(#intenseGlow)">
          <animateMotion
            path="M0 640 C240 600, 380 720, 600 660 C820 600, 960 740, 1180 670 C1300 630, 1380 650, 1440 640"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ================= SMART GRID SUBSTATION NODES ================= */}
        {/* Node A (220, 140) */}
        <g transform="translate(220, 140)">
          <circle r="12" fill="#10b981" opacity="0.15" className="animate-radar-ring" />
          <circle r="5" fill="#06b6d4" opacity="0.4" />
          <circle r="2.5" fill="#34d399" />
        </g>

        {/* Node B (720, 140) */}
        <g transform="translate(720, 140)">
          <circle r="14" fill="#06b6d4" opacity="0.15" className="animate-radar-ring-delayed" />
          <circle r="6" fill="#10b981" opacity="0.4" />
          <circle r="2.5" fill="#38bdf8" />
        </g>

        {/* Node C (1220, 140) */}
        <g transform="translate(1220, 140)">
          <circle r="10" fill="#10b981" opacity="0.15" className="animate-radar-ring" />
          <circle r="4" fill="#10b981" opacity="0.4" />
          <circle r="2" fill="#34d399" />
        </g>

        {/* Central Core Substation Node (720, 420) */}
        <g transform="translate(720, 420)">
          <circle r="22" fill="#10b981" opacity="0.12" className="animate-radar-ring" />
          <circle r="14" fill="#06b6d4" opacity="0.2" className="animate-radar-ring-delayed" />
          <circle r="7" fill="#10b981" opacity="0.5" filter="url(#energyGlow)" />
          <circle r="3.5" fill="#ffffff" />
        </g>

        {/* Node D (220, 420) */}
        <g transform="translate(220, 420)">
          <circle r="12" fill="#06b6d4" opacity="0.15" className="animate-radar-ring-delayed" />
          <circle r="5" fill="#06b6d4" opacity="0.4" />
          <circle r="2.5" fill="#38bdf8" />
        </g>

        {/* Node E (1220, 420) */}
        <g transform="translate(1220, 420)">
          <circle r="12" fill="#10b981" opacity="0.15" className="animate-radar-ring" />
          <circle r="5" fill="#10b981" opacity="0.4" />
          <circle r="2.5" fill="#34d399" />
        </g>

        {/* Node F (720, 700) */}
        <g transform="translate(720, 700)">
          <circle r="14" fill="#38bdf8" opacity="0.15" className="animate-radar-ring" />
          <circle r="6" fill="#06b6d4" opacity="0.4" />
          <circle r="2.5" fill="#ffffff" />
        </g>
      </svg>

      {/* 4. Floating Ascending Energy Photons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: '15%', delay: '0s', dur: '12s', size: 'w-2 h-2', color: 'bg-emerald-400' },
          { left: '28%', delay: '3s', dur: '14s', size: 'w-1.5 h-1.5', color: 'bg-cyan-400' },
          { left: '45%', delay: '6s', dur: '11s', size: 'w-2 h-2', color: 'bg-teal-300' },
          { left: '62%', delay: '1.5s', dur: '13s', size: 'w-1.5 h-1.5', color: 'bg-emerald-300' },
          { left: '80%', delay: '4.5s', dur: '15s', size: 'w-2 h-2', color: 'bg-sky-400' },
          { left: '92%', delay: '7s', dur: '12s', size: 'w-1.5 h-1.5', color: 'bg-emerald-400' },
        ].map((pt, i) => (
          <div
            key={i}
            className={`absolute bottom-[-20px] ${pt.size} ${pt.color} rounded-full opacity-60 shadow-sm shadow-emerald-400/50 animate-photon-rise`}
            style={{
              left: pt.left,
              animationDuration: pt.dur,
              animationDelay: pt.delay,
            }}
          />
        ))}
      </div>

      {/* CSS Keyframe Animations */}
      <style>{`
        @keyframes flowRight {
          to { stroke-dashoffset: -96; }
        }
        .animate-flow-right {
          animation: flowRight 3.2s linear infinite;
        }

        @keyframes flowLeft {
          to { stroke-dashoffset: 96; }
        }
        .animate-flow-left {
          animation: flowLeft 3.6s linear infinite;
        }

        @keyframes flowDown {
          to { stroke-dashoffset: -96; }
        }
        .animate-flow-down {
          animation: flowDown 3.4s linear infinite;
        }

        @keyframes flowUp {
          to { stroke-dashoffset: 96; }
        }
        .animate-flow-up {
          animation: flowUp 3.4s linear infinite;
        }

        @keyframes flowWave {
          to { stroke-dashoffset: -96; }
        }
        .animate-flow-wave {
          animation: flowWave 2.8s linear infinite;
        }

        @keyframes radarPing {
          0% { r: 4; opacity: 0.8; }
          75%, 100% { r: 24; opacity: 0; }
        }
        .animate-radar-ring {
          animation: radarPing 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .animate-radar-ring-delayed {
          animation: radarPing 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.2s;
        }

        @keyframes photonRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-105vh) scale(1.3);
            opacity: 0;
          }
        }
        .animate-photon-rise {
          animation-name: photonRise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.08; }
          50% { transform: scale(1.12); opacity: 0.16; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 9s ease-in-out infinite;
        }

        @keyframes pulseSlower {
          0%, 100% { transform: scale(1.1); opacity: 0.14; }
          50% { transform: scale(0.95); opacity: 0.07; }
        }
        .animate-pulse-slower {
          animation: pulseSlower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
