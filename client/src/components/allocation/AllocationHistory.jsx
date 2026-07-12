import React from 'react';
import PropTypes from 'prop-types';
import { UserPlus, ArrowRightLeft, CornerDownLeft, CheckCircle, ShieldAlert, RefreshCw, Clock, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';

const EVENT_CONFIG = {
  allocation: {
    icon: UserPlus,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  transfer: {
    icon: ArrowRightLeft,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  return: {
    icon: CornerDownLeft,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  approval: {
    icon: CheckCircle,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  condition_change: {
    icon: ShieldAlert,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  status_change: {
    icon: RefreshCw,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
};

/**
 * AllocationHistory Component
 * Renders a timeline representation of allocation activities.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.allocation - Target allocation metadata
 * @param {Array<Object>} props.history - List of allocation timeline events from backend
 * @param {boolean} props.loading - Fetch state loader indicator
 * @param {string} [props.error] - Fetch error message feedback
 * @param {Function} props.onBack - Go back callback
 */
export default function AllocationHistory({
  allocation,
  history = [],
  loading = false,
  error = null,
  onBack,
}) {
  const assetName = allocation?.asset?.name || allocation?.asset_name || 'Asset';
  const assetTag = allocation?.asset?.asset_tag || allocation?.asset_tag || '-';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <span className="font-mono text-xs font-bold text-slate-650 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {assetTag}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Allocation Timeline — {assetName}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="shrink-0 w-full sm:w-auto">
          Back to List
        </Button>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        /* Timeline skeletons */
        <div className="space-y-6 animate-pulse pl-4 border-l border-slate-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative pl-6 space-y-2">
              <div className="absolute -left-3.5 w-6 h-6 rounded-full bg-slate-200" />
              <div className="h-4 bg-slate-150 rounded w-1/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        /* Empty Timeline */
        <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
          <Clock className="w-12 h-12 stroke-1 opacity-50 mb-3" />
          <p className="text-sm font-semibold text-slate-500">No Allocation Log Registered</p>
          <p className="text-xs text-slate-400 mt-0.5">Timeline events appear as hand-offs, status shifts, or returns occur.</p>
        </div>
      ) : (
        /* Rendered Timeline List */
        <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
          {history.map((event, index) => {
            const evType = (event.event_type || 'status_change').toLowerCase();
            const config = EVENT_CONFIG[evType] || EVENT_CONFIG.status_change;
            const Icon = config.icon;

            return (
              <div key={event.id || index} className="relative pl-8 group">
                {/* Timeline Node Bubble */}
                <div className={`absolute -left-[25px] top-0 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-110 ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Event Card */}
                <div className="space-y-1.5 bg-slate-50/50 hover:bg-slate-50 p-4 rounded-xl border border-slate-150 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
                      {evType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {formatDate(event.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {event.description || '-'}
                  </p>

                  {event.performed_by && (
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-205/50 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>Operator:</span>
                      <span className="text-slate-600 font-bold">
                        {event.performed_by?.name || event.performed_by}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

AllocationHistory.propTypes = {
  allocation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    asset_name: PropTypes.string,
    asset_tag: PropTypes.string,
    asset: PropTypes.shape({
      name: PropTypes.string,
      asset_tag: PropTypes.string,
    }),
  }),
  history: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      event_type: PropTypes.string,
      description: PropTypes.string.isRequired,
      performed_by: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string }),
      ]),
      created_at: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onBack: PropTypes.func.isRequired,
};
