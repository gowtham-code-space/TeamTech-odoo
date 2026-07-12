import React from 'react';
import PropTypes from 'prop-types';
import { Eye, Edit2, XCircle } from 'lucide-react';
import Table from '../common/Table';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { BOOKING_STATUS } from '../../constants/booking.constants';

export default function BookingTable({
  bookings,
  loading,
  pagination,
  onPageChange,
  sort,
  onSort,
  onView,
  onEdit,
  onCancel,
}) {
  const columns = [
    {
      header: 'Booking ID',
      accessor: 'id',
      sortable: true,
    },
    {
      header: 'Resource',
      accessor: 'resource_name',
      sortable: true,
    },
    {
      header: 'Booked By',
      accessor: 'employee_name',
      sortable: true,
    },
    {
      header: 'Department',
      accessor: 'department_name',
      sortable: true,
    },
    {
      header: 'Start Date/Time',
      accessor: 'start_time',
      sortable: true,
    },
    {
      header: 'End Date/Time',
      accessor: 'end_time',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      sortable: false,
    },
  ];

  const tableData = bookings.map((booking) => ({
    ...booking,
    id: (
      <span className="font-medium text-slate-900">
        #{booking.booking_id || booking.id || booking._id}
      </span>
    ),
    resource_name: (
      <div className="flex items-center gap-2">
        <span className="font-medium text-slate-800">
          {booking.resource?.name || booking.resource_name || '-'}
        </span>
      </div>
    ),
    employee_name: (
      <span className="text-slate-600">
        {booking.employee?.first_name 
          ? `${booking.employee.first_name} ${booking.employee.last_name || ''}`
          : booking.employee_name || '-'}
      </span>
    ),
    department_name: (
      <span className="text-slate-600">
        {booking.department?.name || booking.department_name || '-'}
      </span>
    ),
    start_time: (
      <span className="text-slate-600">
        {formatDate(booking.start_time)}
      </span>
    ),
    end_time: (
      <span className="text-slate-600">
        {formatDate(booking.end_time)}
      </span>
    ),
    status: (
      <StatusBadge status={booking.status} type="booking" />
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(booking);
          }}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        {booking.status !== BOOKING_STATUS.CANCELLED && booking.status !== BOOKING_STATUS.COMPLETED && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(booking);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Booking"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancel(booking);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Cancel Booking"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    ),
  }));

  const paginationProps = {
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    limit: pagination.limit,
    totalItems: pagination.totalItems,
    onPageChange,
  };

  return (
    <Table
      columns={columns}
      data={tableData}
      loading={loading}
      emptyMessage="No bookings found."
      sortColumn={sort.column}
      sortDirection={sort.direction}
      onSort={onSort}
      pagination={paginationProps}
      onRowClick={onView}
    />
  );
}

BookingTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    limit: PropTypes.number,
    totalItems: PropTypes.number,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  sort: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
