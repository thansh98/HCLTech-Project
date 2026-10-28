import React from 'react';
import { Card, Table, Badge, Button } from '../../components/common';

export default function FacilityList({ facilities, loading, onEdit, onDelete, onAddNew }) {
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">{val}</span>
          {row.location_description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.location_description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (val) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'meters_count',
      header: 'Meters',
      render: (val) => <span>{val ?? 0}</span>,
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
      title="Managed Facilities"
      subtitle="Active sites and campuses tracking energy telemetry"
      action={
        onAddNew && (
          <Button size="sm" onClick={onAddNew}>
            + Add Facility
          </Button>
        )
      }
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading facilities...
        </div>
      ) : (
        <Table
          columns={columns}
          data={facilities}
          emptyMessage="No facilities registered yet. Add one to get started."
        />
      )}
    </Card>
  );
}
