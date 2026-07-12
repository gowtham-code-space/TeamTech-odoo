const { error } = require('../utils/response');

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication context missing.', 401);
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return error(res, `Access denied. Requires one of these roles: [${allowedRoles.join(', ')}]`, 403);
    }

    next();
  };
};

module.exports = requireRole;
