const { pool } = require('../config/db');

/**
 * Fetch dashboard KPIs and charts depending on user role.
 */
const getDashboardData = async (userId, role, departmentId, departmentName) => {
  const data = {
    kpi: {},
    recentActivity: []
  };

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    const [[{ total_assets }]] = await pool.query('SELECT COUNT(*) AS count FROM assets');
    const [[{ active_bookings }]] = await pool.query('SELECT COUNT(*) AS count FROM resource_bookings WHERE status_lookup_id IN (20, 21)');
    const [[{ pending_maintenance }]] = await pool.query('SELECT COUNT(*) AS count FROM maintenance_requests WHERE status_lookup_id = 24');
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) AS count FROM users');

    data.kpi = {
      total_assets: total_assets || 0,
      active_bookings: active_bookings || 0,
      pending_maintenance: pending_maintenance || 0,
      total_users: total_users || 0
    };

    // Platform usage trend (mock data for charts)
    data.platformUsageTrend = [
      { label: 'Jan', value: 20 },
      { label: 'Feb', value: 35 },
      { label: 'Mar', value: 55 },
      { label: 'Apr', value: 80 }
    ];
  } else if (role === 'ASSET_MANAGER') {
    const [[{ total_value }]] = await pool.query('SELECT COALESCE(SUM(acquisition_cost), 0) AS value FROM assets');
    const [[{ under_maint }]] = await pool.query('SELECT COUNT(*) AS count FROM assets WHERE status_lookup_id = 4');
    const [[{ overdue }]] = await pool.query('SELECT COUNT(*) AS count FROM asset_allocations WHERE status_lookup_id = 15');
    const [[{ scheduled_audits }]] = await pool.query('SELECT COUNT(*) AS count FROM audit_cycles WHERE status_lookup_id = 34');

    data.kpi = {
      total_value: parseFloat(total_value || 0).toFixed(2),
      under_maintenance: under_maint || 0,
      overdue_returns: overdue || 0,
      scheduled_audits: scheduled_audits || 0
    };
  } else if (role === 'DEPARTMENT_HEAD') {
    const [[{ dept_assets }]] = await pool.query(
      `SELECT COUNT(*) AS count FROM assets 
       WHERE department_id = ? OR department_id IN (SELECT department_id FROM departments WHERE department_name = ?)`,
      [departmentId, departmentName]
    );

    const [[{ dept_employees }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM users WHERE department_id = ? OR department = ?',
      [departmentId, departmentName]
    );

    const [[{ pending_maint }]] = await pool.query(
      `SELECT COUNT(*) AS count FROM maintenance_requests mr
       JOIN assets a ON mr.asset_id = a.asset_id 
       WHERE mr.status_lookup_id = 24 AND (a.department_id = ? OR a.department_id IN (SELECT department_id FROM departments WHERE department_name = ?))`,
      [departmentId, departmentName]
    );

    data.kpi = {
      department_assets: dept_assets || 0,
      department_employees: dept_employees || 0,
      pending_maintenance: pending_maint || 0
    };
  } else {
    // EMPLOYEE dashboard
    const [[{ my_assets }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM asset_allocations WHERE user_id = ? AND status_lookup_id IN (13, 15)',
      [userId]
    );

    const [[{ my_bookings }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM resource_bookings WHERE booked_by = ? AND status_lookup_id IN (20, 21)',
      [userId]
    );

    const [[{ my_maint }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM maintenance_requests WHERE requested_by = ? AND status_lookup_id = 24',
      [userId]
    );

    data.kpi = {
      my_allocated_assets: my_assets || 0,
      my_bookings: my_bookings || 0,
      my_pending_maintenance: my_maint || 0
    };
  }

  // Fetch recent activity
  const [activities] = await pool.query(
    `SELECT action AS title, remarks AS description, created_at 
     FROM asset_history 
     ORDER BY created_at DESC LIMIT 5`
  );
  data.recentActivity = activities;

  return data;
};

module.exports = {
  getDashboardData
};
