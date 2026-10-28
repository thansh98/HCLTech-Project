import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/common';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { ROUTES } from '../../constants';

export default function DashboardCards({ summary, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-900/60 rounded-xl border border-slate-800 animate-pulse p-6" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Renewable Contribution */}
      <Card className="border-t-2 border-t-brand-primary">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Clean Energy</span>
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {summary?.renewable_percentage || 0}%
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatNumber(summary?.total_renewable_kwh)} kWh generated
        </p>
      </Card>

      {/* 2. Total Consumption */}
      <Card className="border-t-2 border-t-brand-secondary">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Total Consumption</span>
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {formatNumber(summary?.total_consumption_kwh)} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">kWh</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Across {summary?.active_meters || 0} active meters
        </p>
      </Card>

      {/* 3. Utility Cost */}
      <Card className="border-t-2 border-t-amber-500">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Estimated Cost</span>
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {formatCurrency(summary?.total_cost || 0)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Billed & pending utility total</p>
      </Card>

      {/* 4. Active Alerts */}
      <Card className="border-t-2 border-t-brand-critical">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">Active Alerts</span>
          <span className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {summary?.active_alerts || 0}
        </div>
        <button
          onClick={() => navigate(ROUTES.ALERTS)}
          className="text-xs text-brand-critical hover:text-red-600 dark:hover:text-red-300 font-semibold mt-1 inline-flex items-center"
        >
          View alert details &rarr;
        </button>
      </Card>
    </div>
  );
}
