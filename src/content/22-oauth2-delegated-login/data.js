// src/content/22-oauth2-delegated-login/data.js
// ─────────────────────────────────────────────────────────────
// REVISI-02 2026-09-13 (lihat revisi/2026-09-13-revisi-02-provider-cases-role-layout.md):
// diganti dari provider generik "Identitas Kampus" jadi 4 provider nyata
// (Google/GitHub/Microsoft/Apple) dengan GitHub sebagai kasus utama, dan
// layout diubah dari satu sumbu vertikal jadi TIGA lane tetap:
//   - LANE_LEFT_X  — user + client (DevNotes, provider picker)
//   - AXIS_X       — browser flow / carrier (redirect → code → token)
//   - LANE_RIGHT_X — provider + API (GitHub login/consent/API)
// Semua koordinat LOCAL (origin body DEFAULT_LAYOUT_V1.body), sama pola
// dengan 18-auth/data.js & 24-cors/data.js (REVISI-05).
//
// Cerita: Adib membuka DevNotes dan memilih "Continue with GitHub".
// DevNotes hanya minta scope read:user (username + avatar). Adib login
// di GitHub, melihat izin itu, menyetujui. GitHub mengembalikan
// authorization code ke redirect URI DevNotes. DevNotes menukar code
// dengan PKCE verifier jadi access token berscope read:user. DevNotes
// TIDAK PERNAH menerima password GitHub Adib dan TIDAK bisa menulis
// repository (akses repo tetap terkunci). Google/Microsoft/Apple hanya
// tampil sebagai pilihan awal di Act 1 (kartu referensi ringkas), bukan
// empat flow paralel — lihat revisi-02 §"Cerita utama yang dipilih".
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  APP: '#38BDF8',        // DevNotes (client)
  PROVIDER: '#6366F1',   // GitHub — delegated authority
  CONSENT: '#A78BFA',    // layar consent / scope card
  CRYPTO: '#F472B6',     // PKCE challenge/verifier
  CODE: '#FBBF24',       // authorization code (sementara, sekali pakai)
  TOKEN: '#34D399',      // access token bergaris scope
  DENY: '#F43F5E',       // scope terkunci (repo write)
  SUCCESS: '#34D399',
}

