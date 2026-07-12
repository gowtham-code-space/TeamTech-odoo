const { verifyToken } = require('../utils/jwt');
const { pool } = require('../config/db');
const { error } = require('../utils/response');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No authentication token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return error(res, 'Authentication token is invalid or expired.', 401);
    }

    // Fetch user from DB to verify status and role
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active, organization_id, tenant_id FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return error(res, 'User session invalid. Account not found.', 401);
    }

    const user = rows[0];
    if (!user.is_active) {
      return error(res, 'Your account has been deactivated. Please contact an Administrator.', 403);
    }

    // Attach user payload to request
    req.user = user;
    next();
  } catch (err) {
    console.error('requireAuth middleware error:', err.message);
    return error(res, 'Authentication system failure.', 401);
  }
};

module.exports = requireAuth;
