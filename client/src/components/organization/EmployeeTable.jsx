import React from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import { Edit, Trash2 } from 'lucide-react';

/**
 * Inline status badge for employee records.
 * @param {Object} props
 * @param {string} props.status
 */
const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase().trim();
  const styles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    suspended: 'bg-amber-50 text-amber-700 border-amber-200',
    terminated: 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const cls = styles[norm] || 'bg-slate-50 text-slate-700 border-slate-200';
  const label =
    norm === 'active'
      ? 'Active'
      : norm === 'suspended'
      ? 'Suspended'
      : norm === 'terminated'
      ? 'Terminated'
      : status || 'Unknown';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider select-none ${cls}`}
    >
      {label}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * EmployeeTable Component
 * Renders the employee directory using the shared Table component.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.employees - List of employee objects from the API
 * @param {boolean} props.loading - Table loading skeleton state
 * @param {Object} props.pagination - Pagination config for the Table
 * @param {Function} props.onEdit - Triggered when the Edit button is clicked
 * @param {Function} props.onDelete - Triggered when the Delete button is clicked
 * @param {string} [props.sortColumn] - Current active sort column accessor
 * @param {string} [props.sortDirection] - Current sort direction ('asc' | 'desc')
 * @param {Function} [props.onSort] - Callback to handle column sort changes
 */
export default function EmployeeTable({
  employees,
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
      header: 'Employee Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 truncate">{row.name}</span>
          {row.email && (
            <span className="text-xs text-slate-400 font-medium truncate">{row.email}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      sortable: false,
      render: (row) => (
        <span className="text-slate-600 font-medium text-sm">
          {row.phone || '-'}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      render: (row) => (
        <span className="text-slate-650 font-medium">
          {row.department?.name || row.department_name || '-'}
        </span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          {row.role || '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || 'active'} />,
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
            title="Edit Employee"
          >
            <Edit className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Employee"
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
      data={employees}
      loading={loading}
      emptyMessage="No employees found. Click 'Add Employee' to register one."
      pagination={pagination}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={onSort}
    />
  );
}

EmployeeTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
      phone: PropTypes.string,
      department: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
      }),
      department_name: PropTypes.string,
      role: PropTypes.string,
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
