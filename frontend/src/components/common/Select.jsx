import React, { useId } from 'react';

export default function Select({
  label,
  options = [],
  error,
  id,
  className = '',
  required = false,
  placeholder = 'Select an option',
  ...props
}) {
  const generatedId = useId();
  const selectId = id || props.name || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 min-h-[42px] bg-[var(--color-input-bg)] border rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:outline-none transition-all ${
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-brand-border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="" className="bg-[var(--color-input-bg)] text-slate-900 dark:text-slate-100">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--color-input-bg)] text-slate-900 dark:text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
}
