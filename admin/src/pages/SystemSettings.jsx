import { useState, useEffect } from 'react'
import { Settings, Server, Database, Shield, Save, CheckCircle, RefreshCw, AlertCircle, Sparkles } from 'lucide-react'
import { api } from '../lib/api'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    otpExpiresMinutes: 5,
    jwtExpiresDays: 7,
    rateLimitPer15Min: 300,
    maxOtpAttempts: 5,
    devMode: true,
    requireMfa: false,
    offlineSyncBatchLimit: 500,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [health, setHealth] = useState(null)
  const [testingDb, setTestingDb] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await api.getSettings()
      if (data.settings) setSettings(data.settings)
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkHealth = async () => {
    try {
      setTestingDb(true)
      const data = await api.getSystemHealth()
      setHealth(data)
      showToast(`Database response: ${data.database?.status} (${data.database?.latencyMs}ms)`)
    } catch (err) {
      showToast('Backend health check failed: ' + err.message, 'error')
    } finally {
      setTestingDb(false)
    }
  }

  useEffect(() => {
    loadSettings()
    checkHealth()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await api.updateSettings(settings)
      showToast('System configuration saved successfully')
    } catch (err) {
      showToast('Failed to save settings: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReSeed = async () => {
    if (!window.confirm('Populate/refresh database with realistic Ethiopian users, sharing sessions, and coordinates?')) return
    try {
      setSeeding(true)
      await api.seedDatabase()
      showToast('Database successfully populated with demo data')
      checkHealth()
    } catch (err) {
      showToast('Seed failed: ' + err.message, 'error')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-xl ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Settings size={12} className="text-blue-600" /> Platform Configuration
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">System Settings</h2>
          <p className="mt-1 text-xs text-slate-500">
            Control authentication security, OTP lifetimes, rate limits, and database parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={checkHealth}
            disabled={testingDb}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={14} className={testingDb ? 'animate-spin text-blue-600' : ''} />
            <span>Test DB Ping</span>
          </button>

          <button
            type="button"
            onClick={handleReSeed}
            disabled={seeding}
            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
          >
            <Sparkles size={14} className={seeding ? 'animate-spin' : ''} />
            <span>Seed Demo Data</span>
          </button>
        </div>
      </div>

      {/* Database & Server Health Diagnostics */}
      {health && (
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 to-blue-50/60 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-md">
                <Database size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">PostgreSQL Connection: {health.database?.status?.toUpperCase()}</h3>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {health.database?.latencyMs} ms latency
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Node.js {health.nodeVersion} · Uptime: {Math.floor(health.uptimeSeconds / 60)}m {health.uptimeSeconds % 60}s · Memory: {health.memory?.heapUsedMb} MB used
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-lg bg-white/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/60">
                Origin: {health.clientOrigin}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Authentication & OTP Settings */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Authentication & Security</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">OTP Code Validity (Minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.otpExpiresMinutes}
                onChange={(e) => setSettings({ ...settings, otpExpiresMinutes: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">Duration before SMS verification code expires.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Max OTP Attempts per Request</label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxOtpAttempts}
                onChange={(e) => setSettings({ ...settings, maxOtpAttempts: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">Attempts allowed before telephone number lock.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Admin JWT Session Expiration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.jwtExpiresDays}
                onChange={(e) => setSettings({ ...settings, jwtExpiresDays: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">Bearer token lifespan for administrator accounts.</p>
            </div>
          </div>

          {/* Sync & Performance Limits */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Server size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Sync & Rate Limits</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">API Rate Limit (Requests per 15 min)</label>
              <input
                type="number"
                min="50"
                max="2000"
                value={settings.rateLimitPer15Min}
                onChange={(e) => setSettings({ ...settings, rateLimitPer15Min: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">Express rate limiter window max request volume.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Max Offline Sync Batch Size (Records)</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={settings.offlineSyncBatchLimit}
                onChange={(e) => setSettings({ ...settings, offlineSyncBatchLimit: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-[10px] text-slate-400">Maximum GPS points uploaded in a single sync batch.</p>
            </div>

            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.devMode}
                  onChange={(e) => setSettings({ ...settings, devMode: e.target.checked })}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-700">Development mode (OTP returned in JSON)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-4 w-4 rounded text-blue-600"
                />
                <span className="text-xs font-semibold text-slate-700">Maintenance mode banner</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
