import { UserPlus, RefreshCw, Radio, ShieldCheck, ArrowRight } from 'lucide-react'
import { activities } from '../../data/dashboardData'
import SectionHeading from '../ui/SectionHeading'

const icons = { user: UserPlus, sync: RefreshCw, share: Radio, security: ShieldCheck }
const styles = { user: 'bg-blue-50 text-blue-600', sync: 'bg-emerald-50 text-emerald-600', share: 'bg-violet-50 text-violet-600', security: 'bg-amber-50 text-amber-600' }

export default function ActivityFeed({ onNavigate }) {
  return (
    <section className="panel p-5">
      <SectionHeading
        title="Recent activity"
        subtitle="Latest events across the platform"
        action={
          <button
            onClick={() => onNavigate && onNavigate('Security & audit')}
            aria-label="View security audit log"
            title="View Security Audit"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
          >
            <ArrowRight size={15} />
          </button>
        }
      />
      <div className="space-y-4">
        {activities.map((item) => {
          const Icon = icons[item.kind] || ShieldCheck
          return (
            <div
              key={item.title}
              onClick={() => onNavigate && onNavigate('Security & audit')}
              className="flex gap-3 cursor-pointer group"
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition ${styles[item.kind]}`}>
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1 border-b border-slate-100 pb-3 last:border-0">
                <div className="flex flex-wrap items-start justify-between gap-1">
                  <p className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-600 transition">
                    {item.title}
                  </p>
                  <span className="text-[9px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-[10px] leading-5 text-slate-500">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
