// src/content/21-forgot-password/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/21-forgot-password/_docs/
// FORGOT_PASSWORD_PLAN.md (2026-09-12). Empat Act, scene-ui V1,
// koordinat LOCAL, sumbu vertikal AXIS_X. Cerita: Raka lupa password
// — sistem TIDAK memberitahu password lama — input email respon generik
// sama (anti-enumeration) — token reset pendek umur + sekali pakai —
// password baru di-hash + salt — hash lama di-replace — session lama
// ditutup → login pakai bukti baru (handoff 18-auth login only).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum `ready`,
// lihat plan § Checklist).
// ═════════════════════════════════════════════════════════════

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan §1 warna #FBBF24 (reset / recovery)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  RESET: '#FBBF24',     // jalur pemulihan — aktor utama
  RECORD: '#38BDF8',    // record akun Raka
  CRYPTO: '#F472B6',    // mesin hash — password lama & baru
  TOKEN: '#A78BFA',     // token reset (pendek umur)
  PENDING: '#FBOF24',   // status sementara
  SUCCESS: '#34D399',   // hash baru cocok / reset valid
  DENY: '#F43F5E',      // invalid / expired / token bekas
  SYSTEM: '#22D3EE',    // warna domain ADIB-DEV.COM (brand kontrak seri)
}

// PHASES — 4 Act (±45s dengan intro 1,2s)
export const PHASES = [
  { id: 'act1-denied', badge: 'ACT 1 — LOGIN GAGAL, PASSWORD TIDAK DISIMPAN', badgeColor: COLORS.RESET, duration: 9.0 },
  { id: 'act2-generic', badge: 'ACT 2 — PERMINTAAN TIDAK MEMBOCORKAN AKUN', badgeColor: COLORS.TOKEN, duration: 11.0 },
  { id: 'act3-token', badge: 'ACT 3 — LINK RESET HANYA SEMENTARA', badgeColor: COLORS.CRYPTO, duration: 12.5 },
  { id: 'act4-hash', badge: 'ACT 4 — HASH BARU MENGGANTIKAN LAMA', badgeColor: COLORS.SUCCESS, duration: 12.0 },
]

export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'FORGOT'
export const INTRO_TITLE_B = ' PASSWORD'
export const INTRO_SUBTITLE = 'Pulihkan tanpa membocorkan yang lama'

// ── Layout LOCAL (origin DEFAULT_LAYOUT_V1.body = 44, 235) ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x           // local 366 — sumbu vertikal

export const DOOR_Y = 45                                        // local 45 — pintu login (gagal/siap)
export const RECORD_Y = 170                                     // local 170 — kartu record (akun Raka)
export const FORM_Y = 300                                       // local 300 — form recovery (email)
export const INBOX_Y = 300                                      // local 300 (disamakan FORM_Y)
export const TOKEN_Y = 435                                      // local 435 — token reset + jam
export const GATE_Y = 565                                       // local 565 — gerbang verifikasi token
export const CLOSING_Y = 685                                    // local 685 — cap payoff

export const CAPTION_Y = [760, 760, 760, 760]                 // local 760 — floating caption bar di bawah

export const RECORD_LABEL = 'RECORD AKUN'
export const RECORD_EMAIL = 'raka@devmail.id'
export const TOKEN_CODE   = 'TOKEN-73F1'   // token reset pendek (1x pakai)

export const DOOR_LABEL = 'LOGIN'
export const FORM_LABEL = 'FORM PEMULIHAN'
export const INBOX_LABEL = 'INBOX RAKA'
export const TOKEN_LABEL = 'TOKEN RESET'
export const GATE_LABEL = 'GERBANG RESET'

// Teks deklaratif ≤5 kata, dekat objek
export const CAPTIONS = {
  // Act 1 — login gagal, tidak ada teks password disimpan
  LOGIN_BLOCKED: 'Pintu login tertutup',
  NO_PLAINTEXT: 'Password tidak disimpan apa adanya',
  HASH_ONLY: 'Record hanya hash + salt',
  RECOVERY_PATH: 'Cari jalur pemulihan',

  // Act 2 — respons generik, tidak membocorkan akun
  ENTER_EMAIL: 'Masukkan email pemulihan',
  GENERIC_REPLY: 'Respons sama untuk semua email',
  TOKEN_SILENT: 'Bukti dibuat tanpa diumumkan',
  INBOX_CHECK: 'Cek inbox yang cocok',

  // Act 3 — link reset sementara + sekali pakai
  LINK_SENT: 'Amplop tautan tiba',
  LINK_EXPIRY: 'Tautan ada batas waktu',
  TOKEN_DEPARTS: 'Token menuju gerbang',
  TOKEN_ONCE: 'Token dipakai sekali',
  TOKEN_DENIED: 'Token sudah dipakai atau basi',

  // Act 4 — hash baru menggantikan lama
  NEW_PASSWORD: 'Buat password baru',
  HASH_NEW: 'Hash baru tersimpan',
  OLD_SESSION: 'Session lama ditutup',
  READY_LOGIN: 'Login dengan bukti baru',
}

export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  LOCK: { category: 'impacts', name: 'lock' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  PLINK: { category: 'ui', name: 'plink' },
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  CHIME: { category: 'ui', name: 'chime' },
  SNAP: { category: 'impacts', name: 'connector-snap' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  RELIEF: { category: 'success', name: 'relief-settle' },
}
