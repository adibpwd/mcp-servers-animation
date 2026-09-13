// src/content/18-auth/data.js
// ─────────────────────────────────────────────────────────────
// Rebuild sesuai src/content/18-auth/_docs/AUTH_PLAN.md (2026-09-12).
// Empat Act, scene-ui V1 (IntroHeaderMorphV1 + ActBadgeNavigatorV1 +
// ContentBodyV1), teks deklaratif ≤5 kata dekat objek.
// Cerita: Adib membawa paket ke Gedung Arsip. Alamat/paket benar
// (callback dari 17-rest-api), tapi identitas harus dibuktikan dulu
// (authentication) sebelum izin akses lemari rahasia diberikan
// (authorization) — dua gerbang yang terpisah.
//
// KOORDINAT LAYOUT: semua konstanta posisi di bawah adalah LOCAL
// (origin DEFAULT_LAYOUT_V1.body = 44,235 → 0,0). ContentBodyV1 yang
// menerapkan translate(44,235), jadi angka di sini tidak pernah
// koordinat canvas absolut (lihat docs/standardizations/05-svg-layout-asset-pipeline.md
// § "Scene Zones V1 dan Local Coordinates" & 09 §1.S).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — lihat AUTH_PLAN.md §3.1
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',    // Adib / bukti identitas
  CLIENT_DIM: '#0C4A6E', // bayangan klien (rambut Adib)
  SYSTEM: '#22D3EE',    // Gedung / jalur sistem
  PROCESS: '#FB923C',   // Petugas / proses pemeriksaan
  CRYPTO: '#A78BFA',    // Hash / signature
  SUCCESS: '#34D399',   // Valid / diizinkan
  DENY: '#F43F5E',      // Bocor / ditolak
  WARN: '#FBBF24',      // Peringatan
}

// PHASES — 4 Act (§9), total ±50s termasuk intro ±1,2s (§11)
export const PHASES = [
  { id: 'act1-arrival', badge: 'ACT 1 — PAKET TEPAT, ORANG BELUM TERBUKTI', badgeColor: COLORS.CLIENT, duration: 9.0 },
  { id: 'act2-hash', badge: 'ACT 2 — PASSWORD TIDAK DISIMPAN UTUH', badgeColor: COLORS.CRYPTO, duration: 13.0 },
  { id: 'act3-branch', badge: 'ACT 3 — BUKTI LOGIN BISA DUA BENTUK', badgeColor: COLORS.SYSTEM, duration: 15.0 },
  { id: 'act4-access', badge: 'ACT 4 — IDENTITAS VALID, AKSES TETAP DIPILIH', badgeColor: COLORS.SUCCESS, duration: 12.0 },
]

// Series identity — konsisten dengan 17-rest-api (Developer Tools).
// Brand domain ADIB-DEV.COM di-split jadi konstanta terpisah supaya bisa
// diwarnai beda (cyan SYSTEM) dari label kategori (MUTED) saat render
// intro/header — pola sama seperti 17-rest-api (Revisi-08 Bug F).
export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'AUTH'
export const INTRO_TITLE_B = 'ENTICATION'
export const INTRO_SUBTITLE = 'Membuktikan siapa, mengatur akses'

// ── Layout — LOCAL coordinates (origin body 44,235), satu jalur vertikal
// x=AXIS_X mengikuti sub-zona body scene-ui V1 (transit 241–375,
// service 375–785, closing 785–965). Angka canvas asli ditulis di
// komentar kanan supaya audit §7 AUTH_PLAN mudah diverifikasi. ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x     // local 366 (canvas 410)

