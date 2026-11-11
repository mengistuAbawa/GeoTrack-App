import { useState } from 'react'
import { CircleHelp, BookOpen, Send, CheckCircle, ChevronDown, ChevronUp, ShieldCheck, ExternalLink } from 'lucide-react'

const faqs = [
  {
    q: 'How does offline location caching work in GeoTrack?',
    a: 'When an authorized mobile device loses cell or internet connectivity, location coordinates continue recording to local SQLite cache. Upon reconnecting, the device executes a single atomic batch sync to /api/locations/sync.'
  },
  {
    q: 'How does GeoTrack ensure user privacy and mutual consent?',
    a: 'Location sharing is strictly opt-in and peer-to-peer. An owner must explicitly approve a contact request before any coordinates become visible. Owners can revoke sharing permissions at any moment.'
  },
  {
    q: 'What coordinates system does the platform utilize?',
    a: 'All GPS coordinates are represented as standard WGS84 floating point values (Latitude: -90 to +90, Longitude: -180 to +180), stored in PostgreSQL.'
  },
  {
    q: 'How are administrative accounts secured?',
    a: 'Admin accounts authenticate via bcrypt-hashed passwords (12 rounds) and receive time-limited HMAC-SHA256 JWT tokens. Every state modification generates an audit log record.'
  }
]

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(0)
  const [ticket, setTicket] = useState({ subject: '', priority: 'Normal', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitTicket = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setTicket({ subject: '', priority: 'Normal', message: '' })
      setSubmitted(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
          <CircleHelp size={12} className="text-blue-600" /> Assistance & Knowledge
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Help & Support Center</h2>
        <p className="mt-1 text-xs text-slate-500">
          Platform documentation, architectural guidelines, and engineering support requests
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* FAQs */}
        <div className="space-y-4">
          <div className="panel p-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen size={16} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-800">Frequently Asked Questions</h3>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="py-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-blue-600"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick API Docs card */}
          <div className="panel p-5">
            <h3 className="text-sm font-bold text-slate-800">API Documentation Summary</h3>
            <p className="mt-1 text-xs text-slate-500">Core REST endpoints available in GeoTrack backend</p>
            <div className="mt-3 space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <span className="font-bold text-blue-600">GET /api/health</span>
                <span className="text-slate-500">Public service status</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <span className="font-bold text-emerald-600">POST /api/admin/auth/login</span>
                <span className="text-slate-500">Admin authentication</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <span className="font-bold text-indigo-600">GET /api/admin/dashboard/stats</span>
                <span className="text-slate-500">Platform metrics</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <span className="font-bold text-violet-600">GET /api/admin/live-locations</span>
                <span className="text-slate-500">Real-time GPS feed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Ticket */}
        <div className="panel p-5">
          <h3 className="text-sm font-bold text-slate-800">Submit Engineering Request</h3>
          <p className="mt-1 text-xs text-slate-500">
            Open a high-priority ticket with GeoTrack systems infrastructure team.
          </p>

          {submitted && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              <CheckCircle size={15} /> Support ticket #GEO-{Math.floor(1000 + Math.random() * 9000)} created successfully!
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Subject</label>
              <input
                type="text"
                required
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                placeholder="e.g. Inquire about database SSL configuration"
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Priority Level</label>
              <select
                value={ticket.priority}
                onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              >
                <option value="Low">Low - General Question</option>
                <option value="Normal">Normal - Standard Operational</option>
                <option value="High">High - Degraded Performance</option>
                <option value="Critical">Critical - Service Disruption</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={ticket.message}
                onChange={(e) => setTicket({ ...ticket, message: e.target.value })}
                placeholder="Describe the issue, reproduction steps, or request details..."
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <Send size={14} /> Submit Support Request
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
