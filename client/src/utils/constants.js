export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
  EMPLOYEE: 'EMPLOYEE',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.ASSET_MANAGER]: 'Asset Manager',
  [ROLES.DEPARTMENT_HEAD]: 'Department Head',
  [ROLES.EMPLOYEE]: 'Employee',
};

export const ASSET_STATUSES = {
  AVAILABLE: 'available',
  ALLOCATED: 'allocated',
  RESERVED: 'reserved',
  UNDER_MAINTENANCE: 'under_maintenance',
  LOST: 'lost',
  RETIRED: 'retired',
  DISPOSED: 'disposed',
};

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const MAINTENANCE_STATUSES = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
};
