import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  body: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center px-8 py-14">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'var(--secondary)' }}>
        <Icon size={26} color="var(--navy)" strokeWidth={1.6} />
      </div>
      <h3 className="font-display font-semibold text-[16px] mb-1.5">{title}</h3>
      <p className="text-[13.5px] leading-relaxed max-w-[26ch]" style={{ color: 'var(--muted-foreground)' }}>{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
