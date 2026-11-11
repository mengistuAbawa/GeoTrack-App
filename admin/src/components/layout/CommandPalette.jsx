import { useState, useEffect } from 'react'
import { Search, LayoutDashboard, MapPinned, Users, Radio, History, MessageSquare, Bell, ShieldCheck, Settings, CircleHelp, ArrowRight, X } from 'lucide-react'

const allCommands = [
  { label: 'Overview', icon: LayoutDashboard, category: 'Page', desc: 'Main control center dashboard' },
  { label: 'Live locations', icon: MapPinned, category: 'Page', desc: 'Real-time GPS tracker across Ethiopia' },
  { label: 'Users', icon: Users, category: 'Page', desc: 'User accounts directory and status' },
  { label: 'Sharing sessions', icon: Radio, category: 'Page', desc: 'Active and pending mutual shares' },
  { label: 'Location history', icon: History, category: 'Page', desc: 'GPS point audit trail and accuracy' },
  { label: 'Messages & reports', icon: MessageSquare, category: 'Page', desc: 'Communications and user inquiries' },
  { label: 'Notifications', icon: Bell, category: 'Page', desc: 'Security triggers and alerts' },
  { label: 'Security & audit', icon: ShieldCheck, category: 'Page', desc: 'PostgreSQL audit logs' },
  { label: 'System settings', icon: Settings, category: 'Page', desc: 'OTP expiry, tokens, rate limits' },
  { label: 'Help & support', icon: CircleHelp, category: 'Page', desc: 'FAQs, API references, support' }
]

export default function CommandPalette({ open, onClose, onSelectPage }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else {
          setQuery('')
        }
      }
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const filtered = allCommands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search size={18} className="text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a page name or command to jump to..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for "{query}".
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onSelectPage(item.label)
                    onClose()
                  }}
                  className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600" />
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[10px] text-slate-400">
          <span>Navigate with click or arrow keys</span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono">ESC to exit</kbd>
        </div>
      </div>
    </div>
  )
}
