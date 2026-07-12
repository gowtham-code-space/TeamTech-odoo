import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../common/Input';
import Button from '../common/Button';
import { EMPLOYEE_STATUS_OPTIONS } from '../../constants/organization.constants';

const schema = z.object({
  name: z
    .string()
    .min(1, 'Employee name is required')
    .max(100, 'Name must be 100 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .regex(/^[+\d\s\-().]{0,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  department_id: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  status: z.string().min(1, 'Status is required'),
});

/**
 * EmployeeForm Component
 * Renders a form to create or edit an employee record using react-hook-form and zod.
 * Roles are fetched from the backend and passed in as a prop — no hardcoded role list.
 *
 * @component
 * @param {Object} props
 * @param {Object} [props.initialData] - Prefill values when editing an existing employee
 * @param {Array<Object>} props.departments - Active departments list for the dropdown
 * @param {string[]} props.roles - Role options fetched from backend
 * @param {boolean} [props.rolesLoading] - Indicates if roles are being fetched
 * @param {Function} props.onSubmit - Called with validated form data
 * @param {Function} props.onCancel - Called when the user cancels
 * @param {boolean} [props.loading] - Disables controls while submitting
 */
export default function EmployeeForm({
  initialData = null,
  departments = [],
  roles = [],
  rolesLoading = false,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      department_id:
        initialData?.department_id != null
          ? String(initialData.department_id)
          : initialData?.department?.id != null
          ? String(initialData.department.id)
          : '',
      role: initialData?.role || '',
      status: initialData?.status || 'active',
    },
  });

  // Reset form when initialData changes (e.g. switching between edit targets)
  useEffect(() => {
    reset({
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      department_id:
        initialData?.department_id != null
          ? String(initialData.department_id)
          : initialData?.department?.id != null
          ? String(initialData.department.id)
          : '',
      role: initialData?.role || '',
      status: initialData?.status || 'active',
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <Input
        label="Employee Name"
        required
        placeholder="e.g. Jane Smith"
        errorMessage={errors.name?.message}
        disabled={loading}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        required
        placeholder="e.g. jane@company.com"
        errorMessage={errors.email?.message}
        disabled={loading}
        {...register('email')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="e.g. +91 98765 43210"
        errorMessage={errors.phone?.message}
        disabled={loading}
        {...register('phone')}
      />

      {/* Department Select */}
      <div className="flex flex-col w-full text-left space-y-1.5">
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          Department
        </label>
        <select
          disabled={loading}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
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
          <p className="text-xs font-semibold text-rose-500 select-none">
            {errors.department_id.message}
          </p>
        )}
      </div>

      {/* Role Select — options come from backend via props */}
      <div className="flex flex-col w-full text-left space-y-1.5">
        <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
          Role
        </label>
        <select
          disabled={loading || rolesLoading}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          {...register('role')}
        >
          <option value="">
            {rolesLoading ? 'Loading roles…' : 'Select Role'}
          </option>
          {roles.map((role) => {
            const value = typeof role === 'string' ? role : role.value ?? role.id;
            const label = typeof role === 'string' ? role : role.label ?? role.name ?? role.value;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
        {errors.role && (
          <p className="text-xs font-semibold text-rose-500 select-none">
            {errors.role.message}
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
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          {...register('status')}
        >
          {EMPLOYEE_STATUS_OPTIONS.map((opt) => (
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
          {initialData ? 'Save Changes' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}

EmployeeForm.propTypes = {
  initialData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    department_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    department: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    role: PropTypes.string,
    status: PropTypes.string,
  }),
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  roles: PropTypes.array,
  rolesLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
