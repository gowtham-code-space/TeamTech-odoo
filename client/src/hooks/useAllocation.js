import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getAllocations,
  getAllocationById,
  allocateAsset,
  transferAsset,
  returnAsset,
  getAllocationHistory,
  getAvailableAssets,
} from '../services/features/allocation';

/**
 * Custom hook for Asset Allocation feature.
 */
export default function useAllocation() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    employee: '',
  });

  // Sort State
  const [sort, setSort] = useState({
    column: 'created_at',
    direction: 'desc',
  });

  const stateRef = useRef({ pagination, filters, sort });
  useEffect(() => {
    stateRef.current = { pagination, filters, sort };
  }, [pagination, filters, sort]);

  // Current selected allocation details
  const [currentAllocation, setCurrentAllocation] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Allocation History State
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Available Assets for allocation
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);

  /**
   * Fetch all allocations.
   */
  const fetchAllocations = useCallback(async (customParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { pagination: pag, filters: filt, sort: srt } = stateRef.current;
      const params = {
        page: pag.currentPage,
        limit: pag.limit,
        search: filt.search,
        status: filt.status,
        department: filt.department,
        employee: filt.employee,
        sort: srt.column,
        order: srt.direction,
        ...customParams,
      };

      const response = await getAllocations(params);
      const list = response.data || response.allocations || [];
      const meta = response.meta || response.pagination || {};

      setAllocations(Array.isArray(response) ? response : list);
      setPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages: meta.totalPages || Math.ceil((meta.total || list.length) / params.limit) || 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch allocations');
      setAllocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single allocation by ID.
   */
  const fetchAllocationById = useCallback(async (id) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const response = await getAllocationById(id);
      const data = response.data || response;
      setCurrentAllocation(data);
      return data;
    } catch (err) {
      setDetailsError(err.response?.data?.message || err.message || 'Failed to load allocation details');
      setCurrentAllocation(null);
      throw err;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  /**
   * Fetch history of an allocation.
   */
  const fetchAllocationHistory = useCallback(async (id, customParams = {}) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await getAllocationHistory(id, customParams);
      const list = response.data || response.history || [];
      setHistory(Array.isArray(response) ? response : list);
    } catch (err) {
      setHistoryError(err.response?.data?.message || err.message || 'Failed to load allocation history');
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  /**
   * Fetch available assets for allocation dropdown.
   */
  const fetchAvailableAssets = useCallback(async (customParams = {}) => {
    setAssetsLoading(true);
    try {
      const response = await getAvailableAssets(customParams);
      const list = response.data || response.assets || [];
      setAvailableAssets(Array.isArray(response) ? response : list);
    } catch (err) {
      setAvailableAssets([]);
    } finally {
      setAssetsLoading(false);
    }
  }, []);

  /**
   * Create an allocation.
   */
  const doAllocate = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await allocateAsset(data);
      await fetchAllocations({ page: 1 });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Allocation failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAllocations]);

  /**
   * Transfer an asset.
   */
  const doTransfer = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await transferAsset(id, data);
      await fetchAllocations();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Transfer failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAllocations]);

  /**
   * Return an asset.
   */
  const doReturn = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await returnAsset(id, data);
      await fetchAllocations();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Return failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchAllocations]);

  return {
    allocations,
    loading,
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    sort,
    setSort,
    currentAllocation,
    setCurrentAllocation,
    detailsLoading,
    detailsError,
    history,
    historyLoading,
    historyError,
    availableAssets,
    assetsLoading,

    fetchAllocations,
    fetchAllocationById,
    fetchAllocationHistory,
    fetchAvailableAssets,
    doAllocate,
    doTransfer,
    doReturn,
  };
}
