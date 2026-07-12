export const LIFECYCLE_STATUS = {
  AVAILABLE: 'available',
  ALLOCATED: 'allocated',
  RESERVED: 'reserved',
  UNDER_MAINTENANCE: 'under_maintenance',
  LOST: 'lost',
  RETIRED: 'retired',
  DISPOSED: 'disposed',
};

export const LIFECYCLE_STATUS_OPTIONS = [
  { value: LIFECYCLE_STATUS.AVAILABLE, label: 'Available' },
  { value: LIFECYCLE_STATUS.ALLOCATED, label: 'Allocated' },
  { value: LIFECYCLE_STATUS.RESERVED, label: 'Reserved' },
  { value: LIFECYCLE_STATUS.UNDER_MAINTENANCE, label: 'Under Maintenance' },
  { value: LIFECYCLE_STATUS.LOST, label: 'Lost' },
  { value: LIFECYCLE_STATUS.RETIRED, label: 'Retired' },
  { value: LIFECYCLE_STATUS.DISPOSED, label: 'Disposed' },
];

export const CONDITION = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  BROKEN: 'broken',
};

export const CONDITION_OPTIONS = [
  { value: CONDITION.EXCELLENT, label: 'Excellent' },
  { value: CONDITION.GOOD, label: 'Good' },
  { value: CONDITION.FAIR, label: 'Fair' },
  { value: CONDITION.POOR, label: 'Poor' },
  { value: CONDITION.BROKEN, label: 'Broken' },
];

export const LIFECYCLE_STATUS_COLORS = {
  [LIFECYCLE_STATUS.AVAILABLE]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [LIFECYCLE_STATUS.ALLOCATED]: 'bg-blue-50 text-blue-700 border-blue-200',
  [LIFECYCLE_STATUS.RESERVED]: 'bg-amber-50 text-amber-700 border-amber-200',
  [LIFECYCLE_STATUS.UNDER_MAINTENANCE]: 'bg-orange-50 text-orange-700 border-orange-200',
  [LIFECYCLE_STATUS.LOST]: 'bg-rose-50 text-rose-700 border-rose-200',
  [LIFECYCLE_STATUS.RETIRED]: 'bg-slate-100 text-slate-700 border-slate-300',
  [LIFECYCLE_STATUS.DISPOSED]: 'bg-zinc-100 text-zinc-700 border-zinc-300',
};

export const CONDITION_COLORS = {
  [CONDITION.EXCELLENT]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  [CONDITION.GOOD]: 'bg-blue-50 text-blue-700 border-blue-100',
  [CONDITION.FAIR]: 'bg-amber-50 text-amber-700 border-amber-100',
  [CONDITION.POOR]: 'bg-orange-50 text-orange-700 border-orange-100',
  [CONDITION.BROKEN]: 'bg-rose-50 text-rose-700 border-rose-100',
};
