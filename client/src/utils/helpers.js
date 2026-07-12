export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusColor = (status, type) => {
  const normalized = (status || '').toLowerCase().trim();
  
  // User Account Status or Roles
  if (type === 'user_status') {
    switch (normalized) {
      case 'active':
      case '1':
      case 'true':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
      case 'inactive':
      case 'deactivated':
      case '0':
      case 'false':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  }

  if (type === 'role') {
    switch (normalized) {
      case 'admin':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
      case 'asset_manager':
        return 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30';
      case 'department_head':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30';
      case 'employee':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-750';
    }
  }

  if (type === 'asset') {
    switch (normalized) {
      case 'available':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
      case 'allocated':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      case 'reserved':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-455 border border-amber-200 dark:border-amber-900/30';
      case 'under_maintenance':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30';
      case 'lost':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
      case 'retired':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
      case 'disposed':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-350 border border-zinc-300 dark:border-zinc-700';
      default:
        return 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700';
    }
  }
  
  if (type === 'booking') {
    switch (normalized) {
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30';
      case 'approved':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
      case 'rejected':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
      case 'cancelled':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700';
      default:
        return 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700';
    }
  }

  if (type === 'maintenance') {
    switch (normalized) {
      case 'scheduled':
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/30';
      case 'in_progress':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-200 dark:border-amber-900/30';
      case 'resolved':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30';
      case 'cancelled':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30';
      default:
        return 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700';
    }
  }

  return 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700';
};

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
