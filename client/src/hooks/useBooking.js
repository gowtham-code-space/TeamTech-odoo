import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getCalendarBookings,
  getResources,
  getAvailableResources,
} from '../services/features/booking';

/**
 * Custom hook for Resource Booking feature.
 */
export default function useBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    department: '',
    resource: '',
    date: '',
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

  // Calendar State
  const [calendarBookings, setCalendarBookings] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Selected Booking Details
  const [currentBooking, setCurrentBooking] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Resources Lookups
  const [resources, setResources] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  /**
   * Fetch paginated and filtered list of bookings.
   */
  const fetchBookings = useCallback(async (customParams = {}) => {
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
        resource: filt.resource,
        date: filt.date,
        sort: srt.column,
        order: srt.direction,
        ...customParams,
      };

      const response = await getBookings(params);
      const list = response.data || response.bookings || [];
      const meta = response.meta || response.pagination || {};

      setBookings(Array.isArray(response) ? response : list);
      setPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages: meta.totalPages || Math.ceil((meta.total || list.length) / params.limit) || 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single booking by ID.
   */
  const fetchBookingById = useCallback(async (id) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const response = await getBookingById(id);
      const data = response.data || response;
      setCurrentBooking(data);
      return data;
    } catch (err) {
      setDetailsError(err.response?.data?.message || err.message || 'Failed to load booking specifications');
      setCurrentBooking(null);
      throw err;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  /**
   * Fetch bookings in range for Calendar View.
   */
  const fetchCalendarBookings = useCallback(async (startDate, endDate, resourceId) => {
    setCalendarLoading(true);
    try {
      const params = { startDate, endDate, resourceId };
      const response = await getCalendarBookings(params);
      const list = response.data || response.bookings || [];
      setCalendarBookings(Array.isArray(response) ? response : list);
    } catch (err) {
      setCalendarBookings([]);
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  /**
   * Fetch all bookable resources.
   */
  const fetchResources = useCallback(async (params = {}) => {
    setResourcesLoading(true);
    try {
      const response = await getResources(params);
      const list = response.data || response.resources || [];
      setResources(Array.isArray(response) ? response : list);
    } catch (err) {
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  /**
   * Fetch available resources for time/date.
   */
  const fetchAvailableResources = useCallback(async (params = {}) => {
    setResourcesLoading(true);
    try {
      const response = await getAvailableResources(params);
      const list = response.data || response.resources || [];
      setAvailableResources(Array.isArray(response) ? response : list);
    } catch (err) {
      setAvailableResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  /**
   * Create booking.
   */
  const addBooking = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createBooking(data);
      await fetchBookings({ page: 1 });
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Booking creation failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  /**
   * Update booking.
   */
  const editBooking = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateBooking(id, data);
      await fetchBookings();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Booking modification failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  /**
   * Cancel booking.
   */
  const undoBooking = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelBooking(id, data);
      await fetchBookings();
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Booking cancellation failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    sort,
    setSort,
    calendarBookings,
    calendarLoading,
    currentBooking,
    setCurrentBooking,
    detailsLoading,
    detailsError,
    resources,
    availableResources,
    resourcesLoading,

    fetchBookings,
    fetchBookingById,
    fetchCalendarBookings,
    fetchResources,
    fetchAvailableResources,
    addBooking,
    editBooking,
    undoBooking,
  };
}
