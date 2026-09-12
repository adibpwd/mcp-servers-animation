// src/content/23-https-tls/data.js
// ─────────────────────────────────────────────────────────────
// Build sesuai _docs/HTTPS_TLS_PLAN.md (2026-09-12). Empat Act,
// scene-ui V1 (IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1),
// teks deklaratif ≤5 kata dekat objek.
// Cerita: paket HTTP Adib melintas lewat jalan publik terbuka; pengintip
// bisa membaca isinya. Browse memilih HTTPS: jalan berubah menjadi
// terowongan TLS — server diperiksa sertifikatnya, kedua sisi membentuk
// kunci sesi, lalu request asli melewati terowongan terkunci (isi aman,
// metadata bentuk/arah tetap terlihat).
//
// KOORDINAT LAYOUT: semua konstanta posisi adalah LOCAL (origin
// DEFAULT_LAYOUT_V1.body = 44,235 → 0,0). ContentBodyV1 menerapkan
// translate(44,235), jadi angka di sini bukan koordinat canvas absolut
// (lih. docs/standardizations/05-svg-text-guide.md § Scene Zones V1 &
// 09 §1.S). Cerita di-layout horizontal: Browser (kiri) — Transit
// publik (tengah) — Server (kanan).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — lihat HTTPS_TLS_PLAN.md §5
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',    // Browser / Adib
  SYSTEM: '#22D3EE',    // Jalan publik → terowongan TLS
  CRYPTO: '#A78BFA',    // Sertifikat / CA / tanda tangan
  PROCESS: '#FB923C',   // Server / operasi pembuka
  SUCCESS: '#34D399',   // Terverifikasi / terlindungi
  DENY: '#F43F5E',      // Pengintip / ditolak
  WARN: '#FBBF24',      // Peringatan plaintext
}

// PHASES — 4 Act (§3), total ±46s termasuk intro ±1,2s
export const PHASES = [
  { id: 'act1-open-road', badge: 'ACT 1 — HTTP LEWAT JALAN UMUM', badgeColor: COLORS.DENY, duration: 9.0 },
  { id: 'act2-cert', badge: 'ACT 2 — SERVER DIPERIKSA, TIDAK LANGSUNG DIPERCAYA', badgeColor: COLORS.CRYPTO, duration: 12.0 },
  { id: 'act3-key', badge: 'ACT 3 — KUNCI SESI DIBENTUK BERSAMA', badgeColor: COLORS.SYSTEM, duration: 13.0 },
  { id: 'act4-tunnel', badge: 'ACT 4 — HTTP KINI DI DALAM TEROWONGAN', badgeColor: COLORS.SUCCESS, duration: 12.0 },
]

// Series identity — konsisten dengan 11-tailscale, 13-dns-explained & 14-http-request-response (Networking).
// Brand domain ADIB-DEV.COM di-split jadi konstanta terpisah supaya bisa
// diwarnai beda (cyan SYSTEM) dari label kategori (MUTED) saat render
// intro/header (Plan 15 — Series Identity Parity).
export const INTRO_CATEGORY_LABEL = 'NETWORKING'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'HTTPS'
export const INTRO_TITLE_B = ' · TLS'
export const INTRO_SUBTITLE = 'HTTP dalam terowongan terkunci'

// ── Layout — LOCAL coordinates (origin body 44,235), cerita horizontal:
// Rantai sertifikat (Act 2) di ZONA ATAS (y≈70–180), lalu baris aktor
// Browser (kiri) — Transit publik (tengah) — Server (kanan) di y≈195–445,
// caption di zona kosong bawah (y≈560). Angka canvas asli ditulis di
// komentar kanan untuk memudahkan audit. ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x     // local 366 (canvas 410): sumbu tengah transit (referensi)

export const BROWSER_X = 230 - DEFAULT_LAYOUT_V1.body.x  // local 186 (canvas 230): pusat Browser (kolom 56–316)
export const BROWSER_Y = 555 - DEFAULT_LAYOUT_V1.body.y  // local 320 (canvas 555): tengah Browser (top 195, bottom 445)
export const SERVER_X = 590 - DEFAULT_LAYOUT_V1.body.x   // local 546 (canvas 590): pusat Server (kolom 426–666)
export const SERVER_Y = 555 - DEFAULT_LAYOUT_V1.body.y   // local 320 (canvas 555): tengah Server (top 195, bottom 445)

export const ROAD_Y = 555 - DEFAULT_LAYOUT_V1.body.y     // local 320 (canvas 555): jalan/terowongan antar Browser→Server
export const ROAD_L = 364 - DEFAULT_LAYOUT_V1.body.x     // local 320 (canvas 364): ujung kiri transit (di bibir kanan Browser)
export const ROAD_R = 460 - DEFAULT_LAYOUT_V1.body.x     // local 416 (canvas 460): ujung kanan transit (bibir kiri Server)

