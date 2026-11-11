import { ShieldAlert, Radio, UserPlus, RefreshCw, CheckCheck, ArrowRight } from 'lucide-react'

export default function NotificationsDropdown({ open, onClose, onNavigate }) {
  if (!open) return null

  const items = [
    { id: 1, title: 'Security review finished', time: '10m ago', kind: 'security', desc: 'Platform permission checks completed.' },
    { id: 2, title: 'New user joined', time: '1h ago', kind: 'user', desc: 'Abel Tesfaye completed OTP registration.' },
    { id: 3, title: 'Location sync success', time: '2h ago', kind: 'sync', desc: '184 offline points received from Addis Ababa.' },
    { id: 4, title: 'Mutual share approved', time: '3h ago', kind: 'share', desc: 'Hana Mekonnen accepted Abel Tesfaye.' }
  ]

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-3">
          <span className="text-xs font-bold text-slate-800">Recent Notifications</span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">4 New</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onNavigate('Notifications')
                onClose()
              }}
              className="flex cursor-pointer items-start gap-3 p-3 transition hover:bg-slate-50"
            >
              <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs ${
                item.kind === 'security' ? 'bg-rose-50 text-rose-600' :
                item.kind === 'user' ? 'bg-blue-50 text-blue-600' :
                item.kind === 'share' ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {item.kind === 'security' ? <ShieldAlert size={14} /> :
                 item.kind === 'user' ? <UserPlus size={14} /> :
                 item.kind === 'share' ? <Radio size={14} /> : <RefreshCw size={14} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-bold text-slate-800">{item.title}</p>
                  <span className="text-[9px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 bg-slate-50/50 p-2 text-center">
          <button
            onClick={() => {
              onNavigate('Notifications')
              onClose()
            }}
            className="flex w-full items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            <span>View All Notifications</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </>
  )
}
