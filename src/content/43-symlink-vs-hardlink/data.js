// src/content/43-symlink-vs-hardlink/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-01 (lihat revisi/2026-09-23-revisi-01-eksekusi-4-act.md):
// Build dari nol mengikuti _docs/SYMLINK_VS_HARDLINK_PLAN.md (4 Act) dan
// pola "1 act = 1 file" (docs/standardizations/07-act-scene-pattern.md).
// Continuity: Act 1-3 memakai InodeChrome (diskBlock Inode persisten +
// dua slot nama file), Act 4 berganti ke DeployChrome (nginx + symlink
// `current` + dua folder versi) — layout titik SENGAJA dibuat simetris
// dengan Act 1-3 (axis sama, tiga baris) supaya terasa "map yang sama,
// konten beda", bukan potongan lepas.
// Icon: inline SVG, tidak ada folder icons/.
// SFX: nama dipakai ulang dari daftar yang sudah diaudit (lihat topic
// 65/67 — docs/standardizations/06-audio-sfx.md), tidak ada sourcing baru.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  INODE: '#FBBF24',     // Amber — blok data fisik / Inode
  HARDLINK: '#34D399',  // Emerald — hard link, dua nama satu Inode
  SYMLINK: '#38BDF8',   // Cyan — symlink, file penunjuk path
  BROKEN: '#F43F5E',    // Rose — dangling symlink
  DEPLOY: '#A78BFA',    // Violet — nginx / zero-downtime deployment
  ACTIVE: '#34D399',
  WARN: '#F43F5E',
}