export const GATE_Y = 300 - DEFAULT_LAYOUT_V1.body.y     // local 65 (canvas 300): gerbang Gedung Arsip, Act 1
export const KIOSK_Y = 520 - DEFAULT_LAYOUT_V1.body.y    // local 285 (canvas 520): kios login + mesin hash
export const BRANCH_Y = 610 - DEFAULT_LAYOUT_V1.body.y   // local 375 (canvas 610): titik cabang session/token
export const BRANCH_CARD_Y = 700 - DEFAULT_LAYOUT_V1.body.y // local 465 (canvas 700): kartu session/token
export const SESSION_PATH_X = 250 - DEFAULT_LAYOUT_V1.body.x // local 206 (canvas 250): jalur kiri
export const TOKEN_PATH_X = 570 - DEFAULT_LAYOUT_V1.body.x   // local 526 (canvas 570): jalur kanan
export const GUARD_Y = 760 - DEFAULT_LAYOUT_V1.body.y    // local 525 (canvas 760): penjaga/resepsionis
export const LOCKER_Y = 940 - DEFAULT_LAYOUT_V1.body.y   // local 705 (canvas 940): dua lemari
export const IZIN_CAP_Y = LOCKER_Y + 125                 // local 830: cap izin per lemari
export const CLOSING_Y = 900                             // local 900 (canvas 1135): dua cap payoff penutup

// Posisi caption per Act — LOCAL. Canvas asli (sebelum konversi):
// [670, 840, 892, 1095] → dikurangi body.y 235; Act 4 digeser ke 842
// (607 local) supaya chip mengambang di atas lemari, tidak menabrak
// cap izin (830) maupun dasar body (965).
export const CAPTION_Y = [435, 605, 657, 607]

export const BUILDING_LABEL = 'GEDUNG ARSIP'
export const KIOSK_LABEL = 'LOKET LOGIN'

// Adib — satu sumber kebenaran profil (identitas + role untuk authorization)
export const ADIB = { name: 'Adib', role: 'reader' }

// Credential — dipakai Act 2, plaintext vs hash+salt
export const CREDENTIAL = { username: 'adib', password: 'p4ketAman!' }

// Hash record — pola visual, bukan algoritma nyata (§12 guardrail: tidak
// dipulihkan menjadi password, hanya penyederhanaan visual verifier aman)
export const HASH_RECORD = { salt: 'x9Q2', hash: 'f3a7…c9d1' }

// Session vs Token — dua cabang bukti login (§4, §9 Act 3)
export const SESSION = { id: 'SESS-8841', store: 'server' }
export const TOKEN_CLAIMS = { user: ADIB.name, role: ADIB.role, exp: '15:00' }

// Authorization policy — dua lemari, hanya reader.archive.read yang lolos
// ke lemari umum; lemari rahasia butuh izin khusus yang Adib TIDAK punya.
export const ACCESS_POLICY = {
  role: ADIB.role,
  required: 'archive.read',
  lockers: [
    { id: 'umum', label: 'LEMARI UMUM', requiredPermission: 'archive.read', allowed: true },
    { id: 'rahasia', label: 'LEMARI RAHASIA', requiredPermission: 'archive.admin', allowed: false },
  ],
}

// Teks lokal per beat — deklaratif, ≤5 kata, tanpa emoji/tanda tanya (§3.2)
export const CAPTIONS = {
  ARRIVAL: 'Tujuan sudah tepat',
  BLOCKED: 'Identitas belum terbukti',
  POINT_KIOSK: 'Buktikan pemilik paket',
  AT_KIOSK: 'Authentication memeriksa siapa',

  PLAINTEXT_WARN: 'Password asli berbahaya',
  LEAK: 'Buku bocor',
  HASH_ONE_WAY: 'Hash tidak dibalik',
  HASH_MATCH: 'Hash cocok, Adib valid',

  BRANCH_SETUP: 'Dua cara mengingat login',
  SESSION_CHECK: 'Session cek server',
  TOKEN_CHECK: 'Token membawa bukti',
  JWT_NOTE: 'JWT signed, bukan encrypted',
  BRANCH_MERGE: 'Trade-off berbeda',

  GENERAL_LOCKER: 'Login bukan semua akses',
  PERMISSION_CHECK: 'Izin diperiksa terpisah',
  IDENTITY_VS_PERMISSION: 'Siapa berbeda dari boleh',
  ACCESS_GRANTED: 'Akses sesuai izin',

  STATUS_401: '401: belum/invalid login',
  STATUS_403: '403: login valid, izin kurang',
}

// SFX — hanya nama yang sudah dipakai/terverifikasi tersedia di
// public/audio/* lewat topic lain (17-rest-api), sesuai
// docs/standardizations/06-audio-sfx.md §2.
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
}
