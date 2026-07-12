import React from 'react';
import PropTypes from 'prop-types';

/**
 * LineChart placeholder component.
 * Replace with a real charting library (e.g. Recharts, Chart.js) implementation
 * when the Reports/Dashboard module is built out.
 *
 * @param {Object} props
 * @param {Array<{x: string|number, y: number}>} [props.data] - Chart line data points
 * @param {string} [props.title] - Optional chart title
 */
export default function LineChart({ data = [], title = '' }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 select-none">
      <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
      </svg>
      <span className="text-xs font-semibold">{title || 'Line Chart'}</span>
      <span className="text-[10px] mt-0.5 opacity-70">{data.length} data points</span>
    </div>
  );
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      y: PropTypes.number,
    })
  ),
  title: PropTypes.string,
};
