// src/content/18-auth/data.js
// ─────────────────────────────────────────────────────────────
// Authentication — lanjutan langsung dari rest-api (17): topic itu
// menutup Act 5 dengan amplop bersegel-gembok + tease "siapa yang
// boleh buka amplop ini?". Topic ini menjawabnya — dari sekadar
// alamat & method yang benar (17), sekarang soal IDENTITAS & IZIN:
// siapa yang mengirim, kenapa kata sandi tidak boleh disimpan apa
// adanya (hashing), dua cara "mengingat" pengunjung terverifikasi
// (session vs token), dan kenapa "sudah login" tidak otomatis
// berarti "boleh buka semua ruangan" (authorization). Lihat
// _docs/AUTH_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  SENDER: '#38BDF8',    // sky blue — pengirim/identitas
  GATE: '#06B6D4',      // cyan — gerbang/gedung (anchor dari 17)
  OFFICER: '#FB923C',   // orange — penjaga gerbang & meja resepsionis
  TECHNICAL: '#A78BFA', // purple — istilah teknis (HASH/SESSION/TOKEN/JWT)
  SUCCESS: '#34D399',   // green — verifikasi berhasil / akses diberikan
  ERROR: '#F43F5E',     // red — verifikasi gagal / akses ditolak
  WARNING: '#FBBF24',   // yellow — peringatan transisi
}

