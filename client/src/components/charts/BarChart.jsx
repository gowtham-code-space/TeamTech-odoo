import React from 'react';
import PropTypes from 'prop-types';

/**
 * BarChart placeholder component.
 * Replace with a real charting library (e.g. Recharts, Chart.js) implementation
 * when the Reports/Dashboard module is built out.
 *
 * @param {Object} props
 * @param {Array<{label: string, value: number}>} [props.data] - Chart bar data
 * @param {string} [props.title] - Optional chart title
 */
export default function BarChart({ data = [], title = '' }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 select-none">
      <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V21h4.5V13.5H3zM9.75 8.25V21h4.5V8.25h-4.5zM16.5 3V21H21V3h-4.5z" />
      </svg>
      <span className="text-xs font-semibold">{title || 'Bar Chart'}</span>
      <span className="text-[10px] mt-0.5 opacity-70">{data.length} data points</span>
    </div>
  );
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  title: PropTypes.string,
};
