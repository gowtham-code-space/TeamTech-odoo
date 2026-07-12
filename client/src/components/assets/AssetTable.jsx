import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import { Eye, Edit, History, Trash2 } from 'lucide-react';
import { LIFECYCLE_STATUS_COLORS, CONDITION_COLORS } from '../../constants/asset.constants';
import { capitalize } from '../../utils/helpers';

/**
 * Status badge with ERP styles.
 */
const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase().trim();
  const cls = LIFECYCLE_STATUS_COLORS[norm] || 'bg-slate-50 text-slate-700 border-slate-200';
  const label = norm.replace(/_/g, ' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider select-none ${cls}`}>
      {label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * Condition badge with custom styles.
 */
const ConditionBadge = ({ condition }) => {
  const norm = (condition || '').toLowerCase().trim();
  const cls = CONDITION_COLORS[norm] || 'bg-slate-50 text-slate-700 border-slate-100';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize select-none ${cls}`}>
      {norm}
    </span>
  );
};

ConditionBadge.propTypes = {
  condition: PropTypes.string.isRequired,
};

/**
 * AssetTable Component
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.assets - List of assets
 * @param {boolean} props.loading - Loading skeleton state
 * @param {Object} props.pagination - Pagination configuration
 * @param {Function} props.onView - Callback when viewing asset details
 * @param {Function} props.onEdit - Callback when editing asset details
 * @param {Function} props.onHistory - Callback when viewing asset history timeline
 * @param {Function} props.onDelete - Callback when deleting asset
 * @param {string} props.sortColumn - Current active sort column
 * @param {string} props.sortDirection - Current active sort direction ('asc' | 'desc')
 * @param {Function} props.onSort - Sorting callback
 */
export default function AssetTable({
  assets,
  loading,
  pagination,
  onView,
  onEdit,
  onHistory,
  onDelete,
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
          {row.asset_tag || '-'}
        </span>
      ),
    },
    {
      header: 'Asset Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 text-sm truncate">{row.name}</span>
          {row.serial_number && (
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">SN: {row.serial_number}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 font-medium text-xs">
          {row.category?.name || row.category_name || '-'}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 font-semibold text-xs">
          {row.department?.name || row.department_name || '-'}
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: 'location',
      sortable: true,
      render: (row) => (
        <span className="text-slate-500 font-medium text-xs">
          {row.location?.name || row.location_name || row.location || '-'}
        </span>
      ),
    },
    {
      header: 'Condition',
      accessor: 'condition',
      sortable: true,
      render: (row) => (
        row.condition ? <ConditionBadge condition={row.condition} /> : '-'
      ),
    },
    {
      header: 'Lifecycle Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || 'available'} />,
    },
    {
      header: 'Assigned To',
      accessor: 'assigned_to',
      sortable: true,
      render: (row) => (
        <span className="text-slate-650 font-bold text-xs">
          {row.assigned_to?.name || row.assigned_to_name || row.assigned_to || '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-indigo-650 hover:text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer"
            title="Edit Asset"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onHistory(row)}
            className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-all cursor-pointer"
            title="View History Timeline"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg text-rose-650 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Asset"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={assets}
      loading={loading}
      emptyMessage="No assets registered in the database. Use 'Add Asset' to create one."
      pagination={pagination}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

AssetTable.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      asset_tag: PropTypes.string,
      name: PropTypes.string.isRequired,
      serial_number: PropTypes.string,
      category: PropTypes.shape({ name: PropTypes.string }),
      category_name: PropTypes.string,
      department: PropTypes.shape({ name: PropTypes.string }),
      department_name: PropTypes.string,
      location: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string }),
      ]),
      location_name: PropTypes.string,
      condition: PropTypes.string,
      status: PropTypes.string,
      assigned_to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string }),
      ]),
      assigned_to_name: PropTypes.string,
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
  onEdit: PropTypes.func.isRequired,
  onHistory: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
};