export const PHASES = [
  {
    id: 'who-is-this',
    badge: 'ACT 1 — ALAMAT BENAR, TAPI SIAPA INI?',
    badgeColor: COLORS.SENDER,
    caption: 'Setiap surat butuh bukti siapa pengirimnya.',
    duration: 7.0,
  },
  {
    id: 'dangerous-guestbook',
    badge: 'ACT 2 — BUKU TAMU YANG BERBAHAYA',
    badgeColor: COLORS.WARNING,
    caption: 'Simpan tanpa menyimpan kata sandi asli.',
    duration: 9.0,
  },
  {
    id: 'one-way-stamp',
    badge: 'ACT 3 — STEMPEL YANG TIDAK BISA DIBALIK',
    badgeColor: COLORS.TECHNICAL,
    caption: 'Pola stempel tidak bisa dibalik ke asli.',
    duration: 10.0,
  },
  {
    id: 'session-vs-token',
    badge: 'ACT 4 — KARTU TAMU VS SEGEL AJAIB',
    badgeColor: COLORS.OFFICER,
    caption: 'Kartu tamu atau segel, sama-sama sah.',
    duration: 12.0,
  },
  {
    id: 'authn-vs-authz',
    badge: 'ACT 5 — BOLEH MASUK, BUKAN BOLEH BUKA SEMUA',
    badgeColor: COLORS.SUCCESS,
    caption: 'Identitas terverifikasi beda dari izin akses.',
    duration: 9.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// INTRO — hacker typing → header morph
// ═══════════════════════════════════════════════
export const INTRO_CATEGORY = 'NETWORKING'
export const INTRO_TITLE = 'Authentication'
export const INTRO_SUBTITLE = 'Siapa boleh masuk, siapa boleh buka apa'

// ═══════════════════════════════════════════════
// ACT 1 — Alamat Benar, Tapi Siapa Ini? (hook)
// ═══════════════════════════════════════════════
export const ACT1_CONTINUITY_LINE = 'Amplop bersegel itu akhirnya sampai gerbang.'
export const ACT1_SIGNAGE = 'AUTHENTICATION'
export const ACT1_ADDRESS_OK_LABEL = 'ALAMAT & METHOD BENAR'
export const ACT1_QUESTION = 'Alamat benar. Tapi siapa pengirimnya?'
export const ACT1_PAYOFF = 'Setiap surat butuh bukti siapa pengirimnya.'

// ═══════════════════════════════════════════════
// ACT 2 — Buku Tamu yang Berbahaya
// ═══════════════════════════════════════════════
export const ACT2_ID_CARD_FIELDS = [
  { key: 'nama', value: 'Sari' },
  { key: 'kata-sandi', value: 'S4ri123!' },
]
export const ACT2_GUESTBOOK_ROW_NOTE = 'Tercatat apa adanya, terbaca siapa saja.'
export const ACT2_THEFT_INSIGHT = 'Buku dicuri, kata sandi ikut bocor.'
export const ACT2_PAYOFF = 'Simpan tanpa menyimpan kata sandi asli.'

// ═══════════════════════════════════════════════
// ACT 3 — Stempel yang Tidak Bisa Dibalik
// ═══════════════════════════════════════════════
export const ACT3_HASH_LABEL = 'HASH'
export const ACT3_REVERSE_FAIL_NOTE = 'Tidak bisa dibalik ke sandi asli.'
export const ACT3_COMPARE_NOTE = 'Bandingkan dua pola stempel, bukan sandi asli.'
export const ACT3_SAFE_NOTE = 'Sekarang bocor pun, kata sandi tetap aman.'
export const ACT3_CLIFFHANGER = 'Tiap ruangan baru, harus buktikan lagi?'

// ═══════════════════════════════════════════════
// ACT 4 — Kartu Tamu vs Segel Ajaib (2 sub-beat: session, token)
// ═══════════════════════════════════════════════
export const ACT4_SESSION_LABEL = 'SESSION'
export const ACT4_TOKEN_LABEL = 'TOKEN / JWT'
export const ACT4_SESSION_ISSUED_NOTE = 'Kartu tamu bernomor diterbitkan.'
export const ACT4_SESSION_CHECK_NOTE = 'Ruangan baru tetap harus tanya meja pusat.'
export const ACT4_TOKEN_PAYLOAD_NOTE = 'Segel ini bawa identitas di dalam polanya.'
export const ACT4_TOKEN_INDEPENDENCE_NOTE = 'Ruangan mana pun bisa langsung memeriksa sendiri.'
export const ACT4_STATELESS_CALLBACK = 'Sama seperti REST, tidak perlu ingat sebelumnya.'
export const ACT4_TRADEOFF_NOTE = 'Token terbit sulit dibatalkan sebelum waktu habis.'
export const ACT4_CLIFFHANGER = 'Boleh masuk, belum tentu boleh buka semua.'

// ═══════════════════════════════════════════════
// ACT 5 — Boleh Masuk, Bukan Boleh Buka Semua (payoff)
// ═══════════════════════════════════════════════
export const ACT5_RESTRICTED_DOOR_LABEL = 'ARSIP RAHASIA'
export const ACT5_DUAL_STAMP = [
  { label: 'IDENTITAS TERVERIFIKASI', checked: true },
  { label: 'IZIN AKSES', checked: false },
]
export const ACT5_TWO_CHECKS_NOTE = 'Dua pemeriksaan berbeda, bukan satu momen.'
export const ACT5_STATUS_BONUS_NOTE = '401 soal identitas. 403 soal izin akses.'
export const ACT5_PAYOFF = 'Identitas terverifikasi beda dari izin akses.'

// ═══════════════════════════════════════════════
// SFX MAP — semua nama sudah dicek match ke public/audio/*
// (lihat _docs/AUTH_PLAN.md § SFX Sketch)
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  LOCK: { category: 'impacts', name: 'lock' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  TYPING: { category: 'sfx', name: 'typing' },
  TICK: { category: 'ui', name: 'tick' },
  CRITICAL: { category: 'warnings', name: 'critical-alert' },
  GLITCH: { category: 'transitions', name: 'glitch' },
  ERROR: { category: 'sfx', name: 'error' },
  CONFIRM: { category: 'success', name: 'confirm' },
  POP: { category: 'ui', name: 'pop' },
  BEEP2: { category: 'ui', name: 'beep-2' },
  CONNECTOR_SNAP: { category: 'impacts', name: 'connector-snap' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  DING: { category: 'success', name: 'ding' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
}
