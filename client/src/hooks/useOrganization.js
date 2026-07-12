import { useState, useCallback, useRef, useEffect } from 'react';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getRoles,
} from '../services/features/organization';

/**
 * Custom hook to manage Organization Management operations and states.
 * Uses useRef to track latest filter/pagination values inside memoized fetch
 * functions, giving them stable references (empty useCallback deps) and
 * preventing stale-closure / infinite-loop bugs.
 */
export default function useOrganization() {
  // ─── Departments State ────────────────────────────────────────────────────
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [deptError, setDeptError] = useState(null);
  const [deptPagination, setDeptPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [deptFilters, setDeptFilters] = useState({ search: '', status: '' });

  // Keep latest dept state accessible in memoized callbacks without triggering re-memoization
  const deptRef = useRef({ pagination: deptPagination, filters: deptFilters });
  useEffect(() => {
    deptRef.current = { pagination: deptPagination, filters: deptFilters };
  }, [deptPagination, deptFilters]);

  // ─── Categories State ─────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState(null);
  const [catPagination, setCatPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [catFilters, setCatFilters] = useState({ search: '' });

  const catRef = useRef({ pagination: catPagination, filters: catFilters });
  useEffect(() => {
    catRef.current = { pagination: catPagination, filters: catFilters };
  }, [catPagination, catFilters]);

  // ─── Employees State ──────────────────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [empError, setEmpError] = useState(null);
  const [empPagination, setEmpPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
  });
  const [empFilters, setEmpFilters] = useState({
    search: '',
    department: '',
    status: '',
  });

  const empRef = useRef({ pagination: empPagination, filters: empFilters });
  useEffect(() => {
    empRef.current = { pagination: empPagination, filters: empFilters };
  }, [empPagination, empFilters]);

  // ─── Roles State ──────────────────────────────────────────────────────────
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Helper: normalise a paginated API response into { data[], meta{} }
  // Supports:  { data, meta }, { data, pagination }, { departments, … },
  //            or bare arrays.
  // ─────────────────────────────────────────────────────────────────────────
  const normaliseResponse = (response, listKey) => {
    if (Array.isArray(response)) {
      return { list: response, meta: {} };
    }
    const list =
      response.data ||
      response[listKey] ||
      [];
    const meta = response.meta || response.pagination || {};
    return { list: Array.isArray(list) ? list : [], meta };
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Departments — fetch
  // useCallback with [] → stable reference; reads latest state via deptRef
  // ─────────────────────────────────────────────────────────────────────────
  const fetchDepartments = useCallback(async (customParams = {}) => {
    setDeptLoading(true);
    setDeptError(null);
    try {
      const { pagination, filters } = deptRef.current;
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        ...customParams,
      };
      const response = await getDepartments(params);
      const { list, meta } = normaliseResponse(response, 'departments');
      setDepartments(list);
      setDeptPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages:
          meta.totalPages ||
          Math.ceil((meta.total || list.length) / (meta.limit || params.limit)) ||
          1,
      }));
    } catch (err) {
      setDeptError(
        err.response?.data?.message || err.message || 'Failed to fetch departments'
      );
      setDepartments([]);
    } finally {
      setDeptLoading(false);
    }
  }, []); // stable — reads latest state through deptRef

  /** Create a department and refresh the list. */
  const addDepartment = useCallback(async (data) => {
    setDeptLoading(true);
    setDeptError(null);
    try {
      const result = await createDepartment(data);
      await fetchDepartments({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to create department';
      setDeptError(msg);
      throw new Error(msg);
    } finally {
      setDeptLoading(false);
    }
  }, [fetchDepartments]);

  /** Update a department and refresh the list. */
  const editDepartment = useCallback(async (id, data) => {
    setDeptLoading(true);
    setDeptError(null);
    try {
      const result = await updateDepartment(id, data);
      await fetchDepartments();
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to update department';
      setDeptError(msg);
      throw new Error(msg);
    } finally {
      setDeptLoading(false);
    }
  }, [fetchDepartments]);

  /** Delete a department and refresh the list from page 1. */
  const removeDepartment = useCallback(async (id) => {
    setDeptLoading(true);
    setDeptError(null);
    try {
      const result = await deleteDepartment(id);
      await fetchDepartments({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to delete department';
      setDeptError(msg);
      throw new Error(msg);
    } finally {
      setDeptLoading(false);
    }
  }, [fetchDepartments]);

  // ─────────────────────────────────────────────────────────────────────────
  // Categories — fetch
  // ─────────────────────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async (customParams = {}) => {
    setCatLoading(true);
    setCatError(null);
    try {
      const { pagination, filters } = catRef.current;
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search,
        ...customParams,
      };
      const response = await getCategories(params);
      const { list, meta } = normaliseResponse(response, 'categories');
      setCategories(list);
      setCatPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages:
          meta.totalPages ||
          Math.ceil((meta.total || list.length) / (meta.limit || params.limit)) ||
          1,
      }));
    } catch (err) {
      setCatError(
        err.response?.data?.message || err.message || 'Failed to fetch categories'
      );
      setCategories([]);
    } finally {
      setCatLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (data) => {
    setCatLoading(true);
    setCatError(null);
    try {
      const result = await createCategory(data);
      await fetchCategories({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to create category';
      setCatError(msg);
      throw new Error(msg);
    } finally {
      setCatLoading(false);
    }
  }, [fetchCategories]);

  const editCategory = useCallback(async (id, data) => {
    setCatLoading(true);
    setCatError(null);
    try {
      const result = await updateCategory(id, data);
      await fetchCategories();
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to update category';
      setCatError(msg);
      throw new Error(msg);
    } finally {
      setCatLoading(false);
    }
  }, [fetchCategories]);

  const removeCategory = useCallback(async (id) => {
    setCatLoading(true);
    setCatError(null);
    try {
      const result = await deleteCategory(id);
      await fetchCategories({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to delete category';
      setCatError(msg);
      throw new Error(msg);
    } finally {
      setCatLoading(false);
    }
  }, [fetchCategories]);

  // ─────────────────────────────────────────────────────────────────────────
  // Employees — fetch
  // ─────────────────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async (customParams = {}) => {
    setEmpLoading(true);
    setEmpError(null);
    try {
      const { pagination, filters } = empRef.current;
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search,
        department: filters.department,
        status: filters.status,
        ...customParams,
      };
      const response = await getEmployees(params);
      const { list, meta } = normaliseResponse(response, 'employees');
      setEmployees(list);
      setEmpPagination((prev) => ({
        ...prev,
        currentPage: meta.page || meta.currentPage || params.page,
        limit: meta.limit || params.limit,
        totalItems: meta.total || meta.totalItems || list.length,
        totalPages:
          meta.totalPages ||
          Math.ceil((meta.total || list.length) / (meta.limit || params.limit)) ||
          1,
      }));
    } catch (err) {
      setEmpError(
        err.response?.data?.message || err.message || 'Failed to fetch employees'
      );
      setEmployees([]);
    } finally {
      setEmpLoading(false);
    }
  }, []);

  const addEmployee = useCallback(async (data) => {
    setEmpLoading(true);
    setEmpError(null);
    try {
      const result = await createEmployee(data);
      await fetchEmployees({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to create employee';
      setEmpError(msg);
      throw new Error(msg);
    } finally {
      setEmpLoading(false);
    }
  }, [fetchEmployees]);

  const editEmployee = useCallback(async (id, data) => {
    setEmpLoading(true);
    setEmpError(null);
    try {
      const result = await updateEmployee(id, data);
      await fetchEmployees();
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to update employee';
      setEmpError(msg);
      throw new Error(msg);
    } finally {
      setEmpLoading(false);
    }
  }, [fetchEmployees]);

  const removeEmployee = useCallback(async (id) => {
    setEmpLoading(true);
    setEmpError(null);
    try {
      const result = await deleteEmployee(id);
      await fetchEmployees({ page: 1 });
      return result;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Failed to delete employee';
      setEmpError(msg);
      throw new Error(msg);
    } finally {
      setEmpLoading(false);
    }
  }, [fetchEmployees]);

  // ─────────────────────────────────────────────────────────────────────────
  // Roles — fetch from backend (no hardcoded roles)
  // ─────────────────────────────────────────────────────────────────────────
  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const data = await getRoles();
      setRoles(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setRolesError(
        err.response?.data?.message || err.message || 'Failed to fetch roles'
      );
      setRoles([]);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  return {
    // Departments
    departments,
    deptLoading,
    deptError,
    deptPagination,
    deptFilters,
    setDeptFilters,
    setDeptPagination,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,

    // Categories
    categories,
    catLoading,
    catError,
    catPagination,
    catFilters,
    setCatFilters,
    setCatPagination,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,

    // Employees
    employees,
    empLoading,
    empError,
    empPagination,
    empFilters,
    setEmpFilters,
    setEmpPagination,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,

    // Roles
    roles,
    rolesLoading,
    rolesError,
    fetchRoles,
  };
}
