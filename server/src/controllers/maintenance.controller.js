const maintService = require('../services/maintenance.service');
const { success, error } = require('../utils/response');
const validator = require('validator');

/**
 * List maintenance requests.
 */
const getRequests = async (req, res) => {
  try {
    const { userId, assetId, statusId } = req.query;
    const list = await maintService.listRequests({ userId, assetId, statusId });
    return success(res, 'Maintenance requests retrieved successfully.', list);
  } catch (err) {
    console.error('getRequests controller error:', err.message);
    return error(res, 'Failed to fetch maintenance requests.');
  }
};

/**
 * Raise a new maintenance request.
 */
const raiseRequest = async (req, res) => {
  try {
    const { assetId, issueDescription, priorityId } = req.body;

    if (!assetId || !issueDescription || !priorityId) {
      return error(res, 'Asset, issue details, and priority level are required.', 400);
    }

    if (validator.isEmpty(issueDescription.trim())) {
      return error(res, 'Issue details cannot be blank.', 400);
    }

    const result = await maintService.raiseRequest(assetId, issueDescription, priorityId, req.user.id);
    return success(res, 'Maintenance request submitted successfully.', result, 201);
  } catch (err) {
    console.error('raiseRequest controller error:', err.message);
    return error(res, err.message || 'Failed to submit maintenance request.');
  }
};

/**
 * Approve maintenance request.
 */
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await maintService.approveRequest(id, req.user.id);
    return success(res, 'Maintenance request approved successfully.', result);
  } catch (err) {
    console.error('approveRequest controller error:', err.message);
    return error(res, err.message || 'Failed to approve request.');
  }
};

/**
 * Reject maintenance request.
 */
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const result = await maintService.rejectRequest(id, comments, req.user.id);
    return success(res, 'Maintenance request rejected successfully.', result);
  } catch (err) {
    console.error('rejectRequest controller error:', err.message);
    return error(res, err.message || 'Failed to reject request.');
  }
};

/**
 * Assign technician.
 */
const assignTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianName } = req.body;

    if (!technicianName || validator.isEmpty(technicianName.trim())) {
      return error(res, 'Technician name is required.', 400);
    }

    const result = await maintService.assignTechnician(id, technicianName, req.user.id);
    return success(res, 'Technician assigned successfully.', result);
  } catch (err) {
    console.error('assignTechnician controller error:', err.message);
    return error(res, err.message || 'Failed to assign technician.');
  }
};

/**
 * Start work.
 */
const startWork = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await maintService.startWork(id, req.user.id);
    return success(res, 'Maintenance repair work started.', result);
  } catch (err) {
    console.error('startWork controller error:', err.message);
    return error(res, err.message || 'Failed to start maintenance work.');
  }
};

/**
 * Resolve maintenance request.
 */
const resolveWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const result = await maintService.resolveWork(id, comments, req.user.id);
    return success(res, 'Maintenance request resolved successfully.', result);
  } catch (err) {
    console.error('resolveWork controller error:', err.message);
    return error(res, err.message || 'Failed to resolve maintenance.');
  }
};

/**
 * Get maintenance request history.
 */
const getRequestHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await maintService.getRequestHistory(id);
    return success(res, 'Maintenance history log retrieved successfully.', history);
  } catch (err) {
    console.error('getRequestHistory controller error:', err.message);
    return error(res, 'Failed to retrieve maintenance history.');
  }
};

module.exports = {
  getRequests,
  raiseRequest,
  approveRequest,
  rejectRequest,
  assignTechnician,
  startWork,
  resolveWork,
  getRequestHistory
};
