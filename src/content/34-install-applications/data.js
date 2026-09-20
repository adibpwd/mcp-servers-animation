// src/content/34-install-applications/data.js
// Revisi 01 (2026-09-16) — mengikuti revisi/2026-09-16-revisi-01-rich-install-flow.md.
// Delapan Act: distro menentukan ekosistem -> manager punya tugas sama ->
// repository berada di jaringan -> source punya jenis berbeda -> rencana
// dulu -> arsip masuk dari internet -> pasang sungguhan (verify/unpack/
// configure/record) -> app siap & dapat dikelola. Tidak ada command
// runnable, alamat repo nyata, kredensial, atau instalasi sungguhan.
// Logo distro TIDAK diaudit dari sini (tidak ada akses browsing/download
// aset) — memakai chip wordmark teks netral sesuai fallback plan bagian 3
// poin 3, bukan reproduksi logo asli.

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111C31',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#64748B',
  INTRO_A: '#38BDF8',
  INTRO_B: '#34D399',
  REPO: '#38BDF8',
  NETWORK: '#22D3EE',
  SUCCESS: '#34D399',
  ACTIVITY: '#FB923C',
  DEPENDENCY: '#A78BFA',
  ADMIN: '#FBBF24',
  DANGER: '#F43F5E',
}

// Local coordinate ContentBodyV1 (732 x 965).
export const ZONE = {
  CAPTION: { yStart: 18, yEnd: 66 },
  TERMINAL: { yStart: 82, yEnd: 200 },
  HUB: { yStart: 216, yEnd: 358 },
  TRANSIT: { yStart: 374, yEnd: 686 },
  GATE: { yStart: 702, yEnd: 822 },
  CLOSING: { yStart: 858, yEnd: 936 },
}

export const HUB_CENTER = { x: 366, y: ZONE.HUB.yStart + 60 }
export const CAROUSEL_Y = ZONE.HUB.yEnd - 24
export const GATE_CENTER = { x: 366, y: (ZONE.GATE.yStart + ZONE.GATE.yEnd) / 2 }
export const TRANSIT_TOP = ZONE.TRANSIT.yStart + 10
export const NETWORK_CENTER = { x: 366, y: TRANSIT_TOP + 74 }
export const CACHE_CENTER = { x: 366, y: TRANSIT_TOP + 150 }

