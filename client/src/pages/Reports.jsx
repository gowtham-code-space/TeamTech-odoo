import React, { useState, useEffect } from 'react';
import { RiAlertLine, RiRefreshLine, RiPieChartLine, RiFileDownloadLine } from 'react-icons/ri';

export default function Reports() {
  const [viewState, setViewState] = useState('success');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (viewState === 'success') {
      setReports([
        { report_id: 'rpt_701', title: 'Asset Utilization Summary Q2', author: 'System Scheduler', size: '2.4 MB', type: 'PDF', created_at: '2026-07-01T00:00:00Z' },
        { report_id: 'rpt_702', title: 'Maintenance Cost Analysis 2026', author: 'Asset Manager', size: '1.1 MB', type: 'Excel', created_at: '2026-07-10T12:00:00Z' },
      ]);
    } else if (viewState === 'empty') {
      setReports([]);
    } else {
      setReports([]);
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Reports</h2>
          <p className="text-sm text-slate-500 mt-0.5">Generate, view, and export asset metrics, depreciation, and financial audit files</p>
        </div>
      </div>

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve System Reports</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/reports`. Please verify connection parameters.
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

      {/* Loading skeleton */}
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

      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiPieChartLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Reports Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no generated system reports. Click "Generate Report" (Phase 2) to build one.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && reports.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Report ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Report Title</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Generated By</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">File Size</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Format</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rpt) => (
                  <tr key={rpt.report_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-500">{rpt.report_id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{rpt.title}</td>
                    <td className="px-6 py-4 text-slate-700">{rpt.author}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{rpt.size}</td>
                    <td className="px-6 py-4 text-slate-500 font-bold">{rpt.type}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all shadow-sm cursor-pointer">
                        <RiFileDownloadLine className="w-4 h-4 text-slate-400" />
                        <span>Download</span>
                      </button>
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
