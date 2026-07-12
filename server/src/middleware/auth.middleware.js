const jwt = require('../utils/jwt');
const db = require('../config/db');
const response = require('../utils/response');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verifyToken(token);
    if (!decoded) {
      return response.error(res, 'Invalid or expired token.', 401);
    }

    // Default user object constructed from decoded token
    let user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      organization_id: decoded.organization_id || decoded.organizationId || null,
      tenant_id: decoded.tenant_id || decoded.tenantId || null
    };

    try {
      // Query users table to verify user exists in DB
      const [users] = await db.query(
        'SELECT id, name, email, role, organization_id, tenant_id FROM users WHERE id = ?',
        [user.id]
      );

      if (users && users.length > 0) {
        user = users[0];
      } else {
        return response.error(res, 'User not found.', 401);
      }
    } catch (dbError) {
      // Graceful fallback for development / hackathon environments where the table might not exist yet
      console.warn('DB user check skipped, falling back to JWT payload details:', dbError.message);
    }

    req.user = user;
    next();
  } catch (err) {
    return response.error(res, 'Authentication failed.', 401);
  }
};
