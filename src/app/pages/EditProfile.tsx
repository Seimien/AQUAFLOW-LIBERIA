import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNav } from '../context/NavContext'
import { TopBar } from '../components/shared/TopBar'
import { Button } from '../components/ui/button'
import { Users } from '../lib/storage'
import { initials } from '../lib/format'
import { toast } from 'sonner'

export function EditProfile() {
  const { user, refreshUser } = useApp()
  const { entry, back } = useNav()
  const section = entry.params?.section
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [pin, setPin] = useState('')

  if (!user) return null

  function save() {
    Users.update(user!.id, { fullName, avatarInitial: initials(fullName) })
    refreshUser()
    toast.success('Profile updated')
    back()
  }

  function savePin() {
    if (pin.length !== 4) return toast.error('PIN must be 4 digits')
    Users.update(user!.id, { pin })
    setPin('')
    toast.success('PIN updated')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack title={section === 'security' ? 'Security & Privacy' : 'Account Settings'} />
      <div className="flex-1 px-6">
        {section === 'security' ? (
          <>
            <label className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>New 4-digit PIN</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
              <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="••••" className="flex-1 bg-transparent outline-none text-[15px] tracking-widest" />
            </div>
            <p className="mt-2 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>Password changes are simulated in this prototype.</p>
            <Button onClick={savePin} className="mt-6 h-13 rounded-2xl w-full" style={{ height: 52 }}>Update PIN</Button>
          </>
        ) : (
          <>
            <label className="text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Full Name</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className="flex-1 bg-transparent outline-none text-[15px]" />
            </div>

            <label className="mt-4 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Phone Number</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13 opacity-60" style={{ height: 52 }}>
              <span className="text-[15px]">{user.phone}</span>
            </div>

            <Button onClick={save} className="mt-6 h-13 rounded-2xl w-full" style={{ height: 52 }}>Save Changes</Button>
          </>
        )}
      </div>
    </div>
  )
}
