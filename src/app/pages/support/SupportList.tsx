import React from 'react'
import { LifeBuoy, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNav } from '../../context/NavContext'
import { TopBar } from '../../components/shared/TopBar'
import { EmptyState } from '../../components/shared/EmptyState'
import { Tickets } from '../../lib/storage'
import type { TicketStatus } from '../../lib/types'
import { relativeDay } from '../../lib/format'

const STATUS_STYLE: Record<TicketStatus, { bg: string; fg: string }> = {
  Open: { bg: 'rgba(23,180,230,0.12)', fg: 'var(--aqua)' },
  Pending: { bg: 'rgba(232,162,61,0.14)', fg: 'var(--warning)' },
  Resolved: { bg: 'rgba(23,180,130,0.12)', fg: 'var(--success)' },
  Closed: { bg: 'var(--secondary)', fg: 'var(--muted-foreground)' },
}

export function SupportList() {
  const { user } = useApp()
  const { navigate } = useNav()
  const tickets = user ? Tickets.forUser(user.id) : []

  return (
    <div className="min-h-dvh pb-8">
      <TopBar showBack title="Help & Support" />
      <div className="px-6">
        <button
          onClick={() => navigate('new-ticket')}
          className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl text-[14.5px] font-semibold"
          style={{ height: 52, background: 'var(--navy)', color: '#fff' }}
        >
          <Plus size={18} /> Create Ticket
        </button>
      </div>

      <div className="px-6 mt-5">
        {tickets.length === 0 ? (
          <EmptyState icon={LifeBuoy} title="No support tickets" body="If something's not working — a card, a payment, a pickup — create a ticket and we'll track it here." />
        ) : (
          <div className="flex flex-col gap-2.5">
            {tickets.map(t => (
              <div key={t.id} className="rounded-2xl bg-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--muted-foreground)' }}>{t.category}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: STATUS_STYLE[t.status].bg, color: STATUS_STYLE[t.status].fg }}>{t.status}</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-snug">{t.description}</p>
                <p className="mt-2 text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>{relativeDay(t.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
