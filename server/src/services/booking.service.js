const { pool } = require('../config/db');

/**
 * Check if the requested booking overlaps with existing bookings.
 * Adjacent bookings are ALLOWED, meaning start_time can equal existing end_time.
 */
const checkBookingOverlap = async (resourceId, startDatetime, endDatetime, excludeBookingId = null) => {
  let query = `
    SELECT booking_id 
    FROM resource_bookings 
    WHERE resource_id = ? 
      AND status_lookup_id IN (20, 21)
      AND start_datetime < ? 
      AND end_datetime > ?
  `;
  const params = [resourceId, endDatetime, startDatetime];

  if (excludeBookingId) {
    query += ' AND booking_id != ?';
    params.push(excludeBookingId);
  }

  const [rows] = await pool.query(query, params);
  return rows.length > 0;
};

/**
 * Create a new resource booking.
 */
const createBooking = async (resourceId, userId, startDatetime, endDatetime, purpose) => {
  // Overlap validation check
  const isOverlapping = await checkBookingOverlap(resourceId, startDatetime, endDatetime);
  if (isOverlapping) {
    throw new Error('Requested time slot overlaps with an existing booking.');
  }

  // 20 = Upcoming status
  const [result] = await pool.query(
    `INSERT INTO resource_bookings (resource_id, booked_by, start_datetime, end_datetime, status_lookup_id, purpose) 
     VALUES (?, ?, ?, ?, 20, ?)`,
    [resourceId, userId, startDatetime, endDatetime, purpose ? purpose.trim() : null]
  );

  return { booking_id: result.insertId };
};

/**
 * Update an existing resource booking.
 */
const updateBooking = async (bookingId, data, userId, userRole) => {
  const [bookingRows] = await pool.query(
    'SELECT * FROM resource_bookings WHERE booking_id = ?',
    [bookingId]
  );

  if (bookingRows.length === 0) {
    throw new Error('Booking record not found.');
  }

  const booking = bookingRows[0];

  // Access control: Only booker, Admin, or Asset Manager can edit bookings
  if (parseInt(booking.booked_by) !== parseInt(userId) && !['ADMIN', 'ASSET_MANAGER'].includes(userRole)) {
    throw new Error('You do not have permission to modify this booking.');
  }

  const start = data.startDatetime || booking.start_datetime;
  const end = data.endDatetime || booking.end_datetime;
  const purpose = data.purpose !== undefined ? data.purpose : booking.purpose;
  const status = data.status_lookup_id || booking.status_lookup_id;

  // Validate overlap if dates are updated
  if (data.startDatetime || data.endDatetime) {
    const isOverlapping = await checkBookingOverlap(booking.resource_id, start, end, bookingId);
    if (isOverlapping) {
      throw new Error('Rescheduled time slot overlaps with an existing booking.');
    }
  }

  await pool.query(
    `UPDATE resource_bookings 
     SET start_datetime = ?, end_datetime = ?, purpose = ?, status_lookup_id = ? 
     WHERE booking_id = ?`,
    [start, end, purpose ? purpose.trim() : null, status, bookingId]
  );

  return { booking_id: bookingId };
};

/**
 * Cancel a resource booking.
 */
const cancelBooking = async (bookingId, userId, userRole) => {
  const [bookingRows] = await pool.query(
    'SELECT * FROM resource_bookings WHERE booking_id = ?',
    [bookingId]
  );

  if (bookingRows.length === 0) {
    throw new Error('Booking record not found.');
  }

  const booking = bookingRows[0];

  // Access control
  if (parseInt(booking.booked_by) !== parseInt(userId) && !['ADMIN', 'ASSET_MANAGER'].includes(userRole)) {
    throw new Error('You do not have permission to cancel this booking.');
  }

  // 23 = Cancelled status
  await pool.query(
    'UPDATE resource_bookings SET status_lookup_id = 23 WHERE booking_id = ?',
    [bookingId]
  );

  return { booking_id: bookingId };
};

/**
 * List all bookings for calendar view, supporting resource & date range filters.
 */
const listBookings = async (filters = {}) => {
  const { resourceId, startDate, endDate } = filters;

  let query = `
    SELECT 
      b.*,
      r.resource_name,
      r.booking_type,
      u.full_name AS booked_by_name,
      s.lookup_value AS booking_status
    FROM resource_bookings b
    JOIN resources r ON b.resource_id = r.resource_id
    JOIN users u ON b.booked_by = u.id
    JOIN lookup_values s ON b.status_lookup_id = s.lookup_id
    WHERE b.status_lookup_id != 23
  `;
  const params = [];

  if (resourceId) {
    query += ' AND b.resource_id = ?';
    params.push(resourceId);
  }

  if (startDate) {
    query += ' AND b.start_datetime >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND b.end_datetime <= ?';
    params.push(endDate);
  }

  query += ' ORDER BY b.start_datetime ASC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Fetch all available bookable resources.
 */
const listResources = async () => {
  const [rows] = await pool.query(
    'SELECT resource_id, resource_name, booking_type, is_active FROM resources WHERE is_active = 1'
  );
  return rows;
};

module.exports = {
  createBooking,
  updateBooking,
  cancelBooking,
  listBookings,
  listResources
};
