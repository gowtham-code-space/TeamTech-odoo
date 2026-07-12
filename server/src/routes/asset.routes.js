const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const requireAuth = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Apply auth and role-based permissions to all endpoints inside this module
router.use(requireAuth);
router.use(requireRole([ROLES.ADMIN, ROLES.ASSET_MANAGER]));

// Asset management endpoints
router.get('/', assetController.getAssets);
router.get('/lookup', assetController.lookupAsset);
router.get('/:id', assetController.getAssetById);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.patch('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);
router.get('/:id/history', assetController.getAssetHistory);

module.exports = router;
