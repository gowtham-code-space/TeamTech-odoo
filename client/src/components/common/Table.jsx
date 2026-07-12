import React from 'react';
import { RiArrowUpSLine, RiArrowDownSLine, RiInboxLine } from 'react-icons/ri';

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  onRowClick = null,
  sortColumn = '',
  sortDirection = '',
  onSort = null,
  pagination = null, // { currentPage, totalPages, onPageChange, limit, totalItems }
  className = '',
}) {
  
  const handleHeaderClick = (col) => {
    if (col.sortable !== false && onSort && col.accessor) {
      onSort(col.accessor);
    }
  };

  return (
    <div className={`w-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-colors duration-200 ${className}`}>
      {/* Table responsive wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 select-none">
            <tr>
              {columns.map((col, index) => {
                const isSortable = col.sortable !== false && onSort && col.accessor;
                const isCurrentSort = sortColumn === col.accessor;

                return (
                  <th
                    key={col.accessor || index}
                    onClick={() => isSortable && handleHeaderClick(col)}
                    className={`px-6 py-4 font-semibold uppercase tracking-wider text-[10px] ${
                      isSortable ? 'cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="text-slate-400">
                          {isCurrentSort ? (
                            sortDirection === 'asc' ? (
                              <RiArrowUpSLine className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                            ) : (
                              <RiArrowDownSLine className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                            )
                          ) : (
                            <div className="flex flex-col -space-y-1">
                              <RiArrowUpSLine className="w-3 h-3 opacity-40" />
                              <RiArrowDownSLine className="w-3 h-3 opacity-40" />
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Loading State Skeleton Rows */}
            {loading ? (
              Array.from({ length: pagination?.limit || 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4.5">
                      <div className="h-4 bg-slate-100 rounded w-5/6" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              /* Empty State Row */
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <RiInboxLine className="w-12 h-12 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Data Rows */
              data.map((row, rIdx) => {
                const rowId = row.id || row.asset_id || row.booking_id || row.request_id || row.dept_id || row.audit_id || row.report_id || rIdx;
                return (
                  <tr
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row, rIdx)}
                    className={`transition-colors ${
                      onRowClick 
                        ? 'hover:bg-slate-50/70 cursor-pointer' 
                        : 'hover:bg-slate-50/30'
                    }`}
                  >
                    {columns.map((col, cIdx) => {
                      const value = col.accessor ? row[col.accessor] : undefined;
                      return (
                        <td key={col.accessor || cIdx} className="px-6 py-4">
                          {col.render ? col.render(row, value, rIdx) : (value ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component bar */}
      {!loading && pagination && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-500 select-none">
          {/* Info Details */}
          <div>
            {pagination.totalItems !== undefined ? (
              <span>
                Showing{' '}
                <span className="font-bold text-slate-700">
                  {Math.min((pagination.currentPage - 1) * pagination.limit + 1, pagination.totalItems)}
                </span>{' '}
                to{' '}
                <span className="font-bold text-slate-700">
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}
                </span>{' '}
                of <span className="font-bold text-slate-700">{pagination.totalItems}</span> entries
              </span>
            ) : (
              <span>
                Page <span className="font-bold text-slate-700">{pagination.currentPage}</span> of{' '}
                <span className="font-bold text-slate-700">{pagination.totalPages}</span>
              </span>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed text-slate-600"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
