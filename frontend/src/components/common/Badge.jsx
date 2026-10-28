import React from 'react';

export default function Badge({ variant = 'default', children, className = '' }) {
  const normalized = (typeof children === 'string' ? children.toLowerCase() : variant).trim();

  const variantStyles = {
    active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    resolved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    acknowledged: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    inactive: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-brand-borderSubtle',
    overdue: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    critical: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    error: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    new: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
    info: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-brand-border',
  };

  const selected = variantStyles[normalized] || variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${selected} ${className}`}
    >
      {children}
    </span>
  );
}
