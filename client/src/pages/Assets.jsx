import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Plus, RefreshCw, QrCode } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

import AssetFilter from '../components/assets/AssetFilter';
import AssetTable from '../components/assets/AssetTable';
import AssetForm from '../components/assets/AssetForm';
import AssetDetails from '../components/assets/AssetDetails';
import AssetHistory from '../components/assets/AssetHistory';

import useAssets from '../hooks/useAssets';
import { getDepartments, getCategories } from '../services/features/organization';

/**
 * Assets Page
 * Handles switching view states between list, details, forms, and timeline.
 */
export default function Assets() {
  const [view, setView] = useState('list'); // list | add | edit | details | history
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Dynamic filter lookup options from backend
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);

  const {
    assets,
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
    fetchAssets,
    fetchAssetById,
    fetchAssetHistory,
    addAsset,
    editAsset,
    removeAsset,
    handlePhotoUpload,
    handleDocumentUpload,
  } = useAssets();

  // Load lookup options from organization endpoints
  const fetchMetadata = useCallback(async () => {
    setMetaLoading(true);
    try {
      const [deptsData, catsData] = await Promise.all([
        getDepartments({ limit: 100 }),
        getCategories({ limit: 100 }),
      ]);
      const depts = deptsData.data || deptsData.departments || deptsData || [];
      const cats = catsData.data || catsData.categories || catsData || [];
      setDepartments(depts);
      setCategories(cats);
    } catch (err) {
      // Gracefully handle or log metadata load failures
    } finally {
      setMetaLoading(false);
    }
  }, []);

  // Sync unique locations list from loaded assets
  useEffect(() => {
    if (assets.length > 0) {
      const uniqueLocs = [
        ...new Set(
          assets
            .map((a) => a.location_name || a.location?.name || a.location)
            .filter(Boolean)
        ),
      ];
      setLocations(uniqueLocs);
    }
  }, [assets]);

  // Initial and reactive list loader
  useEffect(() => {
    if (view === 'list') {
      fetchAssets();
    }
  }, [view, filters, sort.column, sort.direction, pagination.currentPage, fetchAssets]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // QR Scan simulation
  const handleQRSearch = () => {
    const code = prompt('Scan / Enter Asset Tag QR Code (e.g. AST-DELL-092):');
    if (code) {
      setFilters((prev) => ({ ...prev, search: code }));
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  // CRUD Actions
  const handleCreateSubmit = async (formData) => {
    try {
      const { photoFile, docFile, ...assetData } = formData;
      const result = await addAsset(assetData);
      const newAsset = result.data || result;
      
      // Upload files if present
      if (newAsset?.id) {
        if (photoFile) await handlePhotoUpload(newAsset.id, photoFile);
        if (docFile) await handleDocumentUpload(newAsset.id, docFile);
      }
      setView('list');
    } catch (err) {
      alert(err.message || 'Failed to create asset');
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedAsset) return;
    try {
      const { photoFile, docFile, ...assetData } = formData;
      await editAsset(selectedAsset.id, assetData);

      // Upload files if new files chosen
      if (photoFile) await handlePhotoUpload(selectedAsset.id, photoFile);
      if (docFile) await handleDocumentUpload(selectedAsset.id, docFile);

      setView('list');
      setSelectedAsset(null);
    } catch (err) {
      alert(err.message || 'Failed to save changes');
    }
  };

  const handleDelete = async (asset) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      try {
        await removeAsset(asset.id);
        if (selectedAsset?.id === asset.id) setSelectedAsset(null);
      } catch (err) {
        alert(err.message || 'Failed to delete asset');
      }
    }
  };

  const handleViewDetails = async (asset) => {
    try {
      const details = await fetchAssetById(asset.id);
      setSelectedAsset(details);
      setView('details');
    } catch (err) {
      alert('Could not retrieve asset specifications');
    }
  };

  const handleViewHistory = async (asset) => {
    try {
      setSelectedAsset(asset);
      await fetchAssetHistory(asset.id);
      setView('history');
    } catch (err) {
      alert('Could not retrieve asset timelines');
    }
  };

  // Render view states
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
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assets Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">View and manage organization hardware, software, and physical assets</p>
        </div>
        
        {viewState === 'success' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md cursor-pointer transition-all"
          >
            <RiAddLine className="w-5 h-5" />
            <span>Add Asset</span>
          </button>
        )}
      </div>

      {/* Add Asset Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative animate-fade-in space-y-4">
          <h3 className="text-base font-bold text-slate-800">Register New Asset</h3>
          <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asset Tag (asset_tag)</label>
              <input
                type="text"
                required
                placeholder="AST-xxxx"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Asset Name (asset_name)</label>
              <input
                type="text"
                required
                placeholder="Macbook, Monitor..."
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category (category)</label>
              <input
                type="text"
                required
                placeholder="Hardware, Software..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location (location)</label>
              <input
                type="text"
                placeholder="Office Location..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status (status)</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {Object.values(ASSET_STATUSES).map((status) => (
                  <option key={status} value={status}>
                    {status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm cursor-pointer shadow"
              >
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error state */}
      {viewState === 'error' && (
        <div className="p-12 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
          <RiAlertLine className="w-16 h-16 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-rose-800">Failed to Retrieve Assets</h3>
          <p className="text-sm text-rose-600 max-w-lg mx-auto">
            An API communication failure occurred while resolving `/api/v1/assets`. Please verify connection parameters.
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/6" />
                <div className="h-4 bg-slate-200 rounded w-12" />
                <div className="h-4 bg-slate-200 rounded w-24" />
=======
      {view === 'list' && (
        <>
          <PageHeader
            title="Asset Registry"
            subtitle="Monitor, allocate, track history, and check conditions of company equipment."
            breadcrumbs={[{ label: 'Assets' }]}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={QrCode}
                  onClick={handleQRSearch}
                >
                  Scan QR
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => fetchAssets()}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={() => setView('add')}
                >
                  Add Asset
                </Button>
>>>>>>> sakthivel
              </div>
            }
          />

          {/* Filtering panel */}
          <AssetFilter
            filters={filters}
            categories={categories}
            departments={departments}
            locations={locations}
            onFilterChange={(key, val) => {
              setFilters((prev) => ({ ...prev, [key]: val }));
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
            onReset={() => {
              setFilters({
                search: '',
                status: '',
                category: '',
                department: '',
                location: '',
              });
              setPagination((prev) => ({ ...prev, currentPage: 1 }));
            }}
          />

          {/* Error Banner */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{error}</span>
              <button
                onClick={() => fetchAssets()}
                className="ml-auto text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table list view */}
          <AssetTable
            assets={assets}
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
            onView={handleViewDetails}
            onEdit={(asset) => {
              setSelectedAsset(asset);
              setView('edit');
            }}
            onHistory={handleViewHistory}
            onDelete={handleDelete}
          />
        </>
      )}

<<<<<<< HEAD
      {/* Empty state */}
      {viewState === 'empty' && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <RiCpuLine className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No Assets Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            There are currently no assets registered on this system node. Register a new asset to start.
          </p>
        </div>
      )}

      {/* Data table */}
      {viewState === 'success' && assets.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Name / ID</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Asset Tag</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Location</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Assigned To</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => (
                  <tr key={asset.asset_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{asset.asset_name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{asset.asset_id}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-500">{asset.asset_tag}</td>
                    <td className="px-6 py-4 text-slate-600">{asset.category}</td>
                    <td className="px-6 py-4 text-slate-600">{asset.location}</td>
                    <td className="px-6 py-4">
                      {asset.assigned_to ? (
                        <span className="font-semibold text-slate-800">{asset.assigned_to}</span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getStatusColor(asset.status, 'asset')}`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-semibold">{formatDate(asset.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
=======
      {view === 'add' && (
        <>
          <PageHeader
            title="Register New Asset"
            subtitle="Create and assign a new device/resource profile to catalog it."
            breadcrumbs={[{ label: 'Assets', path: '/assets' }, { label: 'Register' }]}
          />
          <AssetForm
            categories={categories}
            departments={departments}
            onSubmit={handleCreateSubmit}
            onCancel={() => setView('list')}
            loading={loading}
          />
        </>
      )}

      {view === 'edit' && selectedAsset && (
        <>
          <PageHeader
            title="Modify Asset Information"
            subtitle={`Edit properties and status parameters for tag: ${selectedAsset.asset_tag}.`}
            breadcrumbs={[{ label: 'Assets', path: '/assets' }, { label: 'Modify' }]}
          />
          <AssetForm
            initialData={selectedAsset}
            categories={categories}
            departments={departments}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setView('list');
              setSelectedAsset(null);
            }}
            loading={loading}
          />
        </>
      )}

      {view === 'details' && selectedAsset && (
        <>
          <PageHeader
            title="Asset Details"
            subtitle="Read-only datasheet showing allocations, purchase records, and invoice attachments."
            breadcrumbs={[{ label: 'Assets', path: '/assets' }, { label: 'Details' }]}
          />
          <AssetDetails
            asset={selectedAsset}
            onBack={() => {
              setView('list');
              setSelectedAsset(null);
            }}
            onEdit={(asset) => {
              setSelectedAsset(asset);
              setView('edit');
            }}
          />
        </>
      )}

      {view === 'history' && selectedAsset && (
        <>
          <PageHeader
            title="Lifecycle Event Timeline"
            subtitle={`Operational logs and status modifications for ${selectedAsset.name}`}
            breadcrumbs={[{ label: 'Assets', path: '/assets' }, { label: 'Timeline' }]}
          />
          <AssetHistory
            asset={selectedAsset}
            history={history}
            loading={historyLoading}
            error={historyError}
            onBack={() => {
              setView('list');
              setSelectedAsset(null);
            }}
          />
        </>
>>>>>>> sakthivel
      )}
    </div>
  );
}
