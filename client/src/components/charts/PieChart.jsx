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
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 select-none">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
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
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      </div>
    );
  }

  const validData = data.filter((item) => item.value > 0);
  if (validData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 select-none">
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
              <span className="text-lg font-black text-slate-800 dark:text-white">
                {segments[hoveredIdx].value}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {segments[hoveredIdx].percentage}%
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-black text-slate-800 dark:text-white">
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
                isHovered ? 'bg-slate-50 dark:bg-slate-800/60' : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span>{seg.label}</span>
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                {seg.value} ({seg.percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
