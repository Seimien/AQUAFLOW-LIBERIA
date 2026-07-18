import React, { useEffect } from 'react'
import { Bell, Droplets, ArrowDownToLine, CreditCard } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { TopBar } from '../components/shared/TopBar'
import { EmptyState } from '../components/shared/EmptyState'
import { Notifications as NotifRepo } from '../lib/storage'
import { relativeDay, formatTime } from '../lib/format'

const ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  deposit: ArrowDownToLine, dispense: Droplets, card: CreditCard,
}

export function Notifications() {
  const { user, refreshUser } = useApp()
  const items = user ? NotifRepo.forUser(user.id) : []

  useEffect(() => {
    if (user) {
      NotifRepo.markAllRead(user.id)
      refreshUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-dvh pb-8">
      <TopBar showBack title="Notifications" />
      <div className="px-6">
        {items.length === 0 ? (
          <EmptyState icon={Bell} title="You're all caught up" body="Deposits, card updates and station alerts will appear here." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map(n => {
              const Icon = ICONS[n.title.toLowerCase().includes('card') ? 'card' : n.title.toLowerCase().includes('deposit') ? 'deposit' : 'dispense'] ?? Bell
              return (
                <div key={n.id} className="flex items-start gap-3 rounded-2xl bg-card shadow-soft p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'var(--secondary)' }}>
                    <Icon size={17} color="var(--navy)" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold">{n.title}</p>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{n.body}</p>
                    <p className="text-[11px] mt-1.5" style={{ color: 'var(--muted-foreground)' }}>{relativeDay(n.createdAt)}, {formatTime(n.createdAt)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
