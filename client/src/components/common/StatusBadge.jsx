import React from 'react';
import { getStatusColor, capitalize } from '../../utils/helpers';

export default function StatusBadge({ status, type, className = '' }) {
  if (!status) return null;

  // Retrieve style classes from helpers.js dynamically
  const colorClasses = getStatusColor(status, type);

  // Format status text dynamically (e.g. "under_maintenance" -> "Under Maintenance")
  const formattedStatusText = status
    .split('_')
    .map((word) => capitalize(word))
    .join(' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider select-none ${colorClasses} ${className}`}
    >
      {formattedStatusText}
    </span>
  );
}
