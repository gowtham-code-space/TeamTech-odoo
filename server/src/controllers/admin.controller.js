const { pool } = require('../config/db');
const { success, error } = require('../utils/response');

/**
 * Get all users with search, role and department filters.
 */
const getUsers = async (req, res) => {
  try {
    const { search, role, department } = req.query;

    let query = 'SELECT id, full_name, email, role, is_active, department, organization_id, tenant_id, created_at FROM users WHERE 1=1';
    const params = [];

    // Filter by search keyword (name or email)
    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ?)';
      const likeParam = `%${search}%`;
      params.push(likeParam, likeParam);
    }

    // Filter by role
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    // Filter by department
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    // Sort by creation date descending
    query += ' ORDER BY created_at DESC';

    const [users] = await pool.query(query, params);
    return success(res, 'Users list retrieved successfully.', users);
  } catch (err) {
    console.error('getUsers controller error:', err.message);
    return error(res, 'Failed to retrieve users directory.');
  }
};

/**
 * Get user by ID.
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active, department, organization_id, tenant_id, created_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return error(res, 'User record not found.', 404);
    }

    return success(res, 'User profile retrieved successfully.', rows[0]);
  } catch (err) {
    console.error('getUserById controller error:', err.message);
    return error(res, 'Failed to fetch user record.');
  }
};

/**
 * Promote an Employee user to DEPARTMENT_HEAD or ASSET_MANAGER.
 */
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['ASSET_MANAGER', 'DEPARTMENT_HEAD'].includes(role)) {
      return error(res, 'Invalid promotion role. Choose either ASSET_MANAGER or DEPARTMENT_HEAD.', 400);
    }

    // Check if target user exists
    const [existing] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return error(res, 'Target user record not found.', 404);
    }

    // Prevent role changes to seeded ADMIN
    if (existing[0].role === 'ADMIN') {
      return error(res, 'Administrative accounts cannot be promoted or modified.', 403);
    }

    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    return success(res, `User role successfully promoted to ${role}.`);
  } catch (err) {
    console.error('promoteUser controller error:', err.message);
    return error(res, 'Role promotion failed due to database error.');
  }
};

/**
 * Demote an elevated user (Asset Manager / Department Head) back to Employee.
 */
const demoteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if target user exists
    const [existing] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return error(res, 'Target user record not found.', 404);
    }

    // Prevent role changes to ADMIN
    if (existing[0].role === 'ADMIN') {
      return error(res, 'Administrative accounts cannot be demoted.', 403);
    }

    await pool.query("UPDATE users SET role = 'EMPLOYEE' WHERE id = ?", [id]);
    return success(res, 'User role successfully demoted back to EMPLOYEE.');
  } catch (err) {
    console.error('demoteUser controller error:', err.message);
    return error(res, 'Role demotion failed due to database error.');
  }
};

/**
 * Activate or Deactivate user.
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return error(res, 'Active status setting is required.', 400);
    }

    // Convert value to boolean
    const targetStatus = is_active ? 1 : 0;

    // Prevent self-deactivation
    if (parseInt(id) === parseInt(req.user.id)) {
      return error(res, 'Self deactivation is blocked to prevent login lockouts.', 403);
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id, email, role FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return error(res, 'Target user record not found.', 404);
    }

    // Prevent deactivating admin demo accounts
    if (existing[0].email === 'admin@assetflow.com') {
      return error(res, 'Seeded primary Admin account cannot be deactivated.', 403);
    }

    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [targetStatus, id]);
    const statusText = targetStatus ? 'activated' : 'deactivated';
    return success(res, `User status successfully ${statusText}.`);
  } catch (err) {
    console.error('updateStatus controller error:', err.message);
    return error(res, 'Status update failed due to database error.');
  }
};

module.exports = {
  getUsers,
  getUserById,
  promoteUser,
  demoteUser,
  updateStatus,
};
