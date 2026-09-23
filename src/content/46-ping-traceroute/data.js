// src/content/46-ping-traceroute/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-01: dieksekusi sesuai storyboard 4-Act di
// _docs/PING_TRACEROUTE_PLAN.md — TIDAK ada merge/pemotongan Act.
//   Act 1 = Website Tidak Merespons — Siapa yang Salah?
//   Act 2 = Memantulkan Bola dengan `ping` (ICMP Echo, RTT)
//   Act 3 = Trik Cerdas `traceroute` & TTL (hop-by-hop)
//   Act 4 = Menemukan Titik Putus / Firewall Drop (hop 5 timeout)
// Icon: inline SVG (pola 17-rest-api/44-ssh), tidak ada folder icons/.
// SFX: nama dipakai ulang dari daftar yang sudah diaudit (public/audio/*).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',   // Sky — browser/client, request asal
  SERVER: '#FBBF24',   // Amber — server tujuan
  ECHO: '#34D399',     // Emerald — ICMP echo reply / sukses / traceroute
  ROUTER: '#A78BFA',   // Violet — hop router perantara
  TTL: '#FB923C',      // Orange — TTL / paket dalam perjalanan
  RISK: '#F87171',     // Merah — timeout / firewall drop
}

export const PHASES = [
  { id: 'diagnose', badge: 'ACT 1 — SIAPA YANG SALAH?', badgeColor: COLORS.CLIENT, duration: 20 },
  { id: 'ping', badge: 'ACT 2 — MEMANTULKAN BOLA DENGAN PING', badgeColor: COLORS.ECHO, duration: 27 },
  { id: 'traceroute', badge: 'ACT 3 — TRIK TTL TRACEROUTE', badgeColor: COLORS.TTL, duration: 32 },
  { id: 'breakpoint', badge: 'ACT 4 — MENEMUKAN TITIK PUTUS', badgeColor: COLORS.RISK, duration: 26 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'NETWORKING & TROUBLESHOOTING'
export const INTRO_TITLE_A = 'PING & '
export const INTRO_TITLE_B = 'TRACEROUTE'
export const INTRO_SUBTITLE = 'Menemukan letak jaringan tersendat'

// ── Layout — spine vertikal x=AXIS_X, client (browser) di atas, server
// tujuan di bawah — anchor TIDAK pernah dihapus, hanya di-morph/diredupkan
// (continuity map, sama pola dengan 44-ssh). ──
export const AXIS_X = 366
export const CLIENT_Y = 120
export const SERVER_Y = 905
export const CHANNEL_TOP = CLIENT_Y + 85
export const CHANNEL_BOTTOM = SERVER_Y - 85

export const CLIENT_LABEL = 'BROWSER / CLIENT'
export const SERVER_LABEL = 'SERVER TUJUAN'
export const HOST_LABEL = 'target: example.com  (203.0.113.10)'

// ── Titik anchor absolut bersama Act 2-4 (body-local ContentBodyV1). ──
export const NEAR_CLIENT = { x: AXIS_X, y: 300 }
export const MID = { x: AXIS_X, y: 500 }
export const NEAR_SERVER = { x: AXIS_X, y: 700 }
export const RTT_BADGE_PT = { x: AXIS_X, y: 300 }
export const SAMPLES_PT = { x: AXIS_X, y: 470 }
export const HOP_TABLE_PT = { x: AXIS_X, y: 560 }
export const HOP1_PT = { x: AXIS_X, y: 360 }
export const HOP2_PT = { x: AXIS_X, y: 480 }
export const HOP3_PT = { x: AXIS_X, y: 600 }

// ═══════════════════════════════════════════════
// ACT 1 — Website Tidak Merespons: Siapa yang Salah?
// ═══════════════════════════════════════════════
export const ACT1_CASE = {
  urlLabel: 'example.com',
  options: ['WiFi Lokal', 'ISP / Jaringan', 'Server Tujuan'],
  copy: {
    timeout: 'Browser menunggu... lalu timeout',
    sub: 'Situs tidak merespons dalam waktu wajar',
    question: 'Masalahnya di WiFi lokal, ISP, atau server tujuan?',
    after: 'Butuh alat untuk mendiagnosa secara presisi, bukan menebak.',
  },
}

// ═══════════════════════════════════════════════
// ACT 2 — Memantulkan Bola dengan `ping`
// ═══════════════════════════════════════════════
export const ACT2_CASE = {
  echoLabel: 'ICMP Echo Request',
  replyLabel: 'ICMP Echo Reply',
  samples: [
    { seq: 1, rtt: '15 ms' },
    { seq: 2, rtt: '14 ms' },
    { seq: 3, rtt: '16 ms' },
  ],
  verdictLabel: 'stabil — RTT konsisten ~15ms',
  copy: {
    send: 'Client mengirim ICMP Echo Request',
    reply: 'Server membalas dengan Echo Reply',
    measure: 'Selisih waktu kirim-terima = RTT (Round Trip Time)',
    verdict: 'RTT stabil di sekitar 15ms, jauh dari 100% packet loss',
    after: '`ping` memastikan server hidup dan mengukur latensi.',
  },
}

// ═══════════════════════════════════════════════
// ACT 3 — Trik Cerdas `traceroute` & TTL (Time To Live)
// ═══════════════════════════════════════════════
export const ACT3_CASE = {
  hops: [
    { ttl: 1, ip: '192.168.1.1', label: 'Router Rumah', status: 'expired' },
    { ttl: 2, ip: '10.20.30.1', label: 'Router ISP', status: 'expired' },
    { ttl: 3, ip: '203.0.113.10', label: 'example.com', status: 'reached' },
  ],
  copy: {
    intro: 'Tiap paket dikirim dengan TTL (Time To Live) berbeda',
    hop1: 'TTL=1 kehabisan umur tepat di router pertama',
    hop2: 'TTL=2 kehabisan umur tepat di router kedua',
    hop3: 'TTL=3 cukup umur untuk sampai ke server tujuan',
    after: 'Tiap "TTL Expired" membuka identitas satu pos perhentian.',
  },
}

// ═══════════════════════════════════════════════
// ACT 4 — Menemukan Titik Putus / Firewall Drop
// ═══════════════════════════════════════════════
export const ACT4_CASE = {
  hops: [
    { ttl: 1, ip: '192.168.1.1', label: 'Router Rumah', status: 'ok' },
    { ttl: 2, ip: '10.20.30.1', label: 'Router ISP', status: 'ok' },
    { ttl: 3, ip: '198.51.100.5', label: 'Backbone Hop', status: 'ok' },
    { ttl: 4, ip: '203.0.113.1', label: 'Firewall Gateway', status: 'ok' },
    { ttl: 5, ip: '* * *', label: 'Request timed out', status: 'timeout' },
  ],
  copy: {
    build: 'Hop demi hop tercatat normal',
    breakpoint: 'Hop ke-5: * * * Request timed out',
    diagnose: 'Firewall ISP atau kabel putus persis di titik ini',
    after: '`traceroute` menunjukkan lokasi persis gangguan, bukan tebakan.',
  },
}

export const CLOSING_CAPTION = '`ping` cek hidup-mati, `traceroute` cek di mana putusnya'

// ═══════════════════════════════════════════════
// SFX MAP — nama dipakai ulang dari daftar yang sudah diaudit di
// 17-rest-api / 44-ssh (public/audio/*), tidak ada sourcing baru.
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
