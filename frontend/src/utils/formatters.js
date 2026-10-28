export function formatNumber(val, decimals = 0) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSec = Math.max(0, Math.floor((now - past) / 1000));
    if (diffInSec < 60) return 'Just now';
    const diffInMin = Math.floor(diffInSec / 60);
    if (diffInMin < 60) return `${diffInMin}m ago`;
    const diffInHours = Math.floor(diffInMin / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  } catch {
    return '';
  }
}

export function extractErrorMessage(error) {
  if (!error) return 'An unknown error occurred.';
  if (error.response?.data?.error?.details?.message) {
    return error.response.data.error.details.message;
  }
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error.response?.data?.detail?.message) {
    return error.response.data.detail.message;
  }
  if (error.response?.data?.detail) {
    return String(error.response.data.detail);
  }
  if (error.response?.data?.message) {
    return String(error.response.data.message);
  }
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  if (error.message) {
    return error.message;
  }
  return 'Failed to complete request. Please try again.';
}
