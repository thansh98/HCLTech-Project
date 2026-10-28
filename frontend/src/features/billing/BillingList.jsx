import React from 'react';
import { Card, Table, Badge, Button } from '../../components/common';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';

export default function BillingList({ bills, loading, onAddNew, onEdit, onDelete, onStatusChange }) {
  const columns = [
    {
      key: 'provider',
      header: 'Provider',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">{val}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            {row.facility_name || `Facility #${row.facility}`}
          </span>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Billing Period',
      render: (_, row) => (
        <span className="text-slate-700 dark:text-slate-300">
          {formatDate(row.period_start)} &rarr; {formatDate(row.period_end)}
        </span>
      ),
    },
    {
      key: 'units',
      header: 'Billed Units',
      render: (val) => <span>{formatNumber(val)} kWh</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(val)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          {row.status !== 'paid' && onStatusChange && (
            <button
              onClick={() => onStatusChange(row, 'paid')}
              className="text-xs text-brand-primary hover:text-emerald-300 font-medium p-1"
            >
              Mark Paid
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="text-xs text-brand-secondary hover:text-cyan-300 font-medium p-1"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row)}
              className="text-xs text-brand-critical hover:text-red-300 font-medium p-1"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Utility Billing & Energy Tariffs"
      subtitle="Monthly power invoices, statements, and payment status"
      action={
        onAddNew && (
          <Button size="sm" onClick={onAddNew}>
            + Record Bill
          </Button>
        )
      }
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading billing records...
        </div>
      ) : (
        <Table
          columns={columns}
          data={bills}
          emptyMessage="No billing records found. Click Record Bill to enter a utility invoice."
        />
      )}
    </Card>
  );
}
