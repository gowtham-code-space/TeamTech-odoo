const allocationService = require('../services/allocation.service');
const { success, error } = require('../utils/response');

/**
 * List all allocations with advanced filter support.
 */
const getAllocations = async (req, res) => {
  try {
    const { userId, assetId, statusId } = req.query;
    // Run overdue checker automatically to ensure accurate status representation
    await allocationService.detectAndMarkOverdue();
    const list = await allocationService.listAllocations({ userId, assetId, statusId });
    return success(res, 'Allocations list retrieved successfully.', list);
  } catch (err) {
    console.error('getAllocations controller error:', err.message);
    return error(res, 'Failed to fetch allocations.');
  }
};

/**
 * List transfer requests.
 */
const getTransfers = async (req, res) => {
  try {
    const list = await allocationService.listTransfers();
    return success(res, 'Transfer requests retrieved successfully.', list);
  } catch (err) {
    console.error('getTransfers controller error:', err.message);
    return error(res, 'Failed to fetch transfer requests.');
  }
};

/**
 * Allocate an asset to a user.
 */
const allocateAsset = async (req, res) => {
  try {
    const { assetId, userId, expectedReturnDate } = req.body;

    if (!assetId || !userId) {
      return error(res, 'Asset selection and target employee selection are required.', 400);
    }

    const result = await allocationService.allocateAsset(assetId, userId, expectedReturnDate, req.user.id);
    return success(res, 'Asset allocated successfully.', result, 201);
  } catch (err) {
    console.error('allocateAsset controller error:', err.message);
    return error(res, err.message || 'Failed to allocate asset.');
  }
};

/**
 * Confirm return of an asset.
 */
const returnAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { conditionLookupId, notes } = req.body;

    const result = await allocationService.returnAsset(id, conditionLookupId, notes, req.user.id);
    return success(res, 'Asset marked as returned successfully.', result);
  } catch (err) {
    console.error('returnAsset controller error:', err.message);
    return error(res, err.message || 'Failed to process asset return.');
  }
};

/**
 * Request asset transfer between users.
 */
const requestTransfer = async (req, res) => {
  try {
    const { assetId, fromUserId, toUserId, reason } = req.body;

    if (!assetId || !fromUserId || !toUserId) {
      return error(res, 'Asset, source employee, and destination employee are required.', 400);
    }

    if (parseInt(fromUserId) === parseInt(toUserId)) {
      return error(res, 'Source and destination employees must be different.', 400);
    }

    const result = await allocationService.requestTransfer(assetId, fromUserId, toUserId, reason);
    return success(res, 'Asset transfer request submitted successfully.', result, 201);
  } catch (err) {
    console.error('requestTransfer controller error:', err.message);
    return error(res, err.message || 'Failed to request transfer.');
  }
};

/**
 * Approve asset transfer.
 */
const approveTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await allocationService.approveTransfer(id, req.user.id);
    return success(res, 'Asset transfer request approved successfully.', result);
  } catch (err) {
    console.error('approveTransfer controller error:', err.message);
    return error(res, err.message || 'Failed to approve transfer.');
  }
};

/**
 * Reject asset transfer.
 */
const rejectTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await allocationService.rejectTransfer(id, req.user.id);
    return success(res, 'Asset transfer request rejected successfully.', result);
  } catch (err) {
    console.error('rejectTransfer controller error:', err.message);
    return error(res, err.message || 'Failed to reject transfer.');
  }
};

module.exports = {
  getAllocations,
  getTransfers,
  allocateAsset,
  returnAsset,
  requestTransfer,
  approveTransfer,
  rejectTransfer
};
