import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Clock, User, Briefcase, FileText, Info, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/helpers';

export default function BookingDetails({ booking, loading, error, onBack }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Failed to load booking</h3>
        <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
        <Button variant="secondary" onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  if (!booking) return null;

  const durationStr = () => {
    if (!booking.start_time || !booking.end_time) return '-';
    const start = new Date(booking.start_time);
    const end = new Date(booking.end_time);
    const diff = (end - start) / (1000 * 60 * 60); // in hours
    return `${diff.toFixed(1)} hours`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-800">
                Booking #{booking.booking_id || booking.id || booking._id}
              </h2>
              <StatusBadge status={booking.status} type="booking" />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Created on {formatDate(booking.created_at)}
            </p>
          </div>
        </div>
        <StatusBadge 
          status={booking.priority} 
          type="priority" 
          className="uppercase tracking-wider"
        />
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Details */}
        <div className="space-y-8">
          
          {/* Resource & Department */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Resource Details
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Resource Name</p>
                <p className="text-sm font-semibold text-slate-800">
                  {booking.resource?.name || booking.resource_name || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Department</p>
                <p className="text-sm font-semibold text-slate-800">
                  {booking.department?.name || booking.department_name || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Booked By
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1">Employee Name</p>
              <p className="text-sm font-semibold text-slate-800">
                {booking.employee?.first_name 
                  ? `${booking.employee.first_name} ${booking.employee.last_name || ''}`
                  : booking.employee_name || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Time & Purpose */}
        <div className="space-y-8">
          
          {/* Schedule */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Start Time
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(booking.start_time)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> End Time
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(booking.end_time)}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                <p className="text-xs text-slate-500 font-medium mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Duration
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {durationStr()}
                </p>
              </div>
            </div>
          </div>

          {/* Purpose & Remarks */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Additional Information
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Purpose</p>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {booking.purpose || '-'}
                </p>
              </div>
              {booking.remarks && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium mb-1">Remarks</p>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {booking.remarks}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BookingDetails.propTypes = {
  booking: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};
