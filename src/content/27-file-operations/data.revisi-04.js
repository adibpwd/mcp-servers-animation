// src/content/27-file-operations/data.js
// Revisi-03b (2026-09-16) — perbaikan dari revisi-03: file/folder baru
// SEKARANG tidak dirender sama sekali sebelum command apply ke GUI (bukan
// slot "pending" bergaris putus2), grid me-reflow otomatis saat item
// bertambah/hilang, dan command baca (cat/less/head/tail -f) membuka panel
// preview isi file. Backup sebelum perubahan ini: lihat *-backup-20260916.*
// STATUS: entry aktif.

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
  CREATE: '#FB923C',
  COPY: '#A78BFA',
  READ: '#22D3EE',
  FIND: '#F472B6',
  DANGER: '#F43F5E',
  WARNING: '#FBBF24',
  SUCCESS: '#34D399',
}

export const ZONE = {
  CAPTION: { yStart: 18, yEnd: 68 },
  GRID: { yStart: 92, yEnd: 468 },
  MOTION: { yStart: 495, yEnd: 615 },
  TERMINAL_BOTTOM: 858,
  CLOSING: { yStart: 884, yEnd: 946 },
}

export const TERM_HEADER_H = 42
export const TERM_PAD_Y = 14
export const TERM_ROW_H = 22
export const TERM_MIN_ROWS = 2
export const TERM_MAX_ROWS = 6

export function terminalHeightFor(historyLength) {
  const rowCount = Math.min(TERM_MAX_ROWS, Math.max(TERM_MIN_ROWS, historyLength + 1))
  return TERM_HEADER_H + TERM_PAD_Y * 2 + rowCount * TERM_ROW_H
}

export function truncateTerminalLine(text, max = 58) {
  if (text.length <= max) return text
  return text.slice(0, max - 1) + '…'
}

