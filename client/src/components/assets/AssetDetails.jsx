import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, FileText, Image as ImageIcon, MapPin, Tag, User, Layers, ShieldCheck, DollarSign, BookmarkCheck } from 'lucide-react';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { LIFECYCLE_STATUS_COLORS, CONDITION_COLORS } from '../../constants/asset.constants';

/**
 * Details component displaying specifications and files.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.asset - Asset object
 * @param {Function} props.onBack - Go back callback
 * @param {Function} props.onEdit - Edit trigger callback
 */
export default function AssetDetails({ asset, onBack, onEdit }) {
  if (!asset) return null;

  const statusCls = LIFECYCLE_STATUS_COLORS[asset.status?.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200';
  const condCls = CONDITION_COLORS[asset.condition?.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-100';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 text-left max-w-4xl mx-auto">
      {/* Header section with status badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-slate-650 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {asset.asset_tag || 'NO TAG'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border uppercase tracking-wider ${statusCls}`}>
              {(asset.status || 'available').replace(/_/g, ' ')}
            </span>
            {asset.is_bookable && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Shared / Bookable
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {asset.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={onBack} className="flex-1 sm:flex-initial">
            Back to List
          </Button>
          <Button variant="primary" size="sm" onClick={() => onEdit(asset)} className="flex-1 sm:flex-initial">
            Edit Asset
          </Button>
        </div>
      </div>

      {/* Basic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Container */}
        <div className="md:col-span-1 border border-slate-150 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center min-h-[200px] relative">
          {asset.photo_url ? (
            <img
              src={asset.photo_url}
              alt={asset.name}
              className="w-full h-full object-cover max-h-[300px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 p-4">
              <ImageIcon className="w-12 h-12 stroke-1 opacity-50 mb-2" />
              <span className="text-xs">No Asset Image Uploaded</span>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                <p className="text-sm font-semibold text-slate-700">{asset.category?.name || asset.category_name || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Department</p>
                <p className="text-sm font-semibold text-slate-700">{asset.department?.name || asset.department_name || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Holder</p>
                <p className="text-sm font-semibold text-slate-700">
                  {asset.assigned_to?.name || asset.assigned_to_name || asset.assigned_to || 'Not Assigned (In Stock)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Location</p>
                <p className="text-sm font-semibold text-slate-700">
                  {asset.location?.name || asset.location_name || asset.location || '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</p>
                <div className="mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize select-none ${condCls}`}>
                    {asset.condition || 'good'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acquisition Date</p>
                <p className="text-sm font-semibold text-slate-700">{formatDate(asset.acquisition_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acquisition Cost</p>
                <p className="text-sm font-semibold text-slate-700">
                  {asset.acquisition_cost != null ? `$${Number(asset.acquisition_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Serial Number</p>
                <p className="text-sm font-mono text-slate-650 font-semibold">{asset.serial_number || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & Invoices */}
      <div className="border-t border-slate-100 pt-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Attachments & Files</h3>
        {asset.document_url ? (
          <a
            href={asset.document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Download Invoice / Document Attachment</span>
          </a>
        ) : (
          <p className="text-xs text-slate-400 italic">No manual, invoice, or documents uploaded for this asset.</p>
        )}
      </div>
    </div>
  );
}

AssetDetails.propTypes = {
  asset: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    asset_tag: PropTypes.string,
    name: PropTypes.string.isRequired,
    serial_number: PropTypes.string,
    category: PropTypes.shape({ name: PropTypes.string }),
    category_name: PropTypes.string,
    department: PropTypes.shape({ name: PropTypes.string }),
    department_name: PropTypes.string,
    assigned_to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string }),
    ]),
    assigned_to_name: PropTypes.string,
    location: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string }),
    ]),
    location_name: PropTypes.string,
    acquisition_date: PropTypes.string,
    acquisition_cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    condition: PropTypes.string,
    status: PropTypes.string,
    is_bookable: PropTypes.bool,
    photo_url: PropTypes.string,
    document_url: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
