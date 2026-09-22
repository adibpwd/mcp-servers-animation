// src/content/async-event-loop/data.js
// ─────────────────────────────────────────────────────────────
// Async/Await & Event Loop
// Intro → Act 1: Hook bug `undefined` → Act 2: Call Stack ("satu
// kasir") → Act 3: Async ke background ("titip ke dapur") →
// Act 4: Event Loop (aha-moment) → Act 5: Payoff (jawab hook Act 1)
// Rencana lengkap: lihat _docs/PLAN-ASYNC-EVENT-LOOP.md
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 640

export const COLORS = {
  CALL_STACK: '#06B6D4',   // cyan — inti mesin eksekusi
  TEXT: '#E2E8F0',         // teks kode/baris sinkron, netral
  PENDING: '#FBBF24',      // task/promise pending
  QUEUE: '#A78BFA',        // Callback Queue — struktur data antrian
  EVENT_LOOP: '#34D399',   // Event Loop — mekanisme "berhasil" jalan
  ERROR: '#F43F5E',        // hasil salah / bug (undefined)
  SUCCESS: '#34D399',      // hasil benar (data asli, resolved)
  KITCHEN: '#FB923C',      // Web API / "Dapur" — kerja di background
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  MUTED: '#94A3B8',
}

export const PHASES = [
  { id: 'intro', label: 'Intro', duration: 1.2 },
  { id: 'act1-hook', label: 'Act 1: Kode yang "Loncat"', duration: 8.0 },
  { id: 'act2-callstack', label: 'Act 2: Satu Kasir, Satu Antrian', duration: 9.0 },
  { id: 'act3-kitchen', label: 'Act 3: Titip ke Dapur', duration: 9.5 },
  { id: 'act4-eventloop', label: 'Act 4: Event Loop Berjaga', duration: 9.5 },
  { id: 'act5-payoff', label: 'Act 5: Giliran Tiba', duration: 8.5 },
]

// ═══════════════════════════════════════════════════════════
// SFX_MAP — full mapping ke asset yang SUDAH ADA di public/audio/*/
// (tidak ada sourcing/download baru). category di sini adalah
// nama folder di public/audio/; method sfxLoader yang dipanggil
// dari Animation.jsx beda sedikit penamaan (lihat SFX_METHOD di
// bawah): ui→ui, transitions→transition, impacts→impact,
// warnings→warning, success→success, sfx→sfx.
// ═══════════════════════════════════════════════════════════
export const SFX_MAP = {
  POP:           { category: 'ui',          name: 'pop' },
  POP_2:         { category: 'ui',          name: 'pop-2' },
  TICK:          { category: 'ui',          name: 'tick' },
  CHIME:         { category: 'ui',          name: 'chime' },
  WHOOSH:        { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW:    { category: 'transitions', name: 'whoosh-low' },
  SLIDE_IN:      { category: 'transitions', name: 'slide-in' },
  STACK_PUSH:    { category: 'impacts',     name: 'impact' },
  ERROR:         { category: 'sfx',         name: 'error' },
  SUCCESS:       { category: 'sfx',         name: 'success' },
  CONFIRM:       { category: 'success',     name: 'confirm' },
  DING:          { category: 'success',     name: 'ding' },
  WARNING_PULSE: { category: 'warnings',    name: 'alert-pulse' },
  LATENCY_TICK:  { category: 'warnings',    name: 'latency-tick' },
  TYPING:        { category: 'sfx',         name: 'typing' },
}

// category folder (public/audio/<category>/) → nama method di
// src/shared/audio/sfxLoader.js (singular utk sebagian kategori)
export const SFX_METHOD = {
  ui: 'ui',
  transitions: 'transition',
  impacts: 'impact',
  warnings: 'warning',
  success: 'success',
  sfx: 'sfx',
}

// ═══════════════════════════════════════════════════════════
// ACT 1 — Hook: kode "loncat" (belum dijawab, cliffhanger)
// ═══════════════════════════════════════════════════════════
export const ACT1_CODE_LINES = [
  { id: 'l1', text: 'Ambil data user dari server.' },
  { id: 'l2', text: 'Tampilkan nama user di layar.' },
  { id: 'l3', text: 'Proses selesai.' },
]
export const ACT1_PENDING_LABEL = 'sedang diambil...'
export const ACT1_RESULT_BAD = 'Hasil: undefined'
export const ACT1_CLIFFHANGER = 'Kode ditulis urut. Kenapa hasilnya tidak?'

// ═══════════════════════════════════════════════════════════
// ACT 2 — Call Stack ("satu kasir, satu antrian")
// ═══════════════════════════════════════════════════════════
export const ACT2_LABEL = 'CALL STACK'
export const ACT2_FRAMES = ['main()', 'fetchUser()', 'console.log()']
export const ACT2_QUESTION = 'Kasir harus diam menunggu?'
export const ACT2_CLIFFHANGER = 'Tugas lambat pergi. Kasir lanjut kerja lain.'

// ═══════════════════════════════════════════════════════════
// ACT 3 — Titip ke Dapur (Web API / background)
// ═══════════════════════════════════════════════════════════
export const ACT3_KITCHEN_LABEL = 'DAPUR (Web API)'
export const ACT3_TASK_LABEL = 'fetchUser() diproses'
export const ACT3_PROGRESS_LABEL = 'Menunggu respons server...'
export const ACT3_QUEUE_LABEL = 'ANTRIAN CALLBACK'
export const ACT3_CLIFFHANGER = 'Data sudah siap. Tapi belum langsung dipakai.'

// ═══════════════════════════════════════════════════════════
// ACT 4 — Event Loop Berjaga (aha-moment)
// ═══════════════════════════════════════════════════════════
export const ACT4_LABEL = 'EVENT LOOP'
export const ACT4_WAITING_LABEL = 'Menunggu giliran...'
export const ACT4_STACK_EMPTY_LABEL = 'Stack kosong.'
export const ACT4_CLIFFHANGER = 'Giliran callback akhirnya tiba.'

// ═══════════════════════════════════════════════════════════
// ACT 5 — Giliran Tiba (payoff penuh, jawab hook Act 1)
// ═══════════════════════════════════════════════════════════
export const ACT5_RUNNING_LABEL = 'Tampilkan nama user (dengan data asli)'
export const ACT5_BEFORE_CARD = 'Kode lanjut. Data belum siap. Hasil: undefined.'
export const ACT5_AFTER_CARD = 'Kode tunggu giliran. Data sudah siap.'
export const ACT5_RESULT_GOOD = 'Hasil: Adib'
export const ACT5_PAYOFF = 'Ternyata: kode tidak diam, hasil balik lewat antrian.'

// ═══════════════════════════════════════════════════════════
// Intro
// ═══════════════════════════════════════════════════════════
export const INTRO_TITLE = 'ASYNC / AWAIT'
export const INTRO_HEADER = 'Async/Await & Event Loop'
export const INTRO_SUBTITLE = 'Kenapa kode JavaScript kelihatan "loncat"'
