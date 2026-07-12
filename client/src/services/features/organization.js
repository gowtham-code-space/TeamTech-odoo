import apiClient from '../api';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

/**
 * Service features for Organization Management.
 * Communicates with backend REST APIs.
 */

// --- Departments API ---

/**
 * Fetch list of departments with optional search, status, page, and limit parameters.
 * @param {Object} [params] - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getDepartments = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.DEPARTMENTS, { params });
  return response.data;
};

/**
 * Create a new department.
 * @param {Object} data - Department data
 * @returns {Promise<Object>} API response
 */
export const createDepartment = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.DEPARTMENTS, data);
  return response.data;
};

/**
 * Update an existing department.
 * @param {string|number} id - Department ID
 * @param {Object} data - Department data to update
 * @returns {Promise<Object>} API response
 */
export const updateDepartment = async (id, data) => {
  const response = await apiClient.put(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, data);
  return response.data;
};

/**
 * Delete a department.
 * @param {string|number} id - Department ID
 * @returns {Promise<Object>} API response
 */
export const deleteDepartment = async (id) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  return response.data;
};


// --- Categories API ---

/**
 * Fetch list of asset categories with optional search, page, and limit parameters.
 * @param {Object} [params] - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getCategories = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.CATEGORIES, { params });
  return response.data;
};

/**
 * Create a new asset category.
 * @param {Object} data - Category data
 * @returns {Promise<Object>} API response
 */
export const createCategory = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, data);
  return response.data;
};

/**
 * Update an existing category.
 * @param {string|number} id - Category ID
 * @param {Object} data - Category data to update
 * @returns {Promise<Object>} API response
 */
export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, data);
  return response.data;
};

/**
 * Delete a category.
 * @param {string|number} id - Category ID
 * @returns {Promise<Object>} API response
 */
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  return response.data;
};


// --- Employees API ---

/**
 * Fetch list of employees with optional filters (search, department, status, page, limit).
 * @param {Object} [params] - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getEmployees = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES, { params });
  return response.data;
};

/**
 * Create a new employee.
 * @param {Object} data - Employee data
 * @returns {Promise<Object>} API response
 */
export const createEmployee = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES, data);
  return response.data;
};

/**
 * Update an existing employee.
 * @param {string|number} id - Employee ID
 * @param {Object} data - Employee data to update
 * @returns {Promise<Object>} API response
 */
export const updateEmployee = async (id, data) => {
  const response = await apiClient.put(`${API_ENDPOINTS.EMPLOYEES}/${id}`, data);
  return response.data;
};

/**
 * Delete an employee.
 * @param {string|number} id - Employee ID
 * @returns {Promise<Object>} API response
 */
export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
  return response.data;
};


// --- Roles API ---

/**
 * Fetch available employee roles from backend.
 * @returns {Promise<string[]>} API response containing array of roles
 */
export const getRoles = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ROLES);
  return response.data;
};
