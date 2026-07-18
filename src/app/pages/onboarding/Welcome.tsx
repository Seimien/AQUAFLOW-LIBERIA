import React from 'react'
import { Droplets, CreditCard, MapPin } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { Button } from '../../components/ui/button'
import { FeatureCarousel } from '../../components/shared/FeatureCarousel'
import logoMark from '../../assets/logo-mark.png'

const CARDS = [
  { icon: Droplets, title: 'Real liters, tracked live', body: 'See your exact water balance, not a vague percentage \u2014 and top up in seconds.' },
  { icon: CreditCard, title: 'Tap to dispense', body: 'Use an RFID card or NFC band at any station to collect your water instantly.' },
  { icon: MapPin, title: 'Find a station nearby', body: 'Check live queue lengths and open stations before you head out.' },
]

export function Welcome() {
  const { navigate } = useNav()
  return (
    <div className="min-h-dvh flex flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-8">
      <div className="flex items-center gap-3">
        <img src={logoMark} alt="AquaFlow Liberia" className="h-11 w-11 object-contain rounded-xl" />
        <h1 className="text-[22px] font-display font-semibold leading-tight">Welcome to<br />AquaFlow</h1>
      </div>

      <div className="mt-9">
        <FeatureCarousel cards={CARDS} />
      </div>

      <div className="mt-auto pt-10 flex flex-col gap-3">
        <Button className="h-13 rounded-2xl text-[15px]" style={{ height: 52 }} onClick={() => navigate('signup')}>
          Create Account
        </Button>
        <button
          onClick={() => navigate('login')}
          className="h-13 rounded-2xl text-[15px] font-medium"
          style={{ height: 52, background: 'var(--secondary)', color: 'var(--navy)' }}
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
