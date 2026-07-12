const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply Admin restriction globally to all sub-routes
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN]));

// Endpoints
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/promote', adminController.promoteUser);
router.patch('/users/:id/demote', adminController.demoteUser);
router.patch('/users/:id/status', adminController.updateStatus);

module.exports = router;
