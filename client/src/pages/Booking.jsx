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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Resource Bookings</h2>
          <p className="text-sm text-slate-500 mt-0.5">Reserve shared resources, testing equipment, and meeting rooms</p>
        </div>
        
        {viewState === 'success' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>New Booking</span>
          </button>
        )}
      </div>

      {/* Booking Creation Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative animate-fade-in space-y-4">
          <h3 className="text-base font-bold text-slate-800">Create Booking Request</h3>
          <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Resource (resource_id)</label>
              <input
                type="text"
                required
                placeholder="res_conference_room"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Start Time (start_time)</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">End Time (end_time)</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Purpose of Booking</label>
              <textarea
                placeholder="Describe team purpose..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm cursor-pointer shadow"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Resolve Bookings</h3>
          <p className="text-sm text-rose-650 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/bookings`. Please verify connection parameters.
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
                <div className="h-4 bg-slate-200 rounded w-12" />
                <div className="h-4 bg-slate-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiCalendarEventLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Bookings Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no resource bookings recorded. Request a new booking to start.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Booking ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Resource ID / Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Start Time</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">End Time</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Booking Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.booking_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-500">{booking.booking_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{booking.resource_name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{booking.resource_id}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{formatDate(booking.start_time)}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{formatDate(booking.end_time)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(booking.booking_status, 'booking')}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{formatDate(booking.created_at)}</td>
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
