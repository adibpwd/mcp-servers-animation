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

// ═══════════════════════════════════════════════
// ACT 2 — Listener Menerima
// Action id: `listener-menerima`
// Before: lane :443 ada, process masih redup.
// Intent: packet mengetuk listener.
// Travel: packet bergerak dari lane ke listener/socket lalu process.
// Apply: listener glow; packet masuk ke process.
// After: service benar-benar menerima koneksi.
// ═══════════════════════════════════════════════
export const LISTENERS = [
  { id: 'web', label: 'Web Server', addr: '0.0.0.0:443', laneId: '443', primary: true },
  { id: 'ssh', label: 'sshd', addr: '0.0.0.0:22', laneId: '22' },
]

export const ACT2_TEXT = {
  before: 'Lane 443 ada, proses belum aktif',
  travel: 'Packet mengetuk listener',
  apply: 'Listener menyala, proses menerima',
  after: 'Tanpa listener, port hanya angka',
}

// ═══════════════════════════════════════════════
// ACT 3 — TCP dan UDP
// Action id: `tcp-vs-udp`
// Before: dua lane protocol redup.
// Intent: client memilih jenis komunikasi.
// Travel: TCP SYN → SYN-ACK → ACK; UDP satu datagram langsung.
// Apply: TCP connection state / UDP datagram tiba.
// After: bentuk komunikasi berbeda, bukan sekadar label.
// ═══════════════════════════════════════════════
export const TCP_STEPS = [
  { id: 'syn', label: 'SYN', from: 'client', to: 'server' },
  { id: 'synack', label: 'SYN-ACK', from: 'server', to: 'client' },
  { id: 'ack', label: 'ACK', from: 'client', to: 'server' },
]

export const UDP_DATAGRAM = { id: 'udp-1', label: 'DNS query', port: '53' }

export const ACT3_TEXT = {
  before: 'Dua jalur protokol belum dipakai',
  tcpApply: 'Koneksi TCP resmi terbentuk',
  udpApply: 'Datagram UDP langsung terkirim',
  after: 'TCP menjaga; UDP hanya mengirim',
}

// ═══════════════════════════════════════════════
// ACT 4 — Dua Ujung Koneksi
// Action id: `dua-ujung-port`
// Before: client dan server belum punya endpoint lengkap.
// Intent: client membuka koneksi (lanjutan packet TCP Act 3).
// Travel: source port ephemeral lahir dari client, packet menuju
//         destination listener (lane 443 yang sudah established).
// Apply: kedua endpoint terhubung oleh satu socket line.
// After: source dan destination port punya peran berbeda.
// ═══════════════════════════════════════════════
export const CONNECTION_ENDPOINT = {
  srcPort: '51789',
  dstPort: '443',
}

export const ACT4_TEXT = {
  before: 'Kedua sisi koneksi belum lengkap',
  travel: 'Source port ephemeral lahir di client',
  apply: 'Satu socket line ikat dua ujung',
  after: 'Source sementara, destination tetap',
}

// ═══════════════════════════════════════════════
// ACT 5 — Scope dan Firewall
// Action id: `scope-dan-policy`
// Before: listener tersedia tapi scope/policy belum jelas.
// Intent: packet BARU datang dari jaringan luar (bukan lanjutan
//         packet client asli — actor baru sesuai narasi eksplisit).
// Travel: packet mencoba bind scope lalu policy gate.
// Apply: jalur valid diteruskan atau berhenti di gate.
// After: listen dan allowed adalah pemeriksaan berbeda.
// ═══════════════════════════════════════════════
export const BIND_SCOPES = [
  { id: 'loopback', label: 'Loopback 127.0.0.1', reach: 'Mesin sendiri saja' },
  { id: 'private', label: 'Private Interface', reach: 'Jaringan privat saja' },
  { id: 'all', label: 'All Interfaces 0.0.0.0', reach: 'Semua jaringan', active: true },
]

export const FIREWALL_OUTCOME = { allowed: true, reason: 'Policy izinkan port 443' }

export const ACT5_TEXT = {
  before: 'Listener siap, jalur luar belum diuji',
  scopeApply: 'Bind scope izinkan semua interface',
  policyApply: 'Policy periksa jalur packet',
  after: 'Listening dan diizinkan itu beda',
}

// ═══════════════════════════════════════════════
// ACT 6 — Jalur Nyata
// Action id: `edge-ke-backend`
// Before: public endpoint dan backend terpisah.
// Intent: client BARU menuju public endpoint (actor publik, terpisah
//         dari packet Act 5 — sesuai narasi "client menuju public IP").
// Travel: packet melalui NAT/proxy/load-balancer ke backend.
// Apply: backend menerima request; health signal muncul setelah respons.
// After: port terbuka bukan bukti aplikasi sehat.
// ═══════════════════════════════════════════════
export const REAL_PATH_HOPS = [
  { id: 'edge', label: 'Public 198.51.100.7:443' },
  { id: 'nat', label: 'NAT / Load Balancer' },
  { id: 'backend', label: 'Backend 10.0.0.5:8443' },
]

export const HEALTH_RESULT = { open: true, responds: true, healthy: false }

export const ACT6_TEXT = {
  before: 'Public endpoint dan backend terpisah',
  travel: 'Packet melalui NAT ke backend',
  apply: 'Backend terima request, respons dikirim',
  after: 'Port terbuka bukan bukti sehat',
}

// ═══════════════════════════════════════════════
// SFX MAP — nama dipakai ulang dari daftar yang sudah diaudit di
// 17-rest-api / 44-ssh (public/audio/*), tidak ada sourcing baru.
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  LOCK: { category: 'impacts', name: 'lock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
