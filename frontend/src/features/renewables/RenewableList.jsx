import React from 'react';
import { Card, Table, Button } from '../../components/common';
import { formatNumber, formatDateTime } from '../../utils/formatters';

export default function RenewableList({ records, loading, onAddNew, onDelete }) {
  const columns = [
    {
      key: 'source_type',
      header: 'Source',
      render: (val) => (
        <span className="font-semibold text-slate-900 dark:text-white capitalize flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
          <span>{val}</span>
        </span>
      ),
    },
    {
      key: 'facility',
      header: 'Facility',
      render: (_, row) => (
        <span>{row.facility_name || `Facility #${row.facility}`}</span>
      ),
    },
    {
      key: 'record_time',
      header: 'Timestamp',
      render: (val) => <span className="text-slate-700 dark:text-slate-300">{formatDateTime(val)}</span>,
    },
    {
      key: 'generated_energy',
      header: 'Energy Generated',
      render: (val, row) => (
        <span className="font-bold text-brand-primary">
          {formatNumber(val, 2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{row.unit}</span>
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
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
      title="Clean Energy Generation Logs"
      subtitle="Solar panels, wind turbines, and on-site renewable generation records"
      action={
        onAddNew && (
          <Button size="sm" onClick={onAddNew}>
            + Log Generation
          </Button>
        )
      }
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading renewable records...
        </div>
      ) : (
        <Table
          columns={columns}
          data={records}
          emptyMessage="No renewable generation logs found. Click Log Generation to record clean power."
        />
      )}
    </Card>
  );
}
