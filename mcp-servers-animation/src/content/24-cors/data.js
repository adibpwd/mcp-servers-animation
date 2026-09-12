// src/content/24-cors/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/24-cors/_docs/CORS_PLAN.md (2026-09-12).
// Empat Act, scene-ui V1, koordinat LOCAL, sumbu vertikal AXIS_X.
// Cerita: CORS bukan kunci keamanan API — ia aturan browser. Origin
// app.example memanggil api.example; browser berdiri menjadi gerbang:
// preflight OPTIONS memastikan method/header/credential diizinkan
// sebelum JS boleh membaca respons. Protagonis Raka (kontrak seri).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum `ready`,
// lihat plan § Checklist).
// ═════════════════════════════════════════════════════════════

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan §1 warna #FB923C (CORS / preflight)
export const COLORS = {
  BG:     '#070913',   // kanvas
  PANEL:  '#0F172A',
  BORDER: '#334155',
  TEXT:   '#E2E8F0',
  MUTED:  '#94A3B8',

  CORS:   '#FB923C',   // preflight / policy — aktor utama
  ORIGIN: '#F472B6',   // origin app.example
  API:    '#38BDF8',   // api.example
  ALLOW:  '#34D399',   // izin cocok
  DENY:   '#F43F5E',   // izin tidak cocok / diblok
  SYSTEM: '#22D3EE',   // domain ADIB-DEV.COM (brand kontrak seri)
};

// PHASES — 4 Act (±44s dengan intro 1,25s)
export const PHASES = [
  { id: 'act1-origin',   badge: 'ACT 1 — ORIGIN BERBEDA, ATURAN BERBEDA',   badgeColor: COLORS.CORS,   duration: 9.0 },
  { id: 'act2-preflight', badge: 'ACT 2 — PREFLIGHT OPTIONS',               badgeColor: COLORS.ORIGIN, duration: 11.0 },
  { id: 'act3-allow',    badge: 'ACT 3 — BROWSER MEMBANDINGKAN IZIN',       badgeColor: COLORS.API,    duration: 12.0 },
  { id: 'act4-read',     badge: 'ACT 4 — RESPONS DIBACA SETELAH IZIN',      badgeColor: COLORS.ALLOW,  duration: 12.0 },
];

// ── Koordinat LOCAL (origin DEFAULT_LAYOUT_V1.body) ──
// AXIS_X = 410 - body.x (lihat plan §3 koordinat: sumbu vertikal)
export const AXIS_X = 366

export const APP_Y    = 120   // kartu app.example (fetch dimulai)
export const API_Y    = 300   // kartu api.example (server respons)
export const GATE_Y   = 560   // browser gate — preflight berlalu di sini
export const PREF_Y   = 780   // preflight OPTIONS di browser gate
export const POL_Y    = 860   // policy shelf — izin dibandingkan
export const RESP_Y   = 820   // respons API kembali
export const READ_Y   = 80    // JS read — pos ini dibawa gate
export const CLOSING_Y = 1100 // closing — handoff 23-https-tls

export const CAPTION_Y = CLOSING_Y + 130

// ── CAPTIONS — teks deklaratif ≤5 kata dekat objek ──
export const CAPTIONS = {
  ORIGIN_DIFFERENT: 'Origin berbeda, aturan beda',
  FETCH_START:      'App mulai fetch',
  GATE_APPEAR:      'Browser jadi gerbang',
  NEEDS_PERMISSION: 'Butuh izin dulu',
  PREFLIGHT_GO:     'Preflight berangkat',
  OPTIONS_SENT:     'OPTIONS + Origin + header',
  POLICY_READ:      'Policy dibandingkan',
  ALLOW_HEADERS:    'Allow-Origin/header cocok',
  ALLOW_LIT:        'Izin menyala',
  ACTUAL_SENT:      'Request asli jalan',
  RESPONSE_PASS:    'Respons lewat gate',
  JS_READY:         'JS boleh baca',
  GATE_OK:          'Gate terbuka',
  DENY_LABEL:       'Blok: izin tidak cocok',
  READY_READ:       'Data siap dibaca',
  SECURE_READ:      'CORS bukan auth API',
}

// SFX_MAP — pemetaan efek suara (kontrak seri)
export const SFX_MAP = {
  POP:     { category: 'ui',          name: 'pop' },
  POP2:    { category: 'ui',          name: 'pop-2' },
  TICK:    { category: 'ui',          name: 'tick' },
  WHOOSH:  { category: 'transitions', name: 'whoosh' },
  SWOOSH:  { category: 'transitions', name: 'swoosh' },
  LOCK:    { category: 'impacts',     name: 'lock' },
  CONFIRM: { category: 'success',     name: 'confirm' },
  DING:    { category: 'success',     name: 'ding' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
