// src/content/24-cors/data.js
// ─────────────────────────────────────────────────────────────
// REVISI-05 2026-09-13 (lihat revisi/2026-09-13-revisi-05-browser-server-flow-layout.md):
// layout dirombak dari satu sumbu vertikal jadi dua panel: BROWSER di
// zona atas, SERVER di zona bawah, dipisah divider. Benang perjalanan
// (request/response) dipisah jadi dua lane tetap (kanan = turun ke
// server, kiri = naik ke browser) supaya tidak pernah bertumpuk dengan
// kartu konten. Koordinat SEMUA local coordinate relatif body (0,0 =
// body.x/body.y dari DEFAULT_LAYOUT_V1), bukan koordinat canvas absolut.
//
// Cerita tidak berubah dari rebuild sebelumnya: app.example minta data
// ke api.example. Origin beda → browser jadi gerbang. Request non-simple
// (POST + Authorization) memicu preflight OPTIONS lebih dulu. API
// menjawab lewat Allow-Origin/Allow-Methods/Allow-Headers. Kalau cocok,
// browser baru mengizinkan request asli lanjut DAN membuka hasilnya
// untuk JS — bukan API yang "menolak menerima", tapi browser yang
// membatasi pembacaan respons.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',   // Sky — app.example, request asli, response data
  GATE: '#FB923C',     // Orange (warna rencana topic) — browser gate, preflight OPTIONS
  SERVICE: '#FBBF24',  // Amber — api.example, policy shelf
  SUCCESS: '#34D399',  // Green — izin cocok, response header, data tiba
  DENY: '#F87171',     // Red — method/header ditolak, guardrail wildcard
}

