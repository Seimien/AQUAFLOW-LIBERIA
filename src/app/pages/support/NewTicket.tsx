import React, { useState } from 'react'
import { CheckCircle2, UploadCloud } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNav } from '../../context/NavContext'
import { TopBar } from '../../components/shared/TopBar'
import { Button } from '../../components/ui/button'
import { Tickets, uid } from '../../lib/storage'
import type { TicketCategory } from '../../lib/types'

const CATEGORIES: TicketCategory[] = ['Water Issue', 'Payment', 'Card', 'Band', 'Pickup', 'Technical', 'Other']

export function NewTicket() {
  const { user } = useApp()
  const { back } = useNav()
  const [category, setCategory] = useState<TicketCategory>('Water Issue')
  const [description, setDescription] = useState('')
  const [done, setDone] = useState(false)

  function submit() {
    if (!user || !description.trim()) return
    Tickets.add({ id: uid('tkt-'), userId: user.id, category, description: description.trim(), status: 'Open', createdAt: new Date().toISOString() })
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full animate-pop" style={{ background: 'rgba(23,180,130,0.12)' }}>
          <CheckCircle2 size={40} color="var(--success)" />
        </div>
        <h1 className="mt-6 text-[20px] font-display font-semibold">Ticket created</h1>
        <p className="mt-2 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Our team will follow up soon.</p>
        <Button className="mt-9 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }} onClick={back}>Done</Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack title="Create Ticket" />
      <div className="flex-1 px-6">
        <p className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} className="px-3.5 py-2 rounded-full text-[13px] font-medium" style={{ background: category === c ? 'var(--navy)' : 'var(--secondary)', color: category === c ? '#fff' : 'var(--navy)' }}>
              {c}
            </button>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Describe the issue</p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Tell us what happened..."
          rows={5}
          className="mt-2 w-full rounded-xl border border-input bg-input-background p-4 text-[14px] outline-none resize-none"
        />

        <button className="mt-4 w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed py-6" style={{ borderColor: 'var(--border)' }}>
          <UploadCloud size={20} color="var(--muted-foreground)" />
          <span className="text-[12.5px]" style={{ color: 'var(--muted-foreground)' }}>Attach a photo (optional)</span>
        </button>
      </div>
      <div className="px-6 pb-8 pt-5">
        <Button disabled={!description.trim()} onClick={submit} className="w-full h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>Submit Ticket</Button>
      </div>
    </div>
  )
}
