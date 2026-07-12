import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightSLine, RiHome4Line } from 'react-icons/ri';

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-4 border-b border-slate-200 pb-5 mb-6 text-left ${className}`}>
      {/* Breadcrumbs trail */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold select-none">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-slate-700 transition-colors"
          >
            <RiHome4Line className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <RiArrowRightSLine className="w-3.5 h-3.5 text-slate-350" />
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-slate-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-500 font-bold">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Subtitle */}
        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-500 font-medium leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons slot */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