// Budget durasi mengikuti storyboard 4 Act (±9 + ±11 + ±12 + ±12 = 44 detik).
// Badge & warna per Act dipakai ActBadgeNavigatorV1.
export const PHASES = [
  { id: 'origin-gate', badge: 'ACT 1 — ORIGIN BEDA, BROWSER JADI GERBANG', badgeColor: COLORS.CLIENT, duration: 9.0 },
  { id: 'preflight-ask', badge: 'ACT 2 — BROWSER BERTANYA LEBIH DULU', badgeColor: COLORS.GATE, duration: 11.0 },
  { id: 'policy-check', badge: 'ACT 3 — API MENJAWAB BATAS IZIN', badgeColor: COLORS.SERVICE, duration: 12.0 },
  { id: 'actual-response', badge: 'ACT 4 — BROWSER MEMBUKA GERBANG DATA', badgeColor: COLORS.SUCCESS, duration: 12.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ── Intro header — scene-ui V1 IntroHeaderMorphV1. ──
export const INTRO_CATEGORY_LABEL = 'DEV TOOLS'
export const INTRO_DOMAIN = 'APP.EXAMPLE'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE_A = 'CORS'
export const INTRO_TITLE_B = ' CHECK'
export const INTRO_SUBTITLE = 'Origin browser, izin server, jawaban aman'

// ═══════════════════════════════════════════════
// LAYOUT — REVISI-05: dua panel (browser atas, server bawah) di body
// local coordinate (body 732 x 965, lihat PortraitSceneLayoutV1.js).
// Divider menyisakan jarak aman ≥44px ke panel manapun (lihat aturan
// jarak minimum di revisi-05 §"Kontrak visibilitas dan anti-overlay").
// ═══════════════════════════════════════════════
export const AXIS_X = 366

// -- Panel browser (zona atas): app.example + browser gate --
export const BROWSER_PANEL = { yTop: 20, yBottom: 360 }
export const APP_Y = 108
export const GATE_Y = 282
export const CAPTION_SLOT_BROWSER_Y = 372 // REVISI: diturunkan dari 336 — dulu numpuk ke ring/label BROWSER GATE (gate visual ±218-346)

// -- Divider + corridor (benang perjalanan), gap ≥88px total (44+44) --
export const DIVIDER_Y = Math.round((BROWSER_PANEL.yBottom + 460) / 2) // ≈410, garis tengah gap
export const CORRIDOR = { yTop: BROWSER_PANEL.yBottom, yBottom: 460 }

// -- Panel server (zona bawah): api.example + policy shelf --
export const SERVER_PANEL = { yTop: 460, yBottom: 940 }
export const API_Y = 560
export const POLICY_Y = 726
export const CAPTION_SLOT_SERVER_Y = 900

// -- Guardrail aside — "kecil di kanan server", bukan di bawah policy
// supaya tidak bertabrakan dengan ticket response/caption slot server --
export const GUARDRAIL_X = AXIS_X + 196
export const GUARDRAIL_Y = POLICY_Y

// -- Dua lane benang tetap: request selalu turun di kanan, response
// selalu naik di kiri. Offset dihitung supaya tiket (lebar ramping
// 160-170px) TIDAK PERNAH menyentuh kartu app/api/policy (lebar 260-300px,
// setengah-lebar maks 150px) bahkan saat tiket berhenti sejajar node —
// margin sisa ±20-35px. Tiket TIDAK PERNAH pindah lane atau teleport ke
// sumbu tengah; node fisik (app/gate/api/policy) di AXIS_X yang menyala
// sebagai tanda terima saat tiket tiba di sisi lane. --
export const LANE_REQUEST_X = AXIS_X + 250  // browser -> server (turun)
export const LANE_RESPONSE_X = AXIS_X - 250 // server -> browser (naik)

export const FLOW_WAYPOINTS = {
  P0_APP: APP_Y + 62,      // titik lahir tiket, di bawah app.example
  P2_GATE: GATE_Y,         // level gate (kedua lane transit lewat sini)
  P4_API_DOOR: API_Y - 58, // ambang pintu API (kedua lane transit lewat sini)
  P5_POLICY: POLICY_Y,     // policy shelf / processor
}

export const APP_LABEL = 'APP.EXAMPLE'
export const GATE_LABEL = 'BROWSER GATE'
export const API_LABEL = 'API.EXAMPLE'
export const POLICY_LABEL = 'POLICY SHELF'
export const BROWSER_ZONE_LABEL = 'BROWSER / CLIENT'
export const SERVER_ZONE_LABEL = 'SERVER / API'

// ── Node flow bernomor 1-6 (revisi-05 §"Flow chart benang"). Direalisasikan
// sebagai mini-stepper di strip aman atas body (bukan badge menempel di
// app/gate/api) supaya TIDAK menambah risiko overlap baru di panel yang
// sudah padat; stepper tetap menunjukkan jejak (node lewat meredup, node
// aktif menyala) dan sinkron dengan node fisik lewat activeNodeIndex. ──
export const FLOW_STEPPER_Y = 6
export const FLOW_NODES = [
  { n: 1, label: 'FETCH', physical: 'app' },
  { n: 2, label: 'HOLD', physical: 'gate' },
  { n: 3, label: 'PREFLIGHT', physical: 'api' },
  { n: 4, label: 'MATCH', physical: 'gate' },
  { n: 5, label: 'REQUEST', physical: 'api' },
  { n: 6, label: 'OPEN', physical: 'app' },
]

// ═══════════════════════════════════════════════
// REQUESTS — satu konfigurasi per jenis tiket. 'INITIAL' dan 'ACTUAL'
// merepresentasikan REQUEST YANG SAMA (POST + Authorization) — INITIAL
// berhenti di gate Act 1, ACTUAL melanjutkan perjalanan di Act 4 setelah
// izin cocok. Semua tiket request lewat LANE_REQUEST_X, semua tiket
// response lewat LANE_RESPONSE_X (lihat blok LAYOUT di atas).
// ═══════════════════════════════════════════════
export const REQUESTS = {
  INITIAL: {
    method: 'POST', path: '/data', tag: 'Authorization: Bearer token',
    color: 'CLIENT', caption: 'Browser cek origin berbeda',
  },
  PREFLIGHT: {
    method: 'OPTIONS', path: '/data',
    lines: [
      'Origin: app.example',
      'Access-Control-Request-Method: POST',
      'Access-Control-Request-Headers: authorization',
    ],
    color: 'GATE', caption: 'Browser tanya sebelum POST',
  },
  PREFLIGHT_RESPONSE: {
    lines: [
      'Access-Control-Allow-Origin: app.example',
      'Access-Control-Allow-Methods: GET, POST',
      'Access-Control-Allow-Headers: authorization',
    ],
    color: 'SUCCESS', caption: 'Server kirim header izin',
  },
  ACTUAL: {
    method: 'POST', path: '/data', tag: 'Authorization: Bearer token',
    color: 'CLIENT', caption: 'Browser cocokkan policy',
  },
  ACTUAL_RESPONSE: {
    label: 'Data diterima aplikasi',
    color: 'SUCCESS', caption: 'Browser buka data untuk JS',
  },
}

// Guardrail aside (Act 3) — perbandingan singkat method diizinkan vs
// ditolak, TIDAK memicu request sungguhan, cuma chip statis di sisi
// kanan server (GUARDRAIL_X/GUARDRAIL_Y di atas), jauh dari lane response.
export const GUARDRAIL_ALLOWED = { label: 'POST diizinkan', ok: true }
export const GUARDRAIL_BLOCKED = { label: 'PUT tidak diizinkan', ok: false }
export const WILDCARD_GUARD_TEXT = 'CORS bukan auth API'
export const NOT_AUTH_TEXT = 'API tetap wajib autentikasi sendiri'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// (sudah dipakai topic lain seperti 17-rest-api, tidak perlu sourcing baru)
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  TICK: { category: 'ui', name: 'tick' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },

  LOCK: { category: 'impacts', name: 'lock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },

  MATERIALIZE: { category: 'sfx', name: 'materialize' },
}
