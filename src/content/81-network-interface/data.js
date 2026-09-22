// src/content/81-network-interface/data.js
// ─────────────────────────────────────────────────────────────
// Lihat _docs/NETWORK_INTERFACE_PLAN.md untuk storyboard 6 Act,
// model mental, dan Batas Aman (tidak ada IP/MAC nyata, tidak ada
// command, tidak ada perubahan network).
// Scene shell: scene-ui V1 (portrait 820x1340) — IntroHeaderMorphV1 +
// ActBadgeNavigatorV1 + ContentBodyV1.
// Icon: inline SVG (tidak ada folder icons/), konsisten dengan pola
// 44-ssh dan 91-linux-server.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111827',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  WIRED: '#38BDF8',    // Sky — interface fisik wired
  WIFI: '#A78BFA',     // Violet — interface wireless
  LOOPBACK: '#94A3B8', // Slate — interface loopback
  LINK: '#FBBF24',     // Amber — link state/carrier
  MAC: '#F472B6',      // Pink — identitas link-layer
  IP: '#34D399',       // Emerald — identitas layer jaringan
  CONFIG: '#FB923C',   // Orange — DHCP/static
  ROUTE: '#F472B6',    // Pink — gateway/route
  DNS: '#22D3EE',      // Cyan — DNS
  VIRTUAL: '#C084FC',  // Purple — interface virtual

  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  RISK: '#F87171',
}

