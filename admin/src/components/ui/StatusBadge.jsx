export default function StatusBadge({ status }) {
  const styles = {
    Sharing: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    Synced: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    Offline: 'bg-slate-100 text-slate-600 ring-slate-500/10',
    Syncing: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    'Waiting for connection': 'bg-amber-50 text-amber-700 ring-amber-600/10'
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${styles[status] || 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Sharing' || status === 'Synced' ? 'bg-emerald-500' : status === 'Syncing' ? 'bg-blue-500' : status === 'Offline' ? 'bg-slate-400' : 'bg-amber-500'}`} />
      {status}
    </span>
  )
}