// Budget durasi mengikuti storyboard 4 Act (revisi-02 §Storyboard),
// tetap 4 Act seperti versi sebelumnya (±10 + ±12 + ±14 + ±12 = 48s).
export const PHASES = [
  { id: 'pick-provider', badge: 'ACT 1 — PILIH PROVIDER, BUKAN PASSWORD', badgeColor: COLORS.APP, duration: 10.0 },
  { id: 'auth-consent', badge: 'ACT 2 — GITHUB AUTENTIKASI & MINTA CONSENT', badgeColor: COLORS.PROVIDER, duration: 12.0 },
  { id: 'code-exchange', badge: 'ACT 3 — CODE DITUKAR, BUKAN DIBACA SEBAGAI TOKEN', badgeColor: COLORS.CODE, duration: 14.0 },
  { id: 'scoped-api', badge: 'ACT 4 — API CEK SCOPE', badgeColor: COLORS.TOKEN, duration: 12.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ── Intro header — scene-ui V1 IntroHeaderMorphV1. ──
export const INTRO_CATEGORY_LABEL = 'DEV TOOLS'
export const INTRO_DOMAIN = 'DEVNOTES'
export const INTRO_TITLE_A = 'OAUTH2'
export const INTRO_TITLE_B = ' DELEGATED LOGIN'
export const INTRO_SUBTITLE = 'Provider pilih, akses dibatasi, password tetap aman'

// ═══════════════════════════════════════════════
// LAYOUT — REVISI-02: TIGA lane tetap di body local coordinate
// (body 732 x 965, lihat PortraitSceneLayoutV1.js). Margin antar-card
// dan carrier ≥36-45px (lihat revisi-02 §"Rencana layout anti-overlay").
// ═══════════════════════════════════════════════
export const LANE_LEFT_X = 132   // DevNotes (client) + provider picker/chip
export const AXIS_X = 366        // carrier corridor (redirect → code → token)
export const LANE_RIGHT_X = 596  // GitHub (provider) + GitHub API

// -- Act 1: DevNotes card + daftar 4 tombol provider (collapse ke chip) --
export const APP_Y = 140
export const REDIRECT_TRANSIT_Y = 300

// -- Act 2: GitHub card — login form lalu consent menggantikan isinya --
export const PROVIDER_Y = 430
export const CONSENT_STAMP_Y = 268 // di luar-atas card provider, bukan dilayer di atasnya

// -- Act 3: PKCE lock di lane tengah, antara provider dan API --
export const PKCE_Y = 590

// -- Act 4: GitHub API + scope terkunci (aside satu baris) + closing band --
export const RESOURCE_Y = 770
export const LOCKED_SCOPE_Y = 900
export const CLOSING_Y = 925

// -- Flow stepper 1-6 (revisi-02 §"Alur visual dan pembagian peran"),
// strip aman di atas body, sama pola dengan 24-cors/data.js --
export const FLOW_STEPPER_Y = 8
export const FLOW_NODES = [
  { n: 1, label: 'REDIRECT', physical: 'client' },
  { n: 2, label: 'LOGIN', physical: 'provider' },
  { n: 3, label: 'CONSENT', physical: 'provider' },
  { n: 4, label: 'CODE', physical: 'client' },
  { n: 5, label: 'EXCHANGE', physical: 'provider' },
  { n: 6, label: 'DATA', physical: 'client' },
]

export const APP_LABEL = 'DEVNOTES'
export const PROVIDER_LABEL = 'GITHUB'

// ═══════════════════════════════════════════════
// PROVIDERS — daftar pilihan Act 1. GitHub = kasus utama (main: true).
// Tiga lainnya hanya tombol + kartu referensi ringkas, TIDAK punya flow
// paralel sendiri (revisi-02 §"Cerita utama yang dipilih"). Warna netral
// dipakai (bukan warna resmi provider) karena logo resmi belum diaudit.
// ═══════════════════════════════════════════════
export const PROVIDERS = [
  { id: 'google', icon: 'G', label: 'Continue with Google', note: 'Google mengelola login dan consent' },
  { id: 'github', icon: '<>', label: 'Continue with GitHub', note: 'GitHub tidak memberi password ke app', main: true },
  { id: 'microsoft', icon: 'M', label: 'Continue with Microsoft', note: 'Akses bertindak atas nama user' },
  { id: 'apple', icon: '', label: 'Sign in with Apple', note: 'Apple menangani login' },
]

// ── Kasus utama: GitHub + DevNotes + Adib ──
export const GITHUB_CASE = {
  appLabel: APP_LABEL,
  providerLabel: PROVIDER_LABEL,
  scope: 'read:user',
  scopeNote: 'username & avatar',
}

export const PKCE_PAIR = { challengeMethod: 'S256' }
export const AUTH_CODE = { type: 'authorization_code' }
export const ACCESS_TOKEN = { scope: 'read:user' }

// Scope yang TIDAK diminta/diizinkan — tetap terkunci meski login berhasil
// (guardrail §3: jangan gambarkan akses repo/write sebagai efek otomatis).
export const LOCKED_SCOPES = [
  { id: 'repo', label: 'repo (write)' },
  { id: 'admin', label: 'admin:org' },
]

// ═══════════════════════════════════════════════
// CAPTIONS — tiap key dipakai lewat say(tl, time, text, y) dengan anchor Y
// per-beat (bukan CAPTION_Y statis lagi), lihat Animation.jsx.
// ═══════════════════════════════════════════════
export const CAPTIONS = {
  PICK_PROVIDER: 'Pilih provider identitas',
  GITHUB_SELECTED: 'GitHub menangani login',
  REDIRECT_TO_GITHUB: 'Redirect + state + PKCE ke GitHub',
  LOGIN_AT_GITHUB: 'Adib login di GitHub',
  PASSWORD_STAYS: 'Password tetap di GitHub',
  CONSENT_ASK: 'DevNotes minta read:user',
  RANI_APPROVES: 'Adib menyetujui izin',
  CONSENT_RECORDED: 'Izin tercatat, bukan akun penuh',
  CODE_RETURNS: 'Code kembali ke redirect URI',
  CODE_NEEDS_PROOF: 'Code perlu bukti verifier',
  PKCE_MATCH: 'Code dan verifier cocok',
  TOKEN_SCOPE: 'Token hanya read:user',
  TOKEN_TO_API: 'Token dikirim ke GitHub API',
  API_CHECK: 'GitHub API cek scope token',
  ACCESS_LOCKED: 'Akses repo tetap terkunci',
  PROFILE_RETURNED: 'Username & avatar kembali',
  TAKEAWAY: 'Izin diberikan, password tidak',
}

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// (dipakai versi sebelumnya topic ini, tidak perlu sourcing baru).
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  PLINK: { category: 'ui', name: 'plink' },
  CHIME: { category: 'ui', name: 'chime' },
  DING: { category: 'success', name: 'ding' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },

  TELEPORT: { category: 'transitions', name: 'teleport' },
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },

  SNAP: { category: 'impacts', name: 'snap' },
  LOCK: { category: 'impacts', name: 'lock' },

  SHIMMER: { category: 'success', name: 'shimmer' },
  RELIEF: { category: 'success', name: 'relief' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
