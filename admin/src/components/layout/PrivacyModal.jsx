import { ShieldCheck, Lock, Check, X } from 'lucide-react'

export default function PrivacyModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">GeoTrack Privacy Policy</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            GeoTrack was built with a fundamental commitment to privacy-preserving location sharing.
          </p>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <span><strong>Explicit Consent:</strong> No location records are transmitted or shared without active, explicit authorization by the device owner.</span>
            </div>

            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <span><strong>Instant Revocation:</strong> Users can revoke location sharing permissions at any moment, immediately blocking contact access.</span>
            </div>

            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <span><strong>Data Minimization:</strong> Unshared location history is aged out according to retention policies.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
