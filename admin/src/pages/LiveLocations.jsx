import { useState, useEffect } from 'react'
import { MapPin, Search, RefreshCw, Copy, Check, ExternalLink, Smartphone, Activity, Radio, Compass, Eye } from 'lucide-react'
import { api } from '../lib/api'
import StatusBadge from '../components/ui/StatusBadge'

export default function LiveLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLocations = async () => {
    try {
      setRefreshing(true)
      const data = await api.getLiveLocations()
      const list = data.liveLocations || []
      setLocations(list)
      if (list.length > 0 && !selectedUser) {
        setSelectedUser(list[0])
      }
    } catch (err) {
      console.error('Failed to fetch live locations:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleCopyCoords = (lat, lng, id) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredLocations = locations.filter(loc => {
    const matchesSearch =
      loc.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      loc.phone?.includes(search) ||
      loc.area?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || loc.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Radio size={12} className="animate-pulse text-blue-600" /> Opt-in live sharing
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Live User Locations</h2>
          <p className="mt-1 text-xs text-slate-500">
            Showing recent GPS locations only for people who enabled sharing in the mobile app. Search by name or phone number.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLocations}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-600' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh GPS'}</span>
          </button>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or phone number..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400">Filter status:</span>
          {['all', 'live', 'sharing', 'offline'].map((st) => (
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
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        {/* Interactive Map Visualizer */}
        <div className="panel overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Regional Distribution (Ethiopia)</h3>
            </div>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {filteredLocations.length} active points
            </span>
          </div>

          <div className="map-surface relative h-[380px] w-full overflow-hidden sm:h-[420px]">
            {/* Region Guides */}
            <div className="map-label left-[10%] top-[14%]">TIGRAY / MEKELLE</div>
            <div className="map-label left-[14%] top-[28%]">AMHARA / BAHIR DAR</div>
            <div className="map-label left-[40%] top-[46%] font-black text-slate-600">ADDIS ABABA</div>
            <div className="map-label left-[38%] top-[68%]">HAWASSA / SIDAMA</div>
            <div className="map-label left-[68%] top-[48%]">DIRE DAWA</div>
            <div className="map-label left-[16%] top-[66%]">JIMMA / OROMIA</div>

            {/* Simulated Grid SVG */}
            <svg viewBox="0 0 800 420" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
              <path d="M70 90 C160 20 240 80 300 65 S420 25 470 90 S590 110 720 55" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 7"/>
              <path d="M100 300 C200 220 250 270 350 210 S510 240 690 160" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 7"/>
              <path d="M220 0 L260 420 M480 0 L430 420 M0 190 L800 230" fill="none" stroke="#dbe4ef" strokeWidth="1.5"/>
            </svg>

            {/* Pins */}
            {filteredLocations.map((loc, idx) => {
              // Normalize lat (6 to 14) and lng (35 to 42) into percentage coords
              const latPct = Math.max(12, Math.min(88, 100 - ((loc.latitude - 6.5) / (14.0 - 6.5)) * 100))
              const lngPct = Math.max(12, Math.min(88, ((loc.longitude - 35.5) / (42.5 - 35.5)) * 100))
              const isSelected = selectedUser?.user_id === loc.user_id

              return (
                <div
                  key={loc.user_id || idx}
                  onClick={() => setSelectedUser(loc)}
                  className="absolute cursor-pointer transition-transform hover:scale-110 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${lngPct}%`, top: `${latPct}%` }}
                >
                  <div className="relative flex flex-col items-center">
                    <span className={`absolute -inset-2 rounded-full ${isSelected ? 'animate-ping bg-blue-500/40' : 'bg-blue-400/20'}`} />
                    <span
                      className={`relative grid h-8 w-8 place-items-center rounded-full border-[3px] shadow-lg transition ${
                        isSelected
                          ? 'border-white bg-blue-600 text-white ring-2 ring-blue-500'
                          : 'border-white bg-slate-800 text-white'
                      }`}
                    >
                      <MapPin size={15} fill="currentColor" />
                    </span>
                    <span className="mt-1 whitespace-nowrap rounded-md border border-white/80 bg-white/95 px-2 py-0.5 text-[9px] font-bold text-slate-800 shadow-sm backdrop-blur">
                      {loc.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected user card preview */}
          {selectedUser && (
            <div className="border-t border-slate-100 bg-slate-50/60 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 font-bold text-white shadow-md">
                    {selectedUser.full_name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{selectedUser.full_name}</h4>
                    <p className="text-[11px] text-slate-500">{selectedUser.phone} · {selectedUser.area}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCoords(selectedUser.latitude, selectedUser.longitude, selectedUser.user_id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    {copiedId === selectedUser.user_id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedId === selectedUser.user_id ? 'Copied' : 'Copy GPS'}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps?q=${selectedUser.latitude},${selectedUser.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <ExternalLink size={13} />
                    <span>View Map</span>
                  </a>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-600 sm:grid-cols-4">
                <div className="rounded-lg bg-white p-2 border border-slate-100">
                  <span className="text-slate-400">Coordinates:</span>
                  <p className="font-mono font-semibold">{Number(selectedUser.latitude).toFixed(4)}, {Number(selectedUser.longitude).toFixed(4)}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-100">
                  <span className="text-slate-400">Accuracy:</span>
                  <p className="font-semibold">±{selectedUser.accuracy || 10} meters</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-100">
                  <span className="text-slate-400">Device:</span>
                  <p className="truncate font-semibold">{selectedUser.device_name || 'Mobile GPS'}</p>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-100">
                  <span className="text-slate-400">Status:</span>
                  <p className="font-semibold text-blue-600">{selectedUser.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live List Table */}
        <div className="panel overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-bold text-slate-800">People sharing now ({filteredLocations.length})</h3>
            <span className="text-[11px] text-slate-400">Click row to center</span>
          </div>

          <div className="overflow-y-auto max-h-[560px]">
            {loading ? (
              <div className="flex h-48 items-center justify-center text-xs text-slate-400">
                <RefreshCw size={18} className="mr-2 animate-spin text-blue-600" /> Loading live locations...
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center p-6 text-slate-400">
                <MapPin size={24} className="mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No matching locations found</p>
                <p className="mt-1 text-[11px]">Try adjusting your search or status filter.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredLocations.map((loc) => {
                  const isSelected = selectedUser?.user_id === loc.user_id
                  return (
                    <div
                      key={loc.user_id}
                      onClick={() => setSelectedUser(loc)}
                      className={`flex cursor-pointer items-center justify-between p-4 transition ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">
                          {loc.full_name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">{loc.full_name}</p>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="truncate">{loc.area}</span>
                            <span>•</span>
                            <span className="font-mono">{Number(loc.latitude).toFixed(3)}, {Number(loc.longitude).toFixed(3)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <StatusBadge status={loc.status} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyCoords(loc.latitude, loc.longitude, loc.user_id)
                          }}
                          title="Copy coordinates"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                        >
                          {copiedId === loc.user_id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
