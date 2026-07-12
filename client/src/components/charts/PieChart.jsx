import React from 'react';
import PropTypes from 'prop-types';

/**
 * PieChart placeholder component.
 * Replace with a real charting library (e.g. Recharts, Chart.js) implementation
 * when the Reports/Dashboard module is built out.
 *
 * @param {Object} props
 * @param {Array<{name: string, value: number}>} [props.data] - Chart data slices
 * @param {string} [props.title] - Optional chart title
 */
export default function PieChart({ data = [], title = '' }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 select-none">
      <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
      <span className="text-xs font-semibold">{title || 'Pie Chart'}</span>
      <span className="text-[10px] mt-0.5 opacity-70">{data.length} data points</span>
    </div>
  );
}

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  title: PropTypes.string,
};
