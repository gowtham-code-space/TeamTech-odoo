const express = require('express');
const router = express.Router();
const maintController = require('../controllers/maintenance.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply authentication verification globally to all endpoints inside this module
router.use(requireAuth);

// Requester endpoints
router.get('/', maintController.getRequests);
router.post('/', maintController.raiseRequest);
router.get('/:id/history', maintController.getRequestHistory);

// Repair work execution endpoints
router.patch('/:id/start', maintController.startWork);

// Management workflow endpoints (restricted to ADMIN and ASSET_MANAGER)
router.patch('/:id/approve', requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]), maintController.approveRequest);
router.patch('/:id/reject', requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]), maintController.rejectRequest);
router.patch('/:id/assign', requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]), maintController.assignTechnician);
router.patch('/:id/resolve', requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]), maintController.resolveWork);

module.exports = router;
