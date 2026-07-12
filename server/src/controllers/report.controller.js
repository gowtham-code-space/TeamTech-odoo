const reportService = require('../services/report.service');
const { success, error } = require('../utils/response');

/**
 * Fetch Asset Utilization report data.
 */
const getAssetUtilization = async (req, res) => {
  try {
    const data = await reportService.getAssetUtilization();
    return success(res, 'Asset utilization analytics fetched successfully.', data);
  } catch (err) {
    console.error('getAssetUtilization controller error:', err.message);
    return error(res, 'Failed to generate asset utilization report.');
  }
};

/**
 * Fetch Maintenance Frequency report.
 */
const getMaintenanceFrequency = async (req, res) => {
  try {
    const data = await reportService.getMaintenanceFrequency();
    return success(res, 'Maintenance frequency analytics fetched successfully.', data);
  } catch (err) {
    console.error('getMaintenanceFrequency controller error:', err.message);
    return error(res, 'Failed to generate maintenance frequency report.');
  }
};

/**
 * Fetch Department Allocation Summary.
 */
const getDepartmentAllocationSummary = async (req, res) => {
  try {
    const data = await reportService.getDepartmentAllocationSummary();
    return success(res, 'Department allocation summary fetched successfully.', data);
  } catch (err) {
    console.error('getDepartmentAllocationSummary controller error:', err.message);
    return error(res, 'Failed to generate department allocation summary.');
  }
};

/**
 * Fetch Idle Assets report.
 */
const getIdleAssets = async (req, res) => {
  try {
    const data = await reportService.getIdleAssets();
    return success(res, 'Idle assets listing fetched successfully.', data);
  } catch (err) {
    console.error('getIdleAssets controller error:', err.message);
    return error(res, 'Failed to retrieve idle assets report.');
  }
};

/**
 * Fetch Booking Heatmap report.
 */
const getBookingHeatmap = async (req, res) => {
  try {
    const data = await reportService.getBookingHeatmap();
    return success(res, 'Resource booking popularity heatmap fetched successfully.', data);
  } catch (err) {
    console.error('getBookingHeatmap controller error:', err.message);
    return error(res, 'Failed to generate booking heatmap report.');
  }
};

/**
 * Fetch Retirement Forecast.
 */
const getRetirementForecast = async (req, res) => {
  try {
    const data = await reportService.getRetirementForecast();
    return success(res, 'Asset retirement forecast retrieved successfully.', data);
  } catch (err) {
    console.error('getRetirementForecast controller error:', err.message);
    return error(res, 'Failed to generate retirement forecast.');
  }
};

module.exports = {
  getAssetUtilization,
  getMaintenanceFrequency,
  getDepartmentAllocationSummary,
  getIdleAssets,
  getBookingHeatmap,
  getRetirementForecast
};
