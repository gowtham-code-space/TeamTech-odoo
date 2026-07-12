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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'inactive':
      case 'deactivated':
      case '0':
      case 'false':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  }

  if (type === 'role') {
    switch (normalized) {
      case 'admin':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'asset_manager':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'department_head':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'employee':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  }

  if (type === 'asset') {
    switch (normalized) {
      case 'available':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'allocated':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'reserved':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'under_maintenance':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'lost':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'retired':
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      case 'disposed':
        return 'bg-zinc-100 text-zinc-700 border border-zinc-300';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  }
  
  if (type === 'booking') {
    switch (normalized) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'cancelled':
        return 'bg-slate-100 text-slate-700 border border-slate-300';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  }

  if (type === 'maintenance') {
    switch (normalized) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'in_progress':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  }

  return 'bg-gray-50 text-gray-700 border border-gray-200';
};

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
