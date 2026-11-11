import { useState, useEffect } from 'react'
import { MessageSquare, RefreshCw, Send, AlertTriangle, ShieldCheck, Check, Clock, User, MessageCircle } from 'lucide-react'
import { api } from '../lib/api'

export default function MessagesReports() {
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'reports'
  const [announcement, setAnnouncement] = useState('')
  const [announcementSent, setAnnouncementSent] = useState(false)
  const [reports, setReports] = useState([
    { id: 'rep-1', user: 'Dawit Alemu', type: 'Connectivity Issue', details: 'Offline sync delayed after leaving Bahir Dar area', status: 'Resolved', date: '2 hours ago' },
    { id: 'rep-2', user: 'Selamawit Desta', type: 'Permission Query', details: 'Requested clarification on revoking sharing with third party', status: 'In Review', date: '5 hours ago' },
    { id: 'rep-3', user: 'Yohannes Tadesse', type: 'Account Inquiry', details: 'Submitted verification code retry inquiry', status: 'Pending', date: '1 day ago' }
  ])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await api.getMessages()
      setMessages(data.messages || [])
      setConversations(data.conversations || [])
    } catch (err) {
      console.error('Failed to load messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSendAnnouncement = (e) => {
    e.preventDefault()
    if (!announcement.trim()) return
    setAnnouncementSent(true)
    setTimeout(() => {
      setAnnouncement('')
      setAnnouncementSent(false)
    }, 3000)
  }

  const handleResolveReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <MessageSquare size={12} className="text-blue-600" /> User Communications
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Messages & Reports</h2>
          <p className="mt-1 text-xs text-slate-500">
            Platform communication logs, SOS safety events, and user support inquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('messages')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'messages' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Messages ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'reports' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports ({reports.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Messages Feed */}
          <div className="panel overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Recent Transmitted Messages</h3>
              <button onClick={fetchData} className="text-slate-400 hover:text-slate-600">
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">No messages recorded.</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-4 hover:bg-slate-50/60 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {m.sender_name ? m.sender_name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <p className="text-xs font-bold text-slate-800">{m.sender_name || 'User'}</p>
                        <span className="text-[10px] font-mono text-slate-400">({m.sender_phone})</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {m.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Broadcast Announcement Form */}
          <div className="space-y-6">
            <div className="panel p-5">
              <h3 className="text-sm font-bold text-slate-900">Broadcast Admin Notice</h3>
              <p className="mt-1 text-xs text-slate-500">
                Send an in-app system notification banner to all connected mobile clients.
              </p>

              {announcementSent && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                  <Check size={15} /> System announcement broadcasted to 9 clients!
                </div>
              )}

              <form onSubmit={handleSendAnnouncement} className="mt-4 space-y-3">
                <textarea
                  rows={4}
                  required
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g. Scheduled platform maintenance tonight at 02:00 AM EAT. Location sharing will remain active offline."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <Send size={14} /> Send Broadcast
                </button>
              </form>
            </div>

            <div className="panel p-5 bg-gradient-to-br from-slate-900 to-[#101a2c] text-white">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                <ShieldCheck size={16} /> End-to-End Privacy
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                User messages transmitted within location sharing channels are encrypted in transit. GeoTrack administrators only review flagged reports or system broadcasts.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Reports tab */
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-bold text-slate-800">Support Inquiries & User Reports</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.map((r) => (
              <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{r.type}</h4>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        r.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{r.details}</p>
                    <p className="mt-1 text-[10px] text-slate-400">Reported by {r.user} · {r.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveReport(r.id)}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
