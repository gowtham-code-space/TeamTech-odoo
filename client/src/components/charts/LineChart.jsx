<<<<<<< HEAD
import React, { useState } from 'react';

export default function LineChart({
  data = [],
  keys = [], // e.g. ['allocated', 'returned']
  keyLabels = {}, // e.g. { allocated: 'Allocated', returned: 'Returned' }
  colors = {}, // e.g. { allocated: '#10b981', returned: '#ef4444' }
  xKey = 'month', // key for X axis labels
  isLoading = false,
  error = null
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null); // { idx, key, value, label }

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

  if (!data || data.length === 0 || keys.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 select-none">
        <span className="text-xs font-semibold text-slate-400">No chart trend records found.</span>
      </div>
    );
  }

  // Dimensions
  const w = 550;
  const h = 220;
  const px = 40; // padding x
  const py = 30; // padding y

  // Find max value in dataset to scale Y axis
  let maxVal = 0;
  data.forEach((d) => {
    keys.forEach((key) => {
      if (d[key] > maxVal) maxVal = d[key];
    });
  });
  // Add 10% breathing room
  maxVal = maxVal > 0 ? Math.ceil(maxVal * 1.1) : 10;

  // Calculate coordinates
  const pointsByKey = {};
  keys.forEach((key) => {
    pointsByKey[key] = data.map((d, idx) => {
      const x = px + (idx / (data.length - 1)) * (w - 2 * px);
      const val = d[key] || 0;
      const y = h - py - (val / maxVal) * (h - 2 * py);
      return { x, y, val, label: d[xKey], key, idx };
    });
  });

  // Generate SVG path for a line
  const getPathD = (points) => {
    if (points.length === 0) return '';
    return points.reduce((d, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${d} L ${pt.x} ${pt.y}`;
    }, '');
  };

  // Generate area fill path (closes line path with bottom coordinates)
  const getAreaD = (points) => {
    if (points.length === 0) return '';
    const lineD = getPathD(points);
    const first = points[0];
    const last = points[points.length - 1];
    return `${lineD} L ${last.x} ${h - py} L ${first.x} ${h - py} Z`;
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 select-none">
        {keys.map((key) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-3 h-1 rounded"
              style={{ backgroundColor: colors[key] || '#94a3b8' }}
            />
            <span>{keyLabels[key] || key}</span>
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="relative">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible select-none">
          {/* Y Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = h - py - ratio * (h - 2 * py);
            const gridVal = Math.round(ratio * maxVal);
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={px}
                  y1={y}
                  x2={w - px}
                  y2={y}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <text
                  x={px - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-bold text-[9px]"
                >
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Area under lines & Lines */}
          {keys.map((key) => {
            const points = pointsByKey[key];
            const color = colors[key] || '#94a3b8';
            return (
              <g key={key}>
                {/* Area Gradient fill */}
                <path
                  d={getAreaD(points)}
                  fill={`url(#gradient-${key})`}
                  className="opacity-15"
                />
                <defs>
                  <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Line path */}
                <path
                  d={getPathD(points)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* X axis labels */}
          {data.map((d, idx) => {
            const x = px + (idx / (data.length - 1)) * (w - 2 * px);
            return (
              <text
                key={idx}
                x={x}
                y={h - 10}
                textAnchor="middle"
                className="fill-slate-400 font-bold text-[9px]"
              >
                {d[xKey]}
              </text>
            );
          })}

          {/* Interactive coordinate points */}
          {keys.map((key) => {
            const points = pointsByKey[key];
            const color = colors[key] || '#94a3b8';
            return points.map((pt, idx) => {
              const isHovered = hoveredPoint && hoveredPoint.idx === idx && hoveredPoint.key === key;
              return (
                <g key={`${key}-${idx}`}>
                  {/* Outer transparent circle to enlarge touch area */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={8}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredPoint({
                        idx,
                        key,
                        value: pt.val,
                        label: pt.label,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Inner visible coordinate point */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5.5 : 3.5}
                    fill={isHovered ? color : '#ffffff'}
                    stroke={color}
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="pointer-events-none transition-all duration-150"
                  />
                </g>
              );
            });
          })}
        </svg>

        {/* Custom floating tooltip overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 p-2 bg-slate-900/90 text-white text-[10px] font-bold rounded-lg shadow border border-slate-700 pointer-events-none animate-fade-in">
            <span className="text-slate-400">{hoveredPoint.label}: </span>
            <span style={{ color: colors[hoveredPoint.key] }}>
              {keyLabels[hoveredPoint.key] || hoveredPoint.key}
            </span>
            <span className="ml-1 text-slate-100 font-black">({hoveredPoint.value})</span>
          </div>
        )}
      </div>
    </div>
  );
}
=======
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
>>>>>>> sakthivel
