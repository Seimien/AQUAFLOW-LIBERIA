import React, { useState } from 'react'
import { Users as UsersIcon, CreditCard, CalendarClock, MapPin, LifeBuoy, ArrowDownToLine, ShieldAlert, Percent, HelpCircle, Trash2 } from 'lucide-react'
import { TopBar } from '../../components/shared/TopBar'
import { EmptyState } from '../../components/shared/EmptyState'
import {
  Users, Devices, Appointments, Stations, Tickets, Transactions, Wallets, Settings, uid,
} from '../../lib/storage'
import type { DiscountTrigger } from '../../lib/types'
import { formatLiters, formatLRD, relativeDay } from '../../lib/format'
import { toast } from 'sonner'

type Tab = 'overview' | 'users' | 'cards' | 'appointments' | 'stations' | 'tickets' | 'rate' | 'discounts' | 'questions'

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>('overview')
  const [, force] = useState(0)
  const refresh = () => force(x => x + 1)

  const users = Users.all()
  const devices = Devices.all()
  const appointments = Appointments.all()
  const stations = Stations.all()
  const tickets = Tickets.all()
  const transactions = Transactions.all()
  const settings = Settings.get()

  const pendingCards = devices.filter(d => d.status === 'Pending Pickup')

  const [rateInput, setRateInput] = useState(String(settings.lrdPerLiter))
  const [discountLabel, setDiscountLabel] = useState('')
  const [discountTrigger, setDiscountTrigger] = useState<DiscountTrigger>('liters')
  const [discountThreshold, setDiscountThreshold] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [questionText, setQuestionText] = useState('')

  function saveRate() {
    const rate = Number(rateInput)
    if (!rate) return toast.error('Enter a valid rate')
    Settings.update({ lrdPerLiter: rate })
    toast.success(`Rate updated \u2014 1 Liter = ${rate} LRD`)
    refresh()
  }

  function addDiscount() {
    if (!discountLabel.trim() || !discountThreshold || !discountPercent) return toast.error('Fill in all discount fields')
    Settings.addDiscount({
      id: uid('disc-'), label: discountLabel.trim(), trigger: discountTrigger,
      threshold: Number(discountThreshold), percentOff: Number(discountPercent), active: true,
    })
    setDiscountLabel(''); setDiscountThreshold(''); setDiscountPercent('')
    toast.success('Discount rule added')
    refresh()
  }

  function addQuestion() {
    if (!questionText.trim()) return
    Settings.addQuestion({ id: uid('q-'), text: questionText.trim() })
    setQuestionText('')
    toast.success('Security question added')
    refresh()
  }

  return (
    <div className="min-h-dvh pb-10">
      <TopBar showBack title="Admin" right={<ShieldAlert size={18} color="var(--warning)" />} />
      <div className="px-6 mb-2 -mt-1">
        <p className="text-[11.5px] px-3 py-1.5 rounded-full inline-block" style={{ background: 'rgba(232,162,61,0.14)', color: 'var(--warning)' }}>
          Prototype only · no authentication
        </p>
      </div>

      <div className="px-6 flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {(['overview', 'users', 'cards', 'appointments', 'stations', 'tickets', 'rate', 'discounts', 'questions'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className="shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium capitalize" style={{ background: tab === t ? 'var(--navy)' : 'var(--secondary)', color: tab === t ? '#fff' : 'var(--navy)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 mt-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={UsersIcon} label="Users" value={users.length} />
            <Stat icon={CreditCard} label="Pending Cards" value={pendingCards.length} />
            <Stat icon={CalendarClock} label="Appointments" value={appointments.length} />
            <Stat icon={MapPin} label="Stations" value={stations.length} />
            <Stat icon={LifeBuoy} label="Open Tickets" value={tickets.filter(t => t.status === 'Open').length} />
            <Stat icon={ArrowDownToLine} label="Deposits" value={transactions.filter(t => t.type === 'deposit').length} />
          </div>
        )}

        {tab === 'users' && (
          users.length === 0 ? <EmptyState icon={UsersIcon} title="No users yet" body="Accounts created via Sign Up will appear here." /> :
          <div className="flex flex-col gap-2.5">
            {users.map(u => {
              const wallet = Wallets.get(u.id)
              return (
                <div key={u.id} className="rounded-2xl bg-card shadow-soft p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold">{u.fullName}</p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>{formatLiters(wallet.waterLiters)}</span>
                  </div>
                  <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{u.phone}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <button onClick={() => { Wallets.update(u.id, { waterLiters: wallet.waterLiters + 50 }); refresh(); toast.success('+50L adjusted') }} className="text-[12px] font-semibold" style={{ color: 'var(--aqua)' }}>+50L Water</button>
                    <button onClick={() => { Wallets.update(u.id, { cashBalance: wallet.cashBalance + 500 }); refresh(); toast.success('+LRD 500 adjusted') }} className="text-[12px] font-semibold" style={{ color: 'var(--aqua)' }}>+LRD 500</button>
                  </div>
                  <p className="mt-2 text-[11.5px]" style={{ color: 'var(--muted-foreground)' }}>{formatLiters(wallet.waterLiters)} · {formatLRD(wallet.cashBalance)}</p>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'cards' && (
          devices.length === 0 ? <EmptyState icon={CreditCard} title="No devices yet" body="Cards and bands requested by users appear here for approval." /> :
          <div className="flex flex-col gap-2.5">
            {devices.map(d => (
              <div key={d.id} className="rounded-2xl bg-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold">{d.label}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>{d.status}</span>
                </div>
                <p className="text-[12px] mt-0.5 font-mono-data" style={{ color: 'var(--muted-foreground)' }}>{d.code}</p>
                <div className="mt-3 flex gap-4">
                  {d.status === 'Pending Pickup' && (
                    <>
                      <button onClick={() => { Devices.update(d.id, { status: 'Active' }); refresh(); toast.success('Card approved') }} className="text-[12px] font-semibold" style={{ color: 'var(--success)' }}>Approve</button>
                      <button onClick={() => { Devices.update(d.id, { status: 'Lost' }); refresh(); toast.success('Card rejected') }} className="text-[12px] font-semibold" style={{ color: 'var(--danger)' }}>Reject</button>
                    </>
                  )}
                  {d.status === 'Active' && (
                    <button onClick={() => { Devices.update(d.id, { status: 'Frozen' }); refresh(); toast.success('Card frozen') }} className="text-[12px] font-semibold" style={{ color: 'var(--aqua)' }}>Freeze</button>
                  )}
                  {d.status === 'Frozen' && (
                    <button onClick={() => { Devices.update(d.id, { status: 'Active' }); refresh(); toast.success('Card unfrozen') }} className="text-[12px] font-semibold" style={{ color: 'var(--aqua)' }}>Unfreeze</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'appointments' && (
          appointments.length === 0 ? <EmptyState icon={CalendarClock} title="No appointments" body="Pickup requests from users appear here to schedule." /> :
          <div className="flex flex-col gap-2.5">
            {appointments.map(a => (
              <div key={a.id} className="rounded-2xl bg-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold">{a.quantity}x {a.deviceKind === 'card' ? 'Card' : 'Band'}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>{a.status}</span>
                </div>
                <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{a.pickupLocation} · {relativeDay(a.createdAt)}</p>
                {a.status === 'Pending' && (
                  <button
                    onClick={() => {
                      Appointments.update(a.id, { status: 'Scheduled', date: 'Jul 22, 2026', time: '10:00 AM' })
                      refresh()
                      toast.success('Pickup scheduled')
                    }}
                    className="mt-3 text-[12px] font-semibold"
                    style={{ color: 'var(--aqua)' }}
                  >
                    Assign Jul 22, 10:00 AM
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'stations' && (
          <div className="flex flex-col gap-2.5">
            {stations.map(s => (
              <div key={s.id} className="rounded-2xl bg-card shadow-soft p-4 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold">{s.name}</p>
                  <p className="text-[12px]" style={{ color: 'var(--muted-foreground)' }}>{s.area} · Queue {s.queueLength}</p>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>{s.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'tickets' && (
          tickets.length === 0 ? <EmptyState icon={LifeBuoy} title="No tickets" body="Support requests submitted by users appear here." /> :
          <div className="flex flex-col gap-2.5">
            {tickets.map(t => (
              <div key={t.id} className="rounded-2xl bg-card shadow-soft p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold">{t.category}</p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'var(--secondary)', color: 'var(--navy)' }}>{t.status}</span>
                </div>
                <p className="text-[13px] mt-1.5">{t.description}</p>
                {t.status !== 'Resolved' && (
                  <button onClick={() => { Tickets.update(t.id, { status: 'Resolved' }); refresh(); toast.success('Ticket resolved') }} className="mt-2 text-[12px] font-semibold" style={{ color: 'var(--success)' }}>Mark Resolved</button>
                )}
              </div>
            ))}
          </div>
        )}
        {tab === 'rate' && (
          <div className="rounded-2xl bg-card shadow-soft p-4">
            <p className="text-[13px] font-semibold">Water Conversion Rate</p>
            <p className="mt-1 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>Applied automatically across deposits, withdrawals and pricing.</p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex-1 flex items-center rounded-xl border border-input bg-input-background px-4 h-11">
                <span className="text-[13px] pr-2" style={{ color: 'var(--muted-foreground)' }}>1 Liter =</span>
                <input value={rateInput} onChange={e => setRateInput(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" className="flex-1 bg-transparent outline-none text-[14px]" />
                <span className="text-[13px]" style={{ color: 'var(--muted-foreground)' }}>LRD</span>
              </div>
              <button onClick={saveRate} className="h-11 px-4 rounded-xl text-[13px] font-semibold" style={{ background: 'var(--aqua)', color: '#fff' }}>Save</button>
            </div>
            <p className="mt-3 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>Current rate: 1 Liter = {settings.lrdPerLiter} LRD</p>
          </div>
        )}

        {tab === 'discounts' && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-card shadow-soft p-4">
              <p className="text-[13px] font-semibold">New Discount Rule</p>
              <div className="mt-2 flex items-center rounded-xl border border-input bg-input-background px-4 h-11">
                <input value={discountLabel} onChange={e => setDiscountLabel(e.target.value)} placeholder="Label, e.g. Bulk card buyers" className="flex-1 bg-transparent outline-none text-[13.5px]" />
              </div>
              <div className="mt-2 flex gap-2">
                {(['cards', 'liters', 'promo'] as DiscountTrigger[]).map(t => (
                  <button key={t} onClick={() => setDiscountTrigger(t)} className="flex-1 h-9 rounded-lg text-[12px] font-semibold capitalize" style={{ background: discountTrigger === t ? 'var(--navy)' : 'var(--secondary)', color: discountTrigger === t ? '#fff' : 'var(--navy)' }}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2.5">
                <div className="flex-1 flex items-center rounded-xl border border-input bg-input-background px-3 h-11">
                  <input value={discountThreshold} onChange={e => setDiscountThreshold(e.target.value.replace(/\D/g, ''))} placeholder="Threshold" inputMode="numeric" className="flex-1 bg-transparent outline-none text-[13px]" />
                </div>
                <div className="flex-1 flex items-center rounded-xl border border-input bg-input-background px-3 h-11">
                  <input value={discountPercent} onChange={e => setDiscountPercent(e.target.value.replace(/\D/g, ''))} placeholder="% off" inputMode="numeric" className="flex-1 bg-transparent outline-none text-[13px]" />
                </div>
              </div>
              <button onClick={addDiscount} className="mt-3 w-full h-10 rounded-xl text-[13px] font-semibold" style={{ background: 'var(--aqua)', color: '#fff' }}>Add Rule</button>
            </div>

            {settings.discounts.length === 0 ? (
              <EmptyState icon={Percent} title="No discount rules yet" body="Rules you add here apply automatically \u2014 no code changes needed." />
            ) : settings.discounts.map(d => (
              <div key={d.id} className="rounded-2xl bg-card shadow-soft p-4 flex items-center justify-between">
                <div>
                  <p className="text-[13.5px] font-semibold">{d.label}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{d.percentOff}% off \u00b7 after {d.threshold} {d.trigger}</p>
                </div>
                <button onClick={() => { Settings.removeDiscount(d.id); refresh() }} aria-label="Remove rule">
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'questions' && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-card shadow-soft p-4">
              <p className="text-[13px] font-semibold">Security Questions</p>
              <p className="mt-1 text-[12px]" style={{ color: 'var(--muted-foreground)' }}>The first 3 active questions are shown during sign up.</p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex-1 flex items-center rounded-xl border border-input bg-input-background px-4 h-11">
                  <input value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Add a new question" className="flex-1 bg-transparent outline-none text-[13.5px]" />
                </div>
                <button onClick={addQuestion} className="h-11 px-4 rounded-xl text-[13px] font-semibold" style={{ background: 'var(--aqua)', color: '#fff' }}>Add</button>
              </div>
            </div>
            {settings.securityQuestions.length === 0 ? (
              <EmptyState icon={HelpCircle} title="No questions configured" body="Add at least 3 so new sign ups have something to answer." />
            ) : settings.securityQuestions.map(q => (
              <div key={q.id} className="rounded-2xl bg-card shadow-soft p-4 flex items-center justify-between">
                <p className="text-[13.5px] flex-1 pr-3">{q.text}</p>
                <button onClick={() => { Settings.removeQuestion(q.id); refresh() }} aria-label="Remove question">
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; color?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-card shadow-soft p-4">
      <Icon size={18} color="var(--aqua)" />
      <p className="mt-3 text-[22px] font-display font-semibold">{value}</p>
      <p className="text-[12px]" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </div>
  )
}
