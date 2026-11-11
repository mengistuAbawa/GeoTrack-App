const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export function getToken() {
  return localStorage.getItem('geotrack_admin_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('geotrack_admin_token', token);
  } else {
    localStorage.removeItem('geotrack_admin_token');
  }
}

export function getStoredAdmin() {
  try {
    const raw = localStorage.getItem('geotrack_admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin) {
  if (admin) {
    localStorage.setItem('geotrack_admin_user', JSON.stringify(admin));
  } else {
    localStorage.removeItem('geotrack_admin_user');
  }
}

export function clearAuth() {
  localStorage.removeItem('geotrack_admin_token');
  localStorage.removeItem('geotrack_admin_user');
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  const res = await fetch(url, {
    ...options,
    headers
  });

  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message = (data && typeof data === 'object' && data.message) ? data.message : `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    if (res.status === 401 && !path.includes('/login')) {
      clearAuth();
      window.dispatchEvent(new CustomEvent('geotrack:unauthorized'));
    }
    throw err;
  }

  return data;
}

// Admin API endpoints
export const api = {
  // Authentication
  login: (email, password) => apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  // Health
  getHealth: () => apiRequest('/health'),
  getSystemHealth: () => apiRequest('/admin/system/health'),

  // Dashboard Stats
  getStats: () => apiRequest('/admin/dashboard/stats'),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.status) query.set('status', params.status);
    if (params.limit) query.set('limit', params.limit);
    if (params.offset) query.set('offset', params.offset);
    const qs = query.toString();
    return apiRequest(`/admin/users${qs ? `?${qs}` : ''}`);
  },
  createUser: (userData) => apiRequest('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  updateUserStatus: (id, status) => apiRequest(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, {
    method: 'DELETE'
  }),

  // Sharing Sessions
  getShares: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    const qs = query.toString();
    return apiRequest(`/admin/shares${qs ? `?${qs}` : ''}`);
  },
  updateShareStatus: (id, status) => apiRequest(`/admin/shares/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Location Tracking
  getLocations: (params = {}) => {
    const query = new URLSearchParams();
    if (params.userId) query.set('userId', params.userId);
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    return apiRequest(`/admin/locations${qs ? `?${qs}` : ''}`);
  },
  getLiveLocations: () => apiRequest('/admin/live-locations'),

  // Messages & reports
  getMessages: () => apiRequest('/admin/messages'),

  // Security & Audit
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', params.limit);
    const qs = query.toString();
    return apiRequest(`/admin/audit-logs${qs ? `?${qs}` : ''}`);
  },

  // System Settings
  getSettings: () => apiRequest('/admin/system/settings'),
  updateSettings: (settings) => apiRequest('/admin/system/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings)
  }),
  seedDatabase: () => apiRequest('/admin/seed', {
    method: 'POST'
  })
};
