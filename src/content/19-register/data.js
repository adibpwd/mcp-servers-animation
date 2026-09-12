// src/content/19-register/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/19-register/_docs/REGISTER_PLAN.md
// (2026-09-12). Empat Act, scene-ui V1, teks deklaratif ≤5 kata dekat objek.
// Cerita: Adib belum punya record akun. Ia mengisi form di loket, sistem
// memvalidasi (format email, keunikan email), password diproses hash + salt
// unik (BUKAN teks asli), lalu record baru berstatus Pending. Amplop verifikasi
// dikirim ke inbox sebagai handoff ke topic 20 — akun belum aktif.
//
// KOORDINAT LAYOUT: semua posisi LOCAL (origin DEFAULT_LAYOUT_V1.body),
// pola sama 22-oauth2/18-auth (09-standar §1.S).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan §1 warna #A78BFA (registration / form)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  FORM: '#A78BFA',      // loket / form pendaftaran — aktor utama
  RECORD: '#38BDF8',    // buku anggota (record akun)
  CRYPTO: '#F472B6',    // mesin hash — password + salt
  PENDING: '#FBBF24',   // status Pending (belum aktif)
  SUCCESS: '#34D399',   // valid / email terkirim
  DENY: '#F43F5E',      // invalid / duplikat / pintu terkunci
  SYSTEM: '#22D3EE',    // warna domain ADIB-DEV.COM (brand kontrak seri)
}

// PHASES — 4 Act (±42s dengan intro 1,2s)
export const PHASES = [
  { id: 'act1-empty', badge: 'ACT 1 — BELUM ADA DI BUKU ANGGOTA', badgeColor: COLORS.FORM, duration: 9.0 },
  { id: 'act2-valid', badge: 'ACT 2 — FORM HARUS MASUK AKAL', badgeColor: COLORS.RECORD, duration: 11.0 },
  { id: 'act3-hash', badge: 'ACT 3 — PASSWORD TIDAK IKUT DISIMPAN', badgeColor: COLORS.CRYPTO, duration: 12.5 },
  { id: 'act4-pending', badge: 'ACT 4 — BUKTIKAN EMAIL MILIKMU', badgeColor: COLORS.PENDING, duration: 9.0 },
]

// Series identity — konsisten 18-auth/22-oauth2/23-https-tls
export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'REGISTER'
export const INTRO_TITLE_B = ' AKUN'
export const INTRO_SUBTITLE = 'Isi data, buktikan email'

// ── Layout LOCAL (origin body 44,235). Sumbu vertikal tunggal AXIS_X,
// alur top → bawah: buku → form → record → mesin hash → inbox. ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x          // local 366 (canvas 410)

export const BOOKS_Y = 320 - DEFAULT_LAYOUT_V1.body.y          // local 85 — buku anggota (slot kosong)
export const FORM_Y = 500 - DEFAULT_LAYOUT_V1.body.y           // local 265 — loket form
export const RECORD_Y = 650 - DEFAULT_LAYOUT_V1.body.y         // local 415 — record baru (Pending/duplicate)
export const MACHINE_Y = 800 - DEFAULT_LAYOUT_V1.body.y        // local 565 — mesin hash
export const INBOX_Y = 960 - DEFAULT_LAYOUT_V1.body.y          // local 725 — inbox Adib
export const CLOSING_Y = 900                                   // local 900 — cap payoff

export const CAPTION_Y = [455, 640, 790, 950]                  // local, dekat zona aktif tiap Act

export const BOOKS_LABEL = 'BUKU ANGGOTA'
export const FORM_LABEL = 'LOKET DAFTAR'
export const RECORD_LABEL = 'RECORD AKUN'
export const MACHINE_LABEL = 'MESIN HASH'
export const INBOX_LABEL = 'INBOX ADIB'

export const FIELDS = [
  { id: 'nama', label: 'nama' },
  { id: 'email', label: 'email' },
  { id: 'password', label: 'password' },
]

export const PENDING_BADGE = { label: 'PENDING' }
export const HASH_OUT = { label: 'b4b1…9c21' }
export const SALT_CHIP = { label: 'salt a9f3' }

// Teks lokal per beat — ≤5 kata, tanpa emoji/tanda tanya
export const CAPTIONS = {
  // Act 1 — Belum Ada di Buku Anggota
  NO_ACCOUNT: 'Akun belum ada',
  SLOT_EMPTY: 'Slot masih kosong',
  LOGIN_BLOCKED: 'Login belum mungkin',
  NEED_DATA: 'Isi data di loket',
  SLOT_PAYOFF: 'Pendaftaran dimulai',

  // Act 2 — Form Harus Masuk Akal
  FILL_BASIC: 'Isi data dasar',
  EMAIL_INVALID: 'Format email salah',
  EMAIL_TAKEN: 'Email sudah dipakai',
  DATA_READY: 'Data siap diproses',

  // Act 3 — Password Tidak Ikut Disimpan
  PASSWORD_SECRET: 'Password tetap rahasia',
  SALT_MIXED: 'Salt unik dicampur',
  HASH_STORED: 'Tersimpan hash, bukan teks',
  STILL_PENDING: 'Akun berstatus Pending',

  // Act 4 — Buktikan Email Milikmu
  VERIFY_SENT: 'Verifikasi dikirim ke email',
  NOT_ACTIVE_YET: 'Akun belum aktif',
  MAIL_TO_INBOX: 'Amplop menuju inbox',
  BUFS_WAIT: 'Bukti menunggu dibuka',
}

// SFX — nama terverifikasi di public/audio (dipakai 17/18/22/23)
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  LOCK: { category: 'impacts', name: 'lock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },

  // Ditambahkan revisi-01 (2026-09-13) — audio lebih playful & bervariasi,
  // lihat revisi/2026-09-13-revisi-01-audio-playful.md. Semua reuse asset
  // existing (0 download baru — kandidat paper-send/approval-stamp dari
  // shared pack ditunda ke fase implementasi pack, belum ada file-nya).
  // sfx/scan & sfx/materialize di-scan tapi TERLALU PELAN (-26dB/-27.2dB
  // vs baseline -18.1dB, diukur ffmpeg volumedetect) — diganti alternatif
  // yang lolos ukur.
  SHIMMER: { category: 'success', name: 'shimmer' },
  SNAP: { category: 'impacts', name: 'connector-snap' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },
  PLINK: { category: 'ui', name: 'plink' },
  CHIME: { category: 'ui', name: 'chime' },
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  RELIEF: { category: 'success', name: 'relief-settle' },
}