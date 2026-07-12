import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';

const schema = z.object({
  employee_id: z.string().min(1, 'Employee is required'),
  department_id: z.string().min(1, 'Department is required'),
  asset_id: z.string().min(1, 'Asset to allocate is required'),
  allocation_date: z.string().min(1, 'Allocation Date is required'),
  expected_return_date: z.string().optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
}).refine(data => {
  if (data.expected_return_date && data.allocation_date) {
    return new Date(data.expected_return_date) >= new Date(data.allocation_date);
  }
  return true;
}, {
  message: 'Expected Return Date must be after or on the Allocation Date',
  path: ['expected_return_date']
});

/**
 * AllocateModal Component
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Modal close handler
 * @param {Array<Object>} props.employees - Employees lookup options
 * @param {Array<Object>} props.departments - Departments lookup options
 * @param {Array<Object>} props.availableAssets - Available assets lookup options
 * @param {Function} props.onSubmit - Submission callback
 * @param {boolean} [props.loading] - Submission state indicator
 * @param {string} [props.errorMessage] - Backend error feedback
 */
export default function AllocateModal({
  isOpen,
  onClose,
  employees = [],
  departments = [],
  availableAssets = [],
  onSubmit,
  loading = false,
  errorMessage = '',
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employee_id: '',
      department_id: '',
      asset_id: '',
      allocation_date: new Date().toISOString().split('T')[0],
      expected_return_date: '',
      notes: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit(data, () => {
      reset();
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allocate Asset" size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Asset Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            Asset to Allocate <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('asset_id')}
          >
            <option value="">Select Asset</option>
            {availableAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.asset_tag || 'No Tag'})
              </option>
            ))}
          </select>
          {errors.asset_id && (
            <p className="text-xs font-semibold text-rose-500">{errors.asset_id.message}</p>
          )}
        </div>

        {/* Employee Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            Assign to Employee <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('employee_id')}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
          {errors.employee_id && (
            <p className="text-xs font-semibold text-rose-500">{errors.employee_id.message}</p>
          )}
        </div>

        {/* Department Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            Responsible Department <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('department_id')}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.department_id && (
            <p className="text-xs font-semibold text-rose-500">{errors.department_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Allocation Date */}
          <Input
            label="Allocation Date"
            type="date"
            required
            errorMessage={errors.allocation_date?.message}
            disabled={loading}
            {...register('allocation_date')}
          />

          {/* Expected Return Date */}
          <Input
            label="Expected Return Date"
            type="date"
            errorMessage={errors.expected_return_date?.message}
            disabled={loading}
            {...register('expected_return_date')}
          />
        </div>

        {/* Notes */}
        <Input
          label="Allocation Notes"
          multiline
          rows={3}
          placeholder="Reason for allocation, project details, specific guidelines..."
          errorMessage={errors.notes?.message}
          disabled={loading}
          {...register('notes')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Allocate Asset
          </Button>
        </div>
      </form>
    </Modal>
  );
}

AllocateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ),
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  availableAssets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      asset_tag: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
