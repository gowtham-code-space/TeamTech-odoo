import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import { Eye, ArrowRightLeft, CornerDownLeft, History } from 'lucide-react';
import { ALLOCATION_STATUS_COLORS } from '../../constants/allocation.constants';
import { LIFECYCLE_STATUS_COLORS } from '../../constants/asset.constants';
import { formatDate } from '../../utils/helpers';

/**
 * Allocation Status Badge
 */
const AllocationStatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase().trim();
  const cls = ALLOCATION_STATUS_COLORS[norm] || 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider select-none ${cls}`}>
      {norm}
    </span>
  );
};

AllocationStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * Asset Lifecycle Status Badge
 */
const LifecycleStatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase().trim();
  const cls = LIFECYCLE_STATUS_COLORS[norm] || 'bg-slate-50 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider select-none ${cls}`}>
      {norm.replace(/_/g, ' ')}
    </span>
  );
};

LifecycleStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * AllocationTable Component
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.allocations - List of allocation records
 * @param {boolean} props.loading - Table skeleton loader indicator
 * @param {Object} props.pagination - Pagination controls mapping
 * @param {Function} props.onView - View callback
 * @param {Function} props.onTransfer - Transfer callback
 * @param {Function} props.onReturn - Return callback
 * @param {Function} props.onHistory - Timeline history callback
 * @param {string} props.sortColumn - Active sort column
 * @param {string} props.sortDirection - Active sort direction ('asc' | 'desc')
 * @param {Function} props.onSort - Column sort callback
 */
export default function AllocationTable({
  allocations,
  loading,
  pagination,
  onView,
  onTransfer,
  onReturn,
  onHistory,
  sortColumn,
  sortDirection,
  onSort,
}) {
  const columns = [
    {
      header: 'Asset Tag',
      accessor: 'asset_tag',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-650 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {row.asset?.asset_tag || row.asset_tag || '-'}
        </span>
      ),
    },
    {
      header: 'Asset Name',
      accessor: 'asset_name',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-800 text-sm">
          {row.asset?.name || row.asset_name || '-'}
        </span>
      ),
    },
    {
      header: 'Allocated To',
      accessor: 'employee_name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 text-xs">
            {row.employee?.name || row.employee_name || '-'}
          </span>
          {row.employee?.email && (
            <span className="text-[10px] text-slate-400 font-medium truncate">{row.employee.email}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department_name',
      sortable: true,
      render: (row) => (
        <span className="text-slate-650 font-semibold text-xs">
          {row.department?.name || row.department_name || '-'}
        </span>
      ),
    },
    {
      header: 'Allocation Date',
      accessor: 'allocation_date',
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 text-xs font-semibold">
          {formatDate(row.allocation_date)}
        </span>
      ),
    },
    {
      header: 'Expected Return',
      accessor: 'expected_return_date',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 text-xs font-medium">
          {row.expected_return_date ? formatDate(row.expected_return_date) : 'No Date Set'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <AllocationStatusBadge status={row.status || 'active'} />,
    },
    {
      header: 'Lifecycle Status',
      accessor: 'asset_status',
      sortable: false,
      render: (row) => (
        <LifecycleStatusBadge status={row.asset?.status || row.asset_status || 'allocated'} />
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => {
        const isActive = (row.status || 'active').toLowerCase() === 'active';
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onView(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {isActive && (
              <>
                <button
                  onClick={() => onTransfer(row)}
                  className="p-1.5 rounded-lg text-indigo-650 hover:text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer"
                  title="Transfer Asset"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReturn(row)}
                  className="p-1.5 rounded-lg text-emerald-650 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
                  title="Return Asset"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => onHistory(row)}
              className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-all cursor-pointer"
              title="Allocation History"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={allocations}
      loading={loading}
      emptyMessage="No asset allocations active in this period."
      pagination={pagination}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

AllocationTable.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      asset_tag: PropTypes.string,
      asset_name: PropTypes.string,
      employee_name: PropTypes.string,
      department_name: PropTypes.string,
      allocation_date: PropTypes.string.isRequired,
      expected_return_date: PropTypes.string,
      status: PropTypes.string,
      asset_status: PropTypes.string,
      asset: PropTypes.shape({
        name: PropTypes.string,
        asset_tag: PropTypes.string,
        status: PropTypes.string,
      }),
      employee: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
      }),
      department: PropTypes.shape({
        name: PropTypes.string,
      }),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    limit: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
  }),
  onView: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
  onHistory: PropTypes.func.isRequired,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
};
