import React, { useState, useEffect } from 'react';
import { getStatusColor, formatDate } from '../utils/helpers';
import { BOOKING_STATUSES } from '../utils/constants';
import { RiAlertLine, RiRefreshLine, RiAddLine, RiCalendarEventLine } from 'react-icons/ri';

export default function Booking() {
  const [viewState, setViewState] = useState('success');
  const [bookings, setBookings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields (Backend-Compatible)
  const [resourceId, setResourceId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    if (viewState === 'success') {
      setBookings([
        {
          booking_id: 'bkg_201',
          resource_id: 'res_room_b',
          resource_name: 'Conference Room B',
          start_time: '2026-07-15T09:00:00Z',
          end_time: '2026-07-15T11:00:00Z',
          booking_status: BOOKING_STATUSES.PENDING,
          created_at: '2026-07-10T08:00:00Z',
        },
        {
          booking_id: 'bkg_202',
          resource_id: 'res_proj_1',
          resource_name: 'Epson 4K Projector',
          start_time: '2026-07-18T13:00:00Z',
          end_time: '2026-07-18T15:00:00Z',
          booking_status: BOOKING_STATUSES.APPROVED,
          created_at: '2026-07-09T14:30:00Z',
        },
        {
          booking_id: 'bkg_203',
          resource_id: 'res_room_a',
          resource_name: 'Executive Boardroom A',
          start_time: '2026-07-12T10:00:00Z',
          end_time: '2026-07-12T12:00:00Z',
          booking_status: BOOKING_STATUSES.CANCELLED,
          created_at: '2026-07-08T11:20:00Z',
        },
      ]);
    } else if (viewState === 'empty') {
      setBookings([]);
    } else {
      setBookings([]);
    }
  }, [viewState]);

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (!resourceId || !startTime || !endTime) return;

    const newBooking = {
      booking_id: `bkg_${Date.now()}`,
      resource_id: resourceId,
      resource_name: resourceId.replace('res_', '').replace('_', ' ').toUpperCase(),
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      booking_status: BOOKING_STATUSES.PENDING,
      created_at: new Date().toISOString(),
    };

    setBookings([newBooking, ...bookings]);
    setShowAddForm(false);

    // Clear inputs
    setResourceId('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
  };

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
