<<<<<<< HEAD
import React, { useState } from 'react';

/**
 * Helper to convert polar coordinates to cartesian.
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default function PieChart({ data = [], isLoading = false, error = null }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 select-none">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading chart analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-rose-500/5 rounded-2xl border border-rose-500/10 select-none">
        <div className="text-center p-4">
          <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Analytics Error</p>
          <p className="text-sm font-semibold text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  const validData = data.filter((item) => item.value > 0);
  if (validData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 select-none">
        <span className="text-xs font-semibold text-slate-400">No chart distribution records found.</span>
      </div>
    );
  }

  const total = validData.reduce((sum, item) => sum + item.value, 0);

  // Generate pie segments
  let currentAngle = 0;
  const segments = validData.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const start = polarToCartesian(100, 100, 75, startAngle);
    const end = polarToCartesian(100, 100, 75, endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathData = `M 100 100 L ${start.x} ${start.y} A 75 75 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;

    return {
      pathData,
      color: item.color || '#cbd5e1',
      label: item.label,
      value: item.value,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-4">
      {/* SVG Canvas */}
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {segments.map((seg, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <path
                key={idx}
                d={seg.pathData}
                fill={seg.color}
                className="transition-all duration-200 cursor-pointer origin-center"
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  opacity: hoveredIdx !== null && !isHovered ? 0.65 : 1,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center overlay label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredIdx !== null ? (
            <>
              <span className="text-lg font-black text-slate-800">
                {segments[hoveredIdx].value}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {segments[hoveredIdx].percentage}%
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-black text-slate-800">
                {total}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Total
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2 max-h-48 overflow-y-auto pr-1">
        {segments.map((seg, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 ${
                isHovered ? 'bg-slate-50' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-650">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span>{seg.label}</span>
              </div>
              <span className="text-xs font-extrabold text-slate-800">
                {seg.value} ({seg.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
=======
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
>>>>>>> sakthivel
