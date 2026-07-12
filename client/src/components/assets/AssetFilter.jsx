import React from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Button from '../common/Button';
import { Search, RotateCcw } from 'lucide-react';
import { LIFECYCLE_STATUS_OPTIONS, CONDITION_OPTIONS } from '../../constants/asset.constants';

/**
 * Reusable filter panel for assets list.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.filters - Active filters state
 * @param {Function} props.onFilterChange - Callback when a filter changes
 * @param {Function} props.onReset - Callback to clear all filters
 * @param {Array<Object>} props.categories - Dynamic categories fetched from backend
 * @param {Array<Object>} props.departments - Dynamic departments fetched from backend
 * @param {Array<string>} props.locations - Distinct locations fetched from backend
 */
export default function AssetFilter({
  filters,
  onFilterChange,
  onReset,
  categories = [],
  departments = [],
  locations = [],
}) {
  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search Input */}
        <div>
          <Input
            label="Search Assets"
            placeholder="Name, serial, tag..."
            icon={Search}
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Category Select */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Department Select */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            Department
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => {
              const val = typeof loc === 'string' ? loc : loc.id || loc.name;
              const name = typeof loc === 'string' ? loc : loc.name || loc.label;
              return (
                <option key={val} value={val}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Status Select */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            {LIFECYCLE_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Select */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            Condition
          </label>
          <select
            value={filters.condition || ''}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Conditions</option>
            {CONDITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          icon={RotateCcw}
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

AssetFilter.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    category: PropTypes.string,
    department: PropTypes.string,
    location: PropTypes.string,
    condition: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  locations: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
      }),
    ])
  ),
};
