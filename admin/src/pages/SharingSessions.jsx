import { useState, useEffect } from 'react'
import { Radio, RefreshCw, Download, CheckCircle, XCircle, ShieldCheck, MapPin, Smartphone, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import StatusBadge from '../components/ui/StatusBadge'

export default function SharingSessions() {
  const [shares, setShares] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchShares = async () => {
    try {
      setRefreshing(true)
      const data = await api.getShares({ status: statusFilter })
      setShares(data.shares || [])
    } catch (err) {
      console.error('Failed to load sharing sessions:', err)
      showToast('Error loading shares: ' + err.message, 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchShares()
  }, [statusFilter])

  const handleUpdateStatus = async (shareId, newStatus) => {
    try {
      await api.updateShareStatus(shareId, newStatus)
      setShares(prev => prev.map(s => s.id === shareId ? { ...s, status: newStatus } : s))
      showToast(`Sharing session marked as ${newStatus}`)
    } catch (err) {
      showToast('Action failed: ' + err.message, 'error')
    }
  }

  const exportCSV = () => {
    const headers = ['Share ID', 'Owner Name', 'Owner Phone', 'Viewer Name', 'Viewer Phone', 'Status', 'Share History', 'Created At']
    const rows = shares.map(s => [
      s.id,
      `"${s.owner_name || ''}"`,
      s.owner_phone,
      `"${s.viewer_name || ''}"`,
      s.viewer_phone,
      s.status,
      s.share_history ? 'Yes' : 'No',
      new Date(s.created_at).toISOString()
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `geotrack_shares_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported sessions to CSV')
  }

  const activeCount = shares.filter(s => s.status === 'accepted').length
  const pendingCount = shares.filter(s => s.status === 'pending').length
  const revokedCount = shares.filter(s => s.status === 'revoked').length

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-xl ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <ShieldCheck size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Radio size={12} className="text-blue-600" /> Mutual Permissions
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Sharing Sessions</h2>
          <p className="mt-1 text-xs text-slate-500">
            Authorized peer-to-peer location channels established between GeoTrack users
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={fetchShares}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-emerald-600">Active Live Shares</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-amber-600">Pending Authorization</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-medium text-slate-400">Revoked / Inactive</p>
          <p className="mt-1 text-2xl font-bold text-slate-700">{revokedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <span className="text-xs font-medium text-slate-400 pl-2">Filter state:</span>
        {['all', 'accepted', 'pending', 'revoked'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'accepted' ? 'Active / Accepted' : st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Sharing Owner</th>
                <th className="px-4 py-3.5">Authorized Viewer</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">History Permitted</th>
                <th className="px-4 py-3.5">Owner Device</th>
                <th className="px-4 py-3.5">Created At</th>
                <th className="px-4 py-3.5 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-blue-600" />
                    Loading sharing sessions from PostgreSQL...
                  </td>
                </tr>
              ) : shares.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No sharing sessions found matching criteria.
                  </td>
                </tr>
              ) : (
                shares.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {s.owner_name ? s.owner_name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{s.owner_name || 'User'}</p>
                          <p className="text-[10px] font-mono text-slate-400">{s.owner_phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={12} className="text-slate-300" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{s.viewer_name || 'Contact'}</p>
                          <p className="text-[10px] font-mono text-slate-400">{s.viewer_phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={s.status === 'accepted' ? 'Sharing' : s.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      {s.share_history ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Full history
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                          Live only
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Smartphone size={13} />
                        <span>{s.device_name || 'Android / iOS'}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-400">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {s.status === 'accepted' ? (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'revoked')}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <XCircle size={12} /> Revoke
                        </button>
                      ) : s.status === 'pending' ? (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'accepted')}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(s.id, 'accepted')}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                          Re-activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
