import React from 'react';
import { Card, Table, Badge, Button } from '../../components/common';

export default function MeterList({ meters, loading, onAddNew, onEdit, onDelete }) {
  const columns = [
    {
      key: 'meter_code',
      header: 'Meter Code',
      render: (val) => <span className="font-semibold text-slate-900 dark:text-white">{val}</span>,
    },
    {
      key: 'facility',
      header: 'Facility',
      render: (_, row) => (
        <span>{row.facility_details?.name || `Facility #${row.facility}`}</span>
      ),
    },
    {
      key: 'energy_type',
      header: 'Energy Type',
      render: (val) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'unit',
      header: 'Unit',
      render: (val) => <span className="text-slate-500 dark:text-slate-400">{val}</span>,
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
      title="Registered Smart Meters"
      subtitle="Hardware telemetry devices measuring consumption & generation"
      action={
        onAddNew && (
          <Button size="sm" onClick={onAddNew}>
            + Register Meter
          </Button>
        )
      }
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading meters...
        </div>
      ) : (
        <Table
          columns={columns}
          data={meters}
          emptyMessage="No meters registered. Click Register Meter to add your first device."
        />
      )}
    </Card>
  );
}
