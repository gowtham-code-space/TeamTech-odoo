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
  new_holder_id: z.string().min(1, 'New Holder is required'),
  target_department_id: z.string().min(1, 'Target Department is required'),
  transfer_date: z.string().min(1, 'Transfer Date is required'),
  reason: z.string().min(1, 'Transfer reason is required'),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
});

/**
 * TransferModal Component
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Modal close handler
 * @param {Object} props.allocation - The target allocation record to transfer
 * @param {Array<Object>} props.employees - List of employees for transfer lookup
 * @param {Array<Object>} props.departments - List of departments for target selection
 * @param {Function} props.onSubmit - Submission callback
 * @param {boolean} [props.loading] - Submission state indicator
 * @param {string} [props.errorMessage] - Backend error feedback
 */
export default function TransferModal({
  isOpen,
  onClose,
  allocation = null,
  employees = [],
  departments = [],
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
      new_holder_id: '',
      target_department_id: '',
      transfer_date: new Date().toISOString().split('T')[0],
      reason: '',
      notes: '',
    },
  });

  const handleFormSubmit = (data) => {
    if (!allocation) return;
    onSubmit(allocation.id, data, () => {
      reset();
      onClose();
    });
  };

  const currentHolderName = allocation?.employee?.name || allocation?.employee_name || 'Unassigned';
  const currentDeptName = allocation?.department?.name || allocation?.department_name || 'Unassigned';
  const assetName = allocation?.asset?.name || allocation?.asset_name || 'Asset';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transfer Asset — ${assetName}`} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Holder (Read Only) */}
          <Input
            label="Current Holder"
            value={currentHolderName}
            readOnly
            disabled
          />

          {/* Current Department (Read Only) */}
          <Input
            label="Current Department"
            value={currentDeptName}
            readOnly
            disabled
          />
        </div>

        {/* New Holder Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            New Holder (Target Employee) <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('new_holder_id')}
          >
            <option value="">Select New Holder</option>
            {employees
              .filter((emp) => emp.id !== allocation?.employee?.id && emp.id !== allocation?.employee_id)
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
          </select>
          {errors.new_holder_id && (
            <p className="text-xs font-semibold text-rose-500">{errors.new_holder_id.message}</p>
          )}
        </div>

        {/* Target Department Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-555 uppercase tracking-wider select-none">
            Target Department <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('target_department_id')}
          >
            <option value="">Select Target Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          {errors.target_department_id && (
            <p className="text-xs font-semibold text-rose-500">{errors.target_department_id.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Transfer Date */}
          <Input
            label="Transfer Date"
            type="date"
            required
            errorMessage={errors.transfer_date?.message}
            disabled={loading}
            {...register('transfer_date')}
          />

          {/* Approval Status (Read Only) */}
          <Input
            label="Approval Workflow Status"
            value="Pending System Approval"
            readOnly
            disabled
            helperText="Approvals are managed through automated server workflow rules."
          />
        </div>

        {/* Reason */}
        <Input
          label="Reason for Transfer"
          required
          placeholder="e.g. Employee reassignment or role changes"
          errorMessage={errors.reason?.message}
          disabled={loading}
          {...register('reason')}
        />

        {/* Transfer Notes */}
        <Input
          label="Transfer Notes"
          multiline
          rows={3}
          placeholder="Specific hand-off checklists or inventory observations..."
          errorMessage={errors.notes?.message}
          disabled={loading}
          {...register('notes')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Initiate Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
}

TransferModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  allocation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    employee_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    employee: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    employee_name: PropTypes.string,
    department_name: PropTypes.string,
    department: PropTypes.shape({
      name: PropTypes.string,
    }),
    asset_name: PropTypes.string,
    asset: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
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
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
