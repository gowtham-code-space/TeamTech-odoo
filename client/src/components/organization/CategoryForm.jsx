import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import { CATEGORY_STATUS_OPTIONS } from '../../constants/organization.constants';

const schema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  warranty_period: z
    .union([
      z.string().regex(/^\d*$/, 'Must be a whole number').optional(),
      z.literal(''),
    ])
    .optional(),
  status: z.string().min(1, 'Status is required'),
});

/**
 * CategoryForm Component
 * Renders a form to create or edit an asset category using react-hook-form and zod.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.initialData] - Prefill values when editing
 * @param {Function} props.onSubmit - Called with validated form data
 * @param {Function} props.onCancel - Called when the user cancels
 * @param {boolean} [props.loading] - Disables controls while submitting
 */
export default function CategoryForm({
  initialData = null,
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
      description: initialData?.description || '',
      warranty_period: initialData?.warranty_period != null
        ? String(initialData.warranty_period)
        : '',
      status: initialData?.status || 'active',
    },
  });

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      warranty_period: data.warranty_period !== '' ? Number(data.warranty_period) : null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
      <Input
        label="Category Name"
        required
        placeholder="e.g. Laptops & Computers"
        errorMessage={errors.name?.message}
        disabled={loading}
        {...register('name')}
      />

      <Input
        label="Description"
        multiline
        rows={3}
        placeholder="Brief description of this asset category..."
        errorMessage={errors.description?.message}
        disabled={loading}
        {...register('description')}
      />

      <Input
        label="Warranty Period (Months)"
        type="number"
        placeholder="e.g. 24"
        helperText="Leave blank if no warranty applies."
        errorMessage={errors.warranty_period?.message}
        disabled={loading}
        min="0"
        {...register('warranty_period')}
      />

      {/* Status Select */}
      <div className="flex flex-col w-full text-left space-y-1.5">
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          Status <span className="text-rose-500 ml-1 font-bold">*</span>
        </label>
        <select
          disabled={loading}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          {...register('status')}
        >
          {CATEGORY_STATUS_OPTIONS.map((opt) => (
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

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}

CategoryForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    warranty_period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
