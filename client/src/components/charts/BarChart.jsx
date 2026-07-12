import React, { useState } from 'react';

export default function BarChart({
  data = [],
  layout = 'horizontal', // 'horizontal' | 'vertical'
  isLoading = false,
  error = null,
  barColor = '#6366f1' // Indigo
}) {
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

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 select-none">
        <span className="text-xs font-semibold text-slate-400">No chart bar records found.</span>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  if (layout === 'horizontal') {
    return (
      <div className="space-y-4 select-none">
        {data.map((item, idx) => {
          const ratio = item.value / maxVal;
          const widthPercent = `${(ratio * 100).toFixed(0)}%`;
          const isHovered = hoveredIdx === idx;
          const color = item.color || barColor;

          return (
            <div
              key={idx}
              className="group space-y-1.5"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-355 transition-colors group-hover:text-slate-800 dark:group-hover:text-white">
                  {item.label}
                </span>
                <span className="text-slate-800 dark:text-slate-200">
                  {item.value}
                </span>
              </div>
              {/* Bar Outer Track */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/20">
                {/* Bar Inner fill */}
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: widthPercent,
                    backgroundColor: color,
                    opacity: hoveredIdx !== null && !isHovered ? 0.7 : 1,
                    filter: isHovered ? 'brightness(1.05)' : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical layout (using SVG or clean flex containers)
  return (
    <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-1 select-none">
      {data.map((item, idx) => {
        const ratio = item.value / maxVal;
        const heightPercent = `${(ratio * 100).toFixed(0)}%`;
        const isHovered = hoveredIdx === idx;
        const color = item.color || barColor;

        return (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center h-full group"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Top Value badge */}
            <div
              className={`text-[10px] font-black text-slate-800 dark:text-slate-200 mb-1 transition-opacity duration-150 ${
                isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {item.value}
            </div>

            {/* Vertical Bar Outer Track */}
            <div className="w-full flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-t-xl overflow-hidden flex items-end relative border border-slate-200/20">
              {/* Vertical Bar Inner fill */}
              <div
                className="w-full rounded-t-xl transition-all duration-500 ease-out"
                style={{
                  height: heightPercent,
                  backgroundColor: color,
                  opacity: hoveredIdx !== null && !isHovered ? 0.7 : 1,
                  filter: isHovered ? 'brightness(1.05)' : 'none',
                }}
              />
            </div>

            {/* X Label */}
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
