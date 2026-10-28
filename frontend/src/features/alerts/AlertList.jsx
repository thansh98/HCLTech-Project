import React from 'react';
import { Card, Table, Badge } from '../../components/common';
import { formatDateTime } from '../../utils/formatters';

export default function AlertList({ alerts, loading, onAcknowledge, onResolve }) {
  const columns = [
    {
      key: 'severity',
      header: 'Severity',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'message',
      header: 'Alert Message',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{val}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
            {row.facility_name ? `${row.facility_name}` : ''}
            {row.meter_code ? ` &bull; Meter ${row.meter_code}` : ''}
          </span>
        </div>
      ),
    },
    {
      key: 'generated_at',
      header: 'Triggered At',
      render: (val) => <span className="text-slate-700 dark:text-slate-300">{formatDateTime(val)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          {row.status === 'new' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(row.id)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 bg-amber-500/10 rounded border border-amber-500/20"
            >
              Acknowledge
            </button>
          )}
          {row.status !== 'resolved' && onResolve && (
            <button
              onClick={() => onResolve(row.id)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20"
            >
              Resolve
            </button>
          )}
          {row.status === 'resolved' && (
            <span className="text-xs text-slate-500">Completed</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title="Threshold Breaches & Security Alerts"
      subtitle="Abnormal power spikes, threshold violations, and incident response history"
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading alerts...
        </div>
      ) : (
        <Table
          columns={columns}
          data={alerts}
          emptyMessage="No alerts triggered. System operating within normal parameters."
        />
      )}
    </Card>
  );
}
