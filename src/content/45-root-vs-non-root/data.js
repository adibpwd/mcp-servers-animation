// 45-root-vs-non-root/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI PLAN: Root vs Non-Root — kenapa tidak boleh selalu jadi raja server.
// 4 Acts: ilusi kemudahan root → kesalahan fatal satu spasi → blast radius
// peretasan (root vs www-data) → pola aman (akun khusus + sudo terbatas).
// Scene shell: scene-ui V1 portrait 820×1340.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

// Color palette (dari 05-svg-layout-asset-pipeline.md)
export const COLORS = {
  DEEP: '#070913',
  MID: '#0B1120',
  LIGHT: '#0F172A',

  BORDER_SUBTLE: '#1E293B',
  BORDER_DEFAULT: '#334155',
  BORDER_EMPHASIZED: '#475569',

  TEXT_PRIMARY: '#E2E8F0',
  TEXT_SECONDARY: '#CBD5E1',
  TEXT_TERTIARY: '#94A3B8',
  MUTED: '#64748B',
  DIM: '#475569',

  // Accent - semantic colors
  PINK: '#F472B6',      // Root, kekuasaan mutlak, bahaya
  EMERALD: '#34D399',   // Non-root, aman, Least Privilege
  RED: '#F43F5E',       // Kerusakan fatal / alert
  ORANGE: '#FB923C',    // Hacker / proses berjalan
  CYAN: '#06B6D4',      // Server / sistem
  PURPLE: '#A78BFA',    // sudo / eskalasi sementara
  YELLOW: '#FBBF24',    // Peringatan
  BLUE: '#38BDF8',      // User biasa / netral
}

// Intro metadata
export const INTRO_CATEGORY = 'LINUX FUNDAMENTALS — SECURITY'
export const INTRO_TITLE_A = 'ROOT VS'
export const INTRO_TITLE_B = ' NON-ROOT'
export const INTRO_SUBTITLE = 'Kenapa tidak boleh selalu jadi raja di server'

// Phases (4 Acts sesuai storyboard PLAN)
export const PHASES = [
  { id: 'ilusi-root', badge: 'ACT 1 — ILUSI KEMUDAHAN ROOT', badgeColor: COLORS.PINK, duration: 9 },
  { id: 'kesalahan-fatal', badge: 'ACT 2 — SATU SPASI, BENCANA FATAL', badgeColor: COLORS.RED, duration: 10 },
  { id: 'blast-radius', badge: 'ACT 3 — BLAST RADIUS PERETASAN', badgeColor: COLORS.ORANGE, duration: 11 },
  { id: 'pola-aman', badge: 'ACT 4 — AKUN KHUSUS & SUDO TERBATAS', badgeColor: COLORS.EMERALD, duration: 10 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// Layout zones (local coordinate dalam ContentBodyV1, body 732x965)
// Posisi persis mengikuti preseden aman 94-domain-to-server (94 sudah lolos
// audit bounding-box §05-svg-layout-asset-pipeline).
export const ZONES = {
  TERMINAL: { x: 366, y: 100 },
  USER_BADGE: { x: 550, y: 100 },
  FS_ROW: { y: 350 },
  SERVER: { x: 366, y: 600 },
  WEBAPP: { x: 366, y: 800 },
  HACKER: { x: 220, y: 905 },
  TARGET: { x: 512, y: 905 },
}

export const FS_FILES = ['etc', 'var', 'home', 'usr', 'boot']

// Copy text untuk narasi
export const COPY = {
  // Act 1: Ilusi Kemudahan Root
  ACT1_BEFORE: 'Developer login sebagai user biasa, sering ketemu Permission Denied.',
  ACT1_ESCALATE: '`sudo su` — sekarang jadi root (UID 0).',
  ACT1_AFTER: 'Root: tidak ada dialog konfirmasi, semua perintah langsung jalan.',

  // Act 2: Kesalahan Fatal Satu Spasi
  ACT2_BEFORE: 'Mau bersihkan folder tmp, ketik cepat, tidak sadar ada spasi ekstra.',
  ACT2_TYPO: '`rm -rf / tmp/*` — spasi itu mengubah target jadi seluruh disk.',
  ACT2_EXEC: 'Root tidak pernah bertanya "yakin?" — perintah langsung dieksekusi.',
  ACT2_AFTER: 'Seluruh isi server terhapus. Tidak ada sistem yang menahan.',

  // Act 3: Blast Radius Peretasan
  ACT3_BEFORE: 'Web app punya bug RCE (Remote Code Execution) yang bisa dieksploitasi.',
  ACT3_SCENARIO_A: 'Skenario A — web app berjalan sebagai root: hacker dapat full server shell.',
  ACT3_SCENARIO_B: 'Skenario B — web app berjalan sebagai `www-data`: hacker terjebak, akses ditolak.',
  ACT3_AFTER: 'Blast radius bergantung penuh pada siapa yang menjalankan proses.',

  // Act 4: Pola Aman
  ACT4_BEFORE: 'Service didaftarkan ke systemd dengan `User=appuser` — bukan root.',
  ACT4_SCOPED: 'appuser hanya punya izin di wilayah kerjanya sendiri.',
  ACT4_SUDO: 'Butuh tugas administrasi? Pakai `sudo` sesaat, lalu kembali ke non-root.',
  ACT4_AFTER: 'Principle of Least Privilege: kekuasaan penuh hanya saat benar-benar perlu.',
}

// SFX Map — semua entry di-cross-check terhadap public/audio/*/ (06-audio-sfx.md §2),
// dipilih dari asset yang sudah terbukti dipakai topic lain.
export const SFX_MAP = {
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  POP: { category: 'ui', name: 'pop' },
  BOUNCE: { category: 'ui', name: 'bounce' },
  TICK: { category: 'ui', name: 'tick' },
  CONNECT: { category: 'impacts', name: 'impact' },
  SUCCESS: { category: 'success', name: 'confirm' },
  ALERT: { category: 'impacts', name: 'impact' },
  POP_OUT: { category: 'transitions', name: 'teleport' },
  HOP: { category: 'transitions', name: 'light-swoosh-quick' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  DENY: { category: 'ui', name: 'tick' },
}
