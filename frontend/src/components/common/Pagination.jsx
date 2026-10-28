import React from 'react';
import Button from './Button';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 20,
  onPageChange,
  hasNext = false,
  hasPrevious = false,
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalPages <= 1 && !hasNext && !hasPrevious) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-brand-borderSubtle bg-brand-surface/40 text-xs text-slate-600 dark:text-slate-400 rounded-b-xl transition-colors duration-200">
      <div>
        Showing page <span className="font-semibold text-slate-900 dark:text-slate-200">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{totalPages}</span>
        {totalItems > 0 && <span> ({totalItems} total items)</span>}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          disabled={!hasPrevious && currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!hasNext && currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
