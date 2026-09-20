// src/content/84-network-ports/data.js
// ─────────────────────────────────────────────────────────────
// REVISI-01 (lihat revisi/2026-09-18-1213-revisi-01.md): mengganti
// panel/kotak statis dengan packet nyata yang lahir dari source,
// melintasi jalur, dan apply di target — sesuai Causal Motion
// Contract (docs/standardizations/03 §1.T). Spine persisten:
// client app → IP host → protocol/port lane → listener → policy → service.
// Tidak ada scanning/enumeration/firewall-change/exploit (Batas aman plan).
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  IP: '#38BDF8',        // Sky — host/IP address
  PORT: '#A78BFA',      // Violet — port/lane, identitas primer topic
  LISTENER: '#34D399',  // Emerald — service yang menerima
  TCP: '#38BDF8',       // Sky — packet/lane TCP
  UDP: '#FB923C',       // Orange — packet/lane UDP
  FIREWALL: '#F87171',  // Merah — policy deny / risiko
  ALLOW: '#34D399',     // Emerald — policy allow
  NAT: '#22D3EE',       // Cyan — NAT/proxy/load balancer
  HEALTH: '#FBBF24',    // Amber — health check
  PACKET_MAIN: '#A78BFA',  // packet contoh utama (client asli, persist Act1-4)
  PACKET_EXT: '#F87171',   // packet contoh eksternal (uji scope/policy, Act5)
  PACKET_PUB: '#22D3EE',   // packet contoh publik (Act6, edge → backend)
}

export const PHASES = [
  { id: 'host-service', badge: 'ACT 1 — HOST BUKAN SERVICE', badgeColor: COLORS.IP, duration: 12 },
  { id: 'listener', badge: 'ACT 2 — LISTENER MENERIMA', badgeColor: COLORS.LISTENER, duration: 10 },
  { id: 'tcp-udp', badge: 'ACT 3 — TCP DAN UDP', badgeColor: COLORS.TCP, duration: 14 },
  { id: 'endpoints', badge: 'ACT 4 — DUA UJUNG KONEKSI', badgeColor: COLORS.PORT, duration: 9 },
  { id: 'scope-firewall', badge: 'ACT 5 — SCOPE DAN FIREWALL', badgeColor: COLORS.FIREWALL, duration: 13 },
  { id: 'real-path', badge: 'ACT 6 — JALUR NYATA', badgeColor: COLORS.NAT, duration: 13 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'NETWORK '
export const INTRO_TITLE_B = 'PORTS'
export const INTRO_SUBTITLE = 'Pintu layanan, bukan pintu mesin'

// ═══════════════════════════════════════════════
// SPINE PERSISTEN — client app → IP host → port lane →
// listener → policy gate → service. Node ini tetap mounted
// sejak Act 1 (redup sebelum dipakai), TIDAK di-pop-out per-Act
// (Continuity/No-Teleport Contract §1.O).
// ═══════════════════════════════════════════════
export const PORT_LANES = [
  { id: '22', label: '22', service: 'SSH' },
  { id: '80', label: '80', service: 'HTTP' },
  { id: '443', label: '443', service: 'HTTPS', primary: true },
  { id: '3306', label: '3306', service: 'MySQL' },
  { id: '5432', label: '5432', service: 'Postgres' },
]

export const PRIMARY_LANE_ID = '443'
export const CLIENT_DEST_IP = '203.0.113.10'

// ═══════════════════════════════════════════════
// ACT 1 — Host Bukan Service
// Action id: `ip-ke-port`
// Before: client hanya punya destination IP.
// Intent: client memilih layanan web (HTTPS).
// Travel: packet tiba di host, menyempit ke lane TCP:443.
// Apply: packet masuk lane TCP:443, lane lain tetap tidak menerima.
// After: port memilih service, bukan mesin.
// ═══════════════════════════════════════════════
export const ACT1_TEXT = {
  before: 'Client hanya tahu alamat host',
  travel: 'Packet menuju host tujuan',
  apply: 'Packet masuk lane TCP 443',
  after: 'Port memilih layanan, bukan mesin',
}
