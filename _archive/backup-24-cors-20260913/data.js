// src/content/24-cors/data.js (repo dobel — hidup)
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/24-cors/_docs/CORS_PLAN.md (2026-09-12).
// Empat Act, scene-ui V1, koordinat LOCAL, sumbu vertikal AXIS_X.
// Cerita: JS di app.example meminta data api.example — browser menjadi
// gate: request non-simple memicu OPTIONS preflight — API mengirim
// policy izin (Allow-Methods/Headers/Origin) — browser membandingkan
// — hanya bila cocok, browser membuka gate & JS boleh membaca respons.
// Tanpa protagonis nama (fokus konsep) — port tradisi seri, brand
// ADIB-DEV.COM tetap tampil di intro.
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat plan § Checklist).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// ── Palet — plan §1 warna #FB923C (CORS) ──
export const COLORS = {
  BG:      '#070913',
  PANEL:   '#0F172A',
  BORDER:  '#334155',
  TEXT:    '#E2E8F0',
  MUTED:   '#94A3B8',

  CORS:     '#FB923C',   // browser gate — aktor utama
  ORIGIN:   '#F472B6',   // app.example (origin pengirim)
  API:      '#38BDF8',   // api.example (origin tujuan)
  PREFLIGHT:'#FBBF24',   // OPTIONS preflight
  POLICY:   '#A78BFA',   // policy shelf izin API
  ALLOW:    '#34D399',   // izin cocok — gate buka
  DENY:     '#F43F5E',   // izin tak cocok — tak terbaca
  SYSTEM:   '#22D3EE',   // brand kontrak — ADIB-DEV.COM
}

// ── PHASES — 4 Act (±44 detik, intro 1,2s) ──
export const PHASES = [
  { id: 'act1-origin',   badge: 'ACT 1 — ORIGIN BERBEDA, ATURAN BERBEDA',   badgeColor: COLORS.ORIGIN, duration: 9.0 },
  { id: 'act2-preflight',badge: 'ACT 2 — BROWSER BERTANYA DULU PREFLIGHT',  badgeColor: COLORS.PREFLIGHT, duration: 11.0 },
  { id: 'act3-policy',   badge: 'ACT 3 — API MENJAWAB BATAS IZIN',           badgeColor: COLORS.POLICY, duration: 13.3 },
  { id: 'act4-read',     badge: 'ACT 4 — BROWSER YANG MEMBATASI BACA',       badgeColor: COLORS.ALLOW, duration: 11.5 },
]

// ── Intro — brand kontrak (scene-ui V1) ──
export const INTRO_CATEGORY_LABEL = 'DEVELOPER TOOLS'
export const INTRO_DOMAIN        = 'ADIB-DEV.COM'
export const INTRO_TITLE_A       = 'CORS'
export const INTRO_TITLE_B       = 'Explained'
export const INTRO_SUBTITLE      = 'Browser penjaga izin lintas origin'

// ── Koordinat LOCAL (origin DEFAULT_LAYOUT_V1.body: x=44, y=235, w=732, h=965) ──
// Revisi-04 (2026-09-13): koordinat lama pakai range 0-1340 (asumsi full
// canvas), padahal ContentBodyV1 sudah translate ke body.y=235, jadi canvas
// aktual = body.y + local. Nilai lama (POLICY_Y=980, RESPONS_Y=1240,
// CAPTION_Y=1320, dst) menghasilkan canvas Y sampai 1555 — jauh di luar
// viewBox 820x1340, makanya kartu policy/respons/caption tidak pernah
// terlihat. Semua nilai di bawah di-desain ulang supaya tetap dalam local
// 0-965 (lihat revisi/2026-09-13-revisi-04-fix-root-cause-invisible.md).
export const AXIS_X = 366

export const APP_Y      = 70     // kartu app.example — origin pengirim
export const RESPONS_Y  = 190    // respons melewati gate kembali ke app
export const CLOSING_Y  = 240    // caption closing kecil "CORS bukan auth"
export const GATE_Y     = 340    // browser gate — penjaga
export const ACTUAL_X   = AXIS_X - 160  // kartu actual request — di samping gate (ditahan/berangkat)
export const ACTUAL_Y   = GATE_Y        // sejajar gate, offset X agar tidak tumpang tindih jalur utama
export const PREFLIGHT_Y= 480    // preflight OPTIONS berangkat dari gate menuju API
export const API_Y      = 620    // kartu api.example — origin tujuan
export const POLICY_Y   = 760    // policy shelf — API kirim izin
export const CAPTION_Y  = 900    // caption bar deklaratif, dekat batas bawah body (965)

