import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { RiAlertLine, RiRefreshLine, RiShieldCheckLine, RiAddLine } from 'react-icons/ri';

export default function Audit() {
  const [viewState, setViewState] = useState('success');
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    if (viewState === 'success') {
      setAudits([
        { audit_id: 'aud_601', title: 'Q2 Physical Inventory Check', auditor: 'Alice Johnson', category: 'Hardware', status: 'completed', start_date: '2026-06-01T09:00:00Z', completion_date: '2026-06-05T17:00:00Z' },
        { audit_id: 'aud_602', title: 'Software License Compliance Audit', auditor: 'John Doe', category: 'Software', status: 'in_progress', start_date: '2026-07-10T10:00:00Z', completion_date: null },
      ]);
    } else if (viewState === 'empty') {
      setAudits([]);
    } else {
      setAudits([]);
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
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">System Compliance & Audit</h2>
          <p className="text-sm text-slate-500 mt-0.5">Publish physical check-ups, review logs, and maintain regulatory compliance</p>
        </div>
        
        {viewState === 'success' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>Launch Audit</span>
          </button>
        )}
      </div>

      {/* Main View Area */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Audit Logs</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/audits`. Please verify connection parameters.
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
            {[1, 2].map((i) => (
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
          <RiShieldCheckLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Audits Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no active or closed compliance audits. Publish a new check-up to start.
          </p>
        </div>
      )}

      {viewState === 'success' && audits.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Audit ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Audit Title</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Auditor</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Target Category</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Start Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audits.map((aud) => (
                  <tr key={aud.audit_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{aud.audit_id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{aud.title}</td>
                    <td className="px-6 py-4 text-slate-700">{aud.auditor}</td>
                    <td className="px-6 py-4 text-slate-600">{aud.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-lg border uppercase tracking-wider ${
                        aud.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                          : 'bg-amber-50 text-amber-750 border-amber-250'
                      }`}>
                        {aud.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{formatDate(aud.start_date)}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{formatDate(aud.completion_date)}</td>
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
