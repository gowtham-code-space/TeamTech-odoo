// Mock Dashboard Fixtures for Hackathon Preview
// In production, these objects will be fetched from endpoints:
// GET /api/dashboard/analytics

export const mockKpiMetrics = {
  total_assets: 148,
  available_assets: 45,
  active_bookings: 24,
  pending_maintenance: 8,
  overdue_returns: 5,
  audit_discrepancies: 2,
};

export const mockAssetDistribution = [
  { label: 'Available', value: 45, color: '#3b82f6' }, // Blue
  { label: 'Allocated', value: 55, color: '#10b981' }, // Emerald
  { label: 'Reserved', value: 15, color: '#8b5cf6' }, // Violet
  { label: 'Under Maintenance', value: 12, color: '#f59e0b' }, // Amber
  { label: 'Lost', value: 3, color: '#ef4444' }, // Red
  { label: 'Retired', value: 10, color: '#64748b' }, // Slate
  { label: 'Disposed', value: 8, color: '#475569' }, // Dark slate
];

export const mockAllocationTrend = [
  { month: 'Jan', allocated: 25, returned: 18 },
  { month: 'Feb', allocated: 38, returned: 22 },
  { month: 'Mar', allocated: 45, returned: 30 },
  { month: 'Apr', allocated: 30, returned: 35 },
  { month: 'May', allocated: 55, returned: 40 },
  { month: 'Jun', allocated: 62, returned: 48 },
];

export const mockMaintenanceTrend = [
  { month: 'Jan', pending: 8, approved: 5, in_progress: 3, resolved: 10 },
  { month: 'Feb', pending: 12, approved: 8, in_progress: 5, resolved: 8 },
  { month: 'Mar', pending: 15, approved: 10, in_progress: 8, resolved: 12 },
  { month: 'Apr', pending: 10, approved: 12, in_progress: 6, resolved: 14 },
  { month: 'May', pending: 14, approved: 9, in_progress: 11, resolved: 11 },
  { month: 'Jun', pending: 7, approved: 14, in_progress: 4, resolved: 18 },
];

export const mockDepartmentDistribution = [
  { label: 'Engineering', value: 42, color: '#6366f1' },
  { label: 'Sales', value: 28, color: '#ec4899' },
  { label: 'Marketing', value: 18, color: '#14b8a6' },
  { label: 'HR', value: 15, color: '#f59e0b' },
  { label: 'Finance', value: 12, color: '#a855f7' },
];

export const mockTopUtilizedAssets = [
  { label: 'AF-0001 Laptop Dell', value: 45 },
  { label: 'AF-0010 Conf Room B', value: 38 },
  { label: 'AF-0008 Projector X', value: 29 },
  { label: 'AF-0022 MacBook Pro', value: 24 },
  { label: 'AF-0005 iPad Air', value: 18 },
];
