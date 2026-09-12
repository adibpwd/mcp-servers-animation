// src/content/dns-explained/data.js
// ─────────────────────────────────────────────────────────────
// DNS Explained — cerita: kenapa ganti DNS ke 8.8.8.8 kadang benerin
// internet yang lemot/gak connect (hook) → analogi buku telepon
// internet → tanya resolver dulu → perjalanan bertingkat root/TLD/
// authoritative → payoff: jawab hook Act 1.
// Lihat _docs/DNS_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  BROWSER: '#38BDF8',      // sky blue — browser/device milik user
  BROWSER_DIM: '#0C4A6E',
  RESOLVER: '#06B6D4',     // cyan — DNS resolver (ISP maupun 8.8.8.8)
  RESOLVER_DIM: '#164E63',
  ROOT: '#A78BFA',         // purple — root server
  ROOT_DIM: '#4C1D95',
  TLD: '#FB923C',          // orange — TLD server
  TLD_DIM: '#7C2D12',
  AUTH: '#34D399',         // green — authoritative server (jawaban final)
  AUTH_DIM: '#065F46',
  DANGER: '#F43F5E',       // red — gagal/error
  DANGER_DIM: '#4C0519',
  WARNING: '#FBBF24',      // yellow — tegangan/loading lama
  WARNING_DIM: '#78350F',
}

