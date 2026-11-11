import { useState } from 'react'
import { Maximize2, Layers, LocateFixed, MapPin, X, ExternalLink } from 'lucide-react'

const initialPins = [
  { x: '40%', y: '46%', label: 'Addis Ababa', count: '4', region: 'Sheger / Central', users: ['Abel Tesfaye', 'Hana Mekonnen'] },
  { x: '18%', y: '28%', label: 'Bahir Dar', count: '1', region: 'Amhara', users: ['Dawit Alemu'] },
  { x: '42%', y: '68%', label: 'Hawassa', count: '1', region: 'Sidama', users: ['Kebede Michael'] },
  { x: '20%', y: '66%', label: 'Jimma', count: '1', region: 'Oromia', users: ['Selamawit Desta'] },
  { x: '58%', y: '50%', label: 'Adama', count: '1', region: 'Oromia', users: ['Mimi Bekele'] },
  { x: '72%', y: '45%', label: 'Dire Dawa', count: '1', region: 'Eastern', users: ['Aster Aweke'] }
]

export default function LocationMapPanel({ onNavigate }) {
  const [activeLayer, setActiveLayer] = useState('Standard')
  const [pins] = useState(initialPins)
  const [selectedPin, setSelectedPin] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleLayerCycle = () => {
    const layers = ['Standard', 'Terrain', 'Satellite']
    const next = layers[(layers.indexOf(activeLayer) + 1) % layers.length]
    setActiveLayer(next)
    setFeedback(`Map style: ${next}`)
    setTimeout(() => setFeedback(''), 2500)
  }

  const handleLocateReset = () => {
    setSelectedPin(pins[0])
    setFeedback('Centered on Addis Ababa capital region')
    setTimeout(() => setFeedback(''), 2500)
  }

  return (
    <>
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Geographic Activity Map</h2>
            <p className="mt-1 text-[11px] text-slate-400">Live regional distribution across Ethiopia</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Active regions ({pins.length})
            </span>
            <button
              onClick={handleLayerCycle}
              title={`Switch layer (Current: ${activeLayer})`}
              className={`rounded-lg border p-2 transition ${
                activeLayer !== 'Standard'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Layers size={15} />
            </button>
            <button
              onClick={() => setExpanded(true)}
              title="Expand full screen map"
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>

        <div className={`map-surface relative h-[300px] overflow-hidden sm:h-[340px] ${
          activeLayer === 'Satellite' ? 'brightness-90 contrast-125' : ''
        }`}>
          {feedback && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur shadow-md animate-in fade-in">
              {feedback}
            </div>
          )}

          <div className="map-label left-[8%] top-[15%]">AMHARA / GONDAR</div>
          <div className="map-label left-[48%] top-[13%]">AFAR</div>
          <div className="map-label left-[44%] top-[40%] font-black text-slate-700">ADDIS ABABA</div>
          <div className="map-label left-[29%] top-[56%]">OROMIA</div>
          <div className="map-label left-[70%] top-[53%]">SOMALI</div>

          <svg viewBox="0 0 800 420" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-60">
            <path d="M70 90 C160 20 240 80 300 65 S420 25 470 90 S590 110 720 55" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 7"/>
            <path d="M100 300 C200 220 250 270 350 210 S510 240 690 160" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 7"/>
            <path d="M220 0 L260 420 M480 0 L430 420 M0 190 L800 230" fill="none" stroke="#dbe4ef" strokeWidth="1.5"/>
            <path d="M0 350 Q160 260 270 320 T520 310 T800 360" fill="none" stroke="#bfdbfe" strokeWidth="2"/>
          </svg>

          {pins.map((pin) => (
            <div
              key={pin.label}
              onClick={() => setSelectedPin(pin)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className="relative flex flex-col items-center">
                <span className="absolute -inset-2 animate-ping rounded-full bg-blue-400/20" />
                <span className="relative grid h-8 w-8 place-items-center rounded-full border-[3px] border-white bg-blue-600 text-white shadow-lg">
                  <MapPin size={14} fill="currentColor" />
                </span>
                <span className="mt-1 whitespace-nowrap rounded-md border border-white/80 bg-white/90 px-2 py-1 text-[9px] font-bold text-slate-700 shadow-sm">
                  {pin.label} · {pin.count}
                </span>
              </div>
            </div>
          ))}

          <div className="absolute bottom-3 left-3 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[10px] text-slate-500 shadow-sm backdrop-blur">
            <span className="font-semibold text-slate-800">Ethiopia Region ({activeLayer})</span>
            <span className="mx-2 text-slate-300">|</span>Click pin to inspect
          </div>

          <button
            onClick={handleLocateReset}
            aria-label="Locate Addis Ababa"
            title="Center on Addis Ababa"
            className="absolute bottom-3 right-3 rounded-lg border border-white bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <LocateFixed size={15} />
          </button>
        </div>
      </section>

      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">{selectedPin.label} Hub</h3>
              </div>
              <button onClick={() => setSelectedPin(null)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="text-slate-500">Region: <strong className="text-slate-800">{selectedPin.region}</strong></p>
              <p className="text-slate-500">Active users: <strong className="text-blue-600">{selectedPin.count}</strong></p>
              
              <div className="rounded-xl bg-slate-50 p-2.5 space-y-1">
                <p className="font-semibold text-[11px] text-slate-700">Tracked Users:</p>
                {selectedPin.users.map(u => (
                  <p key={u} className="text-[11px] text-slate-600">• {u}</p>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setSelectedPin(null)
                  if (onNavigate) onNavigate('Live locations')
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                <span>Live Tracker</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm">Full Screen Geographic Operations (Ethiopia)</h3>
            <button onClick={() => setExpanded(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="map-surface relative flex-1 mt-4 rounded-2xl overflow-hidden">
            {pins.map((pin) => (
              <div
                key={pin.label}
                onClick={() => {
                  setExpanded(false)
                  setSelectedPin(pin)
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: pin.x, top: pin.y }}
              >
                <div className="relative flex flex-col items-center">
                  <span className="relative grid h-10 w-10 place-items-center rounded-full border-[3px] border-white bg-blue-600 text-white shadow-xl">
                    <MapPin size={18} fill="currentColor" />
                  </span>
                  <span className="mt-1 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-800 shadow-md">
                    {pin.label} ({pin.count})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
