import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Route =
  | 'splash' | 'welcome' | 'login' | 'signup'
  | 'dashboard' | 'deposit' | 'withdraw' | 'dispense'
  | 'cards' | 'card-detail' | 'request-card'
  | 'stations' | 'history' | 'support' | 'new-ticket'
  | 'profile' | 'edit-profile' | 'notifications' | 'admin'

export interface NavEntry {
  route: Route
  params?: Record<string, string>
}

interface NavContextValue {
  entry: NavEntry
  navigate: (route: Route, params?: Record<string, string>) => void
  replace: (route: Route, params?: Record<string, string>) => void
  back: () => void
  canGoBack: boolean
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children, initial }: { children: React.ReactNode; initial: NavEntry }) {
  const [stack, setStack] = useState<NavEntry[]>([initial])

  const navigate = useCallback((route: Route, params?: Record<string, string>) => {
    setStack(s => [...s, { route, params }])
  }, [])

  const replace = useCallback((route: Route, params?: Record<string, string>) => {
    setStack(s => [...s.slice(0, -1), { route, params }])
  }, [])

  const back = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  const value = useMemo<NavContextValue>(
    () => ({ entry: stack[stack.length - 1], navigate, replace, back, canGoBack: stack.length > 1 }),
    [stack, navigate, replace, back],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used inside <NavProvider>')
  return ctx
}
