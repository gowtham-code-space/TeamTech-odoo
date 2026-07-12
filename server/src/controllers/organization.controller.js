const orgService = require('../services/organization.service');
const { success, error } = require('../utils/response');
const {
  validateCreateDepartment,
  validateUpdateDepartment,
  validateCreateCategory,
  validateUpdateCategory,
  validatePromoteEmployee
} = require('../validations/organization.validation');

/**
 * Fetch all departments.
 */
const getDepartments = async (req, res) => {
  try {
    const list = await orgService.listDepartments();
    return success(res, 'Departments list retrieved successfully.', list);
  } catch (err) {
    console.error('getDepartments controller error:', err.message);
    return error(res, 'Failed to fetch departments directory.');
  }
};

/**
 * Create a new department.
 */
const createDepartment = async (req, res) => {
  try {
    const { isValid, errors } = validateCreateDepartment(req.body);
    if (!isValid) {
      return error(res, 'Validation failed.', 400, errors);
    }

    const { name, parentId, headId, description } = req.body;
    const dept = await orgService.createDepartment(name, parentId, headId, description);
    return success(res, 'Department created successfully.', dept, 201);
  } catch (err) {
    console.error('createDepartment controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'A department with this name already exists.', 409);
    }
    return error(res, 'Failed to create department due to a system error.');
  }
};

/**
 * Update department fields.
 */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateUpdateDepartment(req.body);
    if (!isValid) {
      return error(res, 'Validation failed.', 400, errors);
    }

    const dept = await orgService.updateDepartment(id, req.body);
    if (!dept) {
      return error(res, 'No changes provided for update.', 400);
    }
    return success(res, 'Department updated successfully.', dept);
  } catch (err) {
    console.error('updateDepartment controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'A department with this name already exists.', 409);
    }
    return error(res, 'Failed to update department due to a system error.');
  }
};

/**
 * Deactivate department.
 */
const deactivateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await orgService.deactivateDepartment(id);
    return success(res, 'Department deactivated successfully.', dept);
  } catch (err) {
    console.error('deactivateDepartment controller error:', err.message);
    return error(res, 'Failed to deactivate department.');
  }
};

/**
 * Fetch all categories.
 */
const getCategories = async (req, res) => {
  try {
    const list = await orgService.listCategories();
    return success(res, 'Asset categories retrieved successfully.', list);
  } catch (err) {
    console.error('getCategories controller error:', err.message);
    return error(res, 'Failed to retrieve asset categories.');
  }
};

/**
 * Create a new asset category.
 */
const createCategory = async (req, res) => {
  try {
    const { isValid, errors } = validateCreateCategory(req.body);
    if (!isValid) {
      return error(res, 'Validation failed.', 400, errors);
    }

    const { name, description } = req.body;
    const category = await orgService.createCategory(name, description);
    return success(res, 'Asset category created successfully.', category, 201);
  } catch (err) {
    console.error('createCategory controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'An asset category with this name already exists.', 409);
    }
    return error(res, 'Failed to create asset category.');
  }
};

/**
 * Update an asset category.
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validateUpdateCategory(req.body);
    if (!isValid) {
      return error(res, 'Validation failed.', 400, errors);
    }

    const category = await orgService.updateCategory(id, req.body);
    if (!category) {
      return error(res, 'No changes provided for update.', 400);
    }
    return success(res, 'Asset category updated successfully.', category);
  } catch (err) {
    console.error('updateCategory controller error:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
      return error(res, 'An asset category with this name already exists.', 409);
    }
    return error(res, 'Failed to update asset category.');
  }
};

/**
 * Get employee directory.
 */
const getEmployees = async (req, res) => {
  try {
    const { search, role, departmentId } = req.query;
    const list = await orgService.listEmployees(search, role, departmentId);
    return success(res, 'Employee directory retrieved successfully.', list);
  } catch (err) {
    console.error('getEmployees controller error:', err.message);
    return error(res, 'Failed to fetch employee directory.');
  }
};

/**
 * Promote an employee.
 */
const promoteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, errors } = validatePromoteEmployee(req.body);
    if (!isValid) {
      return error(res, 'Validation failed.', 400, errors);
    }

    const { role, departmentId } = req.body;
    const result = await orgService.promoteEmployee(id, role, departmentId);
    return success(res, `Employee successfully promoted to ${role}.`, result);
  } catch (err) {
    console.error('promoteEmployee controller error:', err.message);
    return error(res, 'Failed to promote employee role.');
  }
};

/**
 * Demote an employee.
 */
const demoteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orgService.demoteEmployee(id);
    return success(res, 'Employee successfully demoted back to EMPLOYEE role.', result);
  } catch (err) {
    console.error('demoteEmployee controller error:', err.message);
    return error(res, 'Failed to demote employee.');
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deactivateDepartment,
  getCategories,
  createCategory,
  updateCategory,
  getEmployees,
  promoteEmployee,
  demoteEmployee
};
