// src/content/rest-api/data.js
// ─────────────────────────────────────────────────────────────
// REST API — lanjutan dari http-request-response (14): bukan lagi
// soal MEKANIKA kirim-terima surat, tapi soal KONVENSI/ATURAN di
// baliknya — kenapa endpoint dinamai /users/123 bukan /getUser,
// kenapa ada 5 method, dan kenapa disebut "REST" padahal server
// keliatan sibuk terus. Analogi: restoran & cara memesan yang
// konsisten (revisi-02, ganti dari analogi kantor pos revisi-01).
// Lihat _docs/REST-API-storytelling-revision.md untuk story spine
// lengkap & revisi/2026-09-11-1241-revisi-02.md untuk mapping detail.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',       // sky blue — client/pelanggan
  ADDRESS: '#06B6D4',      // cyan — alamat/resource path
  SERVER: '#FB923C',       // orange — server/dapur
  TECHNICAL: '#A78BFA',    // purple — method/istilah teknis
  SUCCESS: '#34D399',      // green — pola benar/sukses
  ERROR: '#F43F5E',        // red — pola salah/error
  WARNING: '#FBBF24',      // yellow — highlight/before-chaos
}

export const PHASES = [
  {
    id: 'naming-hook',
    badge: 'ACT 1 — REST TAPI KOK SIBUK?',
    badgeColor: COLORS.CLIENT,
    caption: 'Bukan soal istirahat. Ini aturan standar.',
    duration: 7.0,
  },
  {
    id: 'before-rest-chaos',
    badge: 'ACT 2 — SEBELUM ADA ATURAN',
    badgeColor: COLORS.WARNING,
    caption: 'Tiap restoran, cara pesan beda.',
    duration: 8.0,
  },
  {
    id: 'resource-and-verb',
    badge: 'ACT 3 — ALAMAT, BUKAN AKSI',
    badgeColor: COLORS.TECHNICAL,
    caption: 'Alamat itu benda. Aksinya lewat method.',
    duration: 10.0,
  },
  {
    id: 'json-and-stateless',
    badge: 'ACT 4 — FORMULIR & REQUEST MANDIRI',
    badgeColor: COLORS.SERVER,
    caption: 'Dapur tetap sibuk, cuma gak nyimpen obrolan.',
    duration: 11.0,
  },
  {
    id: 'payoff-and-tease',
    badge: 'ACT 5 — KONSISTEN, TAPI SIAPA YANG BOLEH AKSES?',
    badgeColor: COLORS.SUCCESS,
    caption: 'Aturan sama, pesanan konsisten.',
    duration: 8.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// INTRO — hacker typing → header morph
// ═══════════════════════════════════════════════
export const INTRO_CATEGORY = 'NETWORKING'
export const INTRO_TITLE = 'REST API'
export const INTRO_SUBTITLE = 'Aturan standar di balik istirahat yang sibuk'

// ═══════════════════════════════════════════════
// ACT 1 — Kenapa Cara Pesannya Beda? (hook, bukan jawaban)
// ═══════════════════════════════════════════════
export const ACT1_CONTINUITY_LINE = 'Lanjutan dari cerita kemarin.'
export const ACT1_SIGNAGE = 'REST API'
// revisi-03: ACT1_QUESTION dihapus (diganti visual LargeQuestionMark).
// ACT1_PAYOFF jadi 1 kata, label di ConsistencyBadge.
export const ACT1_PAYOFF = 'Konsisten'

// ═══════════════════════════════════════════════
// ACT 2 — Sebelum Ada Aturan: Kacau
// ═══════════════════════════════════════════════
// Endpoint contoh sengaja TIDAK diganti (bukan bagian analogi, tetap
// relevan buat "before REST chaos" — lihat revisi-02 § 5).
export const ACT2_DOORS = [
  { label: '/getUser' },
  { label: '/user_remove' },
  { label: '/newCustomer' },
]
// revisi-03: ACT2_INSIGHT dihapus (diganti visual ChaosBadge).
// ACT2_PAYOFF jadi label pendek di RuleIcon.
export const ACT2_PAYOFF = 'aturan sama'

// ═══════════════════════════════════════════════
// ACT 3 — Alamat, Bukan Aksi
// ═══════════════════════════════════════════════
export const ACT3_OLD_ENDPOINT = '/getUser'
export const ACT3_NEW_ENDPOINT = '/users/123'
// revisi-03: ACT3_QUESTION dihapus (sub-teks "Aksinya taruh mana?"
// dipindah fungsinya ke caption bar, bukan sub-teks di newReveal).
export const ACT3_METHODS = [
  { method: 'GET', label: 'Lihat' },
  { method: 'POST', label: 'Buat Baru' },
  { method: 'PUT', label: 'Ganti Total' },
  { method: 'PATCH', label: 'Ubah Sebagian' },
  { method: 'DELETE', label: 'Hapus' },
]
export const ACT3_OTHER_DOORS = ['/products/45', '/orders/9']
// revisi-03: ACT3_PUT_PATCH_NOTE, ACT3_IDEMPOTENCY_NOTE, ACT3_PAYOFF
// dihapus (diganti visual PutPatchComparison, act3PayoffCard dihapus).
// Data item untuk PutPatchComparison:
export const ACT3_PUT_ITEMS = ['nasi goreng', 'telur', 'jus']
export const ACT3_PATCH_ITEMS = [
  { label: 'nasi goreng', changed: false },
  { label: 'telur', changed: false },
  { label: 'jus', changed: true },
]

// ═══════════════════════════════════════════════
// ACT 4 — Formulir Terstruktur & Request Berdiri Sendiri
// (2 sub-beat dalam 1 Act, tetap digabung — lihat revisi-02 § Keputusan
// User poin 4. Beat B TIDAK lagi pakai karakter "petugas pelupa" — lihat
// _docs/REST-API-storytelling-revision.md § Keputusan Storytelling Baru
// poin 8. Statelessness dijelaskan lewat 2 kartu request bersanding.)
// ═══════════════════════════════════════════════
// revisi-03: ACT4_FREEFORM_NOTE dihapus (diganti visual ConfusedChefIcon).
export const ACT4_JSON_FIELDS = [
  { key: 'nama', value: 'Adib' },
  { key: 'makanan', value: 'nasi goreng' },
  { key: 'minuman', value: 'es teh' },
]
// revisi-03: ACT4_JSON_NOTE & ACT4_JSON_FORMAT_NOTE dihapus (diganti
// centang kecil inline di sudut jsonFormCard, dan dihapus total).

// Beat B — 2 request card bersanding, bukan karakter petugas.
// ACT4_REQUEST_RESOURCE tetap dipakai sebagai resource path di dalam
// masing-masing RequestCard (requestResourceLabel standalone dihapus,
// itu duplikat — lihat revisi-03 § 2 Act 4).
export const ACT4_REQUEST_RESOURCE = '/meja/12'
export const ACT4_REQUEST1_LABEL = 'REQUEST 1'
export const ACT4_REQUEST1_FIELDS = [
  { key: 'nama', value: 'Adib' },
  { key: 'makanan', value: 'nasi goreng' },
]
export const ACT4_REQUEST2_LABEL = 'REQUEST 2'
export const ACT4_REQUEST2_FIELDS = [
  { key: 'nama', value: 'Adib' },
  { key: 'minuman', value: 'es teh' },
]
// revisi-03: ACT4_STATELESS_NOTE jadi label pendek StatelessDivider.
// ACT4_STATELESS_CAPTION dihapus (duplikat).
export const ACT4_STATELESS_NOTE = 'berdiri sendiri'

// revisi-03: ACT4_PAYOFF jadi label pendek act4PayoffLine.
// ACT4_STATELESS_CLARIFY dihapus (terlalu kecil, tidak visible).
// ACT4_CLIFFHANGER jadi label pendek cliffhangerLock.
export const ACT4_PAYOFF = 'Lebih predictable'
export const ACT4_CLIFFHANGER = 'Aman?'

// ═══════════════════════════════════════════════
// ACT 5 — Konsisten, Tapi Siapa yang Boleh Akses?
// ═══════════════════════════════════════════════
export const ACT5_STATUS_200 = { code: 200, label: 'OK', desc: 'Pesanan diterima', color: COLORS.SUCCESS }
export const ACT5_STATUS_201 = { code: 201, label: 'Created', desc: 'Pesanan baru dibuat', color: COLORS.SUCCESS }
// revisi-03: ACT5_SECRET_LABEL dihapus (diganti visual LockFlying,
// gembok merah terbang tanpa teks). ACT5_TEASE dihapus (diganti
// AuthTeaser SVG, teks sudah built-in di dalam komponen).
export const ACT5_REST_NOTE = 'REST itu gaya desain, bukan protokol resmi.'
export const ACT5_PAYOFF = 'Konsisten ✓'
export const ACT5_NEXT_TOPIC = '→ Authentication'

// ═══════════════════════════════════════════════
// SFX MAP — semua nama sudah dicek match ke public/audio/*
// (lihat _docs/REST-API-storytelling-revision.md § SFX Sketch)
// TIDAK berubah dari revisi-01 — nama file generic, tidak terikat analogi.
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  CLICK: { category: 'sfx', name: 'click' },
  POP: { category: 'ui', name: 'pop' },
  TICK: { category: 'ui', name: 'tick' },
  ERROR: { category: 'sfx', name: 'error' },
  WARNING: { category: 'warnings', name: 'alert-pulse' },
  ERROR_HUM: { category: 'warnings', name: 'error-hum' },
  IMPACT: { category: 'impacts', name: 'impact' },
  LOCK: { category: 'impacts', name: 'lock' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SUCCESS: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  CHARGE: { category: 'success', name: 'charge' },
}
