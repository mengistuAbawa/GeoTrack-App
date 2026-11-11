import { BookOpen, ExternalLink, ShieldCheck, X } from 'lucide-react'

export default function DocumentationModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">GeoTrack Platform Documentation</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-600 leading-relaxed">
          <section>
            <h4 className="font-bold text-slate-900 text-sm">Overview</h4>
            <p className="mt-1">
              GeoTrack is a high-integrity, privacy-first peer-to-peer location sharing system. All location synchronization is opt-in, mutual, and encrypted.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm">API Architecture</h4>
            <div className="mt-2 space-y-1.5 font-mono text-[11px]">
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="font-bold text-blue-600">POST /api/locations/sync</span> - Atomic batch upload of offline SQLite points.
              </div>
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="font-bold text-emerald-600">GET /api/locations/shared-with-me</span> - Live location query for approved viewers.
              </div>
              <div className="rounded bg-slate-50 p-2 border border-slate-100">
                <span className="font-bold text-violet-600">POST /api/sharing/requests</span> - Solicit peer-to-peer permission handshake.
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm">Security & Auditing</h4>
            <p className="mt-1">
              Administrative functions require a bearer JWT header with admin claims. Every modification to user status, permission authorizations, and settings is written to the immutable PostgreSQL audit log.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  )
}
