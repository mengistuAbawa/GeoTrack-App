import { useState, useEffect } from 'react'
import { History, Download, RefreshCw, MapPin, CheckCircle, Smartphone, ExternalLink, Zap } from 'lucide-react'
import { api } from '../lib/api'

export default function LocationHistory() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchUser, setSearchUser] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchLocations = async () => {
    try {
      setRefreshing(true)
      const data = await api.getLocations({ limit: 150 })
      setLocations(data.locations || [])
    } catch (err) {
      console.error('Failed to load location history:', err)
      showToast('Error loading locations')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const exportCSV = () => {
    const headers = ['Record ID', 'User Name', 'User Phone', 'Latitude', 'Longitude', 'Accuracy (m)', 'Altitude (m)', 'Recorded At']
    const rows = locations.map(l => [
      l.id,
      `"${l.user_name || ''}"`,
      l.user_phone,
      l.latitude,
      l.longitude,
      l.accuracy || '',
      l.altitude || '',
      new Date(l.recorded_at).toISOString()
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `geotrack_location_history_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Exported location records to CSV')
  }

  const filtered = locations.filter(l =>
    !searchUser ||
    l.user_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    l.user_phone?.includes(searchUser)
  )

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <CheckCircle size={15} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <History size={12} className="text-blue-600" /> Audit Trail
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Location History</h2>
          <p className="mt-1 text-xs text-slate-500">
            Verified GPS coordinates received and stored with cryptographic precision
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
            onClick={fetchLocations}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Filter by user name or phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div className="text-xs font-medium text-slate-500">
          Showing <span className="font-bold text-slate-800">{filtered.length}</span> recorded pings
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Coordinates (Lat, Lng)</th>
                <th className="px-4 py-3.5">Accuracy</th>
                <th className="px-4 py-3.5">Altitude</th>
                <th className="px-4 py-3.5">Device</th>
                <th className="px-4 py-3.5">Recorded Timestamp</th>
                <th className="px-4 py-3.5 text-right">Map Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    <RefreshCw size={18} className="mx-auto mb-2 animate-spin text-blue-600" />
                    Loading GPS records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No location records found.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-bold text-slate-800">{l.user_name || 'User'}</p>
                      <p className="text-[10px] font-mono text-slate-400">{l.user_phone}</p>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-mono font-medium text-slate-700">
                      {Number(l.latitude).toFixed(5)}, {Number(l.longitude).toFixed(5)}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        ±{l.accuracy || 12}m
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {l.altitude ? `${Math.round(l.altitude)} m` : '—'}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Smartphone size={13} className="text-slate-400" />
                        <span>{l.device_name || 'Mobile'}</span>
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-400">
                      {new Date(l.recorded_at).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <a
                        href={`https://www.google.com/maps?q=${l.latitude},${l.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-blue-600 hover:bg-slate-50"
                      >
                        <ExternalLink size={12} /> View
                      </a>
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
