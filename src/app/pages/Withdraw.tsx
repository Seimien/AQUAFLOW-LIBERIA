import React, { useState } from 'react'
import { CheckCircle2, Smartphone, HandCoins } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNav } from '../context/NavContext'
import { TopBar } from '../components/shared/TopBar'
import { Button } from '../components/ui/button'
import { Transactions, Wallets, uid } from '../lib/storage'
import type { TxnMethod } from '../lib/types'
import { formatLiters } from '../lib/format'

export function Withdraw() {
  const { user, wallet, refreshWallet } = useApp()
  const { back } = useNav()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<TxnMethod>('MTN Mobile Money')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const liters = Number(amount || 0)

  function confirm() {
    if (!user) return
    if (!liters) return setError('Enter an amount')
    if (liters > wallet.waterLiters) return setError('Amount exceeds available water balance')
    setError('')
    Wallets.update(user.id, { waterLiters: wallet.waterLiters - liters })
    Transactions.add({
      id: uid('txn-'), userId: user.id, type: 'withdraw', amount: liters, unit: 'liters',
      method, createdAt: new Date().toISOString(),
    })
    refreshWallet()
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full animate-pop" style={{ background: 'rgba(23,180,130,0.12)' }}>
          <CheckCircle2 size={40} color="var(--success)" />
        </div>
        <h1 className="mt-6 text-[20px] font-display font-semibold">Withdrawal requested</h1>
        <p className="mt-1 text-[26px] font-display font-semibold" style={{ color: 'var(--aqua)' }}>{formatLiters(liters)}</p>
        <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>via {method}</p>
        <Button className="mt-9 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }} onClick={back}>Done</Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack title="Withdraw" />
      <div className="flex-1 px-6">
        <p className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Amount</p>
        <div className="mt-2 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
          <input
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter amount"
            inputMode="numeric"
            className="flex-1 bg-transparent outline-none text-[15px]"
            autoFocus
          />
          <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>Liters</span>
        </div>
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--muted-foreground)' }}>Available: {formatLiters(wallet.waterLiters)}</p>

        <p className="mt-6 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Withdraw To</p>
        <div className="mt-2 flex flex-col gap-2.5">
          <MethodRow icon={Smartphone} label="MTN Mobile Money" active={method === 'MTN Mobile Money'} onClick={() => setMethod('MTN Mobile Money')} />
          <MethodRow icon={Smartphone} label="Orange Money" active={method === 'Orange Money'} onClick={() => setMethod('Orange Money')} />
          <MethodRow icon={HandCoins} label="Cash Pickup" active={method === 'Cash Pickup'} onClick={() => setMethod('Cash Pickup')} />
        </div>

        {error && <p className="mt-4 text-[13px]" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
      <div className="px-6 pb-8 pt-4">
        <Button onClick={confirm} className="w-full h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>Confirm Withdrawal</Button>
      </div>
    </div>
  )
}

function MethodRow({ icon: Icon, label, active, onClick }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors" style={{ borderColor: active ? 'var(--aqua)' : 'var(--border)', background: active ? 'rgba(23,180,230,0.06)' : 'var(--card)' }}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--secondary)' }}>
        <Icon size={18} color="var(--navy)" />
      </div>
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: active ? 'var(--aqua)' : 'var(--border)' }}>
        {active && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--aqua)' }} />}
      </div>
    </button>
  )
}
