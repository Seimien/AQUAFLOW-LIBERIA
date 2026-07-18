import React from 'react'
import { ChevronLeft, Bell } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { useApp } from '../../context/AppContext'

interface TopBarProps {
  title?: string
  showBack?: boolean
  showBell?: boolean
  transparent?: boolean
  right?: React.ReactNode
}

export function TopBar({ title, showBack, showBell, transparent, right }: TopBarProps) {
  const { back, navigate } = useNav()
  const { unreadCount } = useApp()

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-5 pt-[max(0.9rem,env(safe-area-inset-top))] pb-3"
      style={{ background: transparent ? 'transparent' : 'var(--background)' }}
    >
      <div className="flex items-center gap-2 min-w-[40px]">
        {showBack && (
          <button
            onClick={back}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      {title && <h1 className="text-[17px] font-semibold font-display">{title}</h1>}
      <div className="flex items-center gap-2 min-w-[40px] justify-end">
        {right}
        {showBell && (
          <button
            onClick={() => navigate('notifications')}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-soft active:scale-95 transition-transform"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-danger border-2 border-background" style={{ background: 'var(--danger)' }} />
            )}
          </button>
        )}
      </div>
    </header>
  )
}
