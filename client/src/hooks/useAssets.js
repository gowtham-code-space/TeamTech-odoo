import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetHistory,
  uploadAssetPhoto,
  uploadAssetDocument,
} from '../services/features/assets';

/**
 * Custom hook for Asset feature state and operations.
 */
export default function useAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Filter and Sort State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    department: '',
    location: '',
  });

  const [sort, setSort] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const stateRef = useRef({ pagination, filters, sort });
  useEffect(() => {
    stateRef.current = { pagination, filters, sort };
  }, [pagination, filters, sort]);

  // Asset Details & History State
  const [currentAsset, setCurrentAsset] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  /**
   * Fetch list of assets.
   */
  const fetchAssets = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { pagination: pag, filters: filt, sort: srt } = stateRef.current;
      const params = {
        page: pag.currentPage,
        limit: pag.limit,
        search: filt.search,
        status: filt.status,
        category: filt.category,
        department: filt.department,
        location: filt.location,
        sort: srt.column,
        order: srt.direction,
        ...customParams,
      };

      const response = await getAssets(params);
      
      const list = response.data || response.assets || [];
      const meta = response.meta || response.pagination || {};

      setAssets(Array.isArray(response) ? response : list);
      setPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages: meta.totalPages || Math.ceil((meta.total || list.length) / params.limit) || 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch assets');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single asset by ID.
   */
  const fetchAssetById = useCallback(async (id) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const response = await getAssetById(id);
      const data = response.data || response;
      setCurrentAsset(data);
      return data;
    } catch (err) {
      setDetailsError(err.response?.data?.message || err.message || 'Failed to load asset details');
      setCurrentAsset(null);
      throw err;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  /**
   * Fetch history timeline for a single asset.
   */
  const fetchAssetHistory = useCallback(async (id, customParams = {}) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await getAssetHistory(id, customParams);
      const list = response.data || response.history || [];
      setHistory(Array.isArray(response) ? response : list);
    } catch (err) {
      setHistoryError(err.response?.data?.message || err.message || 'Failed to load asset history');
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  /**
   * Create asset.
   */
  const addAsset = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createAsset(data);
      await fetchAssets({ page: 1 });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create asset';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAssets]);

  /**
   * Update asset.
   */
  const editAsset = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAsset(id, data);
      await fetchAssets();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update asset';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAssets]);

  /**
   * Delete asset.
   */
  const removeAsset = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAsset(id);
      await fetchAssets({ page: 1 });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete asset';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAssets]);

  /**
   * Handles photo file uploads for an asset.
   */
  const handlePhotoUpload = useCallback(async (id, file) => {
    try {
      const result = await uploadAssetPhoto(id, file);
      // reload details if looking at this asset
      await fetchAssetById(id);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload photo';
      throw new Error(msg);
    }
  }, [fetchAssetById]);

  /**
   * Handles document uploads for an asset.
   */
  const handleDocumentUpload = useCallback(async (id, file) => {
    try {
      const result = await uploadAssetDocument(id, file);
      // reload details if looking at this asset
      await fetchAssetById(id);
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload document';
      throw new Error(msg);
    }
  }, [fetchAssetById]);

  return {
    assets,
    loading,
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    sort,
    setSort,
    currentAsset,
    setCurrentAsset,
    detailsLoading,
    detailsError,
    history,
    historyLoading,
    historyError,

    fetchAssets,
    fetchAssetById,
    fetchAssetHistory,
    addAsset,
    editAsset,
    removeAsset,
    handlePhotoUpload,
    handleDocumentUpload,
  };
}
