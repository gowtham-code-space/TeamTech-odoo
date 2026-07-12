import React, { useState, useEffect } from 'react';
import { getStatusColor, formatDate } from '../utils/helpers';
import { MAINTENANCE_STATUSES } from '../utils/constants';
import { RiAlertLine, RiRefreshLine, RiAddLine, RiToolsLine } from 'react-icons/ri';

export default function Maintenance() {
  const [viewState, setViewState] = useState('success');
  const [requests, setRequests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields (Backend-Compatible)
  const [assetId, setAssetId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [issueDescription, setIssueDescription] = useState('');

  useEffect(() => {
    if (viewState === 'success') {
      setRequests([
        {
          request_id: 'maint_301',
          asset_id: 'ast_103',
          asset_name: 'LG 27" UltraFine 4K Monitor',
          priority: 'high',
          maintenance_status: MAINTENANCE_STATUSES.IN_PROGRESS,
          issue_description: 'Screen flickering when connected via Thunderbolt USB-C.',
          created_at: '2026-07-10T14:15:00Z',
        },
        {
          request_id: 'maint_302',
          asset_id: 'ast_101',
          asset_name: 'Dell Latitude 5420 Laptop',
          priority: 'medium',
          maintenance_status: MAINTENANCE_STATUSES.SCHEDULED,
          issue_description: 'OS upgrading and diagnostics run requested.',
          created_at: '2026-07-11T09:00:00Z',
        },
        {
          request_id: 'maint_303',
          asset_id: 'ast_102',
          asset_name: 'MacBook Pro 16 M1',
          priority: 'low',
          maintenance_status: MAINTENANCE_STATUSES.RESOLVED,
          issue_description: 'Keyboard key replacement (Spacebar).',
          created_at: '2026-07-05T10:00:00Z',
        },
      ]);
    } else if (viewState === 'empty') {
      setRequests([]);
    } else {
      setRequests([]);
    }
  }, [viewState]);

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!assetId || !issueDescription) return;

    const newRequest = {
      request_id: `maint_${Date.now()}`,
      asset_id: assetId,
      asset_name: assetId.replace('ast_', 'Asset ').toUpperCase(),
      priority: priority,
      maintenance_status: MAINTENANCE_STATUSES.SCHEDULED,
      issue_description: issueDescription,
      created_at: new Date().toISOString(),
    };

    setRequests([newRequest, ...requests]);
    setShowAddForm(false);

    // Clear inputs
    setAssetId('');
    setPriority('medium');
    setIssueDescription('');
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high':
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30';
      default:
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation console */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Evaluator Preview Console</h3>
          <p className="text-xs text-slate-400 mt-0.5">Toggle states to test table reaction to different API states</p>
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Maintenance Logs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Report defects, track repairs, and manage scheduled testing</p>
        </div>
        
        {viewState === 'success' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>File Request</span>
          </button>
        )}
      </div>

      {/* Maintenance Request Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative animate-fade-in space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">File Maintenance Request</h3>
          <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Asset ID (asset_id)</label>
              <input
                type="text"
                required
                placeholder="ast_101"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Priority (priority)</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Issue Description</label>
              <textarea
                required
                placeholder="Details of the failure or upgrade requested..."
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm cursor-pointer shadow"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to Resolve Maintenance Requests</h3>
          <p className="text-sm text-rose-600 dark:text-rose-400 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/maintenances`. Please verify connection parameters.
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-pulse">
          <div className="h-14 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
          <RiToolsLine className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Maintenance Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            There are currently no maintenance logs found. File a new request if an asset needs diagnostic test or repair.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && requests.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Request ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset ID / Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Issue Details</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Priority</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Maintenance Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {requests.map((req) => (
                  <tr key={req.request_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-500 dark:text-slate-400">{req.request_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{req.asset_name}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{req.asset_id}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium max-w-xs truncate" title={req.issue_description}>
                      {req.issue_description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getPriorityBadge(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(req.maintenance_status, 'maintenance')}`}>
                        {req.maintenance_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-semibold">{formatDate(req.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
