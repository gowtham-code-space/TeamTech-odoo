import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

import AllocationTable from '../components/allocation/AllocationTable';
import AllocateModal from '../components/allocation/AllocateModal';
import TransferModal from '../components/allocation/TransferModal';
import ReturnModal from '../components/allocation/ReturnModal';
import AllocationHistory from '../components/allocation/AllocationHistory';

import useAllocation from '../hooks/useAllocation';
import { getDepartments, getEmployees } from '../services/features/organization';

/**
 * Allocation Management Page
 * Handles orchestration of allocation lists, detail lookups, transfers, returns and timelines.
 */
export default function Allocation() {
  const [view, setView] = useState('list'); // list | history
  const [selectedAllocation, setSelectedAllocation] = useState(null);

  // Modals Visibility
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  // Lookup data loaded dynamically from backend
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);

  // Actions errors
  const [actionError, setActionError] = useState('');

  const {
    allocations,
    loading,
    error,
    pagination,
    setPagination,
    filters,
    setFilters,
    sort,
    setSort,
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
  } = useAllocation();

  // Load lookup options from organization backend endpoints
  const fetchMetadata = useCallback(async () => {
    setMetaLoading(true);
    try {
      const [deptsData, empsData] = await Promise.all([
        getDepartments({ limit: 100 }),
        getEmployees({ limit: 100 }),
      ]);
      const depts = deptsData.data || deptsData.departments || deptsData || [];
      const emps = empsData.data || empsData.employees || empsData || [];
      setDepartments(depts);
      setEmployees(emps);
    } catch (err) {
      // Gracefully log lookup fetch failure
    } finally {
      setMetaLoading(false);
    }
  }, []);

  // Sync allocations list on filter/page changes
  useEffect(() => {
    if (view === 'list') {
      fetchAllocations();
    }
  }, [view, filters, sort.column, sort.direction, pagination.currentPage, fetchAllocations]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Debounced Search Callback
  const searchTimer = useRef(null);
  const handleSearchChange = (val) => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: val }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }, 400);
  };

  // Submit allocation handler
  const handleAllocateSubmit = async (data, onSuccess) => {
    setActionError('');
    try {
      await doAllocate(data);
      onSuccess();
    } catch (err) {
      setActionError(err.message || 'Asset is already allocated.');
    }
  };

  // Submit transfer handler
  const handleTransferSubmit = async (id, data, onSuccess) => {
    setActionError('');
    try {
      await doTransfer(id, data);
      onSuccess();
    } catch (err) {
      setActionError(err.message || 'Transfer validation failed.');
    }
  };

  // Submit return handler
  const handleReturnSubmit = async (id, data, onSuccess) => {
    setActionError('');
    try {
      await doReturn(id, data);
      onSuccess();
    } catch (err) {
      setActionError(err.message || 'Return validation failed.');
    }
  };

  const handleOpenAllocate = () => {
    setActionError('');
    fetchAvailableAssets();
    setAllocateOpen(true);
  };

  const handleOpenTransfer = (record) => {
    setActionError('');
    setSelectedAllocation(record);
    setTransferOpen(true);
  };

  const handleOpenReturn = (record) => {
    setActionError('');
    setSelectedAllocation(record);
    setReturnOpen(true);
  };

  const handleOpenHistory = async (record) => {
    try {
      setSelectedAllocation(record);
      await fetchAllocationHistory(record.id);
      setView('history');
    } catch (err) {
      alert('Could not retrieve allocation logs');
    }
  };

  return (
    <div className="space-y-6">
<<<<<<< HEAD
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
                  ? 'bg-indigo-600 text-white shadow-md'
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Asset Allocations</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track and audit active allocations, lease durations, and returns</p>
        </div>
        
        {viewState === 'success' && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>New Allocation</span>
          </button>
        )}
      </div>

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Allocations</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/allocations`. Please verify connection parameters.
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
      {view === 'list' && (
        <>
          <PageHeader
            title="Asset Allocations"
            subtitle="Track equipment checkouts, handovers, and condition shifts across departments."
            breadcrumbs={[{ label: 'Allocations' }]}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => fetchAllocations()}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={handleOpenAllocate}
                >
                  Allocate Asset
                </Button>
>>>>>>> sakthivel
              </div>
            }
          />

<<<<<<< HEAD
      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiExchangeLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Allocations Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no assets allocated to any team member. Assign an asset to start.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && allocations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocation ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Name / ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated To</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Allocated By</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Start Date</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Return Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocations.map((alc) => (
                  <tr key={alc.allocation_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-500">{alc.allocation_id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{alc.asset_name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{alc.asset_id}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{alc.user_name}</td>
                    <td className="px-6 py-4 text-slate-500">{alc.allocated_by}</td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{formatDate(alc.start_date)}</td>
                    <td className="px-6 py-4">
                      {alc.return_date ? (
                        <span className="text-slate-500 font-semibold">{formatDate(alc.return_date)}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold italic">Indefinite</span>
                      )}
                    </td>
                  </tr>
=======
          {/* Filtering panels */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div>
              <Input
                label="Search Allocations"
                placeholder="Asset, serial, notes..."
                icon={Search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Department
              </label>
              <select
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, department: e.target.value }));
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="w-full px-4 py-2.5 bg-slate-5/10 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
>>>>>>> sakthivel
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Employee
              </label>
              <select
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, employee: e.target.value }));
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="w-full px-4 py-2.5 bg-slate-5/10 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
                Allocation Status
              </label>
              <select
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, status: e.target.value }));
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="w-full px-4 py-2.5 bg-slate-5/10 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>
          </div>

          {/* Action error banner */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
              <button
                onClick={() => fetchAllocations()}
                className="ml-auto text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table list representation */}
          <AllocationTable
            allocations={allocations}
            loading={loading}
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              totalItems: pagination.totalItems,
              limit: pagination.limit,
              onPageChange: (page) =>
                setPagination((prev) => ({ ...prev, currentPage: page })),
            }}
            sortColumn={sort.column}
            sortDirection={sort.direction}
            onSort={(column) => {
              setSort((prev) => ({
                column,
                direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
              }));
            }}
            onView={async (record) => {
              try {
                const details = await fetchAllocationById(record.id);
                alert(
                  `Allocation Details:\n\nAsset Tag: ${details.asset?.asset_tag || '-'}\nEmployee: ${details.employee?.name || '-'}\nDepartment: ${details.department?.name || '-'}\nDate: ${details.allocation_date}\nNotes: ${details.notes || '-'}`
                );
              } catch (err) {
                alert('Could not retrieve allocation specifications');
              }
            }}
            onTransfer={handleOpenTransfer}
            onReturn={handleOpenReturn}
            onHistory={handleOpenHistory}
          />
        </>
      )}

      {view === 'history' && selectedAllocation && (
        <AllocationHistory
          allocation={selectedAllocation}
          history={history}
          loading={historyLoading}
          error={historyError}
          onBack={() => {
            setView('list');
            setSelectedAllocation(null);
          }}
        />
      )}

      {/* --- Allocate Modal --- */}
      <AllocateModal
        isOpen={allocateOpen}
        onClose={() => setAllocateOpen(false)}
        employees={employees}
        departments={departments}
        availableAssets={availableAssets}
        onSubmit={handleAllocateSubmit}
        loading={loading}
        errorMessage={actionError}
      />

      {/* --- Transfer Modal --- */}
      <TransferModal
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        allocation={selectedAllocation}
        employees={employees}
        departments={departments}
        onSubmit={handleTransferSubmit}
        loading={loading}
        errorMessage={actionError}
      />

      {/* --- Return Modal --- */}
      <ReturnModal
        isOpen={returnOpen}
        onClose={() => setReturnOpen(false)}
        allocation={selectedAllocation}
        onSubmit={handleReturnSubmit}
        loading={loading}
        errorMessage={actionError}
      />
    </div>
  );
}
