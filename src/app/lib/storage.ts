// -----------------------------------------------------------------------------
// Local persistence layer.
//
// Every read/write to app data goes through this module. It is intentionally
// shaped like a small repository (getX / saveX / addX) so that later on, each
// function body can be swapped for a `fetch()` call against a real backend
// without touching any page or component.
// -----------------------------------------------------------------------------
import type {
  User, Wallet, Transaction, DeviceCard, Appointment, Station, Ticket, AppNotification, Session,
} from './types'

const KEYS = {
  users: 'aquaflow.users',
  wallets: 'aquaflow.wallets',
  transactions: 'aquaflow.transactions',
  devices: 'aquaflow.devices',
  appointments: 'aquaflow.appointments',
  stations: 'aquaflow.stations',
  tickets: 'aquaflow.tickets',
  notifications: 'aquaflow.notifications',
  session: 'aquaflow.session',
  settings: 'aquaflow.settings',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function uid(prefix = ''): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${prefix}${Date.now().toString(36)}${rand}`
}

// ---- Users -------------------------------------------------------------
export const Users = {
  all(): User[] { return read<User[]>(KEYS.users, []) },
  save(users: User[]) { write(KEYS.users, users) },
  byPhone(phone: string): User | undefined {
    return Users.all().find(u => u.phone === phone)
  },
  byId(id: string): User | undefined {
    return Users.all().find(u => u.id === id)
  },
  create(user: User) {
    const users = Users.all()
    users.push(user)
    Users.save(users)
  },
  update(id: string, patch: Partial<User>) {
    const users = Users.all().map(u => (u.id === id ? { ...u, ...patch } : u))
    Users.save(users)
  },
}

// ---- Wallets -------------------------------------------------------------
export const Wallets = {
  all(): Wallet[] { return read<Wallet[]>(KEYS.wallets, []) },
  save(wallets: Wallet[]) { write(KEYS.wallets, wallets) },
  get(userId: string): Wallet {
    const w = Wallets.all().find(w => w.userId === userId)
    if (w) return w
    const fresh: Wallet = { userId, waterLiters: 0, cashBalance: 0 }
    Wallets.save([...Wallets.all(), fresh])
    return fresh
  },
  update(userId: string, patch: Partial<Wallet>) {
    const wallets = Wallets.all()
    const idx = wallets.findIndex(w => w.userId === userId)
    if (idx === -1) {
      wallets.push({ userId, waterLiters: 0, cashBalance: 0, ...patch })
    } else {
      wallets[idx] = { ...wallets[idx], ...patch }
    }
    Wallets.save(wallets)
    return Wallets.get(userId)
  },
}

// ---- Transactions ----------------------------------------------------
export const Transactions = {
  all(): Transaction[] { return read<Transaction[]>(KEYS.transactions, []) },
  forUser(userId: string): Transaction[] {
    return Transactions.all()
      .filter(t => t.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  add(txn: Transaction) {
    write(KEYS.transactions, [...Transactions.all(), txn])
  },
}

// ---- Devices (cards + bands) ------------------------------------------
export const Devices = {
  all(): DeviceCard[] { return read<DeviceCard[]>(KEYS.devices, []) },
  forUser(userId: string): DeviceCard[] {
    return Devices.all().filter(d => d.userId === userId)
  },
  byId(id: string): DeviceCard | undefined {
    return Devices.all().find(d => d.id === id)
  },
  add(device: DeviceCard) {
    write(KEYS.devices, [...Devices.all(), device])
  },
  update(id: string, patch: Partial<DeviceCard>) {
    write(KEYS.devices, Devices.all().map(d => (d.id === id ? { ...d, ...patch } : d)))
  },
}

// ---- Appointments -------------------------------------------------------
export const Appointments = {
  all(): Appointment[] { return read<Appointment[]>(KEYS.appointments, []) },
  forUser(userId: string): Appointment[] {
    return Appointments.all()
      .filter(a => a.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  add(a: Appointment) { write(KEYS.appointments, [...Appointments.all(), a]) },
  update(id: string, patch: Partial<Appointment>) {
    write(KEYS.appointments, Appointments.all().map(a => (a.id === id ? { ...a, ...patch } : a)))
  },
}

// ---- Stations (network reference data, not per-user) --------------------
const SEED_STATIONS: Station[] = [
  { id: 'stn-broad', name: 'Broad Street Station', area: 'Monrovia Central', status: 'Available', queueLength: 2, distanceKm: 1.2, lat: 6.3106, lng: -10.8047 },
  { id: 'stn-capitol', name: 'Capitol Hill Station', area: 'Capitol Hill', status: 'Busy', queueLength: 7, distanceKm: 2.5, lat: 6.3156, lng: -10.7969 },
  { id: 'stn-waterside', name: 'Waterside Station', area: 'Waterside', status: 'Maintenance', queueLength: 0, distanceKm: 3.1, lat: 6.3208, lng: -10.8021 },
  { id: 'stn-sinkor', name: 'Sinkor Station', area: 'Sinkor', status: 'Available', queueLength: 1, distanceKm: 4.4, lat: 6.2820, lng: -10.7590 },
  { id: 'stn-paynesville', name: 'Paynesville Station', area: 'Paynesville', status: 'Offline', queueLength: 0, distanceKm: 8.6, lat: 6.2760, lng: -10.6890 },
]
export const Stations = {
  all(): Station[] {
    const existing = read<Station[]>(KEYS.stations, [])
    if (existing.length) return existing
    write(KEYS.stations, SEED_STATIONS)
    return SEED_STATIONS
  },
}

// ---- Support tickets -----------------------------------------------------
export const Tickets = {
  all(): Ticket[] { return read<Ticket[]>(KEYS.tickets, []) },
  forUser(userId: string): Ticket[] {
    return Tickets.all()
      .filter(t => t.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  add(t: Ticket) { write(KEYS.tickets, [...Tickets.all(), t]) },
  update(id: string, patch: Partial<Ticket>) {
    write(KEYS.tickets, Tickets.all().map(t => (t.id === id ? { ...t, ...patch } : t)))
  },
}

// ---- Notifications ---------------------------------------------------
export const Notifications = {
  all(): AppNotification[] { return read<AppNotification[]>(KEYS.notifications, []) },
  forUser(userId: string): AppNotification[] {
    return Notifications.all()
      .filter(n => n.userId === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  },
  add(n: AppNotification) { write(KEYS.notifications, [...Notifications.all(), n]) },
  markAllRead(userId: string) {
    write(KEYS.notifications, Notifications.all().map(n => (n.userId === userId ? { ...n, read: true } : n)))
  },
}

// ---- App settings (admin-configurable) ----------------------------------
import type { AppSettings, SecurityQuestion, DiscountRule } from './types'

const DEFAULT_QUESTIONS: SecurityQuestion[] = [
  { id: 'q1', text: 'What is the name of your first school?' },
  { id: 'q2', text: 'What is your mother\u2019s maiden name?' },
  { id: 'q3', text: 'What city were you born in?' },
]

const DEFAULT_SETTINGS: AppSettings = {
  lrdPerLiter: 200,
  securityQuestions: DEFAULT_QUESTIONS,
  discounts: [],
}

export const Settings = {
  get(): AppSettings {
    const existing = read<AppSettings | null>(KEYS.settings, null)
    if (existing) return existing
    write(KEYS.settings, DEFAULT_SETTINGS)
    return DEFAULT_SETTINGS
  },
  update(patch: Partial<AppSettings>) {
    const next = { ...Settings.get(), ...patch }
    write(KEYS.settings, next)
    return next
  },
  addDiscount(rule: DiscountRule) {
    const s = Settings.get()
    Settings.update({ discounts: [...s.discounts, rule] })
  },
  removeDiscount(id: string) {
    const s = Settings.get()
    Settings.update({ discounts: s.discounts.filter(d => d.id !== id) })
  },
  addQuestion(q: SecurityQuestion) {
    const s = Settings.get()
    Settings.update({ securityQuestions: [...s.securityQuestions, q] })
  },
  removeQuestion(id: string) {
    const s = Settings.get()
    Settings.update({ securityQuestions: s.securityQuestions.filter(q => q.id !== id) })
  },
}

// ---- Session -----------------------------------------------------------
export const SessionStore = {
  get(): Session | null { return read<Session | null>(KEYS.session, null) },
  set(session: Session | null) { write(KEYS.session, session) },
}
