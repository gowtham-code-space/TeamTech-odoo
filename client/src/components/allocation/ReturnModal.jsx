import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';
import { RETURN_CONDITION_OPTIONS } from '../../constants/allocation.constants';

const schema = z.object({
  return_date: z.string().min(1, 'Return Date is required'),
  condition: z.string().min(1, 'Return Condition is required'),
  damage_notes: z.string().max(500, 'Damage Notes must be 500 characters or less').optional().or(z.literal('')),
  remarks: z.string().max(500, 'Remarks must be 500 characters or less').optional().or(z.literal('')),
});

/**
 * ReturnModal Component
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility
 * @param {Function} props.onClose - Modal close handler
 * @param {Object} props.allocation - The active allocation record to return
 * @param {Function} props.onSubmit - Submission callback
 * @param {boolean} [props.loading] - Submission state indicator
 * @param {string} [props.errorMessage] - Backend error feedback
 */
export default function ReturnModal({
  isOpen,
  onClose,
  allocation = null,
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
      return_date: new Date().toISOString().split('T')[0],
      condition: 'good',
      damage_notes: '',
      remarks: '',
    },
  });

  const handleFormSubmit = (data) => {
    if (!allocation) return;
    const fileInput = document.getElementById('return-damage-photo');
    const payload = {
      ...data,
      damagePhotoFile: fileInput?.files?.[0] || null,
    };

    onSubmit(allocation.id, payload, () => {
      reset();
      onClose();
    });
  };

  const assetName = allocation?.asset?.name || allocation?.asset_name || 'Asset';
  const assetTag = allocation?.asset?.asset_tag || allocation?.asset_tag || '-';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Return Asset — ${assetName}`} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
        {errorMessage && (
          <div className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Asset Tag (Read Only) */}
          <Input
            label="Asset Tag"
            value={assetTag}
            readOnly
            disabled
          />

          {/* Return Date */}
          <Input
            label="Return Date"
            type="date"
            required
            errorMessage={errors.return_date?.message}
            disabled={loading}
            {...register('return_date')}
          />
        </div>

        {/* Condition Selector */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            Asset Condition on Return <span className="text-rose-500 font-bold ml-1">*</span>
          </label>
          <select
            disabled={loading}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            {...register('condition')}
          >
            {RETURN_CONDITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.condition && (
            <p className="text-xs font-semibold text-rose-500">{errors.condition.message}</p>
          )}
        </div>

        {/* Damage Photo Upload */}
        <div className="flex flex-col space-y-1.5">
          <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider select-none">
            Upload Damage Image (Optional)
          </label>
          <input
            id="return-damage-photo"
            type="file"
            accept="image/*"
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-55/10 border border-slate-200 text-slate-700 rounded-xl text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Damage Notes */}
        <Input
          label="Damage Notes"
          multiline
          rows={2}
          placeholder="Describe damages, key scratches, or hardware malfunctions if condition is Fair/Poor/Broken..."
          errorMessage={errors.damage_notes?.message}
          disabled={loading}
          {...register('damage_notes')}
        />

        {/* Remarks */}
        <Input
          label="Remarks / General Comments"
          multiline
          rows={2}
          placeholder="General comments regarding checkout duration or status..."
          errorMessage={errors.remarks?.message}
          disabled={loading}
          {...register('remarks')}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Confirm Return
          </Button>
        </div>
      </form>
    </Modal>
  );
}

ReturnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  allocation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    asset_name: PropTypes.string,
    asset_tag: PropTypes.string,
    asset: PropTypes.shape({
      name: PropTypes.string,
      asset_tag: PropTypes.string,
    }),
  }),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};
