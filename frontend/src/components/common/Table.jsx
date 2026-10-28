import React from 'react';

export default function Table({
  columns = [],
  data = [],
  keyField = 'id',
  emptyMessage = 'No records found.',
  className = '',
}) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-brand-surface/40 rounded-xl border border-brand-borderSubtle">
        <svg className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {/* Mobile scroll hint */}
      <div className="sm:hidden flex items-center justify-end text-[10px] text-slate-500 dark:text-slate-400 mb-1.5 px-1">
        <span>Scroll horizontally &rarr;</span>
      </div>

      <div className={`w-full overflow-x-auto rounded-xl border border-brand-border bg-brand-surface/60 shadow-sm dark:shadow-md ${className}`}>
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[580px] sm:min-w-full">
          <thead className="bg-brand-surface text-slate-800 dark:text-slate-200 border-b border-brand-border text-xs uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-4 py-3.5 font-semibold whitespace-nowrap ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-borderSubtle">
            {data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                className="hover:bg-slate-100/70 dark:hover:bg-[#16234b]/60 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`px-4 py-3.5 text-xs sm:text-sm ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
