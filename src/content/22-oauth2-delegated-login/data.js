// src/content/22-oauth2-delegated-login/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/22-oauth2-delegated-login/_docs/
// OAUTH2_DELEGATED_LOGIN_PLAN.md (2026-09-12). Empat Act, scene-ui V1
// (IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1), teks
// deklaratif ≤5 kata dekat objek, tanpa emoji/tanda tanya.
// Cerita: Adib memakai Aplikasi Catatan yang butuh profil dasar dari
// Identitas Kampus. Adib tidak pernah memberi password Kampus ke
// Aplikasi Catatan — ia login di Kampus, menyetujui scope terbatas
// (profile.read), lalu aplikasi menerima authorization code yang
// ditukar (dengan PKCE verifier) menjadi access token bergaris scope.
//
// KOORDINAT LAYOUT: semua konstanta posisi di bawah adalah LOCAL
// (origin DEFAULT_LAYOUT_V1.body → 0,0), pola sama dengan 18-auth/data.js
// dan docs/standardizations/05-svg-text-guide.md § "Scene Zones V1 dan
// Local Coordinates" & 09-standar-pembuatan-konten.md §1.S.
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — lihat OAUTH2_DELEGATED_LOGIN_PLAN.md §1 (warna rencana #6366F1)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  APP: '#38BDF8',        // Aplikasi Catatan (client)
  PROVIDER: '#6366F1',   // Identitas Kampus — delegated authority
  CONSENT: '#A78BFA',    // Layar consent / scope card
  CRYPTO: '#F472B6',     // PKCE challenge/verifier
  CODE: '#FBBF24',       // Authorization code (sementara, sekali pakai)
  TOKEN: '#34D399',      // Access token bergaris scope
  DENY: '#F43F5E',       // Scope terkunci (grades.write, email.send)
  SUCCESS: '#34D399',
  WARN: '#FBBF24', // TODO: belum dirender di Animation.jsx — disiapkan untuk micro-label peringatan tambahan (mis. invalid_grant) jika dibutuhkan revisi berikutnya
}

// PHASES — 4 Act (§5 storyboard), total ±48s termasuk intro ±1,2s
export const PHASES = [
  { id: 'act1-no-password', badge: 'ACT 1 — APLIKASI TIDAK MEMINTA PASSWORD', badgeColor: COLORS.APP, duration: 10.0 },
  { id: 'act2-consent', badge: 'ACT 2 — ADIB MELIHAT IZIN YANG DIMINTA', badgeColor: COLORS.CONSENT, duration: 12.0 },
  { id: 'act3-code-vs-token', badge: 'ACT 3 — CODE BUKAN TOKEN', badgeColor: COLORS.CODE, duration: 14.0 },
  { id: 'act4-scoped-access', badge: 'ACT 4 — HANYA DATA YANG DIIZINKAN', badgeColor: COLORS.TOKEN, duration: 12.0 },
]

// Series identity — konsisten dengan 18-auth (Developer Tools), lanjutan
// prasyarat Authentication (§1 plan: "Adib dapat login di pihak identitas").
export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'OAUTH2'
export const INTRO_TITLE_B = ' DELEGATED LOGIN'
export const INTRO_SUBTITLE = 'Beri izin, bukan password'

// ── Layout — LOCAL coordinates (origin body DEFAULT_LAYOUT_V1.body),
// satu jalur vertikal x=AXIS_X. Angka canvas asli di komentar kanan
// untuk audit terhadap template zona §5 (09-standar-pembuatan-konten.md).
// Sub-zona kasar: APP/hero atas → PROVIDER domain (login+consent) tengah
// → code/token exchange → resource/profile closing. ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x

export const APP_Y = 300 - DEFAULT_LAYOUT_V1.body.y          // canvas 300: Aplikasi Catatan, kartu profile.read
export const REDIRECT_Y = 430 - DEFAULT_LAYOUT_V1.body.y      // canvas 430: tiket redirect berangkat
export const PROVIDER_Y = 560 - DEFAULT_LAYOUT_V1.body.y      // canvas 560: gedung Identitas Kampus (login)
export const CONSENT_Y = 660 - DEFAULT_LAYOUT_V1.body.y       // canvas 660: layar consent scope profile.read
export const PKCE_Y = 760 - DEFAULT_LAYOUT_V1.body.y          // canvas 760: code challenge/verifier lock
export const TOKEN_Y = 860 - DEFAULT_LAYOUT_V1.body.y         // canvas 860: token terbit, membawa scope
export const RESOURCE_Y = 960 - DEFAULT_LAYOUT_V1.body.y      // canvas 960: rak Profil API
export const LOCKED_SCOPE_Y = RESOURCE_Y + 110                // scope card terkunci (grades.write, email.send)
export const CLOSING_Y = 900                                  // local: dua cap payoff penutup

