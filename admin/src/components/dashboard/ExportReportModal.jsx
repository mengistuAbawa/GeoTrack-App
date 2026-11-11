import { useState } from 'react'
import { Download, Check, FileText, X } from 'lucide-react'

export default function ExportReportModal({ open, onClose, stats }) {
  const [format, setFormat] = useState('csv')
  const [downloading, setDownloading] = useState(false)

  if (!open) return null

  const handleDownload = () => {
    setDownloading(true)
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'GeoTrack Admin',
      metrics: stats || { total_users: 9, active_shares: 4, location_records: 45, pending_shares: 1 }
    }

    let fileContent = ''
    let mimeType = ''
    let filename = ''

    if (format === 'json') {
      fileContent = JSON.stringify(reportData, null, 2)
      mimeType = 'application/json'
      filename = `geotrack_report_${Date.now()}.json`
    } else {
      fileContent = `Metric,Value\nTotal Users,${reportData.metrics.total_users || 0}\nActive Users,${reportData.metrics.active_users || 0}\nActive Shares,${reportData.metrics.active_shares || 0}\nPending Shares,${reportData.metrics.pending_shares || 0}\nLocation Records,${reportData.metrics.location_records || 0}\nGenerated At,${reportData.generatedAt}\n`
      mimeType = 'text/csv'
      filename = `geotrack_report_${Date.now()}.csv`
    }

    const blob = new Blob([fileContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setTimeout(() => {
      setDownloading(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Export Platform Report</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <p className="text-slate-600">Choose preferred export format for GeoTrack metrics summary:</p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`rounded-xl border p-3 text-center transition ${
                format === 'csv'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              CSV Spreadsheet
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`rounded-xl border p-3 text-center transition ${
                format === 'json'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              JSON Data
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={13} />
            <span>{downloading ? 'Downloading...' : 'Download File'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
