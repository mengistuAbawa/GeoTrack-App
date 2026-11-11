import { useState, useEffect } from 'react'
import { ShieldCheck, Download, RefreshCw, Lock, AlertTriangle, Key, Terminal, Globe, Filter } from 'lucide-react'
import { api } from '../lib/api'

export default function SecurityAudit() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const fetchLogs = async () => {
    try {
      setRefreshing(true)
      const data = await api.getAuditLogs({ limit: 150 })
      setLogs(data.logs || [])
    } catch (err) {
      console.error('Failed to load audit logs:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const exportCSV = () => {
    const headers = ['Log ID', 'Action', 'Target Type', 'Target ID', 'Admin Actor', 'IP Address', 'Created At']
    const rows = logs.map(l => [
      l.id,
      l.action,
      l.target_type || '',
      `"${l.target_id || ''}"`,
      `"${l.admin_name || l.admin_email || 'System'}"`,
      l.ip_address || '',
      new Date(l.created_at).toISOString()
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `geotrack_audit_logs_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLogs = logs.filter(l => {
    const matchesSearch =
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.target_id?.toLowerCase().includes(search.toLowerCase()) ||
      l.ip_address?.includes(search)
    const matchesFilter = actionFilter === 'all' || l.action === actionFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <ShieldCheck size={12} className="text-blue-600" /> Compliance & Integrity
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Security & Audit Logs</h2>
          <p className="mt-1 text-xs text-slate-500">
            Immutable system logs recorded from PostgreSQL database operations
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
            onClick={fetchLogs}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
            <ShieldCheck size={16} /> Token Authentication
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">JWT Signed (HS256)</p>
          <p className="mt-1 text-[11px] text-slate-400">7-day expiration with cryptographic secret</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
            <Lock size={16} /> Password Encryption
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">Bcrypt Salt 12</p>
          <p className="mt-1 text-[11px] text-slate-400">One-way hash with pgcrypto database support</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-violet-600 text-xs font-bold">
            <Globe size={16} /> Rate Limiting
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">300 req / 15m</p>
          <p className="mt-1 text-[11px] text-slate-400">Active Express rate protection enabled</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, target ID, or IP..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Action:</span>
          {['all', 'user.status.changed', 'user.created', 'admin.login', 'share.status.changed'].map((act) => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                actionFilter === act
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {act === 'all' ? 'All events' : act.replace(/\./g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">Action Event</th>
                <th className="px-4 py-3.5">Target</th>
                <th className="px-4 py-3.5">Actor / Admin</th>
                <th className="px-4 py-3.5">Client IP</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-blue-600" />
                    Loading audit records from PostgreSQL...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700">
                        {log.target_type || 'system'}: {log.target_id ? log.target_id.slice(0, 10) + '...' : '—'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                      {log.admin_name || log.admin_email || 'System Daemon'}
                    </td>

                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] font-mono text-slate-500 max-w-[200px] truncate">
                      {typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : log.metadata || '—'}
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
