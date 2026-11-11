import { useState } from 'react'
import { Bell, CheckCheck, Trash2, ShieldAlert, Radio, UserPlus, RefreshCw, Settings, Check } from 'lucide-react'

const initialNotifications = [
  { id: 1, title: 'Security audit completed', description: 'Monthly platform permissions and role audit verified successfully.', time: '12 minutes ago', category: 'security', read: false },
  { id: 2, title: 'New user registered', description: 'Abel Tesfaye completed phone verification (+251911223344).', time: '1 hour ago', category: 'user', read: false },
  { id: 3, title: 'Offline sync spike', description: 'Batch synchronization completed with 184 records from Addis Ababa region.', time: '2 hours ago', category: 'system', read: false },
  { id: 4, title: 'Sharing session authorized', description: 'Hana Mekonnen accepted location sharing request from Abel Tesfaye.', time: '3 hours ago', category: 'share', read: false },
  { id: 5, title: 'User account suspended', description: 'Yohannes Tadesse account suspended due to rapid request anomalies.', time: 'Yesterday', category: 'security', read: true },
  { id: 6, title: 'PostgreSQL connection healthy', description: 'Database response latency averaged 4ms over last 24 hours.', time: 'Yesterday', category: 'system', read: true }
]

export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotifications)
  const [filter, setFilter] = useState('all')
  const [savedSettings, setSavedSettings] = useState(false)
  const [pref, setPref] = useState({
    emailAlerts: true,
    securityFlags: true,
    syncErrors: true,
    newUsers: false
  })

  const markAllAsRead = () => {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setItems([])
  }

  const markItemAsRead = (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const dismissItem = (id) => {
    setItems(prev => prev.filter(n => n.id !== id))
  }

  const filtered = items.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'security') return n.category === 'security'
    if (filter === 'system') return n.category === 'system'
    return true
  })

  const unreadCount = items.filter(n => !n.read).length

  const handleSavePref = () => {
    setSavedSettings(true)
    setTimeout(() => setSavedSettings(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <Bell size={12} className="text-blue-600" /> Notifications Center
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Platform Alerts</h2>
          <p className="mt-1 text-xs text-slate-500">
            Real-time security triggers, synchronization alerts, and administrative notices
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
          >
            <CheckCheck size={14} /> Mark all read
          </button>

          <button
            onClick={clearAll}
            disabled={items.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:opacity-40"
          >
            <Trash2 size={14} /> Clear all
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Main List */}
        <div className="panel overflow-hidden">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-b border-slate-100 p-4">
            {['all', 'unread', 'security', 'system'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
              </button>
            ))}
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                No notifications to display in this view.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markItemAsRead(item.id)}
                  className={`flex items-start justify-between gap-4 p-4 transition cursor-pointer ${
                    !item.read ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs ${
                      item.category === 'security'
                        ? 'bg-rose-50 text-rose-600'
                        : item.category === 'share'
                        ? 'bg-violet-50 text-violet-600'
                        : item.category === 'user'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.category === 'security' ? <ShieldAlert size={15} /> :
                       item.category === 'share' ? <Radio size={15} /> :
                       item.category === 'user' ? <UserPlus size={15} /> : <RefreshCw size={15} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{item.description}</p>
                      <span className="mt-1 block text-[10px] text-slate-400">{item.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dismissItem(item.id)
                    }}
                    title="Dismiss"
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preferences Side Panel */}
        <div className="panel p-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Alert Preferences</h3>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Security triggers</p>
                <p className="text-[10px] text-slate-400">Notify on suspicious OTP or suspended accounts</p>
              </div>
              <input
                type="checkbox"
                checked={pref.securityFlags}
                onChange={(e) => setPref({ ...pref, securityFlags: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Sync anomalies</p>
                <p className="text-[10px] text-slate-400">Alert when client sync batch fails</p>
              </div>
              <input
                type="checkbox"
                checked={pref.syncErrors}
                onChange={(e) => setPref({ ...pref, syncErrors: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Email digest</p>
                <p className="text-[10px] text-slate-400">Receive daily summary to admin email</p>
              </div>
              <input
                type="checkbox"
                checked={pref.emailAlerts}
                onChange={(e) => setPref({ ...pref, emailAlerts: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">New registrations</p>
                <p className="text-[10px] text-slate-400">Notify each time a new user registers</p>
              </div>
              <input
                type="checkbox"
                checked={pref.newUsers}
                onChange={(e) => setPref({ ...pref, newUsers: e.target.checked })}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <div className="pt-2">
              <button
                onClick={handleSavePref}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                {savedSettings ? <Check size={14} /> : null}
                <span>{savedSettings ? 'Saved!' : 'Save Preferences'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
