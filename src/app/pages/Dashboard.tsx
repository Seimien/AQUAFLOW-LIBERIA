import React from 'react'
import { ArrowDownToLine, ArrowUpFromLine, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNav } from '../context/NavContext'
import { BottomNav } from '../components/shared/BottomNav'
import { PageShell } from '../components/shared/PageShell'
import { WaterDroplet } from '../components/shared/WaterDroplet'
import { formatLiters, formatLRD } from '../lib/format'

const CAPACITY = 600

export function Dashboard() {
  const { user, wallet, unreadCount } = useApp()
  const { navigate } = useNav()
  if (!user) return null

  return (
    <PageShell>
      <div className="flex items-center justify-between px-6 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <div>
          <p className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>Good {timeOfDay()}</p>
          <h1 className="text-[19px] font-display font-semibold leading-tight">{user.fullName.split(' ')[0]}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('notifications')} aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-soft active:scale-95 transition-transform">
            <Bell size={17} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: 'var(--danger)' }} />}
          </button>
          <button onClick={() => navigate('profile')} aria-label="Profile" className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold active:scale-95 transition-transform" style={{ background: 'var(--navy)', color: '#fff' }}>
            {user.avatarInitial}
          </button>
        </div>
      </div>

      <div className="mt-7 flex justify-center">
        <WaterDroplet liters={wallet.waterLiters} capacity={CAPACITY} size={158} />
      </div>
      <p className="mt-3 text-center font-display font-semibold" style={{ fontSize: 32, lineHeight: 1.1 }}>
        {formatLiters(wallet.waterLiters)}
      </p>
      <p className="text-center text-[12.5px] mt-1" style={{ color: 'var(--muted-foreground)' }}>Available water balance</p>

      <div className="mt-6 mx-5 rounded-3xl p-5 shadow-lift" style={{ background: 'linear-gradient(150deg, var(--navy) 0%, var(--navy-2) 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11.5px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Water Balance</p>
            <p className="mt-0.5 text-[17px] font-display font-semibold text-white">{formatLiters(wallet.waterLiters)}</p>
          </div>
          <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <div className="text-right">
            <p className="text-[11.5px] font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>Wallet Balance</p>
            <p className="mt-0.5 text-[17px] font-display font-semibold text-white">{formatLRD(wallet.cashBalance)}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => navigate('deposit')} className="flex items-center justify-center gap-2 h-12 rounded-2xl text-[13.5px] font-semibold active:scale-[0.97] transition-transform" style={{ background: 'var(--aqua)', color: '#fff' }}>
            <ArrowDownToLine size={16} /> Deposit
          </button>
          <button onClick={() => navigate('withdraw')} className="flex items-center justify-center gap-2 h-12 rounded-2xl text-[13.5px] font-semibold active:scale-[0.97] transition-transform" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
            <ArrowUpFromLine size={16} /> Withdraw
          </button>
        </div>
      </div>

      <BottomNav />
    </PageShell>
  )
}

function timeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
