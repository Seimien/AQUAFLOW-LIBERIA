import React, { useState } from 'react'
import { CreditCard, Plus, Radio } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNav } from '../../context/NavContext'
import { BottomNav } from '../../components/shared/BottomNav'
import { PageShell } from '../../components/shared/PageShell'
import { EmptyState } from '../../components/shared/EmptyState'
import { Devices } from '../../lib/storage'
import type { DeviceStatus } from '../../lib/types'

const STATUS_COLOR: Record<DeviceStatus, string> = {
  Active: 'var(--success)', Inactive: 'var(--muted-foreground)', Frozen: 'var(--aqua)',
  'Pending Pickup': 'var(--warning)', Lost: 'var(--danger)', Replacement: 'var(--warning)',
}

export function CardsList() {
  const { user } = useApp()
  const { navigate } = useNav()
  const [tab, setTab] = useState<'card' | 'band'>('card')
  const devices = user ? Devices.forUser(user.id).filter(d => d.kind === tab) : []

  return (
    <PageShell>
      <div className="flex items-center justify-between px-6 pt-[max(0.9rem,env(safe-area-inset-top))] pb-1">
        <h1 className="text-[19px] font-display font-semibold">Cards &amp; Bands</h1>
        <button
          onClick={() => navigate('request-card')}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-semibold"
          style={{ background: 'var(--navy)', color: '#fff' }}
        >
          <Plus size={15} /> Request
        </button>
      </div>

      <div className="px-6 mt-3 flex gap-2">
        <TabButton active={tab === 'card'} onClick={() => setTab('card')}>RFID Cards</TabButton>
        <TabButton active={tab === 'band'} onClick={() => setTab('band')}>NFC Bands</TabButton>
      </div>

      <div className="px-6 mt-5 flex flex-col gap-3">
        {devices.length === 0 ? (
          <EmptyState
            icon={tab === 'card' ? CreditCard : Radio}
            title={tab === 'card' ? 'No RFID cards yet' : 'No NFC bands yet'}
            body={`Request your first ${tab === 'card' ? 'physical card' : 'wristband'} to start dispensing water at any station.`}
          />
        ) : (
          devices.map(d => (
            <button
              key={d.id}
              onClick={() => navigate('card-detail', { id: d.id })}
              className="w-full rounded-2xl p-5 text-left shadow-lift active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {d.kind === 'card' ? 'RFID CARD' : 'NFC BAND'} · {d.assignedTo.toUpperCase()}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: STATUS_COLOR[d.status] }}>
                  {d.status}
                </span>
              </div>
              <p className="mt-4 text-[16px] font-display font-semibold text-white">{d.label}</p>
              <p className="mt-1 text-[13px] font-mono-data" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.code}</p>
              {d.lastUsedStation && (
                <p className="mt-3 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Last used at {d.lastUsedStation}</p>
              )}
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </PageShell>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 h-10 rounded-xl text-[13.5px] font-semibold transition-colors"
      style={{ background: active ? 'var(--navy)' : 'var(--secondary)', color: active ? '#fff' : 'var(--navy)' }}
    >
      {children}
    </button>
  )
}
