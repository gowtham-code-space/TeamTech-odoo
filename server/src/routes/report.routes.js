const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply auth and management roles (ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD) globally to all reports
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD]));

// Report analytical endpoints
router.get('/utilization', reportController.getAssetUtilization);
router.get('/maintenance-frequency', reportController.getMaintenanceFrequency);
router.get('/department-summary', reportController.getDepartmentAllocationSummary);
router.get('/idle-assets', reportController.getIdleAssets);
router.get('/booking-heatmap', reportController.getBookingHeatmap);
router.get('/retirement-forecast', reportController.getRetirementForecast);

module.exports = router;
