const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  ASSET_MANAGER: 'Asset Manager',
  DEPT_HEAD: 'Department Head',
  EMPLOYEE: 'Employee'
};

const ASSET_STATUS = {
  AVAILABLE: 'available',
  ALLOCATED: 'allocated',
  RESERVED: 'reserved',
  UNDER_MAINTENANCE: 'under_maintenance',
  LOST: 'lost',
  RETIRED: 'retired',
  DISPOSED: 'disposed'
};

const BOOKING_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

const MAINTENANCE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled'
};

const AUDIT_STATUS = {
  VERIFIED: 'verified',
  MISSING: 'missing',
  DAMAGED: 'damaged'
};

const NOTIFICATION_TYPE = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert'
};

module.exports = {
  ROLES,
  ASSET_STATUS,
  BOOKING_STATUS,
  MAINTENANCE_STATUS,
  AUDIT_STATUS,
  NOTIFICATION_TYPE
};
