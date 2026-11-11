import { useState, useEffect } from 'react'
import { CalendarDays, Download, Plus, ChevronDown, Check } from 'lucide-react'
import MetricCard from '../components/dashboard/MetricCard'
import LocationMapPanel from '../components/dashboard/LocationMapPanel'
import ActivityChart from '../components/dashboard/ActivityChart'
import RecentSessions from '../components/dashboard/RecentSessions'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import SyncStatus from '../components/dashboard/SyncStatus'
import PermissionsReviewModal from '../components/dashboard/PermissionsReviewModal'
import ExportReportModal from '../components/dashboard/ExportReportModal'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard({ onNavigate }) {
  const { admin } = useAuth()
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [dateRange, setDateRange] = useState('Nov 10, 2026')
  const [dateMenuOpen, setDateMenuOpen] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats()
        if (data.stats) {
          setStats(data.stats)
        }
        if (data.chartData) {
          setChartData(data.chartData)
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err)
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  const metrics = [
    {
      label: 'Registered users',
      value: stats ? stats.total_users.toLocaleString() : '9',
      change: '+12.8%',
      detail: 'Live PostgreSQL users',
      tone: 'blue',
      icon: 'users'
    },
    {
      label: 'Active sharing sessions',
      value: stats ? stats.active_shares.toLocaleString() : '4',
      change: '+8.2%',
      detail: 'Currently authorized',
      tone: 'green',
      icon: 'radio'
    },
    {
      label: 'Locations synchronized',
      value: stats ? stats.location_records.toLocaleString() : '45',
      change: '+18.4%',
      detail: 'GPS records stored',
      tone: 'violet',
      icon: 'map'
    },
    {
      label: 'Pending requests',
      value: stats ? stats.pending_shares.toLocaleString() : '1',
      change: '-4.6%',
      detail: 'Awaiting user response',
      tone: 'amber',
      icon: 'clock'
    }
  ]

  const dateOptions = ['Today', 'Nov 10, 2026', 'Last 7 days', 'Last 30 days', 'All time']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Admin Workspace
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Good morning, {admin?.name ? admin.name.split(' ')[0] : 'Administrator'} <span aria-hidden="true">👋</span>
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Here is what's happening across your GeoTrack platform today. Connected to PostgreSQL backend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setDateMenuOpen(!dateMenuOpen)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
            >
              <CalendarDays size={14} />
              <span>{dateRange}</span>
              <ChevronDown size={13} />
            </button>

            {dateMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateRange(opt)
                      setDateMenuOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ${
                      dateRange === opt ? 'bg-blue-50 font-bold text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {dateRange === opt && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-[11px] font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            <Download size={14} /> Export report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            onClick={() => {
              if (metric.icon === 'users') onNavigate && onNavigate('Users')
              else if (metric.icon === 'radio') onNavigate && onNavigate('Sharing sessions')
              else if (metric.icon === 'map') onNavigate && onNavigate('Location history')
              else if (metric.icon === 'clock') onNavigate && onNavigate('Sharing sessions')
            }}
            className="cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <MetricCard metric={metric} />
          </div>
        ))}
      </div>

      {/* Map & Chart */}
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <LocationMapPanel onNavigate={onNavigate} />
        <ActivityChart chartData={chartData} />
      </div>

      {/* Sessions Table */}
      <RecentSessions onNavigate={onNavigate} />

      {/* Activity & Sync */}
      <div className="grid gap-5 xl:grid-cols-2">
        <ActivityFeed onNavigate={onNavigate} />
        <SyncStatus onNavigate={onNavigate} />
      </div>

      {/* Privacy banner */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-slate-900">Keep location sharing transparent</p>
          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-600">
            Only display locations shared by users who have explicitly approved access. Provide clear controls to revoke sharing and delete history.
          </p>
        </div>
        <button
          onClick={() => setShowPermissionsModal(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-[10px] font-semibold text-blue-700 shadow-sm hover:bg-blue-50 transition"
        >
          <Plus size={14} /> Review permissions
        </button>
      </div>

      {/* Modals */}
      <PermissionsReviewModal
        open={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        onNavigate={onNavigate}
      />

      <ExportReportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        stats={stats}
      />
    </div>
  )
}
