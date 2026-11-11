import { useState, useEffect } from 'react'
import { Users as UsersIcon, UserPlus, Search, Download, RefreshCw, MoreVertical, ShieldAlert, CheckCircle, Trash2, Smartphone, MapPin, X } from 'lucide-react'
import { api } from '../lib/api'
import StatusBadge from '../components/ui/StatusBadge'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionMenuId, setActionMenuId] = useState(null)
  const [toast, setToast] = useState(null)

  // New user form state
  const [formData, setFormData] = useState({
    phone: '',
    full_name: '',
    email: '',
    status: 'active'
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = async () => {
    try {
      setRefreshing(true)
      const data = await api.getUsers({ q: search, status: statusFilter })
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to load users:', err)
      showToast('Failed to load users: ' + err.message, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [statusFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchUsers()
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, newStatus)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
      showToast(`User status updated to ${newStatus}`)
      setActionMenuId(null)
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All their device and location data will be removed.')) return
    try {
      await api.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      showToast('User deleted successfully')
      setActionMenuId(null)
    } catch (err) {
      showToast('Failed to delete user: ' + err.message, 'error')
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)

    try {
      const res = await api.createUser(formData)
      setUsers(prev => [res.user, ...prev])
      setShowAddModal(false)
      setFormData({ phone: '', full_name: '', email: '', status: 'active' })
      showToast('New user registered successfully')
    } catch (err) {
      setFormError(err.message || 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  const exportUsersCSV = () => {
    const headers = ['ID', 'Full Name', 'Phone', 'Email', 'Status', 'Registered At']
    const rows = users.map(u => [
      u.id,
      `"${u.full_name || ''}"`,
      u.phone,
      u.email || '',
      u.status,
      new Date(u.created_at).toISOString()
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `geotrack_users_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported users to CSV')
  }

  const totalUsers = users.length
  const activeCount = users.filter(u => u.status === 'active').length
  const suspendedCount = users.filter(u => u.status === 'suspended').length

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-xl ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <UsersIcon size={12} className="text-blue-600" /> Platform Directory
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">User Management</h2>
          <p className="mt-1 text-xs text-slate-500">
            Monitor registered mobile app users, privacy authorization, and account states
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportUsersCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <UserPlus size={14} /> Add New User
          </button>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-slate-400">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalUsers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-emerald-600">Active Accounts</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-amber-600">Suspended</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{suspendedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-blue-600">Database Source</p>
          <p className="mt-1 text-sm font-bold text-blue-600">PostgreSQL (Live)</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone (+251...), or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-14 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            Find
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Status:</span>
          {['all', 'active', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={fetchUsers}
            title="Refresh users"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin text-blue-600' : ''} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Phone</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Location sharing</th>
                <th className="px-4 py-3.5">Devices</th>
                <th className="px-4 py-3.5">Records</th>
                <th className="px-4 py-3.5">Registered</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-blue-600" />
                    Loading users from PostgreSQL...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-slate-400">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                          {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{user.full_name || 'Anonymous User'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-mono text-slate-600">{user.phone}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">{user.email || '—'}</td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        user.location_sharing_active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {user.location_sharing_active ? 'Active' : 'Off'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                        <Smartphone size={13} className="text-slate-400" />
                        <span>{user.device_count || 1}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{user.location_count || 0}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700 transition hover:bg-amber-100"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => setActionMenuId(actionMenuId === user.id ? null : user.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {actionMenuId === user.id && (
                        <div className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setActionMenuId(null)
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <UsersIcon size={14} /> View Details
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={14} /> Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Almaz Ayana"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Phone (E.164 International)</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251911000000"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
                <span className="text-[10px] text-slate-400">Must start with + and country code</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Initial Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {formLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {selectedUser.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedUser.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUser.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">Account ID</p>
                  <p className="mt-1 font-mono text-slate-700 break-all">{selectedUser.id}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">Account Status</p>
                  <div className="mt-1"><StatusBadge status={selectedUser.status} /></div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">Email</p>
                  <p className="mt-1 font-semibold text-slate-700">{selectedUser.email || 'None provided'}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">Registered On</p>
                  <p className="mt-1 font-semibold text-slate-700">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-blue-900">
                <p className="font-semibold text-xs">Privacy & Data Governance</p>
                <p className="mt-1 text-[11px] leading-5 text-blue-700">
                  This user has consented to end-to-end location synchronization under GeoTrack privacy policy.
                  Location history is strictly accessible only to their approved contacts.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
