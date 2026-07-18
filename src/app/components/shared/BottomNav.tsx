import React from 'react'
import { useNav, type Route } from '../../context/NavContext'
import { Home, CreditCard, MapPin, History, User } from 'lucide-react'

const ITEMS: { route: Route; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { route: 'dashboard', label: 'Home', icon: Home },
  { route: 'cards', label: 'Cards', icon: CreditCard },
  { route: 'stations', label: 'Stations', icon: MapPin },
  { route: 'history', label: 'History', icon: History },
  { route: 'profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const { entry, navigate } = useNav()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-md pointer-events-auto glass border-t border-border px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <div className="flex items-center justify-between">
          {ITEMS.map(({ route, label, icon: Icon }) => {
            const active = entry.route === route
            return (
              <button
                key={route}
                onClick={() => navigate(route)}
                className="flex flex-1 flex-col items-center gap-1 py-1.5 transition-transform active:scale-95"
              >
                <span
                  className="flex items-center justify-center rounded-full transition-colors"
                  style={{
                    width: 40, height: 28,
                    background: active ? 'var(--navy)' : 'transparent',
                    color: active ? '#FFFFFF' : 'var(--muted-foreground)',
                  }}
                >
                  <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: active ? 'var(--navy)' : 'var(--muted-foreground)', fontWeight: active ? 600 : 500 }}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
