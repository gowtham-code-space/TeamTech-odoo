import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import { Edit, Trash2 } from 'lucide-react';

/**
 * Custom StatusBadge for asset categories.
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
 * CategoryTable Component
 * Renders category records using the shared Table component.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.categories - List of category objects
 * @param {boolean} props.loading - Table loading state
 * @param {Object} props.pagination - Pagination details
 * @param {Function} props.onEdit - Callback when editing a category
 * @param {Function} props.onDelete - Callback when deleting a category
 * @param {string} props.sortColumn - Current sorted column accessor
 * @param {string} props.sortDirection - Current sort direction (asc/desc)
 * @param {Function} props.onSort - Callback when a column is sorted
 */
export default function CategoryTable({
  categories,
  loading,
  pagination,
  onEdit,
  onDelete,
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
      header: 'Category Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-800">
          {row.name}
        </span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: false,
      render: (row) => (
        <span className="text-slate-650 font-medium max-w-xs truncate block">
          {row.description || '-'}
        </span>
      ),
    },
    {
      header: 'Warranty Period',
      accessor: 'warranty_period',
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-semibold">
          {row.warranty_period ? `${row.warranty_period} Months` : 'No Warranty'}
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
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Category"
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
      data={categories}
      loading={loading}
      emptyMessage="No categories registered. Click 'Create Category' to create one."
      pagination={pagination}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

CategoryTable.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      warranty_period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.string,
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
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func,
};
