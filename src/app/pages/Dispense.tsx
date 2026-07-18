import React, { useState } from 'react'
import { CheckCircle2, Nfc } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNav } from '../context/NavContext'
import { TopBar } from '../components/shared/TopBar'
import { Button } from '../components/ui/button'
import { Transactions, Wallets, Devices, uid } from '../lib/storage'
import { formatLiters } from '../lib/format'
import { toast } from 'sonner'

const PRESETS = [5, 10, 20, 50]

type Stage = 'amount' | 'tap' | 'success'

export function Dispense() {
  const { user, wallet, refreshWallet } = useApp()
  const { back } = useNav()
  const [amount, setAmount] = useState<number | null>(10)
  const [custom, setCustom] = useState('')
  const [stage, setStage] = useState<Stage>('amount')
  const [error, setError] = useState('')

  const liters = amount ?? Number(custom || 0)
  const devices = user ? Devices.forUser(user.id).filter(d => d.status === 'Active') : []

  function goToTap() {
    if (!liters) return setError('Enter an amount')
    if (liters > wallet.waterLiters) return setError('Not enough water balance')
    setError('')
    setStage('tap')
  }

  function simulateTap() {
    if (!user) return
    Wallets.update(user.id, { waterLiters: wallet.waterLiters - liters })
    Transactions.add({
      id: uid('txn-'), userId: user.id, type: 'dispense', amount: liters, unit: 'liters',
      station: 'Broad Street Station', cardId: devices[0]?.id, createdAt: new Date().toISOString(),
    })
    if (devices[0]) {
      Devices.update(devices[0].id, { lastUsedAt: new Date().toISOString(), lastUsedStation: 'Broad Street Station' })
    }
    refreshWallet()
    setStage('success')
  }

  if (stage === 'success') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full animate-pop" style={{ background: 'rgba(23,180,130,0.12)' }}>
          <CheckCircle2 size={40} color="var(--success)" />
        </div>
        <h1 className="mt-6 text-[20px] font-display font-semibold">Water Dispensed</h1>
        <p className="mt-1 text-[26px] font-display font-semibold" style={{ color: 'var(--aqua)' }}>{formatLiters(liters)}</p>
        <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Broad Street Station</p>
        <Button className="mt-9 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }} onClick={back}>Done</Button>
      </div>
    )
  }

  if (stage === 'tap') {
    return (
      <div className="min-h-dvh flex flex-col">
        <TopBar showBack title="Dispense Water" />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full animate-tap-pulse" style={{ background: 'rgba(23,180,230,0.14)' }}>
            <Nfc size={46} color="var(--aqua)" />
          </div>
          <h1 className="mt-8 text-[19px] font-display font-semibold">Tap your NFC Card or Band</h1>
          <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Hold your card near the station reader to dispense {formatLiters(liters)}</p>
          {devices.length === 0 && (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--warning)' }}>No active cards found — this is simulated for the prototype</p>
          )}
          <Button onClick={simulateTap} className="mt-10 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }}>Simulate Tap</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack title="Dispense Water" />
      <div className="flex-1 px-6">
        <p className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Desired Liters</p>
        <div className="mt-2 grid grid-cols-4 gap-2.5">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setAmount(p); setCustom('') }}
              className="h-14 rounded-xl text-[14.5px] font-semibold transition-colors"
              style={{ background: amount === p ? 'var(--navy)' : 'var(--secondary)', color: amount === p ? '#fff' : 'var(--navy)' }}
            >
              {p}L
            </button>
          ))}
        </div>
        <button
          onClick={() => setAmount(null)}
          className="mt-2.5 w-full h-12 rounded-xl text-[13.5px] font-semibold transition-colors"
          style={{ background: amount === null ? 'var(--navy)' : 'var(--secondary)', color: amount === null ? '#fff' : 'var(--navy)' }}
        >
          Custom Amount
        </button>

        {amount === null && (
          <div className="mt-4 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
            <input
              value={custom}
              onChange={e => setCustom(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter liters"
              inputMode="numeric"
              className="flex-1 bg-transparent outline-none text-[15px]"
              autoFocus
            />
            <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>Liters</span>
          </div>
        )}

        <p className="mt-4 text-[12.5px]" style={{ color: 'var(--muted-foreground)' }}>Available: {formatLiters(wallet.waterLiters)}</p>
        {error && <p className="mt-3 text-[13px]" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
      <div className="px-6 pb-8 pt-4">
        <Button onClick={goToTap} className="w-full h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>Continue</Button>
      </div>
    </div>
  )
}
