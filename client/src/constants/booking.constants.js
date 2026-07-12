export const BOOKING_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.UPCOMING]: 'bg-blue-50 text-blue-700 border-blue-200',
  [BOOKING_STATUS.ONGOING]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [BOOKING_STATUS.COMPLETED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [BOOKING_STATUS.CANCELLED]: 'bg-slate-100 text-slate-700 border-slate-300',
  [BOOKING_STATUS.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
  [BOOKING_STATUS.APPROVED]: 'bg-teal-50 text-teal-700 border-teal-200',
  [BOOKING_STATUS.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const PRIORITY_OPTIONS = [
  { value: PRIORITY.LOW, label: 'Low' },
  { value: PRIORITY.MEDIUM, label: 'Medium' },
  { value: PRIORITY.HIGH, label: 'High' },
];

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: 'bg-slate-50 text-slate-650 border-slate-150',
  [PRIORITY.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200',
  [PRIORITY.HIGH]: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
};
