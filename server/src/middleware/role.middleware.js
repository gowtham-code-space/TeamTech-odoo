const response = require('../utils/response');

/**
 * Middleware to restrict access to users with authorized roles.
 * Supports both array and varargs syntax:
 * - requireRole('ADMIN', 'ASSET_MANAGER')
 * - requireRole(['ADMIN', 'ASSET_MANAGER'])
 */
const requireRole = (...args) => {
  const allowedRoles = Array.isArray(args[0]) ? args[0] : args;

  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'Unauthorized. Access token is missing or invalid.', 401);
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return response.error(
        res,
        `Forbidden. You do not have permission to access this resource. Requires one of these roles: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};

module.exports = requireRole;
