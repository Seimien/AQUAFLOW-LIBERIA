import React, { useMemo } from 'react'

interface WaterDropletProps {
  liters: number
  capacity?: number
  size?: number
}

const DROPLET_PATH =
  'M100 14 C132 58 172 108 172 146 C172 186.526 139.764 218 100 218 C60.236 218 28 186.526 28 146 C28 108 68 58 100 14 Z'

/**
 * The dashboard's signature visual: a single animated water droplet whose
 * fill level tracks the user's liter balance, with a slow double-wave motion.
 * No card, background shape, or vessel outline behind it \u2014 just the droplet.
 */
export function WaterDroplet({ liters, capacity = 600, size = 160 }: WaterDropletProps) {
  const pct = Math.max(0.04, Math.min(1, liters / capacity))
  const h = 232
  const fillTopY = useMemo(() => 218 - pct * (218 - 30), [pct])
  const id = useMemo(() => `drop-${Math.random().toString(36).slice(2, 8)}`, [])

  return (
    <div style={{ width: size, height: size * (h / 200) }} className="relative mx-auto select-none">
      <svg viewBox={`0 0 200 ${h}`} width="100%" height="100%" fill="none">
        <defs>
          <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--aqua-2)" />
            <stop offset="100%" stopColor="var(--aqua)" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="50%" cy="70%" r="60%">
            <stop offset="0%" stopColor="var(--aqua)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--aqua)" stopOpacity="0" />
          </radialGradient>
          <clipPath id={id}>
            <path d={DROPLET_PATH} />
          </clipPath>
        </defs>

        <ellipse cx="100" cy="150" rx="80" ry="60" fill={`url(#${id}-glow)`} />

        <path d={DROPLET_PATH} fill="rgba(255,255,255,0.4)" stroke="rgba(8,25,47,0.12)" strokeWidth="2" />

        <g clipPath={`url(#${id})`}>
          <rect x="0" y={fillTopY} width="200" height={h - fillTopY} fill={`url(#${id}-water)`} />
          <path fill="rgba(255,255,255,0.30)">
            <animate attributeName="d" dur="5s" repeatCount="indefinite" values={waveValues(fillTopY, 6, h)} />
          </path>
          <path fill="rgba(255,255,255,0.16)">
            <animate attributeName="d" dur="6.6s" repeatCount="indefinite" values={waveValues(fillTopY - 3, -8, h)} />
          </path>
        </g>

        <path
          d="M78 46 C64 68 50 90 46 106"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.5"
          fill="none"
        />
      </svg>
    </div>
  )
}

function waveValues(baseY: number, amplitude: number, bottom: number): string {
  const y1 = baseY
  const y2 = baseY + amplitude
  const y3 = baseY - amplitude * 0.4
  const a = `M0 ${y1} Q 50 ${y2} 100 ${y1} T 200 ${y1} V ${bottom} H 0 Z`
  const b = `M0 ${y1} Q 50 ${y3} 100 ${y1} T 200 ${y1} V ${bottom} H 0 Z`
  return `${a};${b};${a}`
}
