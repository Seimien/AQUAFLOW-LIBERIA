export interface SecurityAnswer {
  questionId: string
  answer: string
}

export interface User {
  id: string
  fullName: string
  phone: string
  passwordHash: string
  pin: string
  securityAnswers: SecurityAnswer[]
  createdAt: string
  avatarInitial: string
}

export interface Wallet {
  userId: string
  waterLiters: number
  cashBalance: number
}

export type TxnType = 'deposit' | 'withdraw' | 'dispense'
export type TxnMethod = 'MTN Mobile Money' | 'Orange Money' | 'Cash Pickup' | 'Wallet Balance'

export interface Transaction {
  id: string
  userId: string
  type: TxnType
  amount: number
  unit: 'liters' | 'LRD'
  method?: TxnMethod
  station?: string
  cardId?: string
  note?: string
  createdAt: string
}

export type DeviceKind = 'card' | 'band'
export type DeviceStatus = 'Active' | 'Inactive' | 'Frozen' | 'Pending Pickup' | 'Lost' | 'Replacement'
export type AssignedTo = 'Self' | 'Child' | 'Staff' | 'Visitor' | 'Family' | 'Student' | 'Patient'

export interface DeviceCard {
  id: string
  userId: string
  kind: DeviceKind
  label: string
  code: string
  status: DeviceStatus
  assignedTo: AssignedTo
  dailyLimit: number | null
  weeklyLimit: number | null
  monthlyLimit: number | null
  lastUsedAt?: string
  lastUsedStation?: string
  createdAt: string
}

export type AppointmentStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled'

export interface Appointment {
  id: string
  userId: string
  reason: string
  deviceKind: DeviceKind
  quantity: number
  pickupLocation: string
  status: AppointmentStatus
  date?: string
  time?: string
  instructions?: string
  createdAt: string
}

export type StationStatus = 'Available' | 'Busy' | 'Maintenance' | 'Offline'

export interface Station {
  id: string
  name: string
  area: string
  status: StationStatus
  queueLength: number
  distanceKm: number
  lat: number
  lng: number
}

export type TicketCategory = 'Water Issue' | 'Payment' | 'Card' | 'Band' | 'Pickup' | 'Technical' | 'Other'
export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed'

export interface Ticket {
  id: string
  userId: string
  category: TicketCategory
  description: string
  status: TicketStatus
  createdAt: string
}

export interface AppNotification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface Session {
  userId: string
  rememberMe: boolean
}

export interface SecurityQuestion {
  id: string
  text: string
}

export type DiscountTrigger = 'cards' | 'liters' | 'promo'

export interface DiscountRule {
  id: string
  label: string
  trigger: DiscountTrigger
  threshold: number
  percentOff: number
  active: boolean
}

export interface AppSettings {
  lrdPerLiter: number
  securityQuestions: SecurityQuestion[]
  discounts: DiscountRule[]
}
