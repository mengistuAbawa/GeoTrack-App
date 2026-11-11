import { useState } from 'react'
import { Smartphone, MoreHorizontal, MapPin, Check, XCircle, Users } from 'lucide-react'
import { sharingSessions as initialSessions } from '../../data/dashboardData'
import StatusBadge from '../ui/StatusBadge'
import SectionHeading from '../ui/SectionHeading'

export default function RecentSessions({ onNavigate }) {
  const [sessions, setSessions] = useState(initialSessions)
  const [activeMenu, setActiveMenu] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const handleCopyArea = (area) => {
    navigator.clipboard.writeText(area)
    setFeedback(`Copied: ${area}`)
    setActiveMenu(null)
    setTimeout(() => setFeedback(null), 2000)
  }

  const handleRevoke = (index) => {
    setSessions(prev => prev.map((s, idx) => idx === index ? { ...s, status: 'Revoked' } : s))
    setFeedback('Sharing revoked')
    setActiveMenu(null)
    setTimeout(() => setFeedback(null), 2000)
  }

  return (
    <section className="panel relative">
      {feedback && (
        <div className="absolute top-4 right-20 z-20 rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold text-white shadow-md">
          {feedback}
        </div>
      )}

      <div className="px-5 pt-5">
        <SectionHeading
          title="Active sharing sessions"
          subtitle="Location access currently authorized by users"
          action={
            <button
              onClick={() => onNavigate && onNavigate('Sharing sessions')}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              View all
            </button>
          }
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/70 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3">User</th>
              <th className="px-4 py-3">Last known area</th>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((person, index) => (
              <tr key={person.phone} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold ${
                      ['bg-blue-100 text-blue-700', 'bg-violet-100 text-violet-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700'][index % 4]
                    }`}>
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-800">{person.name}</p>
                      <p className="mt-0.5 text-[9px] text-slate-400">{person.phone}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <MapPin size={12} className="text-slate-400" />
                    {person.area}
                  </span>
                </td>

                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Smartphone size={12} />
                    {person.device}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-[10px] text-slate-500">{person.updated}</td>

                <td className="px-4 py-3.5">
                  <StatusBadge status={person.status} />
                </td>

                <td className="px-4 py-3.5 text-right relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                    aria-label={`Actions for ${person.name}`}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenu === index && (
                    <div className="absolute right-4 top-10 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl">
                      <button
                        onClick={() => handleCopyArea(person.area)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        <MapPin size={13} /> Copy Area
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenu(null)
                          if (onNavigate) onNavigate('Users')
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50"
                      >
                        <Users size={13} /> View Account
                      </button>
                      <button
                        onClick={() => handleRevoke(index)}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <XCircle size={13} /> Revoke Share
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-3 text-[10px] text-slate-400">
        Live peer-to-peer records backed by mutual consent and revocable at any time.
      </div>
    </section>
  )
}
