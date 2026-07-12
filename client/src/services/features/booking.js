import apiClient from '../api';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

/**
 * Service methods for Resource Booking feature.
 */

/**
 * Fetch list of bookings with pagination, filter, search and sort.
 * @param {Object} params - Query params (page, limit, search, status, department, resource, date, sort, order)
 * @returns {Promise<Object>} API response
 */
export const getBookings = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.BOOKINGS, { params });
  return response.data;
};

/**
 * Fetch booking details by ID.
 * @param {string|number} id - Booking ID
 * @returns {Promise<Object>} API response
 */
export const getBookingById = async (id) => {
  const response = await apiClient.get(`${API_ENDPOINTS.BOOKINGS}/${id}`);
  return response.data;
};

/**
 * Create a new resource booking.
 * @param {Object} data - Booking form fields
 * @returns {Promise<Object>} API response
 */
export const createBooking = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.BOOKINGS, data);
  return response.data;
};

/**
 * Update an existing resource booking.
 * @param {string|number} id - Booking ID
 * @param {Object} data - Updated booking fields
 * @returns {Promise<Object>} API response
 */
export const updateBooking = async (id, data) => {
  const response = await apiClient.put(`${API_ENDPOINTS.BOOKINGS}/${id}`, data);
  return response.data;
};

/**
 * Cancel a booking.
 * @param {string|number} id - Booking ID
 * @param {Object} [data] - Cancel remarks or reasons
 * @returns {Promise<Object>} API response
 */
export const cancelBooking = async (id, data) => {
  const response = await apiClient.post(`${API_ENDPOINTS.BOOKINGS}/${id}/cancel`, data);
  return response.data;
};

/**
 * Fetch bookings for calendar view range.
 * @param {Object} params - Query params (startDate, endDate, resourceId)
 * @returns {Promise<Object>} API response
 */
export const getCalendarBookings = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.CALENDAR_BOOKINGS, { params });
  return response.data;
};

/**
 * Get all bookable resources (e.g. rooms, cars, projectors).
 * @param {Object} [params] - Query params
 * @returns {Promise<Object>} API response
 */
export const getResources = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.RESOURCES, { params });
  return response.data;
};

/**
 * Get available resources (for a specific date/time range if supported by backend).
 * @param {Object} params - Query params (date, startTime, endTime)
 * @returns {Promise<Object>} API response
 */
export const getAvailableResources = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.AVAILABLE_RESOURCES, { params });
  return response.data;
};
