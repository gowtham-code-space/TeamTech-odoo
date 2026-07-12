import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BOOKING_STATUS_COLORS } from '../../constants/booking.constants';

/**
 * BookingCalendar Component
 * Renders month, week and day grid views of bookings with highlights.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.bookings - Booking records from backend
 * @param {boolean} props.loading - Calendar loading state indicator
 * @param {Function} props.onSelectSlot - Callback when empty slot clicked (starts creation)
 * @param {Function} props.onSelectBooking - Callback when event clicked (shows details)
 * @param {Function} props.onRangeChange - Syncs range boundaries back to API queries
 */
export default function BookingCalendar({
  bookings = [],
  loading = false,
  onSelectSlot,
  onSelectBooking,
  onRangeChange,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month | week | day

  // Calculates active dates on date navigation or view changes
  useEffect(() => {
    let start, end;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (view === 'month') {
      start = new Date(year, month, 1).toISOString();
      end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    } else if (view === 'week') {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 0); // start on Monday
      const monday = new Date(currentDate.setDate(diff));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      start = monday.toISOString();
      end = sunday.toISOString();
    } else {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);
      start = dayStart.toISOString();
      end = dayEnd.toISOString();
    }

    onRangeChange(start, end);
  }, [currentDate, view, onRangeChange]);

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (view === 'month') next.setMonth(next.getMonth() - 1);
      else if (view === 'week') next.setDate(next.getDate() - 7);
      else next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (view === 'month') next.setMonth(next.getMonth() + 1);
      else if (view === 'week') next.setDate(next.getDate() + 7);
      else next.setDate(next.getDate() + 1);
      return next;
    });
  };

  // Month View Calculations
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();

    const days = [];
    // padding for previous month offset
    const offset = firstDay === 0 ? 6 : firstDay - 1; // start week on Monday
    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysCount; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  // Check if a date has events
  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((b) => b.booking_date?.startsWith(dateStr));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-6">
      {/* Calendar Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {currentDate.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
                ...(view === 'day' ? { day: 'numeric' } : {}),
              })}
            </h2>
            <p className="text-xs text-slate-400 font-medium capitalize mt-0.5">{view} View active</p>
          </div>
        </div>

        {/* Navigation & Views */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Prev/Next Buttons */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={handlePrev}
              className="p-2.5 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <button
              onClick={handleNext}
              className="p-2.5 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  view === v
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-400 font-semibold text-sm">
          Loading calendar schedules...
        </div>
      )}

      {/* Grid renderings */}
      {!loading && view === 'month' && (
        <div className="space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((day, idx) => {
              const events = getEventsForDate(day);
              const isToday = day && day.toDateString() === new Date().toDateString();

              return (
                <div
                  key={idx}
                  onClick={() => day && onSelectSlot(day.toISOString().split('T')[0])}
                  className={`min-h-[100px] border rounded-xl p-2 flex flex-col justify-between transition-all select-none cursor-pointer ${
                    day
                      ? 'border-slate-150 bg-slate-50/20 hover:bg-slate-50/70 hover:border-slate-300'
                      : 'border-transparent bg-transparent pointer-events-none'
                  } ${isToday ? 'border-indigo-400 shadow-sm ring-1 ring-indigo-400/25 bg-indigo-50/10' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-xs font-bold ${isToday ? 'text-indigo-650' : 'text-slate-500'}`}>
                        {day.getDate()}
                      </span>

                      {/* Display small dots / strips for events */}
                      <div className="space-y-1 mt-2">
                        {events.slice(0, 3).map((evt) => {
                          const statusCls = BOOKING_STATUS_COLORS[evt.status?.toLowerCase()] || 'bg-slate-50 text-slate-700';
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectBooking(evt);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold truncate border ${statusCls}`}
                            >
                              {evt.resource?.name || evt.resource_name || 'Booking'}
                            </div>
                          );
                        })}
                        {events.length > 3 && (
                          <div className="text-[8px] text-slate-400 font-bold text-center">
                            +{events.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View Grid */}
      {!loading && view === 'week' && (
        <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-150">
          {/* Days headers */}
          <div className="grid grid-cols-7 bg-slate-50 divide-x divide-slate-150">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date(currentDate);
              const currentDay = day.getDay();
              const diff = day.getDate() - currentDay + (currentDay === 0 ? -6 : 0) + i;
              const date = new Date(day.setDate(diff));
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={i}
                  onClick={() => onSelectSlot(date.toISOString().split('T')[0])}
                  className={`p-3 text-center cursor-pointer hover:bg-slate-100/60 ${isToday ? 'bg-indigo-50/20' : ''}`}
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {date.toLocaleDateString(undefined, { weekday: 'short' })}
                  </p>
                  <p className={`text-sm font-extrabold mt-0.5 ${isToday ? 'text-indigo-650' : 'text-slate-700'}`}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Events list per day */}
          <div className="grid grid-cols-7 divide-x divide-slate-150 min-h-[300px] bg-slate-50/10">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date(currentDate);
              const currentDay = day.getDay();
              const diff = day.getDate() - currentDay + (currentDay === 0 ? -6 : 0) + i;
              const date = new Date(day.setDate(diff));
              const events = getEventsForDate(date);

              return (
                <div key={i} className="p-2 space-y-2">
                  {events.map((evt) => {
                    const statusCls = BOOKING_STATUS_COLORS[evt.status?.toLowerCase()] || 'bg-slate-50 text-slate-700';
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectBooking(evt)}
                        className={`p-2 rounded-xl text-[10px] font-bold border space-y-1 cursor-pointer transition-transform hover:scale-102 ${statusCls}`}
                      >
                        <p className="truncate">{evt.resource?.name || evt.resource_name || 'Resource'}</p>
                        <p className="text-[8px] opacity-70">
                          {evt.start_time} - {evt.end_time}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View Grid */}
      {!loading && view === 'day' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-650">Schedules for Today</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectSlot(currentDate.toISOString().split('T')[0])}
            >
              Add Booking
            </Button>
          </div>

          <div className="divide-y divide-slate-150 border border-slate-150 rounded-xl overflow-hidden bg-slate-50/10">
            {getEventsForDate(currentDate).length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm font-semibold">
                No bookings scheduled for this date. Click Add Booking to create one.
              </div>
            ) : (
              getEventsForDate(currentDate).map((evt) => {
                const statusCls = BOOKING_STATUS_COLORS[evt.status?.toLowerCase()] || 'bg-slate-50 text-slate-700';
                return (
                  <div
                    key={evt.id}
                    onClick={() => onSelectBooking(evt)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">
                        {evt.resource?.name || evt.resource_name}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Booked by {evt.employee?.name || evt.employee_name || 'Employee'} • {evt.purpose || 'No Purpose'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-slate-600">
                        {evt.start_time} - {evt.end_time}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider select-none ${statusCls}`}>
                        {evt.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

BookingCalendar.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      booking_date: PropTypes.string.isRequired,
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      status: PropTypes.string,
      resource_name: PropTypes.string,
      resource: PropTypes.shape({ name: PropTypes.string }),
      employee_name: PropTypes.string,
      employee: PropTypes.shape({ name: PropTypes.string }),
      purpose: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  onSelectSlot: PropTypes.func.isRequired,
  onSelectBooking: PropTypes.func.isRequired,
  onRangeChange: PropTypes.func.isRequired,
};
