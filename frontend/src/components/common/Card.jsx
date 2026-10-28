import React from 'react';

export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = '',
}) {
  return (
    <div className={`bg-brand-surface border border-brand-border rounded-2xl shadow-sm dark:shadow-lg overflow-hidden transition-colors duration-200 ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-brand-borderSubtle flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            {title && <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="self-end sm:self-auto">{action}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
