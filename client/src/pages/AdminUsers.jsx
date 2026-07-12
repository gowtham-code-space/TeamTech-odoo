import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/common/PageHeader';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import apiClient from '../services/core/apiClient';
import { useAuthStore } from '../store/authStore';
import { ROLES, ROLE_LABELS } from '../utils/constants';
import { 
  RiSearchLine, 
  RiUserSharedLine, 
  RiUserUnfollowLine, 
  RiCheckboxCircleLine, 
  RiCloseCircleLine 
} from 'react-icons/ri';

const BREADCRUMBS = [
  { label: 'Administration' },
  { label: 'User Directory' }
];

const DEPARTMENTS = [
  'Engineering',
  'Procurement',
  'IT Administration',
  'Sales',
  'Human Resources',
  'Finance',
];

export default function AdminUsers() {
  const { user: loggedInUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'promote' | 'demote' | 'status'
  const [targetRole, setTargetRole] = useState(ROLES.ASSET_MANAGER);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Fetch users from API (memoized with useCallback)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/api/admin/users', {
        params: {
          search: appliedSearch || undefined,
          role: roleFilter || undefined,
          department: deptFilter || undefined
        }
      });
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users directory.');
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, roleFilter, deptFilter]);

  // Trigger fetch on query parameters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setAppliedSearch(search);
  };

  // Perform promote/demote/status updates
  const handleActionConfirm = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionError(null);

    try {
      if (modalType === 'promote') {
        await apiClient.patch(`/api/admin/users/${selectedUser.id}/promote`, { role: targetRole });
      } else if (modalType === 'demote') {
        await apiClient.patch(`/api/admin/users/${selectedUser.id}/demote`);
      } else if (modalType === 'status') {
        await apiClient.patch(`/api/admin/users/${selectedUser.id}/status`, { is_active: !selectedUser.is_active });
      }

      // Close modal & refresh list
      setModalType(null);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Action failed due to a server error.');
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setActionError(null);
    if (type === 'promote') {
      setTargetRole(ROLES.ASSET_MANAGER);
    }
  };

  // Table columns definition
  const columns = [
    {
      header: 'Name',
      accessor: 'full_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-550 flex items-center justify-center font-bold text-xs text-white uppercase">
            {row.full_name.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{row.full_name}</p>
            {row.id === loggedInUser?.id && (
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">You</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => row.department || <span className="text-slate-400 italic">No Dept</span>,
    },
    {
      header: 'Current Role',
      accessor: 'role',
      render: (row) => <StatusBadge status={row.role} type="role" />,
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (row) => (
        <StatusBadge 
          status={row.is_active ? 'active' : 'deactivated'} 
          type="user_status" 
        />
      ),
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => {
        // Prevent modifying system admin accounts or current user self-status
        const isSelf = row.id === loggedInUser?.id;
        const isSeedAdmin = row.email === 'admin@assetflow.com';

        return (
          <div className="flex items-center gap-2">
            {/* Promote/Demote triggers */}
            {!isSeedAdmin && row.role !== ROLES.ADMIN && (
              <>
                {row.role === ROLES.EMPLOYEE ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-indigo-200 text-indigo-650 hover:bg-indigo-50"
                    icon={RiUserSharedLine}
                    onClick={() => openActionModal(row, 'promote')}
                  >
                    Promote
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-rose-250 text-rose-600 hover:bg-rose-50"
                    icon={RiUserUnfollowLine}
                    onClick={() => openActionModal(row, 'demote')}
                  >
                    Demote
                  </Button>
                )}
              </>
            )}

            {/* Activate/Deactivate triggers */}
            {!isSelf && !isSeedAdmin && (
              <Button
                variant="outline"
                size="sm"
                className={`h-8 ${
                  row.is_active
                    ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'border-emerald-250 text-emerald-600 hover:bg-emerald-50'
                }`}
                icon={row.is_active ? RiCloseCircleLine : RiCheckboxCircleLine}
                onClick={() => openActionModal(row, 'status')}
              >
                {row.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 text-left">
      {/* Header section with Breadcrumbs */}
      <PageHeader
        title="Organization User Directory"
        subtitle="Manage user directories, promote roles, and configure account access."
        breadcrumbs={BREADCRUMBS}
      />

      {/* Query Filters Board */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6 transition-colors duration-200">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search name or email */}
          <div className="md:col-span-2 col-span-1">
            <Input
              label="Search User"
              placeholder="Search by name or email address... (Press Enter)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={RiSearchLine}
            />
          </div>

          {/* Role Filter dropdown */}
          <div className="flex flex-col space-y-1.5 col-span-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Roles</option>
              {Object.values(ROLES).map((roleVal) => (
                <option key={roleVal} value={roleVal} className="bg-white">
                  {ROLE_LABELS[roleVal]}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter dropdown */}
          <div className="flex flex-col space-y-1.5 col-span-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
              Filter by Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>

      {/* API Error warning */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-semibold select-none animate-fade-in">
          {error}
        </div>
      )}

      {/* Main Directory Table */}
      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No employees matching the search filters were found."
      />

      {/* Action Confirmation Modals */}
      {modalType && selectedUser && (
        <Modal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          title={
            modalType === 'promote'
              ? 'Promote User Role'
              : modalType === 'demote'
              ? 'Demote User Role'
              : 'Toggle Account Status'
          }
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setModalType(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant={modalType === 'demote' || (modalType === 'status' && selectedUser.is_active) ? 'danger' : 'primary'}
                onClick={handleActionConfirm}
                loading={actionLoading}
                disabled={actionLoading}
              >
                Confirm Action
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-slate-600 text-left">
            {actionError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold select-none">
                {actionError}
              </div>
            )}

            {modalType === 'promote' && (
              <div className="space-y-4">
                <p className="text-sm">
                  You are elevating <span className="font-bold text-slate-800">{selectedUser.full_name}</span>. Please choose the target administrative role:
                </p>
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                    Target Promotion Role
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                  >
                    <option value={ROLES.ASSET_MANAGER}>Asset Manager</option>
                    <option value={ROLES.DEPARTMENT_HEAD}>Department Head</option>
                  </select>
                </div>
              </div>
            )}

            {modalType === 'demote' && (
              <p className="text-sm">
                Are you sure you want to demote <span className="font-bold text-slate-800">{selectedUser.full_name}</span> back to <span className="font-semibold text-indigo-600">Employee</span>? They will lose all department head/asset management dashboard privileges.
              </p>
            )}

            {modalType === 'status' && (
              <p className="text-sm">
                Are you sure you want to {selectedUser.is_active ? 'deactivate' : 'activate'} the account of <span className="font-bold text-slate-800">{selectedUser.full_name}</span>?
                {selectedUser.is_active && ' They will be blocked from logging into the platform immediately.'}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