// ── Label dekat objek ──
export const APP_LABEL    = 'app.example'
export const API_LABEL    = 'api.example'
export const GATE_LABEL   = 'GATE BROWSER'
export const PREFLIGHT_LABEL = 'preflight'
export const POLICY_LABEL = 'policy izin'
export const ACTUAL_LABEL = 'actual request'
export const METHOD_POST  = 'POST'
export const METHOD_OPT   = 'OPTIONS'

export const APP_URL    = 'https://app.example'
export const API_URL    = 'https://api.example'
export const ORIGIN_APP = 'Origin: app.example'
export const AUTH_LABEL = 'Authorization: Bearer ...'

// ── CAPTIONS — deklaratif ≤5 kata, dekat objek ──
// Revisi-03 (2026-09-13): key disamakan PERSIS dengan pemanggilan
// CAPTIONS.* di Animation.jsx (lihat revisi/2026-09-13-revisi-02
// -audit-plan-vs-eksekusi.md §3). Sebelumnya 16/18 caption tidak match
// key di sini sehingga tampil `undefined` saat runtime. WILDCARD_GUARD
// baru ditambahkan untuk merepresentasikan guardrail §4 poin 5 plan
// (wildcard tidak boleh dipasangkan dengan credential) yang sebelumnya
// tidak punya representasi visual sama sekali.
export const CAPTIONS = {
  APP_START:       'App meminta data',
  ORIGIN_DIFF:     'Origin berbeda',
  TRIP_KNOWN:      'Aturan beda',
  GATE_UP:         'Browser menjadi gate',
  NEED_PERMISSION: 'Request perlu izin',
  PREFLIGHT_OFF:   'Preflight berangkat',
  CARRIES:         'OPTIONS + origin',
  API_READS:       'API membaca preflight',
  POLICY_OPEN:     'Policy izin dibuka',
  CHECK_METHOD:    'Browser membandingkan',
  MISMATCH:        'Tak cocok — tak terbaca',
  ALLOWED_HEADER:  'Allow cocok',
  MATCH_PASS:      'Method & header cocok',
  WILDCARD_GUARD:  'Wildcard + credential dilarang',
  ACTUAL_OFF:      'Request asli lanjut',
  RESP_IN:         'Respons dibaca',
  GATE_OPEN:       'Gate terbuka untuk JS',
  DATA_READY:      'Data siap dibaca',
  CLOSING:         'CORS bukan auth API',
}

// ── SFX_MAP — pemetaan efek suara (kontrak seri) ──
// Revisi-01 (2026-09-13): loudness diukur via ffmpeg volumedetect sebelum
// wiring (lihat revisi/2026-09-13-revisi-01-audio-playful.md §4-§5).
// LIGHT_SWOOSH menggantikan WHOOSH lama sebagai cue travel utama karena
// transitions/whoosh.wav terlalu pelan (mean -39.9dB) dibanding baseline
// (~-21dB). POLICY_SCAN sengaja memakai ui/tick, bukan sfx/scan.wav —
// sfx/scan.wav (mean -30.8dB) sama pelannya dengan sfx/materialize.wav
// (-32.0dB) yang sudah ditolak plan; ui/tick (-21.1dB) sejalan baseline.
export const SFX_MAP = {
  LIGHT_SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' }, // travel utama: preflight & actual request berangkat
  SLIDE_IN:     { category: 'transitions', name: 'slide-in' },     // policy kembali ke browser
  POP:          { category: 'ui', name: 'pop' },
  POP2:         { category: 'ui', name: 'pop-2' },
  TICK:         { category: 'ui', name: 'tick' },
  POLICY_SCAN:  { category: 'ui', name: 'tick' },                  // API membaca preflight (alias TICK, loudness-matched)
  LOCK:         { category: 'impacts', name: 'lock' },
  UNLOCK:       { category: 'impacts', name: 'unlock' },           // gate browser membuka akses baca
  DING:         { category: 'success', name: 'ding' },
  ALLOW_CHIME:  { category: 'ui', name: 'chime' },                 // allowed headers cocok
  RELIEF:       { category: 'success', name: 'relief-settle' },    // data siap dibaca JS
  MATERIALIZE:  { category: 'success', name: 'shimmer' },          // intro morph selesai (bukan sfx/materialize.wav — terlalu pelan)
  ERROR_BEEP:   { category: 'warnings', name: 'error-beep' },      // mismatch header — lebih terdengar dari alert-pulse lama
}
