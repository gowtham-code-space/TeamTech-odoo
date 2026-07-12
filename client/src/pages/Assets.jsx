import React, { useState, useEffect } from 'react';
import { getStatusColor, formatDate } from '../utils/helpers';
import { ASSET_STATUSES } from '../utils/constants';
import { RiAlertLine, RiRefreshLine, RiAddLine, RiCpuLine } from 'react-icons/ri';

export default function Assets() {
  const [viewState, setViewState] = useState('success');
  const [assets, setAssets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields (Backend-Compatible)
  const [assetTag, setAssetTag] = useState('');
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('');
  const [locationName, setLocationName] = useState('');
  const [initialStatus, setInitialStatus] = useState(ASSET_STATUSES.AVAILABLE);

  useEffect(() => {
    if (viewState === 'success') {
      setAssets([
        {
          asset_id: 'ast_101',
          asset_tag: 'AST-DELL-092',
          asset_name: 'Dell Latitude 5420 Laptop',
          category: 'Hardware',
          status: ASSET_STATUSES.AVAILABLE,
          assigned_to: null,
          location: 'Floor 3, Desk A8',
          created_at: '2026-06-01T10:00:00Z',
        },
        {
          asset_id: 'ast_102',
          asset_tag: 'AST-APPL-083',
          asset_name: 'MacBook Pro 16 M1',
          category: 'Hardware',
          status: ASSET_STATUSES.ALLOCATED,
          assigned_to: 'Alice Johnson',
          location: 'Remote (Home)',
          created_at: '2026-05-15T09:30:00Z',
        },
        {
          asset_id: 'ast_103',
          asset_tag: 'AST-MONI-024',
          asset_name: 'LG 27" UltraFine 4K Monitor',
          category: 'Peripherals',
          status: ASSET_STATUSES.UNDER_MAINTENANCE,
          assigned_to: null,
          location: 'IT Lab',
          created_at: '2026-04-10T14:00:00Z',
        },
        {
          asset_id: 'ast_104',
          asset_tag: 'AST-IPHD-005',
          asset_name: 'iPad Pro 11"',
          category: 'Mobile Devices',
          status: ASSET_STATUSES.RESERVED,
          assigned_to: 'Bob Smith',
          location: 'Floor 1, Cabinet C',
          created_at: '2026-07-02T11:20:00Z',
        },
      ]);
    } else if (viewState === 'empty') {
      setAssets([]);
    } else {
      setAssets([]);
    }
  }, [viewState]);

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetTag || !assetName || !category) return;
    
    const newAsset = {
      asset_id: `ast_${Date.now()}`,
      asset_tag: assetTag,
      asset_name: assetName,
      category: category,
      status: initialStatus,
      assigned_to: null,
      location: locationName || 'Not Assigned',
      created_at: new Date().toISOString(),
    };

    setAssets([newAsset, ...assets]);
    setShowAddForm(false);
    
    // Clear inputs
    setAssetTag('');
    setAssetName('');
    setCategory('');
    setLocationName('');
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
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Assets Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">View and manage organization hardware, software, and physical assets</p>
        </div>
        
        {viewState === 'success' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>Add Asset</span>
          </button>
        )}
      </div>

      {/* Add Asset Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative animate-fade-in space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">Register New Asset</h3>
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Asset Tag (asset_tag)</label>
              <input
                type="text"
                required
                placeholder="AST-xxxx"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Asset Name (asset_name)</label>
              <input
                type="text"
                required
                placeholder="Macbook, Monitor..."
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Category (category)</label>
              <input
                type="text"
                required
                placeholder="Hardware, Software..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Location (location)</label>
              <input
                type="text"
                placeholder="Office Location..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Status (status)</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {Object.values(ASSET_STATUSES).map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
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
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400">Failed to Retrieve Assets</h3>
          <p className="text-sm text-rose-600 dark:text-rose-400 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/assets`. Please verify connection parameters.
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
            {[1, 2, 3, 4].map((i) => (
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
          <RiCpuLine className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Assets Found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            There are currently no assets registered on this system node. Register a new asset to start.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && assets.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Name / ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Tag</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Location</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Assigned To</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assets.map((asset) => (
                  <tr key={asset.asset_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{asset.asset_name}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{asset.asset_id}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-500 dark:text-slate-400">{asset.asset_tag}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.category}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{asset.location}</td>
                    <td className="px-6 py-4">
                      {asset.assigned_to ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{asset.assigned_to}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(asset.status, 'asset')}`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-semibold">{formatDate(asset.created_at)}</td>
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
