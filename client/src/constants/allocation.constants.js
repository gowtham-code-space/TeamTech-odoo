export const ALLOCATION_STATUS = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  TRANSFERRED: 'transferred',
};

export const ALLOCATION_STATUS_OPTIONS = [
  { value: ALLOCATION_STATUS.ACTIVE, label: 'Active' },
  { value: ALLOCATION_STATUS.RETURNED, label: 'Returned' },
  { value: ALLOCATION_STATUS.TRANSFERRED, label: 'Transferred' },
];

export const ALLOCATION_STATUS_COLORS = {
  [ALLOCATION_STATUS.ACTIVE]: 'bg-blue-50 text-blue-700 border-blue-200',
  [ALLOCATION_STATUS.RETURNED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [ALLOCATION_STATUS.TRANSFERRED]: 'bg-slate-100 text-slate-700 border-slate-300',
};

export const RETURN_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'broken', label: 'Broken' },
];
