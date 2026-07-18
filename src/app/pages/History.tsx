import React, { useMemo, useState } from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Droplets, ListFilter, CalendarClock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { TopBar } from '../components/shared/TopBar'
import { BottomNav } from '../components/shared/BottomNav'
import { PageShell } from '../components/shared/PageShell'
import { EmptyState } from '../components/shared/EmptyState'
import { Transactions, Appointments } from '../lib/storage'
import { relativeDay, formatTime, formatLiters, formatLRD } from '../lib/format'

type Filter = 'all' | 'deposit' | 'dispense' | 'withdraw' | 'appointments'

export function History() {
  const { user } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const txns = user ? Transactions.forUser(user.id) : []
  const appts = user ? Appointments.forUser(user.id) : []

  const groups = useMemo(() => {
    const items: { key: string; date: string; node: React.ReactNode }[] = []

    if (filter !== 'appointments') {
      txns
        .filter(t => filter === 'all' || t.type === filter)
        .forEach(t => items.push({ key: t.id, date: relativeDay(t.createdAt), node: <TxnRow key={t.id} txn={t} /> }))
    }
    if (filter === 'all' || filter === 'appointments') {
      appts.forEach(a => items.push({ key: a.id, date: relativeDay(a.createdAt), node: <ApptRow key={a.id} appt={a} /> }))
    }
    const byDate = new Map<string, React.ReactNode[]>()
    for (const it of items) {
      if (!byDate.has(it.date)) byDate.set(it.date, [])
      byDate.get(it.date)!.push(it.node)
    }
    return Array.from(byDate.entries())
  }, [txns, appts, filter])

  const isEmpty = txns.length === 0 && appts.length === 0

  return (
    <PageShell>
      <TopBar title="History" />
      <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'deposit'} onClick={() => setFilter('deposit')}>Deposits</Chip>
        <Chip active={filter === 'dispense'} onClick={() => setFilter('dispense')}>Water Collected</Chip>
        <Chip active={filter === 'withdraw'} onClick={() => setFilter('withdraw')}>Withdrawals</Chip>
        <Chip active={filter === 'appointments'} onClick={() => setFilter('appointments')}>Appointments</Chip>
      </div>

      <div className="px-6 mt-4">
        {isEmpty ? (
          <EmptyState icon={ListFilter} title="Nothing here yet" body="Your deposits, water pickups and appointments will show up here as you use AquaFlow." />
        ) : groups.length === 0 ? (
          <EmptyState icon={ListFilter} title="No matching activity" body="Try a different filter." />
        ) : (
          groups.map(([date, nodes]) => (
            <div key={date} className="mb-5">
              <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>{date.toUpperCase()}</p>
              <div className="flex flex-col gap-2">{nodes}</div>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </PageShell>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium" style={{ background: active ? 'var(--navy)' : 'var(--secondary)', color: active ? '#fff' : 'var(--navy)' }}>
      {children}
    </button>
  )
}

function TxnRow({ txn }: { txn: ReturnType<typeof Transactions.forUser>[number] }) {
  const meta = {
    deposit: { icon: ArrowDownToLine, label: 'Deposit', color: 'var(--success)', sign: '+' },
    dispense: { icon: Droplets, label: 'Water Collected', color: 'var(--danger)', sign: '-' },
    withdraw: { icon: ArrowUpFromLine, label: 'Withdrawal', color: 'var(--danger)', sign: '-' },
  }[txn.type]
  const Icon = meta.icon
  const amountLabel = txn.unit === 'liters' ? formatLiters(txn.amount) : formatLRD(txn.amount)

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card shadow-soft px-4 py-3.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--secondary)' }}>
        <Icon size={17} color="var(--navy)" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium truncate">{meta.label}{txn.station ? ` · ${txn.station}` : ''}</p>
        <p className="text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>{formatTime(txn.createdAt)}{txn.method ? ` · ${txn.method}` : ''}</p>
      </div>
      <span className="text-[13.5px] font-semibold shrink-0" style={{ color: meta.color }}>{meta.sign}{amountLabel}</span>
    </div>
  )
}

function ApptRow({ appt }: { appt: ReturnType<typeof Appointments.forUser>[number] }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card shadow-soft px-4 py-3.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--secondary)' }}>
        <CalendarClock size={17} color="var(--navy)" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium truncate">{appt.quantity}x {appt.deviceKind === 'card' ? 'RFID Card' : 'NFC Band'} · {appt.pickupLocation}</p>
        <p className="text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>{appt.status}</p>
      </div>
    </div>
  )
}
