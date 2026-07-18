import React, { useEffect } from 'react'
import { useNav } from '../../context/NavContext'
import logoFull from '../../assets/logo-full.png'

export function Splash() {
  const { navigate } = useNav()

  useEffect(() => {
    document.title = 'AquaFlow \u00b7 Digital Water Wallet'
    const t = setTimeout(() => navigate('welcome'), 1800)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-8 relative"
      style={{ background: 'var(--white)' }}
    >
      <img
        src={logoFull}
        alt="AquaFlow Liberia \u2014 Digital Water Wallet"
        className="w-full max-w-[240px] object-contain animate-pop"
      />
      <div className="absolute bottom-16 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full animate-splash-dot" style={{ background: 'var(--aqua)', animationDelay: '0s' }} />
        <span className="h-1.5 w-1.5 rounded-full animate-splash-dot" style={{ background: 'var(--aqua)', animationDelay: '0.15s' }} />
        <span className="h-1.5 w-1.5 rounded-full animate-splash-dot" style={{ background: 'var(--aqua)', animationDelay: '0.3s' }} />
      </div>
    </div>
  )
}