// Tube terowongan TLS + jalur travel — TUBE lebih lebar dari gap (110px) dan
// menempel di muka kedua panel ("jembatan"), digambar PALING ATAS di body
// supaya tidak tertutup Server/kartu HTTP. Travel paket/kapsul dibatasi agar
// tetap di dalam tube (revisi-01: bridge tidak terlihat).
export const TUNNEL_HALF = 40                                    // setengah tinggi tube (y) → 280–360
export const TUNNEL_L = 304 - DEFAULT_LAYOUT_V1.body.x           // local 260 (canvas 304): ujung kiri tube (di muka Browser)
export const TUNNEL_R = 514 - DEFAULT_LAYOUT_V1.body.x           // local 470 (canvas 514): ujung kanan tube (di muka Server)
export const PKT_START = 358 - DEFAULT_LAYOUT_V1.body.x          // local 314 (canvas 358): awal travel paket/kapsul
export const PKT_END = 446 - DEFAULT_LAYOUT_V1.body.x            // local 402 (canvas 446): akhir travel paket/kapsul

export const EAVE_X = 412 - DEFAULT_LAYOUT_V1.body.x     // local 368 (canvas 412): pengintip di kolom transit
export const EAVE_Y = 485 - DEFAULT_LAYOUT_V1.body.y     // local 250 (canvas 485): pengintip di ATAS jalan
export const IMPOSTOR_X = 410 - DEFAULT_LAYOUT_V1.body.x // local 366 (canvas 410): kartu server palsu (tengah transit)
export const IMPOSTOR_Y = 640 - DEFAULT_LAYOUT_V1.body.y // local 405 (canvas 640): di kolom transit, bawah jalan

// Rantai sertifikat — Act 2, baris tiga kartu melintang di ZONA ATAS
export const ROOT_CA_X = 156 - DEFAULT_LAYOUT_V1.body.x  // local 112 (canvas 156): Root CA
export const INTER_X = 366 - DEFAULT_LAYOUT_V1.body.x    // local 322 (canvas 366): Intermediate
export const CERT_X = 580 - DEFAULT_LAYOUT_V1.body.x     // local 536 (canvas 580): Sertifikat server
export const CERT_CARD_Y = 360 - DEFAULT_LAYOUT_V1.body.y // local 125 (canvas 360): tengah kartu (top 70, bottom 180)

// Kunci sesi — Act 3, muncul di pojok dalam tiap panel
export const KEY_BROWSER_X = BROWSER_X - 78
export const KEY_BROWSER_Y = BROWSER_Y + 96
export const KEY_SERVER_X = SERVER_X + 90
export const KEY_SERVER_Y = BROWSER_Y + 96

// Posisi caption per Act — strip lebar pada zona kosong di bawah aktor
export const CAPTION_Y = [560, 560, 560, 560]
export const CLOSING_Y = 790

export const BROWSER_URL = 'adib-dev.com'
export const REQUEST_TEXT = 'GET /profile'
export const CERT_DOMAIN = 'adib-dev.com'

// Ingredient kunci — bahan publik yang dilempar antar sisi (bukan kunci utuh)
export const INGREDIENT_A = 'bahan A'
export const INGREDIENT_B = 'bahan B'
export const FAKE_KEY_LABEL = 'KUNCI'

// Teks lokal per beat — deklaratif, ≤5 kata, tanpa emoji/tanda tanya (§3.2)
export const CAPTIONS = {
  HTTP_OPEN: 'HTTP lewat jalan umum',
  EAVES_OPEN: 'Isi mudah diintip',
  CHOOSE_HTTPS: 'Browser memilih HTTPS',
  SAFE_START: 'Percakapan aman dimulai',

  CERT_SEND: 'Server mengirim sertifikat',
  NAME_MUST_MATCH: 'Nama harus cocok',
  SIGN_TRUSTED: 'Tanda tangan dipercaya',
  IMPOSTOR_X: 'Sertifikat palsu ditolak',
  SERVER_VERIFIED: 'Server terverifikasi',

  TWO_INGREDIENTS: 'Dua bahan rahasia',
  KEY_NOT_SENT: 'Kunci tidak dikirim utuh',
  SHARED_SECRET: 'Rahasia bersama terbentuk',
  TUNNEL_READY: 'Terowongan siap dipakai',

  REQUEST_PACKED: 'Request masuk kapsul',
  OUTER_ONLY: 'Penyerang lihat paket luar',
  PROTECTED: 'Isi dan perubahan aman',
  SERVER_READS: 'Server baca request asli',
}

// SFX — hanya nama yang sudah dipakai/terverifikasi tersedia di
// public/audio/* lewat topic lain (18-auth, 17-rest-api), sesuai
// docs/standardizations/08-audio-sfx-generation.md §2.
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

  // Ditambahkan revisi-01 (2026-09-12) — penebalan SFX coverage,
  // lihat revisi/2026-09-12-revisi-01.md §4. Semua reuse asset existing.
  // MATERIALIZE & ERROR diganti assetnya di revisi-02 (terlalu pelan di
  // pengukuran ffmpeg volumedetect — lih. revisi/2026-09-12-revisi-02.md §1/§3),
  // ERROR_BEEP diganti jadi CRITICAL_ALERT (source lama 5.5s, kepanjangan).
  MATERIALIZE: { category: 'success', name: 'shimmer' },
  PLINK: { category: 'ui', name: 'plink' },
  CHIME: { category: 'ui', name: 'chime' },
  ERROR: { category: 'impacts', name: 'connector-snap' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },
  BOUNCE: { category: 'ui', name: 'bounce' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  // Ditambahkan revisi-02 — menutup 2 motion yang di-defer revisi-01
  // (lih. revisi/2026-09-12-revisi-02.md §4).
  SHIFT: { category: 'ui', name: 'beep-2' },
}