const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const requireAuth = require('../middleware/auth.middleware');

// Ensure only authenticated users can access notification endpoints
router.use(requireAuth);

// Notification endpoints
router.get('/', notificationController.getNotifications);
router.patch('/mark-all-read', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