export const PHASES = [
  {
    id: 'hook-switch-dns',
    badge: 'ACT 1 — KENAPA GANTI DNS BISA BENERIN INTERNET?',
    badgeColor: COLORS.WARNING,
    caption: 'Loading lama, situs tidak kunjung terbuka.',
    duration: 9.0,
  },
  {
    id: 'phonebook-analogy',
    badge: 'ACT 2 — INTERNET CUMA KENAL ANGKA',
    badgeColor: COLORS.BROWSER,
    caption: 'Nama domain diterjemahkan jadi nomor IP.',
    duration: 9.0,
  },
  {
    id: 'ask-resolver',
    badge: 'ACT 3 — RESOLVER BELUM TENTU LANGSUNG TAHU',
    badgeColor: COLORS.RESOLVER,
    caption: 'Resolver mulai cari dari titik paling atas.',
    duration: 10.0,
  },
  {
    id: 'root-tld-auth',
    badge: 'ACT 4 — TIAP SERVER CUMA TAHU SEBAGIAN',
    badgeColor: COLORS.ROOT,
    caption: 'Perjalanan bertingkat mencari jawaban pasti.',
    duration: 13.0,
  },
  {
    id: 'payoff-8888',
    badge: 'ACT 5 — SEKARANG JAWAB HOOK ACT 1',
    badgeColor: COLORS.AUTH,
    caption: 'DNS itu buku telepon internet.',
    duration: 9.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// ACT 1 — Hook: ganti DNS, tiba-tiba lancar
// ═══════════════════════════════════════════════
export const DOMAIN_NAME = 'toko-online.com'
export const EXAMPLE_IP = '93.184.216.34'

export const HOOK_LOADING = 'Loading lama, situs tidak kunjung terbuka.'
export const HOOK_SWITCH = 'Coba ganti DNS ke 8.8.8.8.'
export const HOOK_CLIFFHANGER = 'Langsung lancar. DNS itu apa sebenarnya?'

// ═══════════════════════════════════════════════
// ACT 2 — Nama vs nomor: buku telepon internet
// ═══════════════════════════════════════════════
export const ANALOGY_QUESTION = 'Internet cuma kenal alamat IP, bukan nama.'
export const ANALOGY_INSIGHT = 'DNS = Buku Telepon Internet'
export const ANALOGY_CAPTION = 'Nama domain diterjemahkan jadi nomor IP.'
export const RESOLVER_INTRO = 'DNS Resolver — operator buku telepon ini.'
export const RESOLVER_LABEL_DEFAULT = 'DNS RESOLVER'

// ═══════════════════════════════════════════════
// ACT 3 — Tanya resolver dulu, ternyata belum tahu
// ═══════════════════════════════════════════════
export const ASK_QUERY = 'Resolver ditanya duluan oleh browser.'
export const ASK_CACHE_MISS = 'Belum pernah dicatat sebelumnya.'
export const ASK_TENSION = 'Resolver tahu harus mulai cari dari mana.'
export const ASK_PAYOFF = 'Pencarian dimulai dari titik paling atas internet.'

// ═══════════════════════════════════════════════
// ACT 4 — Perjalanan bertingkat: root → TLD → authoritative
// ═══════════════════════════════════════════════
// Iterative query dari sisi RESOLVER (resolver yang loncat ke tiap
// server), bukan recursive antar server — lihat catatan akurasi di
// _docs/DNS_PLAN.md § Konsep Teknis WAJIB Akurat poin 1-2.
export const LOOKUP_HOPS = [
  {
    id: 'root',
    label: 'ROOT SERVER',
    color: COLORS.ROOT,
    knows: 'Root tahu siapa pemegang domain .com.',
    partial: 'Belum jawaban lengkap, lanjut ke TLD.',
  },
  {
    id: 'tld',
    label: 'TLD SERVER (.com)',
    color: COLORS.TLD,
    knows: 'TLD tahu server resmi domain ini.',
    partial: 'Belum jawaban lengkap, lanjut ke authoritative.',
  },
  {
    id: 'auth',
    label: 'AUTHORITATIVE SERVER',
    color: COLORS.AUTH,
    knows: 'Authoritative server — jawaban paling pasti.',
    partial: 'Ketemu! Alamat IP domain ditemukan.',
  },
]

export const LOOKUP_TENSION = 'Akankah ketemu jawaban pastinya?'
export const LOOKUP_FOUND = 'Ketemu! Alamat IP domain ditemukan.'
export const CACHE_NOTE = 'Resolver simpan jawaban ini untuk nanti.'
export const RESOLVER_REPLY = 'Resolver kirim balik alamatnya ke browser.'

// ═══════════════════════════════════════════════
// ACT 5 — Payoff: jawab hook Act 1
// ═══════════════════════════════════════════════
export const PAYOFF_CONNECT = 'Browser dapat IP, langsung connect ke server asli.'
export const PAYOFF_LEFT_LABEL = 'RESOLVER ISP'
export const PAYOFF_LEFT_NOTE = 'Lambat, error, atau diblokir.'
export const PAYOFF_RIGHT_LABEL = '8.8.8.8'
export const PAYOFF_RIGHT_SUB = 'GOOGLE PUBLIC DNS'
export const PAYOFF_RIGHT_NOTE = 'Cepat dan stabil.'
export const RESOLVER_LABEL_UPGRADED = '8.8.8.8 — GOOGLE PUBLIC DNS'
export const SWITCH_RESOLVER_LINE = 'Ganti resolver, coba lagi lewat 8.8.8.8.'
export const CLOSING_LINE = 'DNS itu buku telepon internet.'
export const CLOSING_BRAND = 'Ganti operatornya, pencarian jadi cepat.'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// (sudah discan dulu sesuai docs/standardizations/08-audio-sfx-
// generation.md §2, tidak perlu sourcing SFX baru untuk topic ini)
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  TYPING: { category: 'sfx', name: 'typing', boost: 2.2 },
  LATENCY: { category: 'warnings', name: 'latency-tick' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  CONNECT_OK: { category: 'success', name: 'confirm' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  POP: { category: 'ui', name: 'pop' },
  POP_ALT: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  TICK: { category: 'ui', name: 'tick' },
  SCAN: { category: 'sfx', name: 'scan' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_ALT: { category: 'transitions', name: 'swoosh' },
  TELEPORT_HOP: { category: 'transitions', name: 'teleport' },
  IP_FOUND: { category: 'success', name: 'victory' },
  CACHE_SAVE: { category: 'impacts', name: 'connector-snap' },
}
