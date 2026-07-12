const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff'
};

const ASSET_STATUS = {
  AVAILABLE: 'Available',
  ALLOCATED: 'Allocated',
  MAINTENANCE: 'Maintenance',
  DISPOSED: 'Disposed'
};

const ALLOCATION_STATUS = {
  ACTIVE: 'Active',
  RETURNED: 'Returned'
};

const BOOKING_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed'
};

const MAINTENANCE_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

const AUDIT_STATUS = {
  VERIFIED: 'Verified',
  MISSING: 'Missing',
  DAMAGED: 'Damaged'
};

const NOTIFICATION_TYPE = {
  INFO: 'Info',
  WARNING: 'Warning',
  ALERT: 'Alert'
};

module.exports = {
  ROLES,
  ASSET_STATUS,
  ALLOCATION_STATUS,
  BOOKING_STATUS,
  MAINTENANCE_STATUS,
  AUDIT_STATUS,
  NOTIFICATION_TYPE
};
