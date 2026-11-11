import { Users, Radio, Map, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const icons = { users: Users, radio: Radio, map: Map, clock: Clock }
const tones = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600'
}

export default function MetricCard({ metric }) {
  const Icon = icons[metric.icon]
  const isDown = metric.change.startsWith('-')
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-medium text-slate-500">{metric.label}</p><p className="mt-3 text-[27px] font-bold tracking-tight text-slate-900">{metric.value}</p></div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[metric.tone]}`}><Icon size={19} /></div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${isDown ? 'text-rose-600' : 'text-emerald-600'}`}>{isDown ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{metric.change}</span>
        <span className="text-[10px] text-slate-400">{metric.detail}</span>
      </div>
    </article>
  )
}
