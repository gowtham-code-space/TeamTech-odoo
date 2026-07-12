export const API_ENDPOINTS = {
  DEPARTMENTS: '/departments',
  CATEGORIES: '/categories',
  EMPLOYEES: '/employees',
  ROLES: '/roles',
  ASSETS: '/assets',
  ASSET_HISTORY: (id) => `/assets/${id}/history`,
  ASSET_PHOTO: (id) => `/assets/${id}/photo`,
  ASSET_DOCUMENT: (id) => `/assets/${id}/document`,
  ALLOCATIONS: '/allocations',
  ALLOCATION_HISTORY: (id) => `/allocations/${id}/history`,
  AVAILABLE_ASSETS: '/assets/available',
  BOOKINGS: '/bookings',
  CALENDAR_BOOKINGS: '/bookings/calendar',
  RESOURCES: '/resources',
  AVAILABLE_RESOURCES: '/resources/available',
};

