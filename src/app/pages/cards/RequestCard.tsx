import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useNav } from '../../context/NavContext'
import { TopBar } from '../../components/shared/TopBar'
import { Button } from '../../components/ui/button'
import { Devices, Appointments, uid } from '../../lib/storage'
import type { AssignedTo, DeviceKind } from '../../lib/types'

const ASSIGNEES: AssignedTo[] = ['Self', 'Child', 'Staff', 'Visitor', 'Family', 'Student', 'Patient']
const LOCATIONS = ['Broad Street Station', 'Capitol Hill Station', 'Sinkor Station', 'Paynesville Station']

export function RequestCard() {
  const { user } = useApp()
  const { back } = useNav()
  const [kind, setKind] = useState<DeviceKind>('card')
  const [quantity, setQuantity] = useState(1)
  const [assignedTo, setAssignedTo] = useState<AssignedTo>('Self')
  const [reason, setReason] = useState('')
  const [location, setLocation] = useState(LOCATIONS[0])
  const [done, setDone] = useState(false)

  function submit() {
    if (!user) return
    for (let i = 0; i < quantity; i++) {
      Devices.add({
        id: uid('dev-'), userId: user.id, kind,
        label: `${assignedTo === 'Self' ? 'Primary' : assignedTo} ${kind === 'card' ? 'Card' : 'Band'}`,
        code: `AF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Pending Pickup', assignedTo,
        dailyLimit: null, weeklyLimit: null, monthlyLimit: null,
        createdAt: new Date().toISOString(),
      })
    }
    Appointments.add({
      id: uid('apt-'), userId: user.id, reason: reason || `New ${kind} request`,
      deviceKind: kind, quantity, pickupLocation: location, status: 'Pending', createdAt: new Date().toISOString(),
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full animate-pop" style={{ background: 'rgba(23,180,130,0.12)' }}>
          <CheckCircle2 size={40} color="var(--success)" />
        </div>
        <h1 className="mt-6 text-[20px] font-display font-semibold">Request submitted</h1>
        <p className="mt-2 text-[13.5px] max-w-[28ch]" style={{ color: 'var(--muted-foreground)' }}>
          We'll confirm your pickup date and time for {location} soon. You can track it under Appointments in History.
        </p>
        <Button className="mt-9 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }} onClick={back}>Done</Button>
      </div>
    )
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack title="Request New" />
      <div className="flex-1 px-6">
        <p className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Device Type</p>
        <div className="mt-2 flex gap-2">
          <Choice active={kind === 'card'} onClick={() => setKind('card')}>RFID Card</Choice>
          <Choice active={kind === 'band'} onClick={() => setKind('band')}>NFC Band</Choice>
        </div>

        <p className="mt-6 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Quantity</p>
        <div className="mt-2 flex items-center gap-4">
          <Stepper onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</Stepper>
          <span className="text-[18px] font-display font-semibold w-6 text-center">{quantity}</span>
          <Stepper onClick={() => setQuantity(q => Math.min(10, q + 1))}>+</Stepper>
        </div>

        <p className="mt-6 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Assign To</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ASSIGNEES.map(a => (
            <button
              key={a}
              onClick={() => setAssignedTo(a)}
              className="px-3.5 py-2 rounded-full text-[13px] font-medium"
              style={{ background: assignedTo === a ? 'var(--navy)' : 'var(--secondary)', color: assignedTo === a ? '#fff' : 'var(--navy)' }}
            >
              {a}
            </button>
          ))}
        </div>

        <p className="mt-6 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Reason</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. New staff member, lost previous card..."
          className="mt-2 w-full rounded-xl border border-input bg-input-background p-4 text-[14px] outline-none resize-none"
          rows={3}
        />

        <p className="mt-5 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Pickup Location</p>
        <div className="mt-2 flex flex-col gap-2">
          {LOCATIONS.map(l => (
            <button
              key={l}
              onClick={() => setLocation(l)}
              className="flex items-center justify-between rounded-xl border px-4 py-3 text-[13.5px] font-medium"
              style={{ borderColor: location === l ? 'var(--aqua)' : 'var(--border)', background: location === l ? 'rgba(23,180,230,0.06)' : 'var(--card)' }}
            >
              {l}
              <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center" style={{ borderColor: location === l ? 'var(--aqua)' : 'var(--border)' }}>
                {location === l && <div className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--aqua)' }} />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8 pt-5">
        <Button onClick={submit} className="w-full h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>Submit Request</Button>
      </div>
    </div>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex-1 h-11 rounded-xl text-[13.5px] font-semibold" style={{ background: active ? 'var(--navy)' : 'var(--secondary)', color: active ? '#fff' : 'var(--navy)' }}>
      {children}
    </button>
  )
}

function Stepper({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="h-10 w-10 rounded-full flex items-center justify-center text-[18px] font-semibold" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>
      {children}
    </button>
  )
}
