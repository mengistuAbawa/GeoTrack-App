import { useState } from 'react'
import { CloudDownload, RefreshCw, Smartphone, Check } from 'lucide-react'
import { syncDevices as initialDevices } from '../../data/dashboardData'
import SectionHeading from '../ui/SectionHeading'
import StatusBadge from '../ui/StatusBadge'

export default function SyncStatus({ onNavigate }) {
  const [devices, setDevices] = useState(initialDevices)
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)

  const handleRefreshSync = () => {
    setRefreshing(true)
    setTimeout(() => {
      setDevices(prev => prev.map(d => ({
        ...d,
        percent: 100,
        state: 'Synced',
        last: 'Just now'
      })))
      setRefreshing(false)
      setToast('All device queues synchronized!')
      setTimeout(() => setToast(null), 2500)
    }, 1200)
  }

  const handleSyncReport = () => {
    if (onNavigate) {
      onNavigate('Location history')
    } else {
      setToast('Generated synchronization audit report')
      setTimeout(() => setToast(null), 2500)
    }
  }

  return (
    <section className="panel p-5 relative">
      {toast && (
        <div className="absolute top-4 right-20 z-20 flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-semibold text-white shadow-md">
          <Check size={12} />
          <span>{toast}</span>
        </div>
      )}

      <SectionHeading
        title="Device synchronization"
        subtitle="Offline records waiting to sync"
        action={
          <button
            onClick={handleSyncReport}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sync report
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-3 rounded-xl bg-blue-50/80 p-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-blue-600 shadow-sm">
          <CloudDownload size={18} />
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-slate-800">1,248 records synchronized</p>
          <p className="mt-0.5 text-[9px] text-slate-500">Across connected mobile devices today</p>
        </div>
        <button
          onClick={handleRefreshSync}
          disabled={refreshing}
          title="Force sync check"
          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-100 transition"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-4">
        {devices.map((device) => (
          <div key={device.device}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] font-semibold text-slate-800">{device.device}</p>
                  <p className="text-[9px] text-slate-400">{device.owner} · {device.last}</p>
                </div>
              </div>
              <StatusBadge status={device.state} />
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  device.state === 'Waiting for connection' ? 'bg-amber-400' : 'bg-blue-500'
                }`}
                style={{ width: `${device.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
