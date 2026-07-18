import React from 'react'
import { Toaster } from './components/ui/sonner'
import { AppProvider, useApp } from './context/AppContext'
import { NavProvider, useNav } from './context/NavContext'

import { Splash } from './pages/onboarding/Splash'
import { Welcome } from './pages/onboarding/Welcome'
import { Login } from './pages/onboarding/Login'
import { Signup } from './pages/onboarding/Signup'

import { Dashboard } from './pages/Dashboard'
import { Deposit } from './pages/Deposit'
import { Withdraw } from './pages/Withdraw'
import { Dispense } from './pages/Dispense'
import { CardsList } from './pages/cards/CardsList'
import { CardDetail } from './pages/cards/CardDetail'
import { RequestCard } from './pages/cards/RequestCard'
import { Stations } from './pages/Stations'
import { History } from './pages/History'
import { SupportList } from './pages/support/SupportList'
import { NewTicket } from './pages/support/NewTicket'
import { Profile } from './pages/Profile'
import { EditProfile } from './pages/EditProfile'
import { Notifications } from './pages/Notifications'
import { AdminPanel } from './pages/admin/AdminPanel'

function Router() {
  const { entry } = useNav()
  const { user, isAdmin } = useApp()

  // Guard authenticated user routes: if there's no session, always show onboarding.
  const AUTH_ROUTES = new Set([
    'dashboard', 'deposit', 'withdraw', 'dispense', 'cards', 'card-detail', 'request-card',
    'stations', 'history', 'support', 'new-ticket', 'profile', 'edit-profile', 'notifications',
  ])
  if (!user && AUTH_ROUTES.has(entry.route)) {
    return <Welcome />
  }
  if (entry.route === 'admin' && !isAdmin) {
    return <Welcome />
  }

  switch (entry.route) {
    case 'splash': return <Splash />
    case 'welcome': return <Welcome />
    case 'login': return <Login />
    case 'signup': return <Signup />

    case 'dashboard': return <Dashboard />
    case 'deposit': return <Deposit />
    case 'withdraw': return <Withdraw />
    case 'dispense': return <Dispense />
    case 'cards': return <CardsList />
    case 'card-detail': return <CardDetail />
    case 'request-card': return <RequestCard />
    case 'stations': return <Stations />
    case 'history': return <History />
    case 'support': return <SupportList />
    case 'new-ticket': return <NewTicket />
    case 'profile': return <Profile />
    case 'edit-profile': return <EditProfile />
    case 'notifications': return <Notifications />
    case 'admin': return <AdminPanel />
    default: return <Splash />
  }
}

export default function App() {
  return (
    <AppProvider>
      <NavProvider initial={{ route: 'splash' }}>
        <div className="mx-auto max-w-md min-h-dvh bg-background relative" style={{ fontFamily: 'var(--font-body)' }}>
          <Router />
          <Toaster position="top-center" />
        </div>
      </NavProvider>
    </AppProvider>
  )
}
