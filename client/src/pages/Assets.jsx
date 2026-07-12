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

  // Action (create/edit/delete) error surfaced in forms
  const [actionError, setActionError] = useState('');

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
    setActionError('');
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
      setActionError(err.message || 'Failed to create asset');
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedAsset) return;
    setActionError('');
    try {
      const { photoFile, docFile, ...assetData } = formData;
      await editAsset(selectedAsset.id, assetData);

      // Upload files if new files chosen
      if (photoFile) await handlePhotoUpload(selectedAsset.id, photoFile);
      if (docFile) await handleDocumentUpload(selectedAsset.id, docFile);

      setView('list');
      setSelectedAsset(null);
    } catch (err) {
      setActionError(err.message || 'Failed to save changes');
    }
  };

  const handleDelete = async (asset) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      try {
        await removeAsset(asset.id);
        if (selectedAsset?.id === asset.id) setSelectedAsset(null);
        fetchAssets();
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

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <PageHeader
            title="Assets Management"
            subtitle="View and manage organization hardware, software, and physical assets."
            breadcrumbs={[{ label: 'Assets' }]}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={QrCode}
                  onClick={handleQRSearch}
                >
                  Scan Tag
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
                  onClick={() => {
                    setActionError('');
                    setView('add');
                  }}
                >
                  Add Asset
                </Button>
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
              setActionError('');
              setSelectedAsset(asset);
              setView('edit');
            }}
            onHistory={handleViewHistory}
            onDelete={handleDelete}
          />
        </>
      )}

      {view === 'add' && (
        <AssetForm
          mode="create"
          categories={categories}
          departments={departments}
          loading={loading}
          errorMessage={actionError}
          onSubmit={handleCreateSubmit}
          onCancel={() => {
            setActionError('');
            setView('list');
          }}
        />
      )}

      {view === 'edit' && selectedAsset && (
        <AssetForm
          mode="edit"
          initialData={selectedAsset}
          categories={categories}
          departments={departments}
          loading={loading}
          errorMessage={actionError}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setActionError('');
            setView('list');
            setSelectedAsset(null);
          }}
        />
      )}

      {view === 'details' && selectedAsset && (
        <AssetDetails
          asset={selectedAsset}
          onBack={() => {
            setView('list');
            setSelectedAsset(null);
          }}
          onEdit={() => {
            setActionError('');
            setView('edit');
          }}
          onHistory={() => handleViewHistory(selectedAsset)}
        />
      )}

      {view === 'history' && selectedAsset && (
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
      )}
    </div>
  );
}
