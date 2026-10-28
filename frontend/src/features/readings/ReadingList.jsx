import React from 'react';
import { Card, Table, Badge, Button } from '../../components/common';
import { formatNumber, formatDateTime } from '../../utils/formatters';

export default function ReadingList({ readings, loading, onAddNew, onUploadCSV }) {
  const columns = [
    {
      key: 'meter_details',
      header: 'Meter',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">
            {val?.meter_code || `Meter #${row.meter}`}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            {val?.facility_name || 'Grid Site'}
          </span>
        </div>
      ),
    },
    {
      key: 'reading_time',
      header: 'Timestamp',
      render: (val) => <span className="text-slate-700 dark:text-slate-300">{formatDateTime(val)}</span>,
    },
    {
      key: 'value',
      header: 'Value',
      render: (val, row) => (
        <span className="font-bold text-brand-primary">
          {formatNumber(val, 2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{row.unit}</span>
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (val) => (
        <span className="text-xs capitalize bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-700 dark:text-slate-300 border border-brand-border">
          {val ? val.replace('_', ' ') : 'Manual'}
        </span>
      ),
    },
    {
      key: 'created_by_username',
      header: 'Recorded By',
      render: (val) => <span className="text-slate-500 dark:text-slate-400">{val || 'System Telemetry'}</span>,
    },
  ];

  return (
    <Card
      title="Energy Reading Telemetry"
      subtitle="Historical and real-time load measurements across smart meters"
      action={
        <div className="flex items-center space-x-2">
          {onUploadCSV && (
            <Button size="sm" variant="outline" onClick={onUploadCSV}>
              Import CSV
            </Button>
          )}
          {onAddNew && (
            <Button size="sm" onClick={onAddNew}>
              + Record Reading
            </Button>
          )}
        </div>
      }
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading readings...
        </div>
      ) : (
        <Table
          columns={columns}
          data={readings}
          emptyMessage="No energy readings recorded yet. Record a reading or import a CSV file."
        />
      )}
    </Card>
  );
}
