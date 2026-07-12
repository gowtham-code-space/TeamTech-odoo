import React, { useState, useEffect } from 'react';
import { RiAlertLine, RiRefreshLine, RiBuilding4Line, RiAddLine } from 'react-icons/ri';

export default function Organization() {
  const [viewState, setViewState] = useState('success');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (viewState === 'success') {
      setDepartments([
        { dept_id: 'dept_01', dept_name: 'Engineering', head: 'John Doe', count: 42, budget: '$45,000' },
        { dept_id: 'dept_02', dept_name: 'Human Resources', head: 'Alice Johnson', count: 12, budget: '$15,000' },
        { dept_id: 'dept_03', dept_name: 'Product Design', head: 'Bob Smith', count: 8, budget: '$20,000' },
      ]);
    } else if (viewState === 'empty') {
      setDepartments([]);
    } else {
      setDepartments([]);
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
                  ? 'bg-indigo-650 text-white shadow-md'
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Organization Structure</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage departments, view headcount, and monitor asset allocation budgets</p>
        </div>
        
        {viewState === 'success' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>Create Department</span>
          </button>
        )}
      </div>

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Organization Structure</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/departments`. Please verify connection parameters.
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

      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiBuilding4Line className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Departments Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no departments registered under your organization. Create one to begin.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && departments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department Head</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Employee Count</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.dept_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{dept.dept_id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{dept.dept_name}</td>
                    <td className="px-6 py-4 text-slate-700">{dept.head}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{dept.count} members</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{dept.budget}</td>
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
