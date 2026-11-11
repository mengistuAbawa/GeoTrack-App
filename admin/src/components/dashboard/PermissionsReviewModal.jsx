import { useState } from 'react'
import { ShieldCheck, Check, AlertTriangle, X } from 'lucide-react'

export default function PermissionsReviewModal({ open, onClose, onNavigate }) {
  const [retention, setRetention] = useState('30days')
  const [enforceMfa, setEnforceMfa] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!open) return null

  const handleApply = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Review Privacy & Permissions</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700">Location Record Retention Window</label>
            <select
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
            >
              <option value="7days">7 days (Maximum privacy)</option>
              <option value="30days">30 days (Recommended)</option>
              <option value="90days">90 days (Extended history)</option>
              <option value="unlimited">Unlimited (Keep all records)</option>
            </select>
            <p className="mt-1 text-[10px] text-slate-400">Location history records older than this will be permanently purged.</p>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enforceMfa}
              onChange={(e) => setEnforceMfa(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600"
            />
            <span className="font-semibold text-slate-700">Require contact approval re-prompt every 14 days</span>
          </label>

          <div className="rounded-xl bg-blue-50/70 p-3 text-[11px] text-blue-800">
            All active sharing sessions can also be individually inspected and revoked in the <strong>Sharing sessions</strong> tab.
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => {
              onClose()
              if (onNavigate) onNavigate('Sharing sessions')
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Manage Sessions
          </button>

          <button
            onClick={handleApply}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            {saved ? 'Applied!' : 'Save Policy'}
          </button>
        </div>
      </div>
    </div>
  )
}
