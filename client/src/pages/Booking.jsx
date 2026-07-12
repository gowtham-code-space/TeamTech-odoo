import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, List, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import useBooking from '../hooks/useBooking';
import BookingTable from '../components/booking/BookingTable';
import BookingForm from '../components/booking/BookingForm';
import BookingDetails from '../components/booking/BookingDetails';
import BookingCalendar from '../components/booking/BookingCalendar';

export default function Booking() {
  const [view, setView] = useState('list'); // list, calendar, form, details
  const [mode, setMode] = useState('create'); // create, edit
  
  const {
    bookings,
    loading,
    error,
    pagination,
    setPagination,
    sort,
    setSort,
    calendarBookings,
    calendarLoading,
    currentBooking,
    setCurrentBooking,
    detailsLoading,
    detailsError,
    resources,
    fetchBookings,
    fetchBookingById,
    fetchCalendarBookings,
    fetchResources,
    addBooking,
    editBooking,
    undoBooking,
  } = useBooking();

  useEffect(() => {
    fetchBookings();
    fetchResources({ limit: 100 });
  }, [fetchBookings, fetchResources]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchBookings({ page: newPage });
  };

  const handleSort = (column) => {
    const isAsc = sort.column === column && sort.direction === 'asc';
    const newSort = { column, direction: isAsc ? 'desc' : 'asc' };
    setSort(newSort);
    fetchBookings({ sort: newSort.column, order: newSort.direction });
  };

  const handleCreate = () => {
    setMode('create');
    setCurrentBooking(null);
    setView('form');
  };

  const handleEdit = (booking) => {
    setMode('edit');
    setCurrentBooking(booking);
    setView('form');
  };

  const handleView = async (booking) => {
    setView('details');
    const id = booking.booking_id || booking.id || booking._id;
    if (id) {
      await fetchBookingById(id);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const id = booking.booking_id || booking.id || booking._id;
      await undoBooking(id, { status: 'cancelled' });
    }
  };

  const handleFormSubmit = async (data) => {
    if (mode === 'create') {
      await addBooking(data);
    } else {
      const id = currentBooking.booking_id || currentBooking.id || currentBooking._id;
      await editBooking(id, data);
    }
    setView('list');
  };

  const handleFormCancel = () => {
    setView('list');
    setCurrentBooking(null);
  };

  const renderContent = () => {
    if (view === 'form') {
      return (
        <BookingForm
          initialData={currentBooking}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={loading}
          error={error}
          resources={resources}
        />
      );
    }

    if (view === 'details') {
      return (
        <BookingDetails
          booking={currentBooking}
          loading={detailsLoading}
          error={detailsError}
          onBack={() => setView('list')}
        />
      );
    }

    if (view === 'calendar') {
      return (
        <BookingCalendar
          bookings={calendarBookings}
          loading={calendarLoading}
          onSelectSlot={() => handleCreate()}
          onSelectBooking={(b) => handleView(b)}
          fetchBookings={fetchCalendarBookings}
        />
      );
    }

    return (
      <BookingTable
        bookings={bookings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        sort={sort}
        onSort={handleSort}
        onView={handleView}
        onEdit={handleEdit}
        onCancel={handleCancelBooking}
      />
    );
  };

  const pageActions = view === 'list' || view === 'calendar' ? (
    <div className="flex items-center gap-3">
      <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === 'list'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <List className="w-4 h-4" />
          <span>List</span>
        </button>
        <button
          onClick={() => setView('calendar')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            view === 'calendar'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendar</span>
        </button>
      </div>
      <Button variant="primary" onClick={handleCreate} className="gap-1.5">
        <Plus className="w-4 h-4" />
        New Booking
      </Button>
    </div>
  ) : null;

  return (
    <div className="p-6">
      <PageHeader
        title="Resource Booking"
        subtitle="Manage resource reservations and schedules"
        breadcrumbs={[
          { label: 'Resource Booking', path: '/bookings' },
        ]}
        actions={pageActions}
      />
      
      {renderContent()}
    </div>
  );
}
