// 94-domain-to-server/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI PLAN: Domain ke Server — Perjalanan request dari domain sampai aplikasi.
// 4 Acts: resolve domain → connect ke edge → proxy ke app → return page.
// Scene shell: scene-ui V1 portrait 820×1340.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

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
  BLUE: '#38BDF8',      // Domain, Browser, Client
  PURPLE: '#A78BFA',    // DNS
  GREEN: '#34D399',     // Server, Success
  PINK: '#F472B6',      // Packet
  YELLOW: '#FBBF24',    // Warning
  ORANGE: '#FB923C',    // Process, Activity
  RED: '#F43F5E',       // Alert, Error
  CYAN: '#06B6D4',      // Network, HTTPS
  MINT: '#2CD1A8',      // Response
  SKY: '#38BCF8',       // Alt blue
}

// Intro metadata
export const INTRO_CATEGORY = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'DOMAIN'
export const INTRO_TITLE_B = ' TO SERVER'
export const INTRO_SUBTITLE = 'Perjalanan request dari domain sampai aplikasi'

// Phases (4 Acts sesuai storyboard)
export const PHASES = [
  { id: 'resolve-domain', badge: 'ACT 1 — NAMA MENJADI ALAMAT', badgeColor: COLORS.PURPLE, duration: 10 },
  { id: 'connect-ke-edge', badge: 'ACT 2 — MENCAPAI SERVER', badgeColor: COLORS.CYAN, duration: 9 },
  { id: 'proxy-ke-app', badge: 'ACT 3 — MEMILIH APLIKASI', badgeColor: COLORS.ORANGE, duration: 10 },
  { id: 'return-page', badge: 'ACT 4 — HALAMAN KEMBALI', badgeColor: COLORS.MINT, duration: 11 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// Layout zones (local coordinate dalam ContentBodyV1)
// Zona vertikal: browser/DNS di atas; transit di tengah; edge, proxy, dan backend di bawah
export const ZONES = {
  BROWSER: { x: 366, y: 100 },
  DNS: { x: 550, y: 100 },
  TRANSIT: { y: 350 },
  EDGE: { x: 366, y: 600 },
  PROXY: { x: 366, y: 800 },
  BACKEND_A: { x: 220, y: 905 },
  BACKEND_B: { x: 512, y: 905 },
}
// Catatan bounding box (lihat 05-svg-layout-asset-pipeline.md § Bounding Box):
// BACKEND half-height 40 -> bottom lokal 945, masih di bawah body.height (965)
// dan di atas closing sub-zone (local ~785) yang cuma boleh diisi progress/tease.

// Domain dan IP fiktif (Batas Aman)
export const DOMAIN = 'example.dev'
export const IP = '203.0.113.42'
export const PORT = '443'

// Copy text untuk narasi
export const COPY = {
  // Act 1: Resolve Domain
  ACT1_BEFORE: 'Browser hanya punya domain, belum tahu alamat IP.',
  ACT1_DNS_QUERY: 'DNS query lahir untuk mencari alamat.',
  ACT1_DNS_ANSWER: 'DNS mengembalikan IP address.',
  ACT1_AFTER: 'Domain handoff menjadi IP destination.',

  // Act 2: Connect ke Edge
  ACT2_BEFORE: 'Browser tahu IP, siap membuat HTTPS connection.',
  ACT2_CONNECTING: 'Packet mengikuti route menuju port 443.',
  ACT2_REACHED: 'Edge server menerima packet.',
  ACT2_AFTER: 'Tujuan server tercapai.',

  // Act 3: Proxy ke App
  ACT3_BEFORE: 'Proxy belum memilih target backend.',
  ACT3_ROUTING: 'Proxy membaca host dan path untuk routing.',
  ACT3_SELECTED: 'Routing beam menyala, packet masuk backend.',
  ACT3_AFTER: 'Aplikasi membentuk response.',

  // Act 4: Return Page
  ACT4_BEFORE: 'Browser masih loading.',
  ACT4_SENDING: 'Backend mengirim response body.',
  ACT4_TRANSIT: 'Capsule lewat proxy dan edge.',
  ACT4_AFTER: 'Halaman dirender, spine lengkap menyala.',
}

// SFX Map
// Semua entry di-cross-check terhadap public/audio/*/ (06-audio-sfx.md §2) —
// CONNECT/DNS_QUERY/ROUTE sebelumnya menunjuk file yang tidak ada
// (impacts/connect.wav, ui/notify.wav, transitions/slide.wav), diganti ke
// asset existing terdekat. CLICK dihapus karena tidak pernah dipanggil
// di Animation.jsx (dead config, lihat 03-...md §1.G).
export const SFX_MAP = {
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  POP: { category: 'ui', name: 'pop' },
  CONNECT: { category: 'impacts', name: 'impact' },
  SUCCESS: { category: 'success', name: 'confirm' },
  PACKET_SEND: { category: 'transitions', name: 'swoosh' },
  DNS_QUERY: { category: 'ui', name: 'plink' },
  ROUTE: { category: 'transitions', name: 'slide-in' },
  // revisi-04: perbanyak coverage SFX (appear/disappear/movement)
  POP_OUT: { category: 'transitions', name: 'teleport' },
  BOUNCE: { category: 'ui', name: 'bounce' },
  TICK: { category: 'ui', name: 'tick' },
  HOP: { category: 'transitions', name: 'light-swoosh-quick' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
}

