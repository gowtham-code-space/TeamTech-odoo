// Mock Dashboard Fixtures for Role-Based Analytics Dashboard System
// In production, these structures will map directly to backend REST endpoints.

// --------------------------------------------------
// 1. SUPER_ADMIN Dashboard Data (Platform Level)
// --------------------------------------------------
export const mockSuperAdminData = {
  kpi: {
    total_organizations: 18,
    active_organizations: 15,
    total_users: 1250,
    total_assets: 3450,
    total_bookings: 890,
    platform_health: '99.9%',
    active_sessions: 142,
    storage_usage: '68%',
    api_health: '99.8%',
    monthly_growth: '+12.5%'
  },
  organizationGrowthTrend: [
    { month: 'Jan', active: 8, pending: 2 },
    { month: 'Feb', active: 10, pending: 3 },
    { month: 'Mar', active: 11, pending: 1 },
    { month: 'Apr', active: 12, pending: 2 },
    { month: 'May', active: 14, pending: 1 },
    { month: 'Jun', active: 15, pending: 3 }
  ],
  tenantDistribution: [
    { label: 'Multi-Tenant SaaS', value: 12, color: '#6366f1' },
    { label: 'Single-Tenant Dedicated', value: 4, color: '#10b981' },
    { label: 'Hybrid/On-Premise', value: 2, color: '#f59e0b' }
  ],
  platformUsageTrend: [
    { month: 'Jan', operations: 4200, users: 400 },
    { month: 'Feb', operations: 5800, users: 650 },
    { month: 'Mar', operations: 6400, users: 800 },
    { month: 'Apr', operations: 7200, users: 950 },
    { month: 'May', operations: 8900, users: 1100 },
    { month: 'Jun', operations: 10400, users: 1250 }
  ],
  subscriptionDistribution: [
    { label: 'Premium Enterprise', value: 6, color: '#8b5cf6' },
    { label: 'Standard Business', value: 8, color: '#3b82f6' },
    { label: 'Trial Tier', value: 4, color: '#64748b' }
  ]
};

// --------------------------------------------------
// 2. ADMIN Dashboard Data (Organization Level)
// --------------------------------------------------
export const mockAdminData = {
  kpi: {
    total_assets: 148,
    available_assets: 45,
    active_bookings: 24,
    pending_maintenance: 8,
    overdue_returns: 5,
    audit_issues: 2
  },
  assetDistribution: [
    { label: 'Available', value: 45, color: '#3b82f6' },
    { label: 'Allocated', value: 55, color: '#10b981' },
    { label: 'Reserved', value: 15, color: '#8b5cf6' },
    { label: 'Under Maintenance', value: 12, color: '#f59e0b' },
    { label: 'Lost', value: 3, color: '#ef4444' },
    { label: 'Retired', value: 10, color: '#64748b' },
    { label: 'Disposed', value: 8, color: '#475569' }
  ],
  departmentDistribution: [
    { label: 'Engineering', value: 42, color: '#6366f1' },
    { label: 'Sales', value: 28, color: '#ec4899' },
    { label: 'Marketing', value: 18, color: '#14b8a6' },
    { label: 'HR', value: 15, color: '#f59e0b' },
    { label: 'Finance', value: 12, color: '#a855f7' }
  ],
  maintenanceTrend: [
    { month: 'Jan', pending: 8, approved: 5, in_progress: 3, resolved: 10 },
    { month: 'Feb', pending: 12, approved: 8, in_progress: 5, resolved: 8 },
    { month: 'Mar', pending: 15, approved: 10, in_progress: 8, resolved: 12 },
    { month: 'Apr', pending: 10, approved: 12, in_progress: 6, resolved: 14 },
    { month: 'May', pending: 14, approved: 9, in_progress: 11, resolved: 11 },
    { month: 'Jun', pending: 7, approved: 14, in_progress: 4, resolved: 18 }
  ],
  bookingTrend: [
    { month: 'Jan', bookings: 45, cancellations: 3 },
    { month: 'Feb', bookings: 68, cancellations: 5 },
    { month: 'Mar', bookings: 74, cancellations: 2 },
    { month: 'Apr', bookings: 89, cancellations: 8 },
    { month: 'May', bookings: 110, cancellations: 4 },
    { month: 'Jun', bookings: 125, cancellations: 7 }
  ],
  topUsedAssets: [
    { label: 'AF-0001 Dell Laptop', value: 45 },
    { label: 'AF-0010 Conf Room B', value: 38 },
    { label: 'AF-0008 Projector X', value: 29 },
    { label: 'AF-0022 MacBook Pro', value: 24 },
    { label: 'AF-0005 iPad Air', value: 18 }
  ],
  assetUtilizationRate: [
    { month: 'Jan', rate: 68 },
    { month: 'Feb', rate: 72 },
    { month: 'Mar', rate: 75 },
    { month: 'Apr', rate: 78 },
    { month: 'May', rate: 82 },
    { month: 'Jun', rate: 86 }
  ]
};

