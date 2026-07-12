const assetService = require('../services/asset.service');
const { success, error } = require('../utils/response');
const validator = require('validator');

/**
 * List all assets with search and filter parameters.
 */
const getAssets = async (req, res) => {
  try {
    const { search, categoryId, departmentId, statusId, conditionId } = req.query;
    const assets = await assetService.listAssets({ search, categoryId, departmentId, statusId, conditionId });
    return success(res, 'Assets list retrieved successfully.', assets);
  } catch (err) {
    console.error('getAssets controller error:', err.message);
    return error(res, 'Failed to retrieve asset registry.');
  }
};

/**
 * Fetch detailed asset data by ID.
 */
const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await assetService.getAssetById(id);
    if (!asset) {
      return error(res, 'Asset record not found.', 404);
    }
    return success(res, 'Asset details retrieved successfully.', asset);
  } catch (err) {
    console.error('getAssetById controller error:', err.message);
    return error(res, 'Failed to fetch asset details.');
  }
};

/**
 * QR Code or Asset Tag lookup endpoint.
 */
const lookupAsset = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return error(res, 'QR code or asset tag parameter is required.', 400);
    }
    const asset = await assetService.getAssetByQRCodeOrTag(code);
    if (!asset) {
      return error(res, 'Asset not found with the provided identifier.', 404);
    }
    return success(res, 'Asset details retrieved successfully.', asset);
  } catch (err) {
    console.error('lookupAsset controller error:', err.message);
    return error(res, 'Failed to lookup asset.');
  }
};

/**
 * Create a new asset.
 */
const createAsset = async (req, res) => {
  try {
    const { category_id, asset_tag, asset_name } = req.body;

    // Validations
    if (!category_id) {
      return error(res, 'Asset category selection is required.', 400);
    }
    if (!asset_tag || validator.isEmpty(asset_tag.trim())) {
      return error(res, 'Asset unique tag is required.', 400);
    }
    if (!asset_name || validator.isEmpty(asset_name.trim())) {
      return error(res, 'Asset name is required.', 400);
    }

    const newAsset = await assetService.createAsset(req.body, req.user.id);
    return success(res, 'Asset added to inventory successfully.', newAsset, 201);
  } catch (err) {
    console.error('createAsset controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'An asset with this Tag or Serial Number already exists.', 409);
    }
    return error(res, 'Failed to add asset to database.');
  }
};

/**
 * Update an existing asset.
 */
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { asset_name } = req.body;

    if (asset_name !== undefined && validator.isEmpty(asset_name.trim())) {
      return error(res, 'Asset name cannot be empty.', 400);
    }

    const updated = await assetService.updateAsset(id, req.body, req.user.id);
    if (!updated) {
      return error(res, 'Asset record not found or no changes made.', 404);
    }
    return success(res, 'Asset updated successfully.', updated);
  } catch (err) {
    console.error('updateAsset controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'An asset with this Tag or Serial Number already exists.', 409);
    }
    return error(res, 'Failed to update asset.');
  }
};

/**
 * Delete or soft-retire an asset.
 */
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    await assetService.deleteAsset(id, req.user.id);
    return success(res, 'Asset deleted / retired successfully.');
  } catch (err) {
    console.error('deleteAsset controller error:', err.message);
    return error(res, err.message || 'Failed to remove asset.');
  }
};

/**
 * Get history logs for a specific asset.
 */
const getAssetHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await assetService.getAssetHistory(id);
    return success(res, 'Asset history timeline retrieved successfully.', history);
  } catch (err) {
    console.error('getAssetHistory controller error:', err.message);
    return error(res, 'Failed to fetch asset history timeline.');
  }
};

module.exports = {
  getAssets,
  getAssetById,
  lookupAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetHistory
};
