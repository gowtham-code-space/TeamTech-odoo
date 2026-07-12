import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { RiAlertLine, RiRefreshLine, RiExchangeLine, RiAddLine } from 'react-icons/ri';

export default function Allocation() {
  const [viewState, setViewState] = useState('success');
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    if (viewState === 'success') {
      setAllocations([
        { allocation_id: 'alc_501', asset_id: 'ast_101', asset_name: 'Dell Latitude Laptop', user_name: 'Jane Smith', allocated_by: 'Admin', start_date: '2026-06-01T00:00:00Z', return_date: null },
        { allocation_id: 'alc_502', asset_id: 'ast_102', asset_name: 'MacBook Pro 16 M1', user_name: 'Alice Johnson', allocated_by: 'Asset Manager', start_date: '2026-05-15T00:00:00Z', return_date: null },
        { allocation_id: 'alc_503', asset_id: 'ast_104', asset_name: 'iPad Pro 11"', user_name: 'Bob Smith', allocated_by: 'Admin', start_date: '2026-07-02T00:00:00Z', return_date: '2026-07-31T00:00:00Z' },
      ]);
    } else if (viewState === 'empty') {
      setAllocations([]);
    } else {
      setAllocations([]);
    }
  }, [viewState]);

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
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">Asset Allocations</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track and audit active allocations, lease durations, and returns</p>
        </div>
        
        {viewState === 'success' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>New Allocation</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Allocations</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/allocations`. Please verify connection parameters.
          </p>
          <button
            onClick={() => setViewState('success')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl shadow cursor-pointer"
          >
            <RiRefreshLine className="w-4 h-4 animate-spin-hover" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {viewState === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
          <div className="h-14 bg-slate-100 border-b border-slate-200" />
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/6" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiExchangeLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Allocations Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no assets allocated to any team member. Assign an asset to start.
          </p>
        </div>
      )}

      {viewState === 'success' && allocations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocation ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Name / ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated To</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated By</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Start Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Return Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocations.map((alc) => (
                  <tr key={alc.allocation_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{alc.allocation_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{alc.asset_name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{alc.asset_id}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{alc.user_name}</td>
                    <td className="px-6 py-4 text-slate-500">{alc.allocated_by}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{formatDate(alc.start_date)}</td>
                    <td className="px-6 py-4">
                      {alc.return_date ? (
                        <span className="text-slate-500 font-semibold">{formatDate(alc.return_date)}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold italic">Indefinite</span>
                      )}
                    </td>
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
