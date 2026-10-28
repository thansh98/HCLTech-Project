import React from 'react';
import { Card, Table, Badge } from '../../components/common';
import { formatDate } from '../../utils/formatters';

export default function UserList({ users, loading, onEditRole, currentUser }) {
  const columns = [
    {
      key: 'username',
      header: 'Username',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white">{val}</span>
          {row.id === currentUser?.id && (
            <span className="ml-2 text-[10px] text-emerald-600 dark:text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded border border-brand-primary/20 font-semibold">
              You
            </span>
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400 block">{row.email || 'No email specified'}</span>
        </div>
      ),
    },
    {
      key: 'first_name',
      header: 'Full Name',
      render: (_, row) => (
        <span className="text-slate-800 dark:text-slate-200">{`${row.first_name || ''} ${row.last_name || ''}`.trim() || '—'}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (val) => (
        <Badge variant={val === 'admin' ? 'critical' : val === 'manager' ? 'warning' : 'info'}>
          {val}
        </Badge>
      ),
    },
    {
      key: 'date_joined',
      header: 'Joined',
      render: (val) => <span className="text-slate-500 dark:text-slate-400 text-xs">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onEditRole(row)}
              className="text-xs text-brand-secondary hover:text-cyan-300 font-medium p-1"
            >
              Change Role
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card
      title={currentUser?.role === 'manager' ? 'Facility Manager Directory' : currentUser?.role === 'viewer' ? 'My Viewer Profile' : 'User Accounts & Permissions'}
      subtitle={currentUser?.role === 'manager' ? 'Verified facility managers in your operational tier' : currentUser?.role === 'viewer' ? 'Your personal access credentials' : 'Access control, roles, and administrative operator privileges'}
    >
      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          Loading user accounts...
        </div>
      ) : (
        <Table
          columns={columns}
          data={users}
          emptyMessage="No users registered in system."
        />
      )}
    </Card>
  );
}
