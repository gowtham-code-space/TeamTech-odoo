const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply authentication and role permissions (ADMIN, ASSET_MANAGER) globally
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]));

// Audit workflow endpoints
router.get('/', auditController.getCycles);
router.post('/', auditController.createCycle);
router.patch('/:id/start', auditController.startAudit);
router.post('/:id/verify', auditController.verifyAsset);
router.get('/:id/discrepancies', auditController.getDiscrepancyReport);
router.patch('/:id/close', auditController.closeAudit);
router.post('/:id/auditors', auditController.assignAuditors);

module.exports = router;
