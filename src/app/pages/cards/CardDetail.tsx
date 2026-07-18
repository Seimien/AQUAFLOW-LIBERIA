import React, { useState } from 'react'
import { PauseCircle, PlayCircle, Edit3, RefreshCcw, ChevronRight, Lock } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { TopBar } from '../../components/shared/TopBar'
import { Devices, Transactions } from '../../lib/storage'
import type { DeviceCard } from '../../lib/types'
import { formatLiters, relativeDay, formatTime } from '../../lib/format'
import { toast } from 'sonner'

type Period = 'daily' | 'weekly' | 'monthly'

export function CardDetail() {
  const { entry } = useNav()
  const id = entry.params?.id ?? ''
  const [, force] = useState(0)
  const [period, setPeriod] = useState<Period>('daily')
  const [limitValue, setLimitValue] = useState('')
  const device = Devices.byId(id)

  if (!device) {
    return (
      <div className="min-h-dvh flex flex-col">
        <TopBar showBack title="Card Details" />
        <p className="px-6 mt-6 text-[14px]" style={{ color: 'var(--muted-foreground)' }}>This card could not be found.</p>
      </div>
    )
  }

  const txns = Transactions.forUser(device.userId).filter(t => t.cardId === device.id)
  const isApproved = device.status === 'Active' || device.status === 'Frozen'
  const isDisabled = device.status === 'Frozen'

  function toggleDisable() {
    const next = isDisabled ? 'Active' : 'Frozen'
    Devices.update(device!.id, { status: next })
    toast.success(next === 'Frozen' ? 'Card disabled' : 'Card enabled')
    force(x => x + 1)
  }

  function rename() {
    const label = prompt('Rename card', device!.label)
    if (label) {
      Devices.update(device!.id, { label })
      toast.success('Card renamed')
      force(x => x + 1)
    }
  }

  function replace() {
    Devices.update(device!.id, { status: 'Replacement' })
    toast.success('Replacement requested \u2014 a new card will be issued at pickup')
    force(x => x + 1)
  }

  function saveLimit() {
    const liters = Number(limitValue)
    if (!liters) return toast.error('Enter a liter amount')
    const patch: Partial<DeviceCard> =
      period === 'daily' ? { dailyLimit: liters } :
      period === 'weekly' ? { weeklyLimit: liters } :
      { monthlyLimit: liters }
    Devices.update(device!.id, patch)
    toast.success(`${period[0].toUpperCase()}${period.slice(1)} limit set to ${liters}L`)
    setLimitValue('')
    force(x => x + 1)
  }

  return (
    <div className="min-h-dvh flex flex-col pb-10">
      <TopBar showBack title={device.kind === 'card' ? 'Card Details' : 'Band Details'} />

      <div className="px-6">
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>{device.assignedTo.toUpperCase()}</span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>{device.status}</span>
          </div>
          <p className="mt-5 text-[17px] font-display font-semibold text-white">{device.label}</p>
          <p className="mt-1 text-[13px] font-mono-data" style={{ color: 'rgba(255,255,255,0.6)' }}>{device.code}</p>
        </div>
      </div>

      {!isApproved && (
        <div className="mx-6 mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ background: 'rgba(232,162,61,0.12)' }}>
          <Lock size={15} color="var(--warning)" />
          <p className="text-[12.5px]" style={{ color: 'var(--warning)' }}>
            {device.status === 'Pending Pickup' ? 'Awaiting admin approval before this card can be used or limited.' : 'This card is unavailable.'}
          </p>
        </div>
      )}

      <div className="px-6 mt-5 flex flex-col rounded-2xl bg-card shadow-soft">
        <Row icon={isDisabled ? PlayCircle : PauseCircle} label={isDisabled ? 'Enable Card' : 'Disable Card'} onClick={toggleDisable} disabled={!isApproved} />
        <Row icon={Edit3} label="Rename Card" onClick={rename} />
        <Row icon={RefreshCcw} label="Replace Card" onClick={replace} last />
      </div>

      <div className="px-6 mt-6">
        <p className="text-[13px] font-semibold">Usage Limits</p>
        <div className="mt-2 grid grid-cols-3 gap-2.5">
          <Limit label="Daily" value={device.dailyLimit} />
          <Limit label="Weekly" value={device.weeklyLimit} />
          <Limit label="Monthly" value={device.monthlyLimit} />
        </div>

        {isApproved ? (
          <div className="mt-3 rounded-2xl bg-card shadow-soft p-4">
            <p className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Limit Period</p>
            <div className="mt-2 flex gap-2">
              {(['daily', 'weekly', 'monthly'] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="flex-1 h-9 rounded-lg text-[12.5px] font-semibold capitalize"
                  style={{ background: period === p ? 'var(--navy)' : 'var(--secondary)', color: period === p ? '#fff' : 'var(--navy)' }}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Number of Liters</p>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex-1 flex items-center rounded-xl border border-input bg-input-background px-4 h-11">
                <input
                  value={limitValue}
                  onChange={e => setLimitValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 50"
                  inputMode="numeric"
                  className="flex-1 bg-transparent outline-none text-[14px]"
                />
                <span className="text-[12.5px]" style={{ color: 'var(--muted-foreground)' }}>Liters</span>
              </div>
              <button onClick={saveLimit} className="h-11 px-4 rounded-xl text-[13px] font-semibold" style={{ background: 'var(--aqua)', color: '#fff' }}>
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[12.5px]" style={{ color: 'var(--muted-foreground)' }}>Limits unlock once this card is approved by an admin.</p>
        )}
      </div>

      <div className="px-6 mt-6">
        <p className="text-[13px] font-semibold">Card Transactions</p>
        <div className="mt-2 flex flex-col gap-2">
          {txns.length === 0 ? (
            <p className="text-[13px] mt-1" style={{ color: 'var(--muted-foreground)' }}>No transactions on this card yet.</p>
          ) : txns.slice(0, 8).map(t => (
            <div key={t.id} className="flex items-center justify-between rounded-xl bg-card shadow-soft px-4 py-3">
              <div>
                <p className="text-[13.5px] font-medium">Water Collected</p>
                <p className="text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>{relativeDay(t.createdAt)}, {formatTime(t.createdAt)}</p>
              </div>
              <span className="text-[13.5px] font-semibold" style={{ color: 'var(--danger)' }}>-{formatLiters(t.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, onClick, last, disabled }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; onClick: () => void; last?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="flex items-center gap-3 px-4 py-3.5 disabled:opacity-40" style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <Icon size={17} color="var(--navy)" />
      <span className="flex-1 text-left text-[14px] font-medium">{label}</span>
      <ChevronRight size={16} color="var(--muted-foreground)" />
    </button>
  )
}

function Limit({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-card shadow-soft py-3 text-center">
      <p className="text-[15px] font-display font-semibold">{value ? `${value}L` : '\u2014'}</p>
      <p className="text-[11px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  )
}
