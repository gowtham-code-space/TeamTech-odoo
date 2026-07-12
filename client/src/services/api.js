import axios from 'axios';

/**
 * Shared Axios instance for the AssetFlow client.
 *
 * Base URL is read from the VITE_API_BASE_URL environment variable.
 * Authentication interceptors are handled by Member 1 (core infrastructure).
 * This file MUST NOT be modified by feature modules — import it as-is.
 *
 * Usage:
 *   import apiClient from '../api';
 *   apiClient.get('/departments', { params });
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiClient;
