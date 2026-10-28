import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#0a1128] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold focus:ring-emerald-500 shadow-md shadow-emerald-500/20',
    secondary: 'bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold focus:ring-sky-500 shadow-md shadow-sky-500/20',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold focus:ring-red-500',
    outline: 'border border-brand-border hover:bg-slate-100 dark:hover:bg-[#16234b] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white focus:ring-emerald-500',
    ghost: 'hover:bg-slate-100 dark:hover:bg-[#16234b] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 min-h-[36px] text-xs',
    md: 'px-4 py-2 min-h-[42px] text-sm',
    lg: 'px-6 py-2.5 min-h-[48px] text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}
