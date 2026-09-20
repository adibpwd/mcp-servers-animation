// 93-reverse-proxy/data.js

export const VW = 820
export const VH = 1340

export const PHASES = [
  { label: 'Act 1: Satu Pintu Publik', duration: 9.0 },
  { label: 'Act 2: Proxy Memilih Tujuan', duration: 10.0 },
  { label: 'Act 3: Request Diteruskan', duration: 9.0 },
  { label: 'Act 4: Response Kembali', duration: 10.0 },
]

// Color palette (dari 05-svg-text-guide.md)
export const COLORS = {
  // Background layers
  DEEP: '#070913',
  MID: '#0B1120',
  LIGHT: '#0F172A',

  // Border & divider
  BORDER_SUBTLE: '#1E293B',
  BORDER_DEFAULT: '#334155',
  BORDER_EMPHASIZED: '#475569',

  // Text
  TEXT_PRIMARY: '#E2E8F0',
  TEXT_SECONDARY: '#CBD5E1',
  TEXT_TERTIARY: '#94A3B8',
  MUTED: '#64748B',
  DIM: '#475569',

  // Accent - semantic colors
  BLUE: '#38BDF8',      // Client, Info
  PURPLE: '#A78BFA',    // Technical term
  GREEN: '#34D399',     // Success, Active
  PINK: '#F472B6',      // Media
  YELLOW: '#FBBF24',    // Warning
  ORANGE: '#FB923C',    // Process, Activity
  RED: '#F43F5E',       // Alert, Error
  CYAN: '#06B6D4',      // Network, System
  MINT: '#2CD1A8',      // Alt success
  SKY: '#38BCF8',       // Alt blue
}

// Intro metadata
export const INTRO_CATEGORY = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'REVERSE'
export const INTRO_TITLE_B = ' PROXY'
export const INTRO_SUBTITLE = 'Satu pintu untuk banyak aplikasi'

// Layout zones (local coordinate dalam ContentBodyV1)
export const ZONES = {
  CLIENT: { y: 20 },
  PUBLIC_ENDPOINT: { y: 140 },
  PROXY_GATE: { y: 280 },
  ROUTING: { y: 420 },
  BACKEND_A: { y: 560, x: 180 },
  BACKEND_B: { y: 560, x: 552 },
}

// SFX Map
export const SFX_MAP = {
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  POP: { category: 'ui', name: 'pop' },
  CLICK: { category: 'ui', name: 'click' },
  CONNECT: { category: 'impacts', name: 'connect' },
  SUCCESS: { category: 'success', name: 'confirm' },
  PACKET_SEND: { category: 'transitions', name: 'swoosh' },
}
