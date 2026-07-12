import apiClient from '../api';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

/**
 * Service methods for Assets Management feature.
 */

/**
 * Get assets with pagination, filtering, searching and sorting.
 * @param {Object} params - Query parameters (page, limit, search, status, category, department, location, sort, order)
 * @returns {Promise<Object>} API response
 */
export const getAssets = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.ASSETS, { params });
  return response.data;
};

/**
 * Search assets.
 * @param {string} query - Search term
 * @param {Object} extraParams - Extra filters
 * @returns {Promise<Object>} API response
 */
export const searchAssets = async (query, extraParams = {}) => {
  const params = { search: query, ...extraParams };
  const response = await apiClient.get(API_ENDPOINTS.ASSETS, { params });
  return response.data;
};

/**
 * Get asset by ID.
 * @param {string|number} id - Asset ID
 * @returns {Promise<Object>} API response
 */
export const getAssetById = async (id) => {
  const response = await apiClient.get(`${API_ENDPOINTS.ASSETS}/${id}`);
  return response.data;
};

/**
 * Create a new asset.
 * @param {Object} data - Asset fields
 * @returns {Promise<Object>} API response
 */
export const createAsset = async (data) => {
  const response = await apiClient.post(API_ENDPOINTS.ASSETS, data);
  return response.data;
};

/**
 * Update an existing asset.
 * @param {string|number} id - Asset ID
 * @param {Object} data - Asset fields to update
 * @returns {Promise<Object>} API response
 */
export const updateAsset = async (id, data) => {
  const response = await apiClient.put(`${API_ENDPOINTS.ASSETS}/${id}`, data);
  return response.data;
};

/**
 * Delete an asset.
 * @param {string|number} id - Asset ID
 * @returns {Promise<Object>} API response
 */
export const deleteAsset = async (id) => {
  const response = await apiClient.delete(`${API_ENDPOINTS.ASSETS}/${id}`);
  return response.data;
};

/**
 * Get lifecycle / allocation / maintenance / transfer / audit history of an asset.
 * @param {string|number} id - Asset ID
 * @param {Object} params - Query parameters for paging history
 * @returns {Promise<Object>} API response
 */
export const getAssetHistory = async (id, params) => {
  const response = await apiClient.get(API_ENDPOINTS.ASSET_HISTORY(id), { params });
  return response.data;
};

/**
 * Upload asset photo.
 * @param {string|number} id - Asset ID
 * @param {File} file - Photo file
 * @returns {Promise<Object>} API response
 */
export const uploadAssetPhoto = async (id, file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await apiClient.post(API_ENDPOINTS.ASSET_PHOTO(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Upload asset document.
 * @param {string|number} id - Asset ID
 * @param {File} file - Document file
 * @returns {Promise<Object>} API response
 */
export const uploadAssetDocument = async (id, file) => {
  const formData = new FormData();
  formData.append('document', file);
  const response = await apiClient.post(API_ENDPOINTS.ASSET_DOCUMENT(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
