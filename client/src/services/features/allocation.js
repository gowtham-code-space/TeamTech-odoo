import apiClient from '../api';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { getDepartments as orgGetDepartments, getEmployees as orgGetEmployees } from './organization';

/**
 * Service methods for Asset Allocation feature.
 */

/**
 * Get all allocations with parameters.
 * @param {Object} params - Query parameters (page, limit, search, status, department, employee, sort, order)
 * @returns {Promise<Object>} API response
 */
export const getAllocations = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.ALLOCATIONS, { params });
  return response.data;
};

/**
 * Get allocation by ID.
 * @param {string|number} id - Allocation ID
 * @returns {Promise<Object>} API response
 */
export const getAllocationById = async (id) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ALLOCATIONS}/${id}`);
  return response.data;
};

/**
 * Allocate asset to an employee.
 * @param {Object} data - Allocation parameters (employee_id, department_id, asset_id, allocation_date, expected_return_date, notes)
 * @returns {Promise<Object>} API response
 */
export const allocateAsset = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.ALLOCATIONS, data);
  return response.data;
};

/**
 * Transfer an allocated asset to a new employee.
 * @param {string|number} id - Allocation ID
 * @param {Object} data - Transfer parameters (new_holder_id, target_department_id, transfer_date, reason, notes)
 * @returns {Promise<Object>} API response
 */
export const transferAsset = async (id, data) => {
  const response = await apiClient.post(`${API_ENDPOINTS.ALLOCATIONS}/${id}/transfer`, data);
  return response.data;
};

/**
 * Return an allocated asset.
 * @param {string|number} id - Allocation ID
 * @param {Object} data - Return parameters (return_date, condition, damage_notes, remarks, damagePhotoFile)
 * @returns {Promise<Object>} API response
 */
export const returnAsset = async (id, data) => {
  const { damagePhotoFile, ...rest } = data;
  let payload = rest;
  let headers = {};

  if (damagePhotoFile) {
    const formData = new FormData();
    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        formData.append(key, rest[key]);
      }
    });
    formData.append('damage_photo', damagePhotoFile);
    payload = formData;
    headers = { 'Content-Type': 'multipart/form-data' };
  }

  const response = await apiClient.post(`${API_ENDPOINTS.ALLOCATIONS}/${id}/return`, payload, { headers });
  return response.data;
};

/**
 * Get historical logs for an allocation.
 * @param {string|number} id - Allocation ID
 * @param {Object} params - Pagination params
 * @returns {Promise<Object>} API response
 */
export const getAllocationHistory = async (id, params) => {
  const response = await apiClient.get(API_ENDPOINTS.ALLOCATION_HISTORY(id), { params });
  return response.data;
};

/**
 * Get list of departments (delegates to organization service).
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getDepartments = async (params) => {
  return orgGetDepartments(params);
};

/**
 * Get list of employees (delegates to organization service).
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getEmployees = async (params) => {
  return orgGetEmployees(params);
};

/**
 * Get available assets (not allocated).
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export const getAvailableAssets = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.AVAILABLE_ASSETS, { params });
  return response.data;
};
