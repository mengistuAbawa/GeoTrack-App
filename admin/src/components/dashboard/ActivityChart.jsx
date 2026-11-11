import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import SectionHeading from '../ui/SectionHeading'

const datasets = {
  'This week': [
    { day: 'Mon', users: 34, sessions: 21 },
    { day: 'Tue', users: 42, sessions: 27 },
    { day: 'Wed', users: 38, sessions: 24 },
    { day: 'Thu', users: 51, sessions: 33 },
    { day: 'Fri', users: 47, sessions: 30 },
    { day: 'Sat', users: 62, sessions: 41 },
    { day: 'Sun', users: 57, sessions: 38 }
  ],
  'Last week': [
    { day: 'Mon', users: 24, sessions: 15 },
    { day: 'Tue', users: 30, sessions: 18 },
    { day: 'Wed', users: 29, sessions: 20 },
    { day: 'Thu', users: 35, sessions: 22 },
    { day: 'Fri', users: 38, sessions: 25 },
    { day: 'Sat', users: 45, sessions: 31 },
    { day: 'Sun', users: 40, sessions: 28 }
  ],
  'This month': [
    { day: 'W1', users: 180, sessions: 120 },
    { day: 'W2', users: 240, sessions: 165 },
    { day: 'W3', users: 310, sessions: 215 },
    { day: 'W4', users: 390, sessions: 280 }
  ]
}

export default function ActivityChart({ chartData }) {
  const [range, setRange] = useState('This week')

  const data = (range === 'This week' && chartData && chartData.length > 0)
    ? chartData
    : datasets[range] || datasets['This week']

  return (
    <section className="panel p-5">
      <SectionHeading
        title="Platform Activity"
        subtitle="Registrations & active location shares over time"
        action={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-medium text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="This week">This week</option>
            <option value="Last week">Last week</option>
            <option value="This month">This month</option>
          </select>
        }
      />
      <div className="mb-3 flex gap-4 text-[10px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-blue-500" /> New users
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-violet-400" /> Sharing sessions
        </span>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3978f6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#3978f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#edf1f6" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#98a2b3', fontSize: 10 }} dy={9} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#98a2b3', fontSize: 10 }} />
            <Tooltip contentStyle={{ border: '1px solid #e9eef5', borderRadius: 12, fontSize: 11, boxShadow: '0 8px 24px #10182812' }} />
            <Area type="monotone" dataKey="users" name="New users" stroke="#3978f6" strokeWidth={2.5} fill="url(#usersFill)" />
            <Area type="monotone" dataKey="sessions" name="Sharing sessions" stroke="#a78bfa" strokeWidth={2.5} fill="url(#sessionsFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
