const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const requireAuth = require('../middleware/auth.middleware');

// Apply authentication verification globally
router.use(requireAuth);

router.get('/', dashboardController.getOverview);

module.exports = router;
