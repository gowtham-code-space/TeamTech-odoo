const notificationService = require('../services/notification.service');
const { success, error } = require('../utils/response');

/**
 * Get all notifications for the authenticated user.
 */
const getNotifications = async (req, res) => {
  try {
    const list = await notificationService.listNotifications(req.user.id);
    return success(res, 'Notifications retrieved successfully.', list);
  } catch (err) {
    console.error('getNotifications controller error:', err.message);
    return error(res, 'Failed to retrieve notifications.');
  }
};

/**
 * Mark a single notification as read.
 */
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.markRead(id, req.user.id);
    return success(res, 'Notification marked as read.', result);
  } catch (err) {
    console.error('markRead controller error:', err.message);
    return error(res, 'Failed to update notification status.');
  }
};

/**
 * Mark all notifications as read.
 */
const markAllRead = async (req, res) => {
  try {
    const result = await notificationService.markAllRead(req.user.id);
    return success(res, 'All notifications marked as read.', result);
  } catch (err) {
    console.error('markAllRead controller error:', err.message);
    return error(res, 'Failed to update all notifications status.');
  }
};

/**
 * Delete a notification.
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id, req.user.id);
    return success(res, 'Notification deleted successfully.', result);
  } catch (err) {
    console.error('deleteNotification controller error:', err.message);
    return error(res, 'Failed to delete notification.');
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
};