export const PHASES = [
  { id: 'inode-concept', badge: 'ACT 1 — INODE: NOMOR ASLI DI BALIK NAMA FILE', badgeColor: COLORS.INODE, duration: 9.0 },
  { id: 'hard-link', badge: 'ACT 2 — HARD LINK: DUA PINTU SATU RUANGAN', badgeColor: COLORS.HARDLINK, duration: 10.5 },
  { id: 'symlink', badge: 'ACT 3 — SYMLINK: PAPAN PETUNJUK JALAN', badgeColor: COLORS.SYMLINK, duration: 10.5 },
  { id: 'zero-downtime', badge: 'ACT 4 — ZERO-DOWNTIME DEPLOYMENT', badgeColor: COLORS.DEPLOY, duration: 11.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'SYMLINK & '
export const INTRO_TITLE_B = 'HARD LINK'
export const INTRO_SUBTITLE = 'Dua jenis jalan pintas di Linux'

// ── Layout bersama — axis vertikal tunggal, tiga baris (anchor/nama/target),
// dipakai identik oleh InodeChrome (Act1-3) dan DeployChrome (Act4). ──
export const AXIS_X = 410
export const ROW_ANCHOR_Y = 230
export const ROW_CMD_Y = 350
export const ROW_NAMES_Y = 470
export const ROW_TARGET_Y = 700
export const CLOSING_Y = 1180

// ═══════════════════════════════════════════════
// Titik anchor Act 1-3 — InodeChrome
// ═══════════════════════════════════════════════
export const INODE_PT = { x: AXIS_X, y: ROW_ANCHOR_Y }
export const CMD_PT = { x: AXIS_X, y: ROW_CMD_Y }
export const ORIGINAL_PT = { x: AXIS_X - 160, y: ROW_NAMES_Y }
export const HARDLINK_PT = { x: AXIS_X + 160, y: ROW_NAMES_Y }
export const V1_FOLDER_PT = { x: AXIS_X - 160, y: ROW_TARGET_Y }
export const SYMLINK_PT = { x: AXIS_X + 160, y: ROW_TARGET_Y }

// ═══════════════════════════════════════════════
// Titik anchor Act 4 — DeployChrome (layout simetris dengan Act 1-3)
// ═══════════════════════════════════════════════
export const NGINX_PT = { x: AXIS_X, y: ROW_ANCHOR_Y }
export const CMD2_PT = { x: AXIS_X, y: ROW_CMD_Y }
export const CURRENT_PT = { x: AXIS_X, y: ROW_NAMES_Y }
export const V1_DEPLOY_PT = { x: AXIS_X - 160, y: ROW_TARGET_Y }
export const V2_DEPLOY_PT = { x: AXIS_X + 160, y: ROW_TARGET_Y }

export const INODE_NUMBER = '#1024'
export const INODE_LABEL = 'INODE ' + INODE_NUMBER

// ═══════════════════════════════════════════════
// ACT 1 — Konsep Inode & Nama File
// ═══════════════════════════════════════════════
export const ORIGINAL_LABEL = 'original.txt'
export const ACT1_COPY = {
  diskIntro: 'Harddisk menyimpan data di blok fisik',
  inodeNumber: 'Tiap blok punya nomor unik: Inode',
  nameIsLabel: 'Nama file di direktori cuma LABEL',
  pointsTo: 'original.txt hanyalah penunjuk ke Inode #1024',
}

// ═══════════════════════════════════════════════
// ACT 2 — Hard Link: Dua Pintu Satu Ruangan
// ═══════════════════════════════════════════════
export const HARDLINK_LABEL = 'hardlink.txt'
export const ACT2_CMD_CREATE = '$ ln original.txt hardlink.txt'
export const ACT2_CMD_DELETE = '$ rm original.txt'
export const ACT2_COPY = {
  create: 'Hard link dibuat: nama baru, Inode yang sama persis',
  counterUp: 'Link counter pada Inode bertambah jadi 2',
  bothWork: 'Dua pintu, satu ruangan — datanya identik',
  deleteOriginal: 'original.txt dihapus...',
  dataIntact: 'Isi data tetap utuh, diakses lewat hardlink.txt',
  counterDown: 'Link counter turun jadi 1 — data baru hilang di 0',
}

// ═══════════════════════════════════════════════
// ACT 3 — Symlink: Papan Petunjuk Jalan (ln -s)
// ═══════════════════════════════════════════════
export const SYMLINK_LABEL = 'current'
export const V1_FOLDER_LABEL = '/var/www/v1'
export const ACT3_CMD_CREATE = '$ ln -s /var/www/v1 current'
export const ACT3_CMD_DELETE = '$ rm -rf /var/www/v1'
export const ACT3_COPY = {
  create: 'Symlink dibuat — bukan pintu baru, tapi papan petunjuk',
  isPath: 'Isinya cuma teks path: "/var/www/v1"',
  notInode: 'Tidak nempel ke Inode, link counter original TIDAK berubah',
  deleteTarget: 'Folder v1 dihapus atau dipindah...',
  broken: 'Papan petunjuk jadi PATAH — dangling symlink',
}

// ═══════════════════════════════════════════════
// ACT 4 — Zero-Downtime Deployment
// ═══════════════════════════════════════════════
export const NGINX_LABEL = 'NGINX'
export const CURRENT_LABEL = 'current'
export const V1_DEPLOY_LABEL = 'v1'
export const V2_DEPLOY_LABEL = 'v2'
export const ACT4_CMD_SWAP = '$ ln -sfn /var/www/v2 current'
export const ACT4_COPY = {
  setup: 'Nginx selalu baca lewat symlink current, bukan folder versi',
  pointsV1: 'Sekarang current menunjuk ke v1 — versi live',
  v2Ready: 'v2 sudah siap ter-deploy di samping, belum aktif',
  swap: 'Symlink digeser dari v1 ke v2 dalam satu perintah atomik',
  instant: 'Perubahan terjadi hitungan milidetik',
  noRestart: 'Nginx tidak perlu restart — trafik langsung ke v2',
}

export const CLOSING_CAPTION = 'Hard link = salinan nama untuk data yang sama. Symlink = petunjuk jalan yang bisa patah.'
export const CLOSING_STAMPS = [
  { top: 'HARD LINK', sub: 'aman selama 1 device, tak bisa patah', icon: 'link' },
  { top: 'SYMLINK', sub: 'fleksibel lintas folder, bisa dangling', icon: 'route' },
]

// ═══════════════════════════════════════════════
// SFX MAP — reuse kategori yang sudah diaudit (topic 65/67).
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  LOCK: { category: 'impacts', name: 'lock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
