import { Shield, Mail, Key, LogOut, Settings, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ProfileModal({ open, onClose, onNavigate }) {
  const { admin, logout } = useAuth()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            {admin?.name ? admin.name.split(' ').map(n => n[0]).join('') : 'AD'}
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-900">{admin?.name || 'Administrator'}</h4>
          <span className="mt-0.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            {admin?.role || 'Super Admin'}
          </span>
        </div>

        <div className="mt-5 space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <Mail size={15} className="text-slate-400" />
            <span className="truncate text-slate-700">{admin?.email || 'admin@geotrack.local'}</span>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <Shield size={15} className="text-emerald-500" />
            <span className="text-slate-700">Authenticated via JWT Bearer</span>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <Key size={15} className="text-slate-400" />
            <span className="truncate font-mono text-[11px] text-slate-500">ID: {admin?.id || 'admin-01'}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              onNavigate('System settings')
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Settings size={14} /> System Settings
          </button>

          <button
            onClick={() => {
              onClose()
              logout()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
