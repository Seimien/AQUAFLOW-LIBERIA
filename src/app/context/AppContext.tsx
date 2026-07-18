import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SessionStore, Users, Wallets, Notifications } from '../lib/storage'
import type { User, Wallet } from '../lib/types'

interface AppContextValue {
  user: User | null
  wallet: Wallet
  unreadCount: number
  isAdmin: boolean
  refreshWallet: () => void
  refreshUser: () => void
  signIn: (userId: string, rememberMe: boolean) => void
  signInAdmin: () => void
  signOut: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const EMPTY_WALLET: Wallet = { userId: '', waterLiters: 0, cashBalance: 0 }

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const session = SessionStore.get()
    return session ? Users.byId(session.userId) ?? null : null
  })
  const [wallet, setWallet] = useState<Wallet>(() => (user ? Wallets.get(user.id) : EMPTY_WALLET))
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)

  const refreshWallet = useCallback(() => {
    setUser(prev => {
      if (prev) setWallet(Wallets.get(prev.id))
      return prev
    })
  }, [])

  const refreshUser = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev
      const fresh = Users.byId(prev.id) ?? prev
      setWallet(Wallets.get(fresh.id))
      setUnreadCount(Notifications.forUser(fresh.id).filter(n => !n.read).length)
      return fresh
    })
  }, [])

  const signIn = useCallback((userId: string, rememberMe: boolean) => {
    SessionStore.set({ userId, rememberMe })
    const u = Users.byId(userId) ?? null
    setUser(u)
    setWallet(u ? Wallets.get(u.id) : EMPTY_WALLET)
    setUnreadCount(u ? Notifications.forUser(u.id).filter(n => !n.read).length : 0)
  }, [])

  const signInAdmin = useCallback(() => {
    setIsAdmin(true)
  }, [])

  const signOut = useCallback(() => {
    SessionStore.set(null)
    setUser(null)
    setWallet(EMPTY_WALLET)
    setUnreadCount(0)
    setIsAdmin(false)
  }, [])

  const value = useMemo(
    () => ({ user, wallet, unreadCount, isAdmin, refreshWallet, refreshUser, signIn, signInAdmin, signOut }),
    [user, wallet, unreadCount, isAdmin, refreshWallet, refreshUser, signIn, signInAdmin, signOut],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