// Posisi caption per Act — LOCAL, disusun dekat objek yang sedang
// dibahas di tiap beat (lihat §1.K standar). Disesuaikan lebih presisi
// saat Animation.jsx timeline dibuat (langkah 5 execution order).
export const CAPTION_Y = [415, 555, 650, 755]

export const APP_LABEL = 'APLIKASI CATATAN'
export const PROVIDER_LABEL = 'IDENTITAS KAMPUS'

// Scope request — Act 1-2 (kartu yang diminta aplikasi, bukan seluruh akun)
export const SCOPE_REQUEST = { scope: 'profile.read', label: 'PROFILE.READ' }

// PKCE — Act 3 guardrail: Authorization Code + PKCE S256, public client
// (§6 guardrail plan: code verifier tidak dikirim di authorization request)
export const PKCE_PAIR = { challengeMethod: 'S256' }

// Authorization code — sementara, sekali pakai, BUKAN access token (§6.4).
// singleUse/short: TODO belum dirender visual terpisah, baru dijelaskan
// lewat carrierSub teks "sekali pakai" di Animation.jsx (pakai .type saja).
export const AUTH_CODE = { type: 'authorization_code', singleUse: true, short: true }

// Access token — scope terbatas, hasil tukar code + verifier (§6.3)
export const ACCESS_TOKEN = { scope: SCOPE_REQUEST.scope }

// Scope lain yang TIDAK diminta/diizinkan — tetap terkunci di Act 4 (§5 Act4)
export const LOCKED_SCOPES = [
  { id: 'grades', label: 'GRADES.WRITE' },
  { id: 'email', label: 'EMAIL.SEND' },
]

// Teks lokal per beat — deklaratif, ≤5 kata, tanpa emoji/tanda tanya,
// diambil langsung dari kolom "Teks lokal" storyboard §5 plan.
export const CAPTIONS = {
  // Act 1 — Aplikasi Tidak Meminta Password
  APP_NEEDS_PROFILE: 'Catatan butuh profil dasar',
  PASSWORD_REJECTED: 'Password bukan milik aplikasi',
  REDIRECT_TO_PROVIDER: 'Kampus menangani login',
  PASSWORD_STAYS: 'Password tetap di Kampus',

  // Act 2 — Adib Melihat Izin yang Diminta
  LOGIN_AT_PROVIDER: 'Login pada pihak tepat',
  SCOPE_LIMITED: 'Aplikasi minta scope terbatas',
  ADIB_APPROVES: 'Adib memberi persetujuan',
  CONSENT_RECORDED: 'Izin tercatat',

  // Act 3 — Code Bukan Token
  CODE_RETURNS: 'Code kembali ke aplikasi',
  CODE_NEEDS_PROOF: 'Code perlu bukti pasangan',
  CHALLENGE_MATCHES: 'Challenge dan verifier cocok',
  TOKEN_CARRIES_SCOPE: 'Token membawa scope',

  // Act 4 — Hanya Data yang Diizinkan
  TOKEN_TO_API: 'Token menuju Profil API',
  OTHER_DATA_LOCKED: 'Data lain tetap terkunci',
  SCOPE_CHECKED: 'Scope diperiksa',
  PROFILE_RETURNED: 'Profil dasar kembali',
}

// SFX — nama yang sudah diverifikasi tersedia di public/audio/* lewat
// topic lain (17-rest-api, 18-auth), sesuai
// docs/standardizations/08-audio-sfx-generation.md §2.
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },

  LOCK: { category: 'impacts', name: 'lock' },
  SNAP: { category: 'impacts', name: 'connector-snap' },

  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  RELIEF: { category: 'success', name: 'relief-settle' },

  PLINK: { category: 'ui', name: 'plink' },
  CHIME: { category: 'ui', name: 'chime' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
}
