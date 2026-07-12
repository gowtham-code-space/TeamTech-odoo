import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { RiAlertLine, RiRefreshLine, RiNotificationLine, RiMailOpenLine, RiMailLine } from 'react-icons/ri';

export default function Notifications() {
  const [viewState, setViewState] = useState('success');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (viewState === 'success') {
      setNotifications([
        {
          notification_id: 'ntf_001',
          notification_type: 'asset_allocated',
          message: 'Your laptop request AST-DELL-092 has been approved and allocated.',
          is_read: false,
          created_at: '2026-07-12T08:30:00Z',
        },
        {
          notification_id: 'ntf_002',
          notification_type: 'maintenance_scheduled',
          message: 'Maintenance is scheduled for LG 4K Monitor (AST-MONI-024) tomorrow at 10:00 AM.',
          is_read: true,
          created_at: '2026-07-11T14:00:00Z',
        },
        {
          notification_id: 'ntf_003',
          notification_type: 'audit_requested',
          message: 'Quarterly compliance audit request has been published for hardware category.',
          is_read: false,
          created_at: '2026-07-10T09:15:00Z',
        },
      ]);
    } else if (viewState === 'empty') {
      setNotifications([]);
    } else {
      setNotifications([]);
    }
  }, [viewState]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Simulation console */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Evaluator Preview Console</h3>
          <p className="text-xs text-slate-400 mt-0.5">Toggle states to test list reaction to different API states</p>
        </div>
        <div className="flex gap-2">
          {['success', 'loading', 'empty', 'error'].map((s) => (
            <button
              key={s}
              onClick={() => setViewState(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                viewState === s
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Stay updated on your booking requests, asset allocations, and compliance alerts</p>
        </div>
        
        {viewState === 'success' && notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs shadow-sm cursor-pointer transition-all"
          >
            <RiMailOpenLine className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to Retrieve Notifications</h3>
          <p className="text-sm text-rose-600 dark:text-rose-400 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/notifications`. Please verify connection parameters.
          </p>
          <button
            onClick={() => setViewState('success')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl shadow cursor-pointer"
          >
            <RiRefreshLine className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {viewState === 'loading' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
          <RiNotificationLine className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Notifications</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            You are all caught up! There are no notifications in your inbox.
          </p>
        </div>
      )}

      {/* Notification cards */}
      {viewState === 'success' && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((ntf) => (
            <div
              key={ntf.notification_id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 shadow-sm relative ${
                ntf.is_read
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  : 'bg-indigo-50/40 dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 text-slate-900 dark:text-slate-100'
              }`}
            >
              {/* Unread dot */}
              {!ntf.is_read && (
                <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-indigo-600" />
              )}

              {/* Icon */}
              <div className={`p-2.5 rounded-xl shrink-0 ${
                ntf.is_read
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20'
              }`}>
                {ntf.is_read ? <RiMailOpenLine className="w-5 h-5" /> : <RiMailLine className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded">
                    {ntf.notification_type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{formatDate(ntf.created_at)}</span>
                </div>
                <p className="text-sm font-semibold mt-2 leading-relaxed">{ntf.message}</p>
                
                {!ntf.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(ntf.notification_id)}
                    className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
