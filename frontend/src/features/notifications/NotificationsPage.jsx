import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from './notificationService';
import { Header } from '../../components/layout';
import { Button, Card, Badge, Loader, EmptyState } from '../../components/common';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'critical' | 'alerts'
  const navigate = useNavigate();

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'unread') return !item.is_read;
    if (activeTab === 'critical') return item.severity === 'critical';
    if (activeTab === 'alerts') return item.notification_type === 'energy_alert' || item.notification_type === 'threshold_exceeded';
    return true;
  });

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case 'critical':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <div>
      <Header
        title="Dashboard Notifications"
        subtitle="Real-time telemetry threshold events, meter status alerts, and operational messages."
        actions={
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkAllRead}
            >
              <svg className="w-4 h-4 mr-1.5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark All as Read
            </Button>
            <Button size="sm" onClick={loadNotifications}>
              Refresh
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: notifications.filter((n) => !n.is_read).length },
          { key: 'critical', label: 'Critical', count: notifications.filter((n) => n.severity === 'critical').length },
          { key: 'alerts', label: 'Alerts', count: notifications.filter((n) => n.notification_type === 'energy_alert' || n.notification_type === 'threshold_exceeded').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-brand-surface text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-brand-border'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-slate-900/40 text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card>
        {loading ? (
          <div className="py-12">
            <Loader text="Loading notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            title="No Notifications Found"
            description={
              activeTab === 'all'
                ? 'You are completely caught up! No active notifications recorded.'
                : `No notifications matching the "${activeTab}" filter.`
            }
          />
        ) : (
          <div className="divide-y divide-brand-borderSubtle">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.is_read ? 'hover:bg-slate-100 dark:hover:bg-[#16234b]/40' : 'bg-emerald-500/5 hover:bg-slate-100 dark:hover:bg-[#16234b]/70'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className="pt-0.5">
                    <Badge variant={getSeverityVariant(notif.severity)}>
                      {notif.severity}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-bold truncate ${notif.is_read ? 'text-slate-700 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-500">
                      <span>{formatDateTime(notif.created_at)}</span>
                      <span>&bull;</span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{formatRelativeTime(notif.created_at)}</span>
                      <span>&bull;</span>
                      <span className="capitalize">{notif.notification_type?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  {notif.related_link && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(notif.related_link)}
                    >
                      Open Target &rarr;
                    </Button>
                  )}
                  {!notif.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
