// src/content/http-request-response/data.js
// ─────────────────────────────────────────────────────────────
// HTTP Request-Response — cerita: browser diketik URL, penonton
// mengira "ambil" halaman instan → dibongkar jadi analogi surat +
// amplop balasan: nulis surat (request) → cari alamat & ketuk
// pintu (DNS + koneksi) → surat dibuka (server proses) → balasan +
// stempel (status code) → amplop dibuka lagi (browser render).
// Lihat _docs/HTTP_REQUEST_RESPONSE_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',       // sky blue — Browser/client
  CLIENT_DIM: '#0C4A6E',
  NETWORK: '#06B6D4',      // cyan — DNS/koneksi
  NETWORK_DIM: '#155E75',
  SERVER: '#FB923C',       // orange — server/proses
  SERVER_DIM: '#7C2D12',
  SUCCESS: '#34D399',      // green — status 2xx
  SUCCESS_DIM: '#065F46',
  ERROR: '#F43F5E',        // red — status 4xx/5xx
  ERROR_DIM: '#4C0519',
  TECHNICAL: '#A78BFA',    // purple — method/header/istilah teknis
  TECHNICAL_DIM: '#4C1D95',
}

export const PHASES = [
  // revisi-05: dipadatkan dari 6 Act jadi 4 Act (Act1+2 lama digabung,
  // Act4+5 lama digabung; Act3 & Act6 lama tetap standalone, cuma
  // di-reindex). Semua detail/beat di Animation.jsx TETAP ada — cuma
  // jumlah "babak" & jeda antar-babak yang dipadatkan/dimajukan.
  {
    id: 'hook-write-letter',
    badge: 'ACT 1 — KOK NYURUH NUNGGU? (NULIS SURAT)',
    badgeColor: COLORS.CLIENT,
    caption: 'Browser nulis surat dulu sebelum bisa dikirim.',
    duration: 15.7,
  },
  {
    id: 'find-address-knock',
    badge: 'ACT 2 — NYARI ALAMAT & KETUK PINTU',
    badgeColor: COLORS.NETWORK,
    caption: 'Server akan memproses surat ini.', // revisi-10: declarative, bukan nanya
    duration: 10.0,
  },
  {
    id: 'process-and-stamp',
    badge: 'ACT 3 — SURAT DIPROSES & DISTEMPEL',
    badgeColor: COLORS.SERVER,
    caption: 'Amplop sudah sampai di server.', // revisi-10: declarative, bukan nanya
    duration: 15.7,
  },
  {
    id: 'envelope-reopened',
    badge: 'ACT 4 — AMPLOP DIBUKA LAGI',
    badgeColor: COLORS.CLIENT,
    caption: 'Bukan "ambil", tapi kirim surat dan terima balasan.',
    duration: 8.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// INTRO — hacker typing → header morph (pola sama seperti
// tailscale/container-docker)
// ═══════════════════════════════════════════════
export const INTRO_CATEGORY = 'NETWORKING'
export const INTRO_TITLE = 'HTTP REQUEST-RESPONSE'
export const INTRO_SUBTITLE = 'Ngirim surat, nunggu balasan'

// ═══════════════════════════════════════════════
// ACT 1 — Kok Nyuruh Nunggu? (hook, bukan jawaban)
// ═══════════════════════════════════════════════
export const HOOK_URL = 'store.adib-dev.com'
export const HOOK_QUESTION = 'Browser tidak langsung ambil halaman.' // revisi-10: declarative
export const HOOK_REVEAL = 'Browser kirim surat, bukan comot langsung.' // revisi-11: fix analogi (browser=pengirim, bukan kurir)
export const HOOK_CLIFFHANGER = 'Isi surat itu belum terungkap.' // revisi-10: declarative, emoji dibuang

// ═══════════════════════════════════════════════
// ACT 2 — Nulis Surat (Client Bikin Request)
// ═══════════════════════════════════════════════
export const REQUEST_ADDRESS = HOOK_URL
export const DOMAIN_VS_IP_QUESTION = 'Kurir belum tahu alamat aslinya.' // revisi-10: declarative
export const ENVELOPE_SEALED_CAPTION = 'Surat berangkat!' // revisi-11: "siap!" misleading (implisit selesai), padahal baru mulai perjalanan

// ═══════════════════════════════════════════════
// ACT 3 — Nyari Alamat & Ketuk Pintu (DNS + Koneksi)
// ═══════════════════════════════════════════════
export const RESOLVED_IP = '203.0.113.42'

// ═══════════════════════════════════════════════
// ACT 4 — Surat Dibuka (Server Proses Request)
// ═══════════════════════════════════════════════
export const SERVER_THINKING_CAPTION = 'Server sedang memproses.' // revisi-10: declarative, emoji dibuang
export const REPLY_CLIFFHANGER = 'Balasan itu belum terungkap.' // revisi-10: declarative, emoji dibuang

// ═══════════════════════════════════════════════
// ACT 5 — Balasan & Stempel (Response: Status, Headers, Body)
// ═══════════════════════════════════════════════
export const STATUS_MAIN = { code: 200, label: 'OK', desc: 'Surat diterima baik', color: COLORS.SUCCESS }
export const STATUS_VARIANTS = [
  { code: 404, label: 'Not Found', desc: 'Alamat/data yang diminta tidak ketemu', color: COLORS.ERROR },
  { code: 500, label: 'Server Error', desc: 'Bukan salah surat — petugas server-nya bermasalah', color: '#7C2D12' },
]

// ═══════════════════════════════════════════════
// ACT 6 — Amplop Dibuka Lagi (Browser Render, Payoff Penuh)
// ═══════════════════════════════════════════════
export const RENDER_CAPTION = 'Halaman jadi! 🎉'
export const TEASE_NEXT_TOPIC = '→ REST API & WebSocket 🔗'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// (scan dulu per 08-audio-sfx-generation.md §2 sebelum sourcing baru)
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  TICK: { category: 'ui', name: 'tick' },
  BOUNCE: { category: 'ui', name: 'bounce' },
  BEEP: { category: 'ui', name: 'beep' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  TELEPORT: { category: 'transitions', name: 'teleport' }, // intro morph

  MATERIALIZE: { category: 'sfx', name: 'materialize' },   // amplop reveal
  SCAN: { category: 'sfx', name: 'scan' },                  // DNS lookup
  TYPING: { category: 'sfx', name: 'typing' },
  CLICK: { category: 'sfx', name: 'click' },

  IMPACT: { category: 'impacts', name: 'impact' },          // stempel jatuh
  LOCK: { category: 'impacts', name: 'lock' },               // ketuk pintu

  CHARGE: { category: 'success', name: 'charge' },           // intro morph
  CONFIRM: { category: 'success', name: 'confirm' },         // status 200
  RELIEF: { category: 'success', name: 'relief-settle' },    // Act 6 payoff

  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },  // status 404/500
}
