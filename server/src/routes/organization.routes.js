const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organization.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Restrict access globally to authenticated users with SUPER_ADMIN or ADMIN role
router.use(requireAuth);
router.use(requireRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]));

// Departments Management endpoints
router.get('/departments', orgController.getDepartments);
router.post('/departments', orgController.createDepartment);
router.put('/departments/:id', orgController.updateDepartment);
router.patch('/departments/:id', orgController.updateDepartment);
router.patch('/departments/:id/deactivate', orgController.deactivateDepartment);

// Asset Categories Management endpoints
router.get('/categories', orgController.getCategories);
router.post('/categories', orgController.createCategory);
router.put('/categories/:id', orgController.updateCategory);
router.patch('/categories/:id', orgController.updateCategory);

// Employee Directory & Promotion workflows
router.get('/employees', orgController.getEmployees);
router.patch('/employees/:id/promote', orgController.promoteEmployee);
router.patch('/employees/:id/demote', orgController.demoteEmployee);

module.exports = router;
