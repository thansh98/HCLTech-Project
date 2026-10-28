import React from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import Badge from './Badge';

export default function RoleIdentityBanner({ className = '' }) {
  const { user } = useAuth();

  if (!user) return null;

  const roleMeta = {
    admin: {
      title: 'Enterprise Administrator',
      description: 'You possess full administrative authority across all facilities, telemetry meters, and organizational user accounts.',
      badgeVariant: 'critical',
      accessScope: 'Enterprise Platform Scope (Full Access)',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    manager: {
      title: 'Facility Operations Manager',
      description: 'You have operational management access scoped strictly to your assigned physical facilities and operational staff.',
      badgeVariant: 'warning',
      accessScope: 'Facility-Scoped Operations (Admin details restricted)',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    viewer: {
      title: 'Telemetry Viewer & Operator',
      description: 'You have read-only visibility into real-time telemetry metrics and your personal account profile.',
      badgeVariant: 'info',
      accessScope: 'Read-Only Telemetry (User management restricted)',
      icon: (
        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  };

  const meta = roleMeta[user.role] || roleMeta.viewer;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-sm dark:shadow-md transition-colors duration-200 mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {user.first_name || user.last_name
                  ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                  : user.username}
              </h2>
              <Badge variant={meta.badgeVariant}>{meta.title}</Badge>
              {user.is_email_verified && (
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{user.email}</span> &bull; {meta.description}
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto sm:text-right shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Active Privilege Scope</span>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{meta.accessScope}</span>
        </div>
      </div>
    </div>
  );
}