export const PHASES = [
  { id: 'create-copy', badge: 'ACT 1 — BUAT DAN SALIN',        badgeColor: COLORS.CREATE, duration: 8.5 },
  { id: 'move-delete',  badge: 'ACT 2 — PINDAH DAN HAPUS AMAN', badgeColor: COLORS.DANGER, duration: 8.0 },
  { id: 'read',         badge: 'ACT 3 — BACA ISI YANG TEPAT',   badgeColor: COLORS.READ,   duration: 11.5 },
  { id: 'find',         badge: 'ACT 4 — TEMUKAN FILE',          badgeColor: COLORS.FIND,   duration: 9.5 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'FILE '
export const INTRO_TITLE_B = 'OPERATIONS'
export const INTRO_SUBTITLE = 'Buat, salin, pindah, hapus dengan aman'

export const PROJECT_PATH = '~/Projects/website-demo'

export const CAPTIONS = {
  MKDIR: 'mkdir -p membuat beberapa folder sekaligus',
  TOUCH: 'touch membuat file kosong',
  CP: 'cp menyalin, sumber tetap ada',
  MV: 'mv memindah sekaligus mengganti nama',
  RM_ASK: 'Cek target sebelum menghapus',
  RM_CONFIRM: 'Konfirmasi y baru menghapus',
  CAT: 'cat menampilkan seluruh isi file',
  LESS: 'less membaca file panjang bertahap',
  HEAD: 'head menampilkan baris awal',
  TAILF: 'tail -f mengikuti log baru',
  FIND: 'find memindai folder satu per satu',
  LOCATE: 'locate langsung lompat lewat indeks',
  TAKEAWAY: 'Terminal dan file manager, objek sama',
}

// ── Katalog SEMUA kemungkinan item top-level (yang sudah ada + yang akan
// dibuat command). Item hanya dirender kalau id-nya ada di `activeIds`. ──
export const FILE_CATALOG = {
  changelog:   { id: 'changelog',   kind: 'file',   glyph: 'markdown', label: 'CHANGELOG.md',  colorKey: 'read' },
  config:      { id: 'config',      kind: 'file',   glyph: 'config',   label: 'config.ini',     colorKey: 'read' },
  applog:      { id: 'applog',      kind: 'file',   glyph: 'log',      label: 'app.log',         colorKey: 'read' },
  'old-draft': { id: 'old-draft',   kind: 'file',   glyph: 'markdown', label: 'old-draft.txt',   colorKey: 'muted' },
  src:         { id: 'src',         kind: 'folder', label: 'src/',      colorKey: 'create' },
  assets:      { id: 'assets',      kind: 'folder', label: 'assets/',   colorKey: 'create' },
  readme:      { id: 'readme',      kind: 'file',   glyph: 'markdown', label: 'README.md',      colorKey: 'create' },
}

// Item yang ADA sejak sebelum animasi mulai. src/assets/readme sengaja
// tidak masuk sini — mereka baru muncul saat command mkdir/mv di-apply.
export const INITIAL_IDS = ['changelog', 'config', 'applog', 'old-draft']

export const NESTED_BADGE = {
  INDEX_HTML: { id: 'index-html', parent: 'src',    glyph: 'html',  label: 'index.html' },
  BANNER:     { id: 'banner',     parent: 'assets', glyph: 'image', label: 'banner.png' },
}

// ── Layout grid dinamis: reflow otomatis sesuai jumlah item aktif ──
export const GRID = {
  rowY: [195, 335],
  tileW: 128,
  tileH: 80,
  gapX: 22,
  maxCols: 4,
}

// Folder ditaruh duluan (stabil, sesuai urutan dibuat), baru file.
export function orderIds(rawIds) {
  return [...rawIds].sort((a, b) => {
    const ka = FILE_CATALOG[a]?.kind === 'folder' ? 0 : 1
    const kb = FILE_CATALOG[b]?.kind === 'folder' ? 0 : 1
    if (ka !== kb) return ka - kb
    return rawIds.indexOf(a) - rawIds.indexOf(b)
  })
}

export function computeGridLayout(orderedIds) {
  const n = orderedIds.length
  const positions = {}
  if (n === 0) return positions
  const cols = Math.min(GRID.maxCols, Math.max(2, Math.ceil(n / 2)))
  const rows = Math.ceil(n / cols)
  let idx = 0
  for (let r = 0; r < rows; r += 1) {
    const remaining = n - idx
    const rowCount = Math.min(cols, remaining)
    const totalW = rowCount * GRID.tileW + (rowCount - 1) * GRID.gapX
    const startX = 366 - totalW / 2 + GRID.tileW / 2
    for (let c = 0; c < rowCount; c += 1) {
      positions[orderedIds[idx]] = {
        x: startX + c * (GRID.tileW + GRID.gapX),
        y: GRID.rowY[Math.min(r, GRID.rowY.length - 1)],
      }
      idx += 1
    }
  }
  return positions
}

// ── Konten dummy untuk panel preview file (cat/less/head/tail -f) ──
export const PREVIEW_CONTENT = {
  readme: {
    filename: 'README.md',
    lines: [
      '# website-demo',
      '',
      'Starter project untuk demo file operations.',
      '',
      'npm install',
      'npm run dev',
    ],
  },
  changelog: {
    filename: 'CHANGELOG.md',
    lines: [
      '## v1.3.0',
      '- Tambah dark mode',
      '## v1.2.0',
      '- Perbaiki bug login',
      '## v1.1.0',
      '- Optimasi loading gambar',
      '## v1.0.0',
      '- Rilis pertama',
    ],
  },
  config: {
    filename: 'config.ini',
    lines: [
      '[server]',
      'port=3000',
      'host=localhost',
      'timeout=30',
      '[database]',
      'name=demo_db',
      'user=admin',
    ],
  },
  applog: {
    filename: 'app.log',
    lines: [
      '10:22:01 INFO  server started',
      '10:22:03 INFO  db connected',
      '10:22:10 WARN  slow query 480ms',
      '10:22:15 INFO  GET /api/users',
      '10:22:22 INFO  POST /api/login',
      '10:22:30 ERROR timeout upstream',
    ],
  },
}

// Tiap step = satu baris terminal. `full` = true → 5 tahap
// (type→enter→travel→apply→explain). `full:false` (default kind 'out')
// → langsung apply+explain, karena baris ini output lanjutan.
export const TERMINAL_STEPS = [
  // ── Act 1 — buat dan salin ──
  { act: 0, kind: 'cmd', full: true, text: '$ mkdir -p src assets', color: 'create', gui: 'mkdir', target: ['src', 'assets'] },
  { act: 0, kind: 'cmd', full: true, text: '$ touch src/index.html', color: 'create', gui: 'touch', target: ['src'] },
  { act: 0, kind: 'cmd', full: true, text: '$ cp ~/Downloads/banner-draft.png assets/banner.png', color: 'copy', gui: 'cp', target: ['assets'], holdExtra: 0.4 },
  { act: 0, kind: 'out', text: 'copied: banner.png', color: 'muted' },

  // ── Act 2 — pindah dan hapus aman ──
  { act: 1, kind: 'cmd', full: true, text: '$ mv ~/Documents/brief.txt README.md', color: 'create', gui: 'mv', target: ['readme'], holdExtra: 0.3 },
  { act: 1, kind: 'cmd', full: true, text: '$ rm -i old-draft.txt', color: 'warning', gui: 'rm-ask', target: ['old-draft'] },
  { act: 1, kind: 'out', full: true, text: 'rm: remove old-draft.txt? y', color: 'danger', gui: 'rm-confirm', target: ['old-draft'], holdExtra: 0.3 },

  // ── Act 3 — baca isi yang tepat ──
  { act: 2, kind: 'cmd', full: true, text: '$ cat README.md', color: 'read', gui: 'cat', target: ['readme'], previewId: 'readme', holdExtra: 0.7 },
  { act: 2, kind: 'cmd', full: true, text: '$ less CHANGELOG.md', color: 'read', gui: 'less', target: ['changelog'], previewId: 'changelog', holdExtra: 1.6 },
  { act: 2, kind: 'cmd', full: true, text: '$ head config.ini', color: 'read', gui: 'head', target: ['config'], previewId: 'config', holdExtra: 0.7 },
  { act: 2, kind: 'cmd', full: true, text: '$ tail -f app.log', color: 'read', gui: 'tailf', target: ['applog'], previewId: 'applog', holdExtra: 1.7 },

  // ── Act 4 — temukan file ──
  { act: 3, kind: 'cmd', full: true, text: '$ find . -name "banner.png"', color: 'find', gui: 'find', target: ['assets'], holdExtra: 1.2 },
  { act: 3, kind: 'out', text: './assets/banner.png', color: 'muted' },
  { act: 3, kind: 'cmd', full: true, text: '$ locate banner.png', color: 'find', gui: 'locate', target: ['assets'], holdExtra: 0.3 },
  { act: 3, kind: 'out', text: 'catatan: indeks bisa tertinggal', color: 'muted' },
]

export const CAPTION_BY_CMD = {
  '$ mkdir -p src assets': CAPTIONS.MKDIR,
  '$ touch src/index.html': CAPTIONS.TOUCH,
  '$ cp ~/Downloads/banner-draft.png assets/banner.png': CAPTIONS.CP,
  '$ mv ~/Documents/brief.txt README.md': CAPTIONS.MV,
  '$ rm -i old-draft.txt': CAPTIONS.RM_ASK,
  'rm: remove old-draft.txt? y': CAPTIONS.RM_CONFIRM,
  '$ cat README.md': CAPTIONS.CAT,
  '$ less CHANGELOG.md': CAPTIONS.LESS,
  '$ head config.ini': CAPTIONS.HEAD,
  '$ tail -f app.log': CAPTIONS.TAILF,
  '$ find . -name "banner.png"': CAPTIONS.FIND,
  '$ locate banner.png': CAPTIONS.LOCATE,
}

export const GUI_VERB = {
  mkdir: { text: 'mkdir -p', color: 'create' },
  touch: { text: 'touch', color: 'create' },
  cp: { text: 'cp', color: 'copy' },
  mv: { text: 'mv', color: 'create' },
  'rm-ask': { text: 'rm -i', color: 'warning' },
  'rm-confirm': { text: 'rm -i (y)', color: 'danger' },
  cat: { text: 'cat', color: 'read' },
  less: { text: 'less', color: 'read' },
  head: { text: 'head', color: 'read' },
  tailf: { text: 'tail -f', color: 'read' },
  find: { text: 'find', color: 'find' },
  locate: { text: 'locate', color: 'find' },
}

export const CHANGE_BADGE = {
  mkdir: '+ folder',
  touch: '+ file',
  cp: '+ copy',
  mv: 'moved',
  'rm-ask': 'menunggu (y/N)',
  'rm-confirm': 'removed',
  find: 'ditemukan',
  locate: 'dari indeks',
}

export const LINE_COLOR = {
  create: COLORS.CREATE,
  copy: COLORS.COPY,
  read: COLORS.READ,
  find: COLORS.FIND,
  danger: COLORS.DANGER,
  warning: COLORS.WARNING,
  muted: COLORS.MUTED,
}

export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  COPY: { category: 'ui', name: 'paper-arrive' },
  MOVE: { category: 'transitions', name: 'swoosh-2' },
  DENY: { category: 'warnings', name: 'soft-deny' },
  CONFIRM: { category: 'success', name: 'confirm' },
  OPEN: { category: 'ui', name: 'paper-open' },
  SCROLL: { category: 'ui', name: 'plink' },
  STREAM: { category: 'ui', name: 'beep' },
  SCAN: { category: 'transitions', name: 'light-swoosh-quick' },
  CATALOG: { category: 'success', name: 'shimmer' },
  SAVE: { category: 'success', name: 'ding' },
}
