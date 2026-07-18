import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useNav } from '../../context/NavContext'
import { TopBar } from '../../components/shared/TopBar'
import { Button } from '../../components/ui/button'
import { Users, Settings, Wallets, uid } from '../../lib/storage'
import { initials } from '../../lib/format'

const STEPS = ['Basics', 'Password', 'Security', 'Done']

export function Signup() {
  const { navigate } = useNav()
  const [step, setStep] = useState(0)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')

  const questions = Settings.get().securityQuestions.slice(0, 3)

  function next() {
    setError('')
    if (step === 0) {
      if (!fullName.trim()) return setError('Enter your full name')
      if (phone.replace(/\D/g, '').length < 7) return setError('Enter a valid phone number')
      const fullPhone = `+231${phone.replace(/\D/g, '')}`
      if (Users.byPhone(fullPhone)) return setError('An account with this phone number already exists')
    }
    if (step === 1) {
      if (password.length < 8) return setError('Password must be at least 8 characters')
      if (password !== confirm) return setError('Passwords do not match')
    }
    if (step === 2) {
      if (questions.some(q => !answers[q.id]?.trim())) return setError('Please answer all security questions')
      if (!agree) return setError('Please accept the Terms & Policies to continue')
      createAccount()
    }
    setStep(s => Math.min(s + 1, 3))
  }

  function back() {
    setError('')
    setStep(s => Math.max(s - 1, 0))
  }

  function createAccount() {
    const fullPhone = `+231${phone.replace(/\D/g, '')}`
    const id = uid('usr-')
    Users.create({
      id,
      fullName: fullName.trim(),
      phone: fullPhone,
      passwordHash: password,
      pin: '',
      securityAnswers: questions.map(q => ({ questionId: q.id, answer: answers[q.id]?.trim() ?? '' })),
      createdAt: new Date().toISOString(),
      avatarInitial: initials(fullName),
    })
    Wallets.get(id)
    setStep(3)
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <TopBar showBack={step < 3} />
      {step < 3 && (
        <div className="px-6 -mt-1 mb-1">
          <div className="flex gap-1.5">
            {STEPS.slice(0, 3).map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ background: i <= step ? 'var(--aqua)' : 'var(--secondary)' }} />
            ))}
          </div>
          <p className="mt-2 text-[12px] font-semibold" style={{ color: 'var(--aqua)' }}>STEP {step + 1} OF 3</p>
        </div>
      )}

      <div className="flex-1 flex flex-col px-6 pb-8">
        {step === 0 && (
          <>
            <h1 className="text-[24px] font-display font-semibold">Let's get to know you</h1>
            <p className="mt-1 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Your name and phone number</p>

            <Field label="Full Name">
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter full name" className="flex-1 bg-transparent outline-none text-[15px]" />
            </Field>
            <Field label="Phone Number">
              <span className="text-[14.5px] pr-2 border-r border-border mr-3" style={{ color: 'var(--muted-foreground)' }}>+231</span>
              <input value={phone} onChange={e => setPhone(e.target.value)} inputMode="numeric" placeholder="77 000 0000" className="flex-1 bg-transparent outline-none text-[15px]" />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-[24px] font-display font-semibold">Secure your account</h1>
            <p className="mt-1 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Create a password</p>

            <Field label="Password">
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Create a strong password" className="flex-1 bg-transparent outline-none text-[15px]" />
            </Field>
            <p className="mt-1 text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>Minimum 8 characters</p>
            <Field label="Confirm Password">
              <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" placeholder="Re-enter password" className="flex-1 bg-transparent outline-none text-[15px]" />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-[24px] font-display font-semibold">Security questions</h1>
            <p className="mt-1 text-[13.5px]" style={{ color: 'var(--muted-foreground)' }}>Used to verify it's you if you ever lose access</p>

            {questions.map(q => (
              <Field key={q.id} label={q.text}>
                <input
                  value={answers[q.id] ?? ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Your answer"
                  className="flex-1 bg-transparent outline-none text-[15px]"
                />
              </Field>
            ))}

            <label className="mt-5 flex items-start gap-2.5 text-[13px]">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 accent-[var(--aqua)] h-4 w-4" />
              <span>I agree to the AquaFlow <span style={{ color: 'var(--aqua)' }}>Terms of Service</span> and <span style={{ color: 'var(--aqua)' }}>Privacy Policy</span></span>
            </label>
          </>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full animate-pop" style={{ background: 'rgba(23,180,130,0.12)' }}>
              <CheckCircle2 size={40} color="var(--success)" />
            </div>
            <h1 className="mt-6 text-[20px] font-display font-semibold">Account Created Successfully</h1>
            <p className="mt-2 text-[13.5px] max-w-[26ch]" style={{ color: 'var(--muted-foreground)' }}>
              Welcome to AquaFlow. Your digital water wallet is ready.
            </p>
            <Button className="mt-9 w-full max-w-xs h-13 rounded-2xl" style={{ height: 52 }} onClick={() => navigate('login')}>
              Proceed to Login
            </Button>
          </div>
        )}

        {error && <p className="mt-3 text-[13px]" style={{ color: 'var(--danger)' }}>{error}</p>}

        {step < 3 && (
          <div className="mt-auto pt-6 flex gap-3">
            {step > 0 && (
              <button onClick={back} className="h-13 px-6 rounded-2xl text-[15px] font-medium" style={{ height: 52, background: 'var(--secondary)', color: 'var(--navy)' }}>
                Back
              </button>
            )}
            <Button onClick={next} className="flex-1 h-13 rounded-2xl text-[15px]" style={{ height: 52 }}>
              {step === 2 ? 'Create Account' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <label className="mt-4 text-[12.5px] font-medium" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      <div className="mt-1.5 flex items-center rounded-xl border border-input bg-input-background px-4 h-13" style={{ height: 52 }}>
        {children}
      </div>
    </>
  )
}
