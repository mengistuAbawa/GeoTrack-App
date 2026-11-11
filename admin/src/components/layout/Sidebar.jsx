import { useState, useEffect } from 'react'
import {
  Activity, LayoutDashboard, MapPinned, Users, Radio, History,
  MessageSquare, Bell, ShieldCheck, Settings, CircleHelp, LogOut, X, LocateFixed, RefreshCw
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../lib/api'

const primary = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Live locations', icon: MapPinned },
  { label: 'Users', icon: Users },
  { label: 'Sharing sessions', icon: Radio },
  { label: 'Location history', icon: History },
  { label: 'Messages & reports', icon: MessageSquare }
]
const management = [
  { label: 'Notifications', icon: Bell, count: '4' },
  { label: 'Security & audit', icon: ShieldCheck },
  { label: 'System settings', icon: Settings }
]

export default function Sidebar({ activePage, onNavigate, open, onClose }) {
  const { admin, logout } = useAuth()
  const [healthStatus, setHealthStatus] = useState({ status: 'Operational', latency: '3ms', ok: true })
  const [checkingHealth, setCheckingHealth] = useState(false)

  const checkHealth = async () => {
    try {
      setCheckingHealth(true)
      const start = Date.now()
      const res = await api.getHealth()
      const lat = Date.now() - start
      if (res.status === 'ok') {
        setHealthStatus({ status: 'Operational', latency: `${lat}ms`, ok: true })
      } else {
        setHealthStatus({ status: 'Degraded', latency: `${lat}ms`, ok: false })
      }
    } catch {
      setHealthStatus({ status: 'Offline', latency: '—', ok: false })
    } finally {
      setCheckingHealth(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const timer = setInterval(checkHealth, 30000)
    return () => clearInterval(timer)
  }, [])

  const navItem = (item) => {
    const Icon = item.icon
    const active = activePage === item.label
    return (
      <button
        key={item.label}
        onClick={() => {
          onNavigate(item.label)
          if (onClose) onClose()
        }}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
          active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20'
            : 'text-slate-400 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={17} strokeWidth={1.9} />
        <span className="flex-1">{item.label}</span>
        {item.count && (
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
              active ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            {item.count}
          </span>
        )}
      </button>
    )
  }

  const adminName = admin?.name || 'Mengistu Admin'
  const initials = adminName.split(' ').map(n => n[0]).join('')

  return (
    <>
      {open && (
        <button
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-[#101a2c] px-4 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-1">
          <div
            onClick={() => onNavigate('Overview')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 shadow-lg shadow-blue-950/30">
              <LocateFixed size={22} />
            </div>
            <div>
              <div className="text-[17px] font-bold tracking-tight">GeoTrack<span className="text-blue-400">.</span></div>
              <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">Control center</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <nav className="space-y-1">{primary.map(navItem)}</nav>
        </div>

        <div className="mt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Administration</p>
          <nav className="space-y-1">{management.map(navItem)}</nav>
        </div>

        <div className="mt-auto">
          {/* Real-time System health */}
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-2">
                <Activity size={15} className={healthStatus.ok ? 'text-emerald-400' : 'text-rose-400'} /> System health
              </span>
              <button
                onClick={checkHealth}
                title="Refresh system health"
                className="text-slate-400 hover:text-white"
              >
                <RefreshCw size={12} className={checkingHealth ? 'animate-spin text-blue-400' : ''} />
              </button>
            </div>
            <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>PostgreSQL & API</span>
              <span className={healthStatus.ok ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {healthStatus.status}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  healthStatus.ok ? 'w-[98%] bg-emerald-400' : 'w-[20%] bg-rose-400'
                }`}
              />
            </div>
            <p className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Latency: {healthStatus.latency}</span>
              <span className="text-[9px] text-emerald-400">● Live Backend</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('Help & support')}
            className={`mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium transition ${
              activePage === 'Help & support'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <CircleHelp size={17} /> Help & support
          </button>

          <div className="flex items-center gap-3 border-t border-white/10 py-3.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{adminName}</p>
              <p className="mt-0.5 text-[10px] text-slate-400 capitalize">{admin?.role || 'Administrator'}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Sign out"
              title="Sign out of GeoTrack"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
