const bookingService = require('../services/booking.service');
const { success, error } = require('../utils/response');
const validator = require('validator');

/**
 * List all bookings with range filters for Calendar.
 */
const getBookings = async (req, res) => {
  try {
    const { resourceId, startDate, endDate } = req.query;
    const list = await bookingService.listBookings({ resourceId, startDate, endDate });
    return success(res, 'Bookings calendar data retrieved successfully.', list);
  } catch (err) {
    console.error('getBookings controller error:', err.message);
    return error(res, 'Failed to fetch bookings calendar.');
  }
};

/**
 * List active resources available for booking.
 */
const getResources = async (req, res) => {
  try {
    const list = await bookingService.listResources();
    return success(res, 'Bookable resources retrieved successfully.', list);
  } catch (err) {
    console.error('getResources controller error:', err.message);
    return error(res, 'Failed to retrieve bookable resources.');
  }
};

/**
 * Create a new resource booking.
 */
const createBooking = async (req, res) => {
  try {
    const { resourceId, startDatetime, endDatetime, purpose } = req.body;

    if (!resourceId || !startDatetime || !endDatetime) {
      return error(res, 'Resource selection, start date-time, and end date-time are required.', 400);
    }

    const start = new Date(startDatetime);
    const end = new Date(endDatetime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return error(res, 'Invalid date-time format provided.', 400);
    }

    if (end <= start) {
      return error(res, 'End date-time must be strictly after the start date-time.', 400);
    }

    const result = await bookingService.createBooking(resourceId, req.user.id, startDatetime, endDatetime, purpose);
    return success(res, 'Resource booked successfully.', result, 201);
  } catch (err) {
    console.error('createBooking controller error:', err.message);
    return error(res, err.message || 'Failed to book resource.');
  }
};

/**
 * Update an existing booking.
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDatetime, endDatetime } = req.body;

    if (startDatetime && endDatetime) {
      const start = new Date(startDatetime);
      const end = new Date(endDatetime);
      if (end <= start) {
        return error(res, 'End date-time must be strictly after the start date-time.', 400);
      }
    }

    const result = await bookingService.updateBooking(id, req.body, req.user.id, req.user.role);
    return success(res, 'Booking updated successfully.', result);
  } catch (err) {
    console.error('updateBooking controller error:', err.message);
    return error(res, err.message || 'Failed to update booking.');
  }
};

/**
 * Cancel a booking.
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingService.cancelBooking(id, req.user.id, req.user.role);
    return success(res, 'Booking cancelled successfully.', result);
  } catch (err) {
    console.error('cancelBooking controller error:', err.message);
    return error(res, err.message || 'Failed to cancel booking.');
  }
};

module.exports = {
  getBookings,
  getResources,
  createBooking,
  updateBooking,
  cancelBooking
};
