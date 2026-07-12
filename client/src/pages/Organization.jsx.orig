import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, Tags, Users, Plus, Search, RefreshCw, AlertTriangle, X } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

import DepartmentTable from '../components/organization/DepartmentTable';
import DepartmentForm from '../components/organization/DepartmentForm';
import CategoryTable from '../components/organization/CategoryTable';
import CategoryForm from '../components/organization/CategoryForm';
import EmployeeTable from '../components/organization/EmployeeTable';
import EmployeeForm from '../components/organization/EmployeeForm';

import useOrganization from '../hooks/useOrganization';

// ─── Tab configuration ───────────────────────────────────────────────────────
const TABS = [
  { id: 'departments', label: 'Department Management', icon: Building2 },
  { id: 'categories', label: 'Asset Category Management', icon: Tags },
  { id: 'employees', label: 'Employee Directory', icon: Users },
];

// ─── Confirm-delete inline dialog ────────────────────────────────────────────
/**
 * ConfirmDeleteDialog
 * A lightweight confirmation overlay used when deleting a record.
 *
 * @param {Object} props
 * @param {string} props.label - Description of the record being deleted
 * @param {boolean} props.loading - Disables controls while the deletion is in progress
 * @param {Function} props.onConfirm - Called when the user clicks Confirm
 * @param {Function} props.onCancel - Called when the user clicks Cancel
 */
