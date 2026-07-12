const auditService = require('../services/audit.service');
const { success, error } = require('../utils/response');

/**
 * List all audit cycles.
 */
const getCycles = async (req, res) => {
  try {
    const list = await auditService.listCycles();
    return success(res, 'Audit cycles retrieved successfully.', list);
  } catch (err) {
    console.error('getCycles controller error:', err.message);
    return error(res, 'Failed to retrieve audit cycles.');
  }
};

/**
 * Create a new audit cycle.
 */
const createCycle = async (req, res) => {
  try {
    const { departmentId, locationId, startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return error(res, 'Start date and end date are required for an audit cycle.', 400);
    }

    const result = await auditService.createAuditCycle(departmentId, locationId, startDate, endDate, req.user.id);
    return success(res, 'Audit cycle created successfully.', result, 201);
  } catch (err) {
    console.error('createCycle controller error:', err.message);
    return error(res, 'Failed to create audit cycle.');
  }
};

/**
 * Assign auditors.
 */
const assignAuditors = async (req, res) => {
  try {
    const { id } = req.params;
    const { auditorIds } = req.body;

    if (!Array.isArray(auditorIds)) {
      return error(res, 'Auditor IDs must be provided in an array.', 400);
    }

    const result = await auditService.assignAuditors(id, auditorIds);
    return success(res, 'Auditors assigned successfully to cycle.', result);
  } catch (err) {
    console.error('assignAuditors controller error:', err.message);
    return error(res, 'Failed to assign auditors.');
  }
};

/**
 * Start audit execution.
 */
const startAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await auditService.startAudit(id);
    return success(res, 'Audit cycle set to In Progress successfully.', result);
  } catch (err) {
    console.error('startAudit controller error:', err.message);
    return error(res, 'Failed to start audit cycle.');
  }
};

/**
 * Verify asset item.
 */
const verifyAsset = async (req, res) => {
  try {
    const { id } = req.params; // cycle id
    const { assetId, resultLookupId, remarks } = req.body;

    if (!assetId || !resultLookupId) {
      return error(res, 'Asset selection and verification result status are required.', 400);
    }

    const result = await auditService.verifyAsset(id, assetId, req.user.id, resultLookupId, remarks);
    return success(res, 'Asset verification result recorded successfully.', result);
  } catch (err) {
    console.error('verifyAsset controller error:', err.message);
    return error(res, err.message || 'Failed to submit asset verification result.');
  }
};

/**
 * Get discrepancy report.
 */
const getDiscrepancyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await auditService.getDiscrepancyReport(id);
    return success(res, 'Discrepancy report generated successfully.', report);
  } catch (err) {
    console.error('getDiscrepancyReport controller error:', err.message);
    return error(res, 'Failed to generate discrepancy report.');
  }
};

/**
 * Close audit cycle.
 */
const closeAudit = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await auditService.closeAudit(id);
    return success(res, 'Audit cycle closed and locked successfully.', result);
  } catch (err) {
    console.error('closeAudit controller error:', err.message);
    return error(res, 'Failed to close audit cycle.');
  }
};

module.exports = {
  getCycles,
  createCycle,
  assignAuditors,
  startAudit,
  verifyAsset,
  getDiscrepancyReport,
  closeAudit
};
