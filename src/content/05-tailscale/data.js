// src/content/tailscale/data.js
// ─────────────────────────────────────────────────────────────
// Tailscale — cerita: 2 device diblokir NAT → WireGuard key pair →
// coordination server "mak comblang" → NAT hole punching + DERP
// relay fallback → payoff: mesh network privat.
// Lihat _docs/TAILSCALE_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  BRAND: '#6366F1',      // indigo — Tailscale itu sendiri
  BRAND_DIM: '#312E81',
  CRYPTO: '#2CD1A8',      // mint — WireGuard key pair, enkripsi
  CRYPTO_DIM: '#0F766E',
  DANGER: '#F43F5E',      // rose — NAT block, gagal
  DANGER_DIM: '#4C0519',
  SERVER: '#FBBF24',      // amber — coordination server
  SERVER_DIM: '#78350F',
  SUCCESS: '#38BDF8',     // sky blue — P2P direct berhasil
  SUCCESS_DIM: '#0C4A6E',
  RELAY: '#A78BFA',       // violet — DERP relay fallback
  RELAY_DIM: '#4C1D95',
}

export const PHASES = [
  {
    id: 'blocked-hook',
    badge: 'ACT 1 — DUA DEVICE, DUA TEMBOK',
    badgeColor: COLORS.DANGER,
    caption: 'Sama-sama online. Kok gagal connect?',
    duration: 9.0,
  },
  {
    id: 'wireguard-keys',
    badge: 'ACT 2 — SETIAP DEVICE PUNYA KUNCI SENDIRI',
    badgeColor: COLORS.CRYPTO,
    caption: 'Tiap device bikin kunci sendiri.',
    duration: 9.0,
  },
  {
    id: 'coordination',
    badge: 'ACT 3 — SIAPA YANG KENALIN MEREKA?',
    badgeColor: COLORS.SERVER,
    caption: 'IP berubah-ubah. Server cuma tukar alamat.',
    duration: 10.0,
  },
  {
    id: 'hole-punching',
    badge: 'ACT 4 — NEMBUS TEMBOK BARENGAN',
    badgeColor: COLORS.SUCCESS,
    caption: 'Nembus firewall bareng. Gagal? Ada cadangan.',
    duration: 12.0,
  },
  {
    id: 'mesh-payoff',
    badge: 'ACT 5 — SEKARANG BERASA 1 JARINGAN',
    badgeColor: COLORS.BRAND,
    caption: 'Semua device nyambung — serasa 1 LAN.',
    duration: 9.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// ACT 1 — Dua device, dua tembok (hook)
// ═══════════════════════════════════════════════
export const DEVICES = {
  home:   { id: 'home', label: 'RUMAH',   sub: 'Laptop pribadi', x: 150 },
  office: { id: 'office', label: 'KANTOR', sub: 'Laptop kerja',   x: 582 },
}

export const HOOK_QUESTION = 'Kok gak nyambung?'
export const HOOK_CLIFFHANGER = 'Gimana caranya bisa saling nemu?'

// ═══════════════════════════════════════════════
// ACT 2 — WireGuard key pair
// ═══════════════════════════════════════════════
export const KEY_INSIGHT = 'Bukan Password — Kunci Kriptografi!'
export const KEY_CAPTION = 'Password bisa dicuri. Kunci privat disimpan aman.'

// ═══════════════════════════════════════════════
// ACT 3 — Coordination server (mak comblang)
// ═══════════════════════════════════════════════
export const IP_FLICKER = ['103.44.x.x', '182.17.x.x', '36.90.x.x', '?.?.?.?']
export const COORD_QUESTION = 'Gimana caranya bisa saling nemu?'
export const COORD_NOTE = 'Server cuma nyimpen alamat.'
export const COORD_PAYOFF = 'Kedua laptop kenalan otomatis.'

// ═══════════════════════════════════════════════
// ACT 4 — NAT hole punching + DERP relay fallback
// ═══════════════════════════════════════════════
export const HOLEPUNCH_TENSION = 'Nembak bareng... akankah tembus?'
export const HOLEPUNCH_SUCCESS = 'TEMBUS! Koneksi P2P langsung.'
export const RELAY_TENSION = 'Firewall satunya kelewat ketat... hole punching gagal.'
export const RELAY_FALLBACK = 'Lewat DERP relay — tetap aman.'
export const HOLEPUNCH_COMPARE = 'P2P = jalan tol. Relay = muter, aman.'

// ═══════════════════════════════════════════════
// ACT 5 — Mesh payoff (jawab hook Act 1)
// ═══════════════════════════════════════════════
export const MESH_EXTRA_DEVICES = [
  { id: 'phone', label: 'HP', x: 366, y: 40 },
  { id: 'cloud', label: 'SERVER CLOUD', x: 366, y: 300 },
]

export const CLOSING_LINE = 'Sekarang berasa 1 LAN, padahal beda kota.'
export const CLOSING_BRAND = 'Itulah cara kerja Tailscale.'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  PLINK: { category: 'ui', name: 'plink' },
  TICK: { category: 'ui', name: 'tick' },
  BOUNCE: { category: 'ui', name: 'bounce' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  SWOOSH2: { category: 'transitions', name: 'swoosh-2' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  GLITCH: { category: 'transitions', name: 'glitch' },

  IMPACT: { category: 'impacts', name: 'impact' },
  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  VICTORY: { category: 'success', name: 'victory' },
  CHARGE: { category: 'success', name: 'charge' },
  DING: { category: 'success', name: 'ding' },
  COMPLETE: { category: 'success', name: 'complete' },

  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },

  TYPING: { category: 'sfx', name: 'typing', boost: 2.2 },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SCAN: { category: 'sfx', name: 'scan' },
  SUCCESS: { category: 'sfx', name: 'success' },
  ERROR: { category: 'sfx', name: 'error' },
}