// Total durasi diukur ulang dari timeline nyata setelah preview manual —
// angka di bawah estimasi awal untuk badge saja (pola sama dengan
// 91-linux-server/data.js).
export const PHASES = [
  { id: 'titik-koneksi', badge: 'ACT 1 — TITIK KONEKSI', badgeColor: COLORS.WIRED, duration: 8 },
  { id: 'link-dan-identity', badge: 'ACT 2 — LINK DAN IDENTITY', badgeColor: COLORS.MAC, duration: 9 },
  { id: 'mendapat-konfigurasi', badge: 'ACT 3 — MENDAPAT KONFIGURASI', badgeColor: COLORS.CONFIG, duration: 9 },
  { id: 'memilih-jalan', badge: 'ACT 4 — MEMILIH JALAN', badgeColor: COLORS.ROUTE, duration: 9 },
  { id: 'nama-ke-tujuan', badge: 'ACT 5 — NAMA KE TUJUAN', badgeColor: COLORS.DNS, duration: 9 },
  { id: 'interface-virtual', badge: 'ACT 6 — INTERFACE VIRTUAL', badgeColor: COLORS.VIRTUAL, duration: 9 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS · NETWORKING'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'NETWORK'
export const INTRO_TITLE_B = ' INTERFACE'
export const INTRO_SUBTITLE = 'Titik koneksi OS ke jaringan'

// ── Anchor persisten — 1 interface card ("eth0") yang settle di akhir
// Act 1 dan TIDAK PERNAH dihapus sampai penutup Act 5 (Continuity
// Contract §1.O, pola sama SERVER_ANCHOR 91-linux-server). Act 6
// (interface virtual) sengaja TIDAK memakai anchor ini — bahasannya
// justru interface LAIN di luar eth0 (lihat Animation.jsx Act 6). ──
export const ANCHOR_POS = { x: 366, y: 470 }

// Copy layar (§Copy layar di plan) — dipakai lintas Act sebagai
// caption/badge singkat, deklaratif, tanpa kata tanya/emoji/kata ganti
// orang (lihat 03-planning-storytelling-quality-gate.md § Wording).
export const COPY = {
  INTERFACE_IS_CONNECTION_POINT: 'Interface adalah titik koneksi OS.',
  LINK_NOT_INTERNET: 'Link up belum tentu internet siap.',
  MAC_IP_DIFFERENT_ROLE: 'MAC dan IP punya peran berbeda.',
  GATEWAY_CHOOSES_EXIT: 'Gateway memilih jalan keluar.',
  DNS_TRANSLATES_NOT_CARRIES: 'DNS menerjemahkan nama, bukan membawa paket.',
  VIRTUAL_IS_ALSO_INTERFACE: 'Jalur virtual juga interface.',
}

// ── Act 1 — Titik koneksi: 3 jenis interface pada 1 laptop. ──
export const INTERFACE_TYPES = [
  { id: 'wired', label: 'Wired (eth0)', desc: 'Kartu jaringan lewat kabel', color: COLORS.WIRED },
  { id: 'wifi', label: 'Wi-Fi (wlan0)', desc: 'Kartu jaringan nirkabel', color: COLORS.WIFI },
  { id: 'loopback', label: 'Loopback (lo)', desc: 'Jalur mesin ke dirinya sendiri', color: COLORS.LOOPBACK },
]

export const ACT1_BEATS = {
  hook: { caption: 'Laptop bisa punya beberapa titik koneksi sekaligus.' },
  reveal: { caption: COPY.INTERFACE_IS_CONNECTION_POINT },
  settle: { caption: 'Fokus ke satu interface: eth0.' },
}

// ── Act 2 — Link dan identity: layer link/MAC/IP di atas anchor. ──
export const IDENTITY_LAYERS = [
  { id: 'link', label: 'Link', desc: 'Carrier fisik/Wi-Fi — sinyal ada', color: COLORS.LINK },
  { id: 'mac', label: 'MAC', desc: 'Identitas link-layer, relevan di jaringan lokal', color: COLORS.MAC },
  { id: 'ip', label: 'IP / prefix', desc: 'Identitas layer jaringan dan cakupan subnet', color: COLORS.IP },
]

export const ACT2_BEATS = {
  intro: { caption: COPY.LINK_NOT_INTERNET },
  layering: { caption: 'MAC dan IP menumpuk di atas link yang sama.' },
  closing: { caption: COPY.MAC_IP_DIFFERENT_ROLE },
}

// ── Act 3 — Mendapat konfigurasi: DHCP/static → address, gateway, DNS. ──
export const CONFIG_PATHS = [
  { id: 'dhcp', label: 'DHCP', desc: 'Alamat diminta otomatis ke jaringan', color: COLORS.CONFIG },
  { id: 'static', label: 'Static', desc: 'Alamat ditulis manual di konfigurasi', color: COLORS.CONFIG },
]

export const CONFIG_RESULTS = [
  { id: 'address', label: 'Address', desc: 'IP/prefix milik interface ini', color: COLORS.IP },
  { id: 'gateway', label: 'Gateway', desc: 'Titik keluar ke jaringan lain', color: COLORS.ROUTE },
  { id: 'dns', label: 'DNS', desc: 'Server penerjemah nama', color: COLORS.DNS },
]

export const ACT3_BEATS = {
  intro: { caption: 'IP saja belum melengkapi koneksi.' },
  chosen: { caption: 'DHCP atau static — dua cara mendapat alamat.' },
  closing: { caption: 'Gateway dan DNS datang bersama alamat.' },
}

// ── Act 4 — Memilih jalan: paket ke subnet lokal atau default gateway. ──
export const ROUTE_TARGETS = [
  { id: 'local', label: 'Subnet lokal', desc: 'Tujuan satu jaringan — langsung terkirim', color: COLORS.IP },
  { id: 'gateway', label: 'Default gateway', desc: 'Tujuan di luar subnet — lewat gateway', color: COLORS.ROUTE },
]

export const ACT4_BEATS = {
  intro: { caption: 'Paket harus tahu ke mana keluar.' },
  local: { caption: 'Tujuan di subnet sama, langsung ke sana.' },
  gateway: { caption: 'Tujuan di luar subnet, lewat gateway.' },
  closing: { caption: COPY.GATEWAY_CHOOSES_EXIT },
}

// ── Act 5 — Nama ke tujuan: DNS name → address → route → interface. ──
export const NAME_HOPS = [
  { id: 'name', label: 'Nama', desc: 'Aplikasi mengenal nama, bukan angka', color: COLORS.TEXT },
  { id: 'dns', label: 'DNS', desc: 'Nama diterjemahkan jadi address', color: COLORS.DNS },
  { id: 'route', label: 'Route', desc: 'Address lewat route yang sudah dikenal', color: COLORS.ROUTE },
  { id: 'interface', label: 'Interface', desc: 'Paket keluar lewat eth0', color: COLORS.WIRED },
]

export const ACT5_BEATS = {
  intro: { caption: 'Aplikasi mengenal nama, bukan angka.' },
  resolve: { caption: 'DNS mengubah nama jadi address.' },
  closing: { caption: COPY.DNS_TRANSLATES_NOT_CARRIES },
}

// ── Act 6 — Interface virtual: loopback, bridge, VLAN, VPN, container.
// Act ini SENGAJA tidak memakai ANCHOR_POS (eth0) — bahasannya interface
// lain yang bukan kartu fisik, disusun sebagai chip row (pola sama
// COMPUTE_FORMS 91-linux-server). ──
export const VIRTUAL_INTERFACES = [
  { id: 'loopback', label: 'Loopback', desc: 'Jalur mesin ke dirinya sendiri', color: COLORS.LOOPBACK },
  { id: 'bridge', label: 'Bridge', desc: 'Menyatukan beberapa interface jadi satu segmen', color: COLORS.VIRTUAL },
  { id: 'vlan', label: 'VLAN', desc: 'Membagi satu link jadi beberapa jaringan logis', color: COLORS.VIRTUAL },
  { id: 'vpn', label: 'VPN / tunnel', desc: 'Jalur terenkripsi di atas jaringan lain', color: COLORS.VIRTUAL },
  { id: 'container', label: 'Container', desc: 'Interface virtual milik container', color: COLORS.VIRTUAL },
]

export const ACT6_BEATS = {
  intro: { caption: 'Tidak semua interface kartu fisik.' },
  reveal: { caption: 'Bridge, VLAN, VPN, dan container juga punya interface sendiri.' },
  closing: { caption: COPY.VIRTUAL_IS_ALSO_INTERFACE },
}

// ── SFX_MAP — nama file diverifikasi ada di public/audio/ (audit
// sebelum dipakai, sama seperti 91-linux-server/data.js). Kategori:
// ui, transitions, impacts, success, warnings. ──
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh-2' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  KEY_TURN: { category: 'impacts', name: 'key-turn' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  COMPLETE: { category: 'success', name: 'complete' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  SOFT_DENY: { category: 'warnings', name: 'soft-deny' },
}
