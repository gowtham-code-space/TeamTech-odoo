const response = require('../utils/response');

/**
 * Middleware to restrict access to users with authorized roles.
 * @param {...string} allowedRoles - The roles permitted to access the route.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return response.error(res, 'Unauthorized. Access token is missing or invalid.', 401);
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return response.error(res, 'Forbidden. You do not have permission to access this resource.', 403);
    }

    next();
  };
};

module.exports = authorize;
