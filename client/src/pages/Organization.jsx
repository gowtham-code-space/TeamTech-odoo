import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, Tags, Users, Plus, Search, RefreshCw, AlertTriangle } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Are you sure you want to delete <span className="font-bold">{label}</span>? This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm cursor-pointer transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm cursor-pointer shadow disabled:opacity-50"
        >
          {loading ? 'Deleting…' : 'Confirm Delete'}
        </button>
      </div>
    </div>
  );
}

/**
 * Organization Page
 * Tabs between Department, Category, and Employee management, each backed
 * by its own list/pagination/sort/filter state from useOrganization.
 *
 * NOTE: field names below (departments, deptLoading, fetchDepartments, ...)
 * are inferred to match the useAllocation/useAssets hook pattern used
 * elsewhere in this project. Rename to match your actual useOrganization
 * hook if it differs.
 */
export default function Organization() {
  const [activeTab, setActiveTab] = useState('departments');
  const [formModal, setFormModal] = useState({ open: false, record: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const {
    // Departments
    departments,
    deptLoading,
    deptError,
    deptPagination,
    setDeptPagination,
    deptFilters,
    setDeptFilters,
    deptSort,
    setDeptSort,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
    toggleDepartmentStatus,

    // Categories
    categories,
    catLoading,
    catError,
    catPagination,
    setCatPagination,
    catFilters,
    setCatFilters,
    catSort,
    setCatSort,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,

    // Employees
    employees,
    empLoading,
    empError,
    empPagination,
    setEmpPagination,
    empFilters,
    setEmpFilters,
    empSort,
    setEmpSort,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,

    // Shared lookups
    roles,
    rolesLoading,
    fetchRoles,
  } = useOrganization();

  // ── Data loaders, scoped to the active tab ──────────────────────────────
  useEffect(() => {
    if (activeTab === 'departments') fetchDepartments();
  }, [activeTab, deptFilters, deptSort.column, deptSort.direction, deptPagination.currentPage, fetchDepartments]);

  useEffect(() => {
    if (activeTab === 'categories') fetchCategories();
  }, [activeTab, catFilters, catSort.column, catSort.direction, catPagination.currentPage, fetchCategories]);

  useEffect(() => {
    if (activeTab === 'employees') fetchEmployees();
  }, [activeTab, empFilters, empSort.column, empSort.direction, empPagination.currentPage, fetchEmployees]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // ── Debounced search handlers, one timer per tab ────────────────────────
  const deptSearchTimer = useRef(null);
  const handleDeptSearch = (val) => {
    clearTimeout(deptSearchTimer.current);
    deptSearchTimer.current = setTimeout(() => {
      setDeptFilters((prev) => ({ ...prev, search: val }));
      setDeptPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);
  };

  const catSearchTimer = useRef(null);
  const handleCatSearch = (val) => {
    clearTimeout(catSearchTimer.current);
    catSearchTimer.current = setTimeout(() => {
      setCatFilters((prev) => ({ ...prev, search: val }));
      setCatPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);
  };

  const empSearchTimer = useRef(null);
  const handleEmpSearch = (val) => {
    clearTimeout(empSearchTimer.current);
    empSearchTimer.current = setTimeout(() => {
      setEmpFilters((prev) => ({ ...prev, search: val }));
      setEmpPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);
  };

  // ── Generic sort toggler, reused across all three tables ────────────────
  const handleSort = (setSortFn) => (column) => {
    setSortFn((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleToggleDeptStatus = async (record) => {
    try {
      await toggleDepartmentStatus(record.id, record.status === 'active' ? 'inactive' : 'active');
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Failed to update department status');
    }
  };

  // ── Create / edit submit, routed by active tab ──────────────────────────
  const handleFormSubmit = async (data) => {
    setActionError('');
    try {
      if (activeTab === 'departments') {
        if (formModal.record) await editDepartment(formModal.record.id, data);
        else await addDepartment(data);
        fetchDepartments();
      } else if (activeTab === 'categories') {
        if (formModal.record) await editCategory(formModal.record.id, data);
        else await addCategory(data);
        fetchCategories();
      } else if (activeTab === 'employees') {
        if (formModal.record) await editEmployee(formModal.record.id, data);
        else await addEmployee(data);
        fetchEmployees();
      }
      setFormModal({ open: false, record: null });
    } catch (err) {
      setActionError(err.message || 'Failed to save record.');
    }
  };

  // ── Delete confirm, routed by active tab ────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteModal.record) return;
    setDeleteLoading(true);
    setActionError('');
    try {
      if (activeTab === 'departments') {
        await removeDepartment(deleteModal.record.id);
        fetchDepartments();
      } else if (activeTab === 'categories') {
        await removeCategory(deleteModal.record.id);
        fetchCategories();
      } else if (activeTab === 'employees') {
        await removeEmployee(deleteModal.record.id);
        fetchEmployees();
      }
      setDeleteModal({ open: false, record: null });
    } catch (err) {
      setActionError(err.message || 'Failed to delete record.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteLabel = deleteModal.record
    ? deleteModal.record.dept_name ||
    deleteModal.record.category_name ||
    deleteModal.record.name ||
    'this record'
    : '';

  const tabNoun =
    activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Category' : 'Employee';
  const formModalTitle = `${formModal.record ? 'Edit' : 'Create'} ${tabNoun}`;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Structure"
        subtitle="Manage departments, view headcount, and monitor asset allocation budgets."
        breadcrumbs={[{ label: 'Organization' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => {
              setActionError('');
              setFormModal({ open: true, record: null });
            }}
          >
            Create {tabNoun}
          </Button>
        }
      />

      {/* ── Tab bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 -mb-px transition-colors cursor-pointer ${isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── DEPARTMENTS TAB ─────────────────────────────────────────────── */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-64">
              <Input
                id="dept-search"
                placeholder="Search departments…"
                icon={Search}
                onChange={(e) => handleDeptSearch(e.target.value)}
              />
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
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchDepartments()}
              disabled={deptLoading}
            >
              Refresh
            </Button>
          </div>

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
            onEdit={(record) => {
              setActionError('');
              setFormModal({ open: true, record });
            }}
            onDelete={(record) => {
              setActionError('');
              setDeleteModal({ open: true, record });
            }}
            onToggleStatus={handleToggleDeptStatus}
          />
        </div>
      )}

      {/* ── CATEGORIES TAB ──────────────────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-64">
              <Input
                id="cat-search"
                placeholder="Search categories…"
                icon={Search}
                onChange={(e) => handleCatSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchCategories()}
              disabled={catLoading}
            >
              Refresh
            </Button>
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
            onEdit={(record) => {
              setActionError('');
              setFormModal({ open: true, record });
            }}
            onDelete={(record) => {
              setActionError('');
              setDeleteModal({ open: true, record });
            }}
          />
        </div>
      )}

      {/* ── EMPLOYEES TAB ───────────────────────────────────────────────── */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
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
                  {dept.dept_name || dept.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchEmployees()}
              disabled={empLoading}
            >
              Refresh
            </Button>
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
            onEdit={(record) => {
              setActionError('');
              setFormModal({ open: true, record });
            }}
            onDelete={(record) => {
              setActionError('');
              setDeleteModal({ open: true, record });
            }}
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
