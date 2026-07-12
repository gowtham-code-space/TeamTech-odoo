const validator = require('validator');

/**
 * Validate department creation body.
 */
const validateCreateDepartment = (data) => {
  const errors = {};
  const name = data.name || '';

  if (validator.isEmpty(name.trim())) {
    errors.name = 'Department name is required.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate department update body.
 */
const validateUpdateDepartment = (data) => {
  const errors = {};

  if (data.name !== undefined && validator.isEmpty(data.name.trim())) {
    errors.name = 'Department name cannot be empty.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate asset category creation body.
 */
const validateCreateCategory = (data) => {
  const errors = {};
  const name = data.name || '';

  if (validator.isEmpty(name.trim())) {
    errors.name = 'Category name is required.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate asset category update body.
 */
const validateUpdateCategory = (data) => {
  const errors = {};

  if (data.name !== undefined && validator.isEmpty(data.name.trim())) {
    errors.name = 'Category name cannot be empty.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate promotion payload request.
 */
const validatePromoteEmployee = (data) => {
  const errors = {};
  const role = data.role || '';

  if (validator.isEmpty(role.trim())) {
    errors.role = 'Promotion role is required.';
  } else if (!['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'SUPER_ADMIN'].includes(role.toUpperCase())) {
    errors.role = 'Invalid promotion role. Choose SUPER_ADMIN, ADMIN, ASSET_MANAGER, or DEPARTMENT_HEAD.';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateCreateDepartment,
  validateUpdateDepartment,
  validateCreateCategory,
  validateUpdateCategory,
  validatePromoteEmployee
};
