import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

/**
 * Renders a custom badge for status indicator.
 * @param {Object} props
 * @param {string} props.status
 */
const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase().trim();
  if (norm === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider select-none bg-emerald-50 text-emerald-700 border-emerald-200">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider select-none bg-rose-50 text-rose-700 border-rose-200">
      Inactive
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * DepartmentTable Component
 * Renders department records using the shared Table component.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.departments - List of department objects
 * @param {boolean} props.loading - Table loading state
 * @param {Object} props.pagination - Pagination details
 * @param {Function} props.onEdit - Callback when editing a department
 * @param {Function} props.onDelete - Callback when deleting a department
 * @param {Function} props.onToggleStatus - Callback when toggling status (activate/deactivate)
 * @param {string} props.sortColumn - Current sorted column accessor
 * @param {string} props.sortDirection - Current sort direction (asc/desc)
 * @param {Function} props.onSort - Callback when a column is sorted
 */
export default function DepartmentTable({
  departments,
  loading,
  pagination,
  onEdit,
  onDelete,
  onToggleStatus,
  sortColumn,
  sortDirection,
  onSort,
}) {
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: false,
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {row.id || '-'}
        </span>
      ),
    },
    {
      header: 'Department Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-800">
          {row.name}
        </span>
      ),
    },
    {
      header: 'Department Head',
      accessor: 'head',
      sortable: true,
      render: (row) => (
        <span className="text-slate-650 font-medium">
          {row.head || '-'}
        </span>
      ),
    },
    {
      header: 'Parent Department',
      accessor: 'parent_name',
      sortable: false,
      render: (row) => (
        <span className="text-slate-500 font-medium text-xs">
          {row.parent?.name || row.parent_name || '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || 'inactive'} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {row.status === 'active' ? (
            <button
              onClick={() => onToggleStatus(row, 'inactive')}
              className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
              title="Deactivate Department"
            >
              <XCircle className="w-[18px] h-[18px]" />
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(row, 'active')}
              className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
              title="Activate Department"
            >
              <CheckCircle className="w-[18px] h-[18px]" />
            </button>
          )}
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit Department"
          >
            <Edit className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Department"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={departments}
      loading={loading}
      emptyMessage="No departments registered. Click 'Add Department' to create one."
      pagination={pagination}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

DepartmentTable.propTypes = {
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      head: PropTypes.string,
      parent_name: PropTypes.string,
      parent: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
      }),
      status: PropTypes.string,
      description: PropTypes.string,
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
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
};
