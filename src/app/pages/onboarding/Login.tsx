import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { useApp } from '../../context/AppContext'
import { TopBar } from '../../components/shared/TopBar'
import { Button } from '../../components/ui/button'
import { Users } from '../../lib/storage'
import { toast } from 'sonner'

export function Login() {
  const { navigate, back } = useNav()
  const { signIn, signInAdmin } = useApp()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (phone.trim().toLowerCase() === 'admin' && password === 'admin') {
      signInAdmin()
      toast.success('Signed in as Admin')
      navigate('admin')
      return
    }

    const fullPhone = `+231${phone.replace(/\D/g, '')}`
    const user = Users.byPhone(fullPhone)
    if (!user || user.passwordHash !== password) {
      setError('Phone number or password is incorrect')
      return
    }
    signIn(user.id, remember)
    toast.success(`Welcome back, ${user.fullName.split(' ')[0]}`)
    navigate('dashboard')
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack />
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6">
        <h1 className="text-[24px] font-display font-semibold">Welcome back</h1>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Sign in to continue</p>

        <label className="mt-7 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Phone Number</label>
        <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
          <span className="text-[14.5px] pr-2 border-r border-border mr-3" style={{ color: 'var(--muted-foreground)' }}>+231</span>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="77 000 0000"
            inputMode="numeric"
            required
            className="flex-1 bg-transparent outline-none text-[15px]"
          />
        </div>

        <label className="mt-4 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>Password</label>
        <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type={showPw ? 'text' : 'password'}
            placeholder="Enter password"
            required
            className="flex-1 bg-transparent outline-none text-[15px]"
          />
          <button type="button" onClick={() => setShowPw(v => !v)} aria-label="Toggle password visibility">
            {showPw ? <EyeOff size={18} color="var(--muted-foreground)" /> : <Eye size={18} color="var(--muted-foreground)" />}
          </button>
        </div>

        {error && <p className="mt-3 text-[13px]" style={{ color: 'var(--danger)' }}>{error}</p>}

        <p className="mt-2 text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>Admin testing access: type "admin" as phone number with password "admin"</p>

        <div className="mt-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-[var(--aqua)] h-4 w-4" />
            Remember me
          </label>
          <button type="button" onClick={() => toast.info('Password reset is simulated in this prototype')} className="text-[13px] font-medium" style={{ color: 'var(--aqua)' }}>
            Forgot Password?
          </button>
        </div>

        <Button type="submit" className="mt-7 h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>Sign In</Button>

        <p className="mt-6 text-center text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>
          Don't have an account?{' '}
          <button type="button" onClick={() => navigate('signup')} className="font-medium" style={{ color: 'var(--aqua)' }}>Create Account</button>
        </p>
      </form>
    </div>
  )
}
