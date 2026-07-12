import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Clock, Briefcase, User, Info, Flag } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { PRIORITY_OPTIONS } from '../../constants/booking.constants';
import { getDepartments } from '../../services/features/organization';
import apiClient from '../../services/api';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const schema = z.object({
  resource_id: z.string().min(1, 'Resource is required'),
  employee_id: z.string().min(1, 'Employee is required'),
  department_id: z.string().min(1, 'Department is required'),
  booking_date: z.string().min(1, 'Booking date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Priority is required' }),
  remarks: z.string().optional(),
}).refine((data) => {
  if (!data.booking_date || !data.start_time || !data.end_time) return true;
  const start = new Date(`${data.booking_date}T${data.start_time}`);
  const end = new Date(`${data.booking_date}T${data.end_time}`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export default function BookingForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  error,
  resources = [],
}) {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [fetchingLookups, setFetchingLookups] = useState(true);

  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      resource_id: '',
      employee_id: '',
      department_id: '',
      booking_date: '',
      start_time: '',
      end_time: '',
      purpose: '',
      priority: 'medium',
      remarks: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        resource_id: initialData.resource_id || initialData.resource?._id || initialData.resource?.id || '',
        employee_id: initialData.employee_id || initialData.employee?._id || initialData.employee?.id || '',
        department_id: initialData.department_id || initialData.department?._id || initialData.department?.id || '',
        booking_date: initialData.start_time ? new Date(initialData.start_time).toISOString().split('T')[0] : '',
        start_time: initialData.start_time ? new Date(initialData.start_time).toTimeString().substring(0, 5) : '',
        end_time: initialData.end_time ? new Date(initialData.end_time).toTimeString().substring(0, 5) : '',
        purpose: initialData.purpose || '',
        priority: initialData.priority || 'medium',
        remarks: initialData.remarks || '',
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchLookups = async () => {
      setFetchingLookups(true);
      try {
        const [deptRes, empRes] = await Promise.all([
          getDepartments({ limit: 100 }),
          apiClient.get(API_ENDPOINTS.EMPLOYEES, { params: { limit: 100 } }),
        ]);
        
        setDepartments(deptRes.data || deptRes.departments || deptRes || []);
        setEmployees(empRes.data?.data || empRes.data?.employees || empRes.data || []);
      } catch (err) {
        console.error('Failed to load lookup data', err);
      } finally {
        setFetchingLookups(false);
      }
    };
    fetchLookups();
  }, []);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      start_time: new Date(`${data.booking_date}T${data.start_time}`).toISOString(),
      end_time: new Date(`${data.booking_date}T${data.end_time}`).toISOString(),
    };
    delete payload.booking_date; // Not needed in backend payload usually
    onSubmit(payload);
  };

  const selectStyle = 'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl text-sm transition-all focus:outline-none focus:bg-white focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed pl-11';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          {isEdit ? 'Edit Booking' : 'Create New Booking'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {isEdit ? 'Update the details of the selected resource booking.' : 'Fill out the form below to book a resource.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-rose-800">Operation Failed</h4>
            <p className="text-sm text-rose-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource */}
          <div className="flex flex-col space-y-1.5">
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
              Resource <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <Briefcase className="w-5 h-5" />
              </div>
              <select
                {...register('resource_id')}
                disabled={loading || fetchingLookups}
                className={`${selectStyle} ${errors.resource_id ? 'border-rose-350 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
              >
                <option value="">Select Resource...</option>
                {resources.map((res) => (
                  <option key={res._id || res.id} value={res._id || res.id}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.resource_id && (
              <span className="text-[11px] font-semibold text-rose-500 tracking-wide mt-1">
                {errors.resource_id.message}
              </span>
            )}
          </div>

          {/* Department */}
          <div className="flex flex-col space-y-1.5">
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <Briefcase className="w-5 h-5" />
              </div>
              <select
                {...register('department_id')}
                disabled={loading || fetchingLookups}
                className={`${selectStyle} ${errors.department_id ? 'border-rose-350 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
              >
                <option value="">Select Department...</option>
                {departments.map((dept) => (
                  <option key={dept._id || dept.id} value={dept._id || dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.department_id && (
              <span className="text-[11px] font-semibold text-rose-500 tracking-wide mt-1">
                {errors.department_id.message}
              </span>
            )}
          </div>

          {/* Employee */}
          <div className="flex flex-col space-y-1.5">
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
              Employee <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
              <select
                {...register('employee_id')}
                disabled={loading || fetchingLookups}
                className={`${selectStyle} ${errors.employee_id ? 'border-rose-350 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
              >
                <option value="">Select Employee...</option>
                {employees.map((emp) => (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {emp.first_name} {emp.last_name || ''}
                  </option>
                ))}
              </select>
            </div>
            {errors.employee_id && (
              <span className="text-[11px] font-semibold text-rose-500 tracking-wide mt-1">
                {errors.employee_id.message}
              </span>
            )}
          </div>

          {/* Priority */}
          <div className="flex flex-col space-y-1.5">
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
              Priority <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                <Flag className="w-5 h-5" />
              </div>
              <select
                {...register('priority')}
                disabled={loading}
                className={`${selectStyle} ${errors.priority ? 'border-rose-350 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.priority && (
              <span className="text-[11px] font-semibold text-rose-500 tracking-wide mt-1">
                {errors.priority.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Booking Date */}
          <Input
            label="Booking Date"
            type="date"
            icon={CalendarIcon}
            {...register('booking_date')}
            errorMessage={errors.booking_date?.message}
            disabled={loading}
            required
          />

          {/* Start Time */}
          <Input
            label="Start Time"
            type="time"
            icon={Clock}
            {...register('start_time')}
            errorMessage={errors.start_time?.message}
            disabled={loading}
            required
          />

          {/* End Time */}
          <Input
            label="End Time"
            type="time"
            icon={Clock}
            {...register('end_time')}
            errorMessage={errors.end_time?.message}
            disabled={loading}
            required
          />
        </div>

        {/* Purpose */}
        <Input
          label="Purpose"
          placeholder="State the purpose of this booking"
          icon={Info}
          {...register('purpose')}
          errorMessage={errors.purpose?.message}
          disabled={loading}
          required
        />

        {/* Remarks */}
        <Input
          label="Remarks"
          placeholder="Any additional remarks..."
          multiline
          rows={3}
          {...register('remarks')}
          errorMessage={errors.remarks?.message}
          disabled={loading}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
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
            disabled={fetchingLookups}
          >
            {isEdit ? 'Update Booking' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
}

BookingForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  resources: PropTypes.array,
};