// ── Delapan Act (revisi bagian 7) — target ritme 105-125 detik. ──
export const PHASES = [
  { id: 'distro',   badge: 'ACT 1 — DISTRO MENENTUKAN EKOSISTEM', badgeColor: COLORS.INTRO_A,    duration: 12.0 },
  { id: 'manager',  badge: 'ACT 2 — MANAGER PUNYA TUGAS SAMA',    badgeColor: COLORS.ACTIVITY,   duration: 18.0 },
  { id: 'network',  badge: 'ACT 3 — REPOSITORY DI JARINGAN',      badgeColor: COLORS.NETWORK,    duration: 14.0 },
  { id: 'sources',  badge: 'ACT 4 — SOURCE PUNYA JENIS BERBEDA',  badgeColor: COLORS.REPO,       duration: 18.0 },
  { id: 'plan',     badge: 'ACT 5 — RENCANA DULU',                badgeColor: COLORS.DEPENDENCY, duration: 14.0 },
  { id: 'download', badge: 'ACT 6 — ARSIP MASUK DARI INTERNET',   badgeColor: COLORS.NETWORK,    duration: 14.0 },
  { id: 'install',  badge: 'ACT 7 — PASANG SUNGGUHAN',            badgeColor: COLORS.ADMIN,      duration: 20.0 },
  { id: 'ready',    badge: 'ACT 8 — APP SIAP & DAPAT DIKELOLA',   badgeColor: COLORS.SUCCESS,    duration: 10.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'INSTALL '
export const INTRO_TITLE_B = 'APPS'
export const INTRO_SUBTITLE = 'Dari internet ke sistem Linux'

export const PROJECT_PATH = '~/Projects/website-demo'

export const PACKAGE = {
  id: 'editor-lite',
  label: 'editor-lite',
}

export const DEPENDENCIES = [
  { id: 'ui-kit', label: 'ui-kit' },
  { id: 'text-engine', label: 'text-engine' },
]

// ── Distro (Act 1, revisi bagian 3 & 7; diperluas revisi 04) — chip
// wordmark + logo asli (icons/icons.json). Setiap distro membawa
// managerId + pkgFormat eksplisit supaya Act 1 bisa menunjukkan preview
// "distro -> manager -> format paket" langsung, bukan cuma highlight
// bergantian tanpa makna. `color` dipakai untuk connector/pulse saat
// distro itu aktif (hex resmi brand, sinkron dengan icons/_originals/
// LICENSE-LOGOS.md). ──
export const DISTROS = [
  { id: 'ubuntu',   label: 'Ubuntu',    family: 'Debian family',      managerId: 'apt',    pkgFormat: '.deb',      color: '#E95420' },
  { id: 'fedora',   label: 'Fedora',    family: 'RHEL family',        managerId: 'dnf',    pkgFormat: '.rpm',      color: '#51A2DA' },
  { id: 'arch',     label: 'Arch',      family: 'Arch family',        managerId: 'pacman', pkgFormat: '.pkg.tar',  color: '#1793D1' },
  { id: 'opensuse', label: 'openSUSE',  family: 'SUSE family',        managerId: 'zypper', pkgFormat: '.rpm',      color: '#73BA25' },
  { id: 'alpine',   label: 'Alpine',    family: 'minimal/container',  managerId: 'apk',    pkgFormat: '.apk',      color: '#0D597F' },
]
export const DISTRO_TAKEAWAY = 'Distro menentukan manager dan source policy'

// ── Manager berbeda menurut keluarga distro (revisi bagian 5) — carousel
// lima stasiun, bukan tabel/daftar yang muncul bersamaan. ──
export const MANAGERS = [
  { id: 'apt',    label: 'apt',    family: 'Debian / Ubuntu / Mint', format: '.deb',         badge: 'same job: plan \u2192 install' },
  { id: 'dnf',    label: 'dnf',    family: 'Fedora / RHEL / Rocky',  format: '.rpm',          badge: 'RPM ecosystem' },
  { id: 'pacman', label: 'pacman', family: 'Arch / Manjaro',         format: '.pkg.tar.*',    badge: 'own format & policy' },
  { id: 'zypper', label: 'zypper', family: 'openSUSE / SLE',         format: '.rpm',          badge: 'same format, different manager' },
  { id: 'apk',    label: 'apk',    family: 'Alpine Linux',           format: '.apk',          badge: 'lightweight / minimal' },
]
export const MANAGER_TAKEAWAY = 'Semua mengelola transaction package'

// ── Peta repository (revisi bagian 4) — enam sumber, katalog metadata
// dulu sebelum arsip package. Act 3 hanya memakai official+mirror untuk
// menunjukkan topologi jaringan; Act 4 memakai seluruh daftar untuk pan
// satu per satu. ──
export const REPO_SOURCES = [
  { id: 'official',  label: 'Official repository',  note: 'Titik awal default distro, bukan seluruh internet' },
  { id: 'security',  label: 'Security updates',      note: 'Saluran update khusus dalam ekosistem distro' },
  { id: 'mirror',    label: 'Official mirror',       note: 'Salinan tersinkron; bukan pembuat package' },
  { id: 'community', label: 'Community repository',  note: 'Kurasi dan tingkat trust dapat berbeda' },
  { id: 'vendor',    label: 'Vendor repository',     note: 'Perlu asal, key/trust, kebijakan update jelas' },
  { id: 'local',     label: 'Local repository',      note: 'Mirror organisasi/internal, tak perlu internet aktif' },
]
export const REPO_MATCH_ID = 'official'
export const MIRROR_ID = 'mirror'

// ── Transaction plan (revisi bagian 6) — angka contoh, deklaratif, bukan
// command runnable. ──
export const TRANSACTION_PLAN = {
  newPackages: 3,
  downloadSize: '4.8 MB',
  diskSpace: '+12.3 MB',
}

// ── Empat sub-tahap Act 7 "Pasang sungguhan" (revisi bagian 6). Approval
// terjadi di akhir Act 5 (system-change gate); download punya conveyor
// tersendiri di Act 6. ──
export const INSTALL_STAGES = [
  { id: 'verify',    label: 'Verifikasi' },
  { id: 'unpack',    label: 'Unpack' },
  { id: 'configure', label: 'Konfigurasi' },
  { id: 'record',    label: 'Record' },
]

// ── File hasil unpack (revisi bagian 6, baris "Unpack") — bukti file
// sudah ditempatkan ke shelf sistem yang berbeda. ──
export const UNPACK_FILES = [
  { id: 'binary',  label: 'binary' },
  { id: 'library', label: 'library' },
  { id: 'desktop', label: 'desktop entry' },
  { id: 'docs',    label: 'docs' },
]

// ── Lifecycle lanjut (revisi bagian 6 & Act 8) — database menjaga app
// tetap bisa di-update/remove nanti, bukan cuma "selesai". ──
export const LIFECYCLE_ACTIONS = [
  { id: 'update', label: 'update' },
  { id: 'remove', label: 'remove' },
]

// ── Copy layar (revisi bagian 9) — narasi "internet" dibatasi pada Act 3
// dan 6, langsung diikuti batas akurat (repository/mirror terkonfigurasi). ──
export const CAPTIONS = {
  DISTRO: 'Tiap distro punya package manager dan format paket bawaan sendiri',
  MANAGER: 'Tool berbeda, pekerjaan inti serupa',
  NETWORK: 'Repository terkonfigurasi ada di jaringan',
  MIRROR: 'Mirror menyalin repository resmi',
  SOURCES: 'Setiap source punya peran dan trust berbeda',
  METADATA: 'Metadata memilih package dan kebutuhan',
  PLAN_READY: 'Rencana selesai sebelum sistem berubah',
  AUTHORIZE: 'Perubahan sistem perlu izin',
  DOWNLOAD: 'Archive diunduh, belum terpasang',
  VERIFY: 'Archive diperiksa sebelum dipasang',
  UNPACK: 'Isi archive ditempatkan ke sistem',
  CONFIGURE: 'Konfigurasi dan trigger diselesaikan',
  RECORD: 'Database mencatat hasil transaction',
  READY: 'Package terpasang dan dapat dikelola',
  TAKEAWAY: 'Pilih source yang sesuai distro',
}

// ── Baris terminal — log konseptual, tanpa command runnable/sudo/alamat
// repo nyata (acceptance criteria bagian 10). ──
export const TERMINAL_LINES = {
  REQUEST: '> editor-lite belum terpasang',
  OUT_DISTRO: 'OS terdeteksi: Ubuntu \u2192 auto-select manager: apt (.deb)',
  OUT_MANAGER: 'Manager dipilih sesuai keluarga distro',
  OUT_NETWORK: 'Menghubungi repository terkonfigurasi...',
  OUT_FOUND: 'editor-lite ditemukan di official repository',
  OUT_SOURCES: 'Source terbaca: official, security, mirror, community, vendor, local',
  OUT_TREE: 'Menyusun dependency tree... selesai',
  OUT_PLAN: '3 package baru, 4.8 MB unduhan',
  OUT_APPROVE: 'Izin sistem diberikan',
  OUT_DOWNLOAD: 'Archive diterima dari mirror... 4.8 MB',
  OUT_VERIFY: 'Signature archive terverifikasi',
  OUT_UNPACK: 'Membongkar isi archive...',
  OUT_CONFIGURE: 'Menjalankan konfigurasi & trigger...',
  OUT_RECORD: 'editor-lite tercatat: installed',
}

// Badge kecil yang menempel pada package card, berubah tiap Apply.
export const CARD_BADGE = {
  need: 'belum terpasang',
  distro: 'menunggu distro...',
  'manager-known': 'via {manager}',
  network: 'menelusuri jaringan...',
  found: 'official repository',
  sources: 'membaca source...',
  resolving: '+2 dependencies',
  'plan-ready': 'rencana siap',
  authorize: 'menunggu izin',
  download: 'mengunduh...',
  verify: 'memeriksa arsip...',
  unpack: 'membongkar...',
  configure: 'mengonfigurasi...',
  record: 'mencatat...',
  installed: 'installed',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  TICK: { category: 'ui', name: 'tick' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  ARRIVE: { category: 'ui', name: 'paper-arrive' },
  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
}
