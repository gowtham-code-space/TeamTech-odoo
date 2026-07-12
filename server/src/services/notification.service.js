const { pool } = require('../config/db');

/**
 * Fetch all notifications for a specific user.
 */
const listNotifications = async (userId) => {
  const query = `
    SELECT notification_id, title, message, is_read, created_at 
    FROM notifications 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows;
};

/**
 * Mark a single notification as read.
 */
const markRead = async (notificationId, userId) => {
  await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?',
    [notificationId, userId]
  );
  return { notification_id: notificationId };
};

/**
 * Mark all notifications for a user as read.
 */
const markAllRead = async (userId) => {
  await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
    [userId]
  );
  return { user_id: userId };
};

/**
 * Delete a specific notification.
 */
const deleteNotification = async (notificationId, userId) => {
  await pool.query(
    'DELETE FROM notifications WHERE notification_id = ? AND user_id = ?',
    [notificationId, userId]
  );
  return { notification_id: notificationId };
};

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
  deleteNotification
};