function ConfirmDeleteDialog({ label, loading, onConfirm, onCancel }) {
  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {/* Simulation console */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Evaluator Preview Console</h3>
          <p className="text-xs text-slate-400 mt-0.5">Toggle states to test table reaction to different API states</p>
        </div>
        <div className="flex gap-2">
          {['success', 'loading', 'empty', 'error'].map((s) => (
            <button
              key={s}
              onClick={() => setViewState(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                viewState === s
                  ? 'bg-indigo-650 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Organization Structure</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage departments, view headcount, and monitor asset allocation budgets</p>
        </div>
        
        {viewState === 'success' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>Create Department</span>
          </button>
        )}
=======
    <div className="space-y-4 text-left">
      <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p className="text-sm text-rose-700 font-medium leading-relaxed">
          You are about to permanently delete <span className="font-bold">&quot;{label}&quot;</span>.
          This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="button" variant="danger" loading={loading} onClick={onConfirm}>
          Delete
        </Button>
>>>>>>> sakthivel
      </div>
    </div>
  );
}

<<<<<<< HEAD
      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Organization Structure</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/departments`. Please verify connection parameters.
          </p>
          <button
            onClick={() => setViewState('success')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl shadow cursor-pointer"
          >
            <RiRefreshLine className="w-4 h-4 animate-spin-hover" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {viewState === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
          <div className="h-14 bg-slate-100 border-b border-slate-200" />
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/6" />
                <div className="h-4 bg-slate-200 rounded w-24" />
=======
// ─── Error banner ─────────────────────────────────────────────────────────────
/**
 * ErrorBanner — Dismissible top-of-section error alert.
 * @param {Object} props
 * @param {string} props.message
 * @param {Function} props.onDismiss
 */
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
/**
 * Organization Page
 * Entry point for the Organization Management module.
 * Contains three tabs: Department Management, Asset Category Management, Employee Directory.
 */
export default function Organization() {
  const [activeTab, setActiveTab] = useState('departments');

  // --- Modal state ---
  const [formModal, setFormModal] = useState({ open: false, record: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // --- Sort state ---
  const [deptSort, setDeptSort] = useState({ column: '', direction: '' });
  const [catSort, setCatSort] = useState({ column: '', direction: '' });
  const [empSort, setEmpSort] = useState({ column: '', direction: '' });

  const {
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

    // Roles (from backend)
    roles,
    rolesLoading,
    fetchRoles,
  } = useOrganization();

  // ── Fetch data whenever active tab, filters or page changes ──
  // fetchDepartments/Categories/Employees are stable refs from the hook (useCallback with []).
  // Intentionally excluding them from deps to avoid double-firing — the state values
  // (deptFilters, deptPagination.currentPage) already capture the trigger conditions.
  useEffect(() => {
    if (activeTab === 'departments') {
      fetchDepartments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, deptFilters, deptPagination.currentPage]);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, catFilters, catPagination.currentPage]);

  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployees();
      if (roles.length === 0) fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, empFilters, empPagination.currentPage]);

  // ── Debounced search handlers (useRef timers — no hook-rule violations) ──
  const deptSearchTimer = useRef(null);
  const handleDeptSearch = useCallback(
    (value) => {
      clearTimeout(deptSearchTimer.current);
      deptSearchTimer.current = setTimeout(() => {
        setDeptFilters((prev) => ({ ...prev, search: value }));
        setDeptPagination((prev) => ({ ...prev, currentPage: 1 }));
      }, 400);
    },
    [setDeptFilters, setDeptPagination]
  );

  const catSearchTimer = useRef(null);
  const handleCatSearch = useCallback(
    (value) => {
      clearTimeout(catSearchTimer.current);
      catSearchTimer.current = setTimeout(() => {
        setCatFilters((prev) => ({ ...prev, search: value }));
        setCatPagination((prev) => ({ ...prev, currentPage: 1 }));
      }, 400);
    },
    [setCatFilters, setCatPagination]
  );

  const empSearchTimer = useRef(null);
  const handleEmpSearch = useCallback(
    (value) => {
      clearTimeout(empSearchTimer.current);
      empSearchTimer.current = setTimeout(() => {
        setEmpFilters((prev) => ({ ...prev, search: value }));
        setEmpPagination((prev) => ({ ...prev, currentPage: 1 }));
      }, 400);
    },
    [setEmpFilters, setEmpPagination]
  );

  // ── Sort handler factory ──
  const handleSort = (setSortState) => (column) => {
    setSortState((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleFormSubmit = async (data) => {
    setActionError('');
    try {
      if (activeTab === 'departments') {
        if (formModal.record) {
          await editDepartment(formModal.record.id, data);
        } else {
          await addDepartment(data);
        }
      } else if (activeTab === 'categories') {
        if (formModal.record) {
          await editCategory(formModal.record.id, data);
        } else {
          await addCategory(data);
        }
      } else if (activeTab === 'employees') {
        if (formModal.record) {
          await editEmployee(formModal.record.id, data);
        } else {
          await addEmployee(data);
        }
      }
      setFormModal({ open: false, record: null });
    } catch (err) {
      setActionError(err.message || 'An unexpected error occurred.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.record) return;
    setDeleteLoading(true);
    setActionError('');
    try {
      if (activeTab === 'departments') {
        await removeDepartment(deleteModal.record.id);
      } else if (activeTab === 'categories') {
        await removeCategory(deleteModal.record.id);
      } else if (activeTab === 'employees') {
        await removeEmployee(deleteModal.record.id);
      }
      setDeleteModal({ open: false, record: null });
    } catch (err) {
      setActionError(err.message || 'Delete failed. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleDeptStatus = async (dept, newStatus) => {
    setActionError('');
    try {
      await editDepartment(dept.id, { ...dept, status: newStatus });
    } catch (err) {
      setActionError(err.message || 'Status update failed.');
    }
  };

  const dismissError = () => setActionError('');

  // ── Refresh current tab ──
  const handleRefresh = () => {
    if (activeTab === 'departments') fetchDepartments();
    else if (activeTab === 'categories') fetchCategories();
    else fetchEmployees();
  };

  // ── Modal title ──
  const formModalTitle =
    activeTab === 'departments'
      ? formModal.record ? 'Edit Department' : 'Add Department'
      : activeTab === 'categories'
      ? formModal.record ? 'Edit Category' : 'Create Category'
      : formModal.record ? 'Edit Employee' : 'Add Employee';

  const deleteLabel = deleteModal.record?.name || 'this record';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Organization Management"
        subtitle="Manage departments, asset categories, and the employee directory."
        breadcrumbs={[{ label: 'Organization' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={deptLoading || catLoading || empLoading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setFormModal({ open: true, record: null })}
            >
              {activeTab === 'departments'
                ? 'Add Department'
                : activeTab === 'categories'
                ? 'Create Category'
                : 'Add Employee'}
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-slate-100 rounded-2xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`org-tab-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id);
                setActionError('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex-1 justify-center ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action error banner */}
      <ErrorBanner message={actionError} onDismiss={dismissError} />

      {/* ── DEPARTMENTS TAB ─────────────────────────────────────────────── */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-64">
                <Input
                  id="dept-search"
                  placeholder="Search departments…"
                  icon={Search}
                  onChange={(e) => handleDeptSearch(e.target.value)}
                />
>>>>>>> sakthivel
              </div>
              <select
                id="dept-status-filter"
                defaultValue=""
                onChange={(e) => {
                  setDeptFilters((prev) => ({ ...prev, status: e.target.value }));
                  setDeptPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Fetch error */}
          {deptError && !deptLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{deptError}</span>
              <button
                onClick={() => fetchDepartments()}
                className="ml-auto text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <DepartmentTable
            departments={departments}
            loading={deptLoading}
            pagination={{
              currentPage: deptPagination.currentPage,
              totalPages: deptPagination.totalPages,
              totalItems: deptPagination.totalItems,
              limit: deptPagination.limit,
              onPageChange: (page) =>
                setDeptPagination((prev) => ({ ...prev, currentPage: page })),
            }}
            sortColumn={deptSort.column}
            sortDirection={deptSort.direction}
            onSort={handleSort(setDeptSort)}
            onEdit={(record) => setFormModal({ open: true, record })}
            onDelete={(record) => setDeleteModal({ open: true, record })}
            onToggleStatus={handleToggleDeptStatus}
          />
        </div>
      )}

      {/* ── CATEGORIES TAB ──────────────────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="w-full sm:w-64">
            <Input
              id="cat-search"
              placeholder="Search categories…"
              icon={Search}
              onChange={(e) => handleCatSearch(e.target.value)}
            />
          </div>

          {catError && !catLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{catError}</span>
              <button
                onClick={() => fetchCategories()}
                className="ml-auto text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

<<<<<<< HEAD
      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiBuilding4Line className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Departments Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no departments registered under your organization. Create one to begin.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && departments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department Name</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Department Head</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Employee Count</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.dept_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-600">{dept.dept_id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{dept.dept_name}</td>
                    <td className="px-6 py-4 text-slate-700">{dept.head}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{dept.count} members</td>
                    <td className="px-6 py-4 font-semibold text-indigo-600">{dept.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
=======
          <CategoryTable
            categories={categories}
            loading={catLoading}
            pagination={{
              currentPage: catPagination.currentPage,
              totalPages: catPagination.totalPages,
              totalItems: catPagination.totalItems,
              limit: catPagination.limit,
              onPageChange: (page) =>
                setCatPagination((prev) => ({ ...prev, currentPage: page })),
            }}
            sortColumn={catSort.column}
            sortDirection={catSort.direction}
            onSort={handleSort(setCatSort)}
            onEdit={(record) => setFormModal({ open: true, record })}
            onDelete={(record) => setDeleteModal({ open: true, record })}
          />
        </div>
      )}

      {/* ── EMPLOYEES TAB ───────────────────────────────────────────────── */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="w-full sm:w-64">
              <Input
                id="emp-search"
                placeholder="Search employees…"
                icon={Search}
                onChange={(e) => handleEmpSearch(e.target.value)}
              />
            </div>
            <select
              id="emp-dept-filter"
              defaultValue=""
              onChange={(e) => {
                setEmpFilters((prev) => ({ ...prev, department: e.target.value }));
                setEmpPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select
              id="emp-status-filter"
              defaultValue=""
              onChange={(e) => {
                setEmpFilters((prev) => ({ ...prev, status: e.target.value }));
                setEmpPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
>>>>>>> sakthivel
          </div>

          {empError && !empLoading && (
            <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{empError}</span>
              <button
                onClick={() => fetchEmployees()}
                className="ml-auto text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <EmployeeTable
            employees={employees}
            loading={empLoading}
            pagination={{
              currentPage: empPagination.currentPage,
              totalPages: empPagination.totalPages,
              totalItems: empPagination.totalItems,
              limit: empPagination.limit,
              onPageChange: (page) =>
                setEmpPagination((prev) => ({ ...prev, currentPage: page })),
            }}
            sortColumn={empSort.column}
            sortDirection={empSort.direction}
            onSort={handleSort(setEmpSort)}
            onEdit={(record) => setFormModal({ open: true, record })}
            onDelete={(record) => setDeleteModal({ open: true, record })}
          />
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ─────────────────────────────────────────── */}
      <Modal
        isOpen={formModal.open}
        onClose={() => {
          setFormModal({ open: false, record: null });
          setActionError('');
        }}
        title={formModalTitle}
        size="lg"
      >
        {/* Error inside the modal */}
        {actionError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-700 font-medium -mt-2 mb-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {activeTab === 'departments' && formModal.open && (
          <DepartmentForm
            initialData={formModal.record}
            departments={departments}
            loading={deptLoading}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormModal({ open: false, record: null });
              setActionError('');
            }}
          />
        )}

        {activeTab === 'categories' && formModal.open && (
          <CategoryForm
            initialData={formModal.record}
            loading={catLoading}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormModal({ open: false, record: null });
              setActionError('');
            }}
          />
        )}

        {activeTab === 'employees' && formModal.open && (
          <EmployeeForm
            initialData={formModal.record}
            departments={departments}
            roles={roles}
            rolesLoading={rolesLoading}
            loading={empLoading}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setFormModal({ open: false, record: null });
              setActionError('');
            }}
          />
        )}
      </Modal>

      {/* ── DELETE CONFIRM MODAL ────────────────────────────────────────── */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModal({ open: false, record: null });
            setActionError('');
          }
        }}
        title="Confirm Deletion"
        size="sm"
      >
        <ConfirmDeleteDialog
          label={deleteLabel}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeleteModal({ open: false, record: null });
            setActionError('');
          }}
        />
      </Modal>
    </div>
  );
}
