import React from 'react'
import { UserCog, ShieldCheck, Droplets, LifeBuoy, LogOut, ChevronRight, BadgeCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNav } from '../context/NavContext'
import { TopBar } from '../components/shared/TopBar'
import { BottomNav } from '../components/shared/BottomNav'
import { PageShell } from '../components/shared/PageShell'

export function Profile() {
  const { user, signOut } = useApp()
  const { navigate } = useNav()
  if (!user) return null

  function handleSignOut() {
    signOut()
    navigate('welcome')
  }

  return (
    <PageShell>
      <TopBar title="Profile" />
      <div className="px-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-[20px] font-display font-semibold" style={{ background: 'var(--navy)', color: '#fff' }}>
          {user.avatarInitial}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-[17px] font-display font-semibold">{user.fullName}</p>
            <BadgeCheck size={16} color="var(--aqua)" />
          </div>
          <p className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>{user.phone}</p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <button
          onClick={() => navigate('dispense')}
          className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl text-[14.5px] font-semibold"
          style={{ height: 52, background: 'var(--aqua)', color: '#fff' }}
        >
          <Droplets size={18} /> Dispense Water
        </button>
        <p className="mt-2 text-[11.5px] text-center" style={{ color: 'var(--muted-foreground)' }}>Temporary \u2014 will move once physical dispensers are connected</p>
      </div>

      <div className="px-6 mt-6 flex flex-col rounded-2xl bg-card shadow-soft overflow-hidden">
        <Row icon={UserCog} label="Account Settings" onClick={() => navigate('edit-profile')} />
        <Row icon={ShieldCheck} label="Security & Privacy" onClick={() => navigate('edit-profile', { section: 'security' })} />
        <Row icon={LifeBuoy} label="Contact Support" onClick={() => navigate('support')} last />
      </div>

      <div className="px-6 mt-5">
        <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl text-[14.5px] font-semibold" style={{ height: 52, background: 'rgba(229,72,77,0.08)', color: 'var(--danger)' }}>
          <LogOut size={17} /> Sign Out
        </button>
      </div>

      <p className="mt-6 text-center text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>Wallet ID \u00b7 {user.id.slice(-8).toUpperCase()}</p>

      <BottomNav />
    </PageShell>
  )
}

function Row({ icon: Icon, label, onClick, last }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; onClick: () => void; last?: boolean }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <Icon size={17} color="var(--navy)" />
      <span className="flex-1 text-left text-[14px] font-medium">{label}</span>
      <ChevronRight size={16} color="var(--muted-foreground)" />
    </button>
  )
}
