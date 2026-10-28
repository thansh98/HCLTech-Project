import React from 'react';
import { Card, Table, Badge, Button } from '../../components/common';
import { formatNumber } from '../../utils/formatters';

export default function ThresholdList({ thresholds, loading, onAddNew }) {
  const columns = [
    {
      key: 'metric',
      header: 'Rule Target',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white capitalize">{val}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block">
            {row.facility_name ? `${row.facility_name} ${row.meter_code ? `(${row.meter_code})` : ''}` : 'All Managed Facilities'}
          </span>
        </div>
      ),
    },
    {
      key: 'operator',
      header: 'Condition',
      render: (val) => (
        <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-brand-border text-slate-700 dark:text-slate-300">
          {val === 'gt' ? '> Greater Than' : val === 'gte' ? '>= Greater/Equal' : '< Less Than'}
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Trigger Value',
      render: (val) => <span className="font-bold text-slate-900 dark:text-slate-200">{formatNumber(val)}</span>,
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'active',
      header: 'State',
      render: (val) => (
        <span className={`text-xs font-semibold ${val ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
          {val ? 'Active' : 'Disabled'}
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Configured Threshold Rules"
      subtitle="Automated conditions evaluated against smart meter telemetry"
      action={
        onAddNew && (
          <Button size="sm" onClick={onAddNew}>
            + New Rule
          </Button>
        )
      }
    >
      {loading ? (
        <div className="py-6 text-center text-slate-400 text-xs animate-pulse">
          Loading thresholds...
        </div>
      ) : (
        <Table
          columns={columns}
          data={thresholds}
          emptyMessage="No threshold rules configured yet. Create one to enable automated alert detection."
        />
      )}
    </Card>
  );
}
