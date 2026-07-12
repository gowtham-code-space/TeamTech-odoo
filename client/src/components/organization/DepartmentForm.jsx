import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import { DEPARTMENT_STATUS_OPTIONS } from '../../constants/organization.constants';

const schema = z.object({
  name: z.string().min(1, 'Department name is required').max(100, 'Name must be 100 characters or less'),
  head: z.string().max(100, 'Head name must be 100 characters or less').optional().or(z.literal('')),
  parent_id: z.string().optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional().or(z.literal('')),
});

/**
 * DepartmentForm Component
 * Renders a form to create/edit departments using react-hook-form and zod validation.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.initialData] - Initial data for the form (if editing)
 * @param {Array<Object>} props.departments - List of all departments for parent selection
 * @param {Function} props.onSubmit - Callback function when the form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 * @param {boolean} props.loading - Indicates if the form submission is loading
 */
export default function DepartmentForm({
  initialData = null,
  departments = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      head: initialData?.head || '',
      parent_id: initialData?.parent_id || initialData?.parent?.id || '',
      status: initialData?.status || 'active',
      description: initialData?.description || '',
    },
  });

  // Filter out the current department from parent options to prevent self-reference
  const parentOptions = departments.filter((dept) => {
    if (!initialData) return true;
    return dept.id !== initialData.id;
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <Input
        label="Department Name"
        required
        placeholder="e.g. Engineering"
        errorMessage={errors.name?.message}
        disabled={loading}
        {...register('name')}
      />

      <Input
        label="Department Head"
        placeholder="e.g. John Doe"
        errorMessage={errors.head?.message}
        disabled={loading}
        {...register('head')}
      />

      {/* Parent Department Select */}
      <div className="flex flex-col w-full text-left space-y-1.5">
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          Parent Department
        </label>
        <select
          disabled={loading}
          className="w-full px-4 py-2.5 bg-slate-555/10 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          {...register('parent_id')}
        >
          <option value="">None (Top-Level Department)</option>
          {parentOptions.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        {errors.parent_id && (
          <p className="text-xs font-semibold text-rose-500 select-none">
            {errors.parent_id.message}
          </p>
        )}
      </div>

      {/* Status Select */}
      <div className="flex flex-col w-full text-left space-y-1.5">
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          Status <span className="text-rose-500 ml-1 font-bold">*</span>
        </label>
        <select
          disabled={loading}
          className="w-full px-4 py-2.5 bg-slate-555/10 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          {...register('status')}
        >
          {DEPARTMENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-xs font-semibold text-rose-500 select-none">
            {errors.status.message}
          </p>
        )}
      </div>

      <Input
        label="Description"
        multiline
        rows={3}
        placeholder="Provide brief details about department scope..."
        errorMessage={errors.description?.message}
        disabled={loading}
        {...register('description')}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {initialData ? 'Save Changes' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
}

DepartmentForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    head: PropTypes.string,
    parent_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    parent: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    status: PropTypes.string,
    description: PropTypes.string,
  }),
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
