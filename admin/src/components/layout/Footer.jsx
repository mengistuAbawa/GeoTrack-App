import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import DocumentationModal from './DocumentationModal'
import PrivacyModal from './PrivacyModal'

export default function Footer() {
  const [docOpen, setDocOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  return (
    <>
      <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 xl:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 text-[10px] text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} GeoTrack. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <ShieldCheck size={13} className="text-emerald-500" /> Privacy-first location platform
            </span>
            <button
              onClick={() => setDocOpen(true)}
              className="text-slate-500 hover:text-blue-600 transition font-medium"
            >
              Documentation
            </button>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-slate-500 hover:text-blue-600 transition font-medium"
            >
              Privacy policy
            </button>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-semibold">
              Live API v1.0.0
            </span>
          </div>
        </div>
      </footer>

      <DocumentationModal open={docOpen} onClose={() => setDocOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  )
}
