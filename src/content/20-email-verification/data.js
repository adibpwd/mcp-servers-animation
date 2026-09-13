// src/content/20-email-verification/data.js
// ─────────────────────────────────────────────────────────────
// Sesuai src/content/20-email-verification/revisi/
// 2026-09-13-revisi-02-full-activation-delivery-login.md.
// Empat Act, scene-ui V1 penuh, koordinat LOCAL (origin 44,235).
//
// Cerita utuh:
// Act 1: Login pending (password OK, email_verified X) → Shake Merah → Tombol Kirim link.
// Act 2: App Server buat link → Handoff SMTP ke Delivery Provider → Delivered ke Inbox.
// Act 3: Klik link → Token diperiksa di Verification Endpoint → Record Verified.
// Act 4: Login ulang → Shake Hijau Login OK → Session ticket & Pintu terbuka!
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet warna — Revisi-02
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  EMAIL: '#22D3EE',     // inbox / amplop / provider
  TOKEN: '#A78BFA',     // token verifikasi / link
  CRYPTO: '#F472B6',    // gerbang perbandingan / hash
  PENDING: '#FBBF24',   // status Pending / warning
  SUCCESS: '#34D399',   // Verified / cocok / door open
  DENY: '#F43F5E',      // expiry / sekali pakai dilanggar
  SYSTEM: '#22D3EE',    // warna domain ADIB-DEV.COM (brand)
  PROVIDER: '#818CF8',  // Email Delivery Provider (indigo)
}

export const PHASES = [
  { id: 'act1-pending', badge: 'ACT 1 — PASSWORD BENAR, EMAIL BELUM AKTIF', badgeColor: COLORS.PENDING, duration: 12.0 },
  { id: 'act2-delivery', badge: 'ACT 2 — SERVER MENYERAHKAN EMAIL UNTUK DIKIRIM', badgeColor: COLORS.EMAIL, duration: 14.0 },
  { id: 'act3-link', badge: 'ACT 3 — LINK DIUJI SEKALI & BERBATAS WAKTU', badgeColor: COLORS.TOKEN, duration: 13.0 },
  { id: 'act4-verified', badge: 'ACT 4 — LOGIN YANG SAMA KINI BERHASIL', badgeColor: COLORS.SUCCESS, duration: 11.0 },
]

export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'EMAIL'
export const INTRO_TITLE_B = ' VERIFICATION'
export const INTRO_SUBTITLE = 'Buktikan alamat, bukan identitas'

// Sumbu vertikal utama (LOCAL body coordinates, origin x=0, y=0 di canvas 44,235)
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x          // local 366

// Compact, clear layout with safe spacing
export const TOP_Y = 25                                         // local 25 — Account Record, Form Login, App Door
export const SERVER_Y = 195                                     // local 195 — App Server & Delivery Provider
export const INBOX_Y = 365                                      // local 365 — Inbox Adib & Verification Endpoint
export const HANDOFF_Y = 525                                    // local 525 — Session Ticket
export const CAPTION_Y = 595                                    // local 595 — Floating Caption bar at bottom

export const RECORD_LABEL = 'RECORD AKUN'
export const SERVER_LABEL = 'APP SERVER'
export const PROVIDER_LABEL = 'DELIVERY PROVIDER'
export const INBOX_LABEL = 'INBOX ADIB'
export const GATE_LABEL = 'VERIFICATION ENDPOINT'
export const DOOR_LABEL = 'APP DOOR'

export const RECORD_EMAIL = 'iammuslikhuladib@gmail.com'
export const MASKED_LINK = 'verify…7K9'
export const TOKEN_TTL = '10m'

export const CAPTIONS = {
  // Act 1
  PWD_CHECK: 'Password diperiksa',
  EMAIL_NOT_ACTIVE: 'Email belum aktif',
  ACTIVATION_REQ: 'Aktivasi diperlukan',
  SEND_LINK_CMD: 'Kirim link aktivasi',

  // Act 2
  LINK_CREATED: 'Link dibuat sekali',
  SERVER_HANDOFF: 'Server menyerahkan pesan',
  PROVIDER_ROUTE: 'Provider mengirim email',
  EMAIL_ARRIVED: 'Email tiba di inbox',

  // Act 3
  OPEN_LINK: 'Buka link verifikasi',
  LINK_EXPIRY: 'Link punya batas waktu',
  TOKEN_CHECK: 'Token diperiksa',
  TOKEN_CONSUMED: 'Link dipakai sekali',

  // Act 4
  EMAIL_ACTIVE: 'Email sudah aktif',
  REUSE_DENIED: 'Link bekas ditolak',
  TWO_CHECKS: 'Login lolos dua cek',
  WELCOME_DOOR: 'Selamat datang',
}

export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  LOCK: { category: 'impacts', name: 'lock' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },

  PLINK: { category: 'ui', name: 'plink' },
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  CHIME: { category: 'ui', name: 'chime' },
  SNAP: { category: 'impacts', name: 'connector-snap' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  RELIEF: { category: 'success', name: 'relief-settle' },
}
