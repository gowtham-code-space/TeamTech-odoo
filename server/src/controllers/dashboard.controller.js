const dashboardService = require('../services/dashboard.service');
const { success, error } = require('../utils/response');

/**
 * Get dashboard overview metrics.
 */
const getOverview = async (req, res) => {
  try {
    const { id, role, department_id, department } = req.user;
    const overview = await dashboardService.getDashboardData(id, role, department_id, department);
    return success(res, 'Dashboard overview data retrieved successfully.', overview);
  } catch (err) {
    console.error('getOverview controller error:', err.message);
    return error(res, 'Failed to fetch dashboard metrics.');
  }
};

module.exports = {
  getOverview
};
