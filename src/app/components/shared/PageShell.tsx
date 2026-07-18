import React from 'react'

/** Wraps every screen with the shared page-transition + max-width container. */
export function PageShell({ children, withNav = true }: { children: React.ReactNode; withNav?: boolean }) {
  return (
    <div
      className="min-h-full animate-page-in"
      style={{ paddingBottom: withNav ? 'calc(76px + env(safe-area-inset-bottom))' : undefined }}
    >
      {children}
    </div>
  )
}