// --------------------------------------------------
// 3. ASSET_MANAGER Dashboard Data (Asset Operations)
// --------------------------------------------------
export const mockAssetManagerData = {
  kpi: {
    managed_assets: 95,
    pending_transfers: 4,
    maintenance_requests: 6,
    assets_under_maintenance: 12,
    overdue_returns: 3
  },
  maintenanceStatusDistribution: [
    { label: 'Scheduled', value: 4, color: '#3b82f6' },
    { label: 'In Progress', value: 5, color: '#f59e0b' },
    { label: 'Completed', value: 18, color: '#10b981' }
  ],
  assetAllocationTrend: [
    { month: 'Jan', allocated: 15, returned: 12 },
    { month: 'Feb', allocated: 22, returned: 14 },
    { month: 'Mar', allocated: 28, returned: 20 },
    { month: 'Apr', allocated: 20, returned: 22 },
    { month: 'May', allocated: 35, returned: 25 },
    { month: 'Jun', allocated: 42, returned: 30 }
  ],
  assetLifecycleDistribution: [
    { label: 'New Purchase', value: 35, color: '#10b981' },
    { label: 'Mid-Life Active', value: 45, color: '#3b82f6' },
    { label: 'End-of-Life Pending', value: 15, color: '#f59e0b' }
  ],
  mostRequestedAssets: [
    { label: 'Dell Monitor 27"', value: 35 },
    { label: 'MacBook Air M2', value: 29 },
    { label: 'iPhone 14 Pro', value: 20 },
    { label: 'Logitech Combo', value: 15 }
  ]
};

// --------------------------------------------------
// 4. DEPARTMENT_HEAD Dashboard Data (Department Analytics)
// --------------------------------------------------
export const mockDepartmentHeadData = {
  kpi: {
    department_assets: 42,
    department_employees: 18,
    active_bookings: 8,
    pending_requests: 3,
    maintenance_requests: 2
  },
  departmentAssetUsage: [
    { label: 'Active Use', value: 32, color: '#10b981' },
    { label: 'On Standby', value: 7, color: '#3b82f6' },
    { label: 'In Repair', value: 3, color: '#ef4444' }
  ],
  bookingTrend: [
    { month: 'Jan', bookings: 12, hours: 36 },
    { month: 'Feb', bookings: 18, hours: 50 },
    { month: 'Mar', bookings: 22, hours: 64 },
    { month: 'Apr', bookings: 15, hours: 42 },
    { month: 'May', bookings: 25, hours: 80 },
    { month: 'Jun', bookings: 30, hours: 96 }
  ],
  assetDistribution: [
    { label: 'Laptops', value: 18, color: '#6366f1' },
    { label: 'Workstations', value: 12, color: '#8b5cf6' },
    { label: 'AV Equipment', value: 8, color: '#3b82f6' },
    { label: 'Mobile Devices', value: 4, color: '#14b8a6' }
  ],
  resourceUsage: [
    { label: 'Engineering Lab', value: 85 },
    { label: 'Conference Room A', value: 65 },
    { label: 'Testing Server A', value: 50 },
    { label: 'Demo Projector B', value: 30 }
  ]
};

// --------------------------------------------------
// 5. EMPLOYEE Dashboard Data (Personal Portal)
// --------------------------------------------------
export const mockEmployeeData = {
  kpi: {
    my_assets: 3,
    upcoming_returns: 1,
    active_bookings: 2,
    open_maintenance_requests: 1
  },
  myBookingHistory: [
    { month: 'Jan', bookings: 2, hours: 4 },
    { month: 'Feb', bookings: 3, hours: 8 },
    { month: 'Mar', bookings: 1, hours: 2 },
    { month: 'Apr', bookings: 4, hours: 10 },
    { month: 'May', bookings: 2, hours: 6 },
    { month: 'Jun', bookings: 5, hours: 12 }
  ],
  myAssetUsage: [
    { label: 'Dell Latitude 5420', value: 70, color: '#3b82f6' },
    { label: 'Dell 24" Monitor', value: 20, color: '#10b981' },
    { label: 'Logitech Mouse', value: 10, color: '#8b5cf6' }
  ],
  maintenanceRequestHistory: [
    { label: 'Resolved Tickets', value: 4 },
    { label: 'In Progress Tickets', value: 1 },
    { label: 'Rejected Tickets', value: 0 }
  ]
};
