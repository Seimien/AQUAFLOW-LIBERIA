import React, { useMemo, useState } from 'react'
import { Search, MapPin, Navigation } from 'lucide-react'
import { TopBar } from '../components/shared/TopBar'
import { BottomNav } from '../components/shared/BottomNav'
import { PageShell } from '../components/shared/PageShell'
import { Stations as StationsRepo } from '../lib/storage'
import type { StationStatus } from '../lib/types'

const STATUS_STYLE: Record<StationStatus, { bg: string; fg: string }> = {
  Available: { bg: 'rgba(23,180,130,0.12)', fg: 'var(--success)' },
  Busy: { bg: 'rgba(232,162,61,0.14)', fg: 'var(--warning)' },
  Maintenance: { bg: 'rgba(23,180,230,0.12)', fg: 'var(--aqua)' },
  Offline: { bg: 'rgba(229,72,77,0.1)', fg: 'var(--danger)' },
}

export function Stations() {
  const [query, setQuery] = useState('')
  const stations = useMemo(() => {
    const all = [...StationsRepo.all()].sort((a, b) => a.distanceKm - b.distanceKm)
    if (!query) return all
    return all.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.area.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  return (
    <PageShell>
      <TopBar title="Stations" />
      <div className="px-6">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-input-background px-4 h-11">
          <Search size={16} color="var(--muted-foreground)" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stations"
            className="flex-1 bg-transparent outline-none text-[14px]"
          />
        </div>
      </div>

      <div className="px-6 mt-3 h-40 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(160deg, var(--secondary), var(--mist))' }}>
        <svg viewBox="0 0 300 120" className="absolute inset-0 h-full w-full opacity-40">
          <path d="M0 40 Q60 10 120 40 T240 40 T300 30" stroke="var(--aqua)" strokeWidth="1.5" fill="none" />
          <path d="M0 80 Q80 60 150 85 T300 75" stroke="var(--navy)" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
        {stations.slice(0, 5).map((s, i) => (
          <div key={s.id} className="absolute flex h-3 w-3 rounded-full border-2 border-white shadow-soft" style={{ background: STATUS_STYLE[s.status].fg, left: `${15 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }} />
        ))}
        <div className="absolute bottom-2 right-2 rounded-full bg-card px-2.5 py-1 text-[11px] font-medium shadow-soft">Map preview</div>
      </div>

      <div className="px-6 mt-5 flex flex-col gap-2.5">
        {stations.map(s => (
          <div key={s.id} className="rounded-2xl bg-card shadow-soft p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mt-0.5" style={{ background: 'var(--secondary)' }}>
                  <MapPin size={17} color="var(--navy)" />
                </div>
                <div>
                  <p className="text-[14.5px] font-semibold font-display">{s.name}</p>
                  <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.area} · {s.distanceKm.toFixed(1)} km</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_STYLE[s.status].bg, color: STATUS_STYLE[s.status].fg }}>{s.status}</span>
                    {s.status !== 'Offline' && s.status !== 'Maintenance' && (
                      <span className="text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>Queue: {s.queueLength}</span>
                    )}
                  </div>
                </div>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-full shrink-0" style={{ background: 'var(--secondary)' }}>
                <Navigation size={15} color="var(--navy)" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </PageShell>
  )
}
