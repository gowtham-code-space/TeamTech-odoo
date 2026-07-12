const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocation.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply auth and role-based permissions (ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD) to allocations
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]));

// Allocation routes
router.get('/', allocationController.getAllocations);
router.post('/', allocationController.allocateAsset);
router.patch('/:id/return', allocationController.returnAsset);

// Transfer routes
router.get('/transfers', allocationController.getTransfers);
router.post('/transfers', allocationController.requestTransfer);
router.patch('/transfers/:id/approve', allocationController.approveTransfer);
router.patch('/transfers/:id/reject', allocationController.rejectTransfer);

module.exports = router;
