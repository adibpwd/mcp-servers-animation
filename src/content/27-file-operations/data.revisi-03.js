// src/content/27-file-operations/data.revisi-03.js
// Revisi-03 (2026-09-16) — lihat revisi/2026-09-16-revisi-03-terminal-grid-motion.md
// Palette dikoreksi ke standar seri, terminal adaptif berbasis jumlah baris,
// file manager jadi grid ikon, command punya 5 tahap type→enter→travel→apply→explain.
// VARIAN BARU — tidak menimpa data.js aktif sampai preview revisi disetujui.

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
  INTRO_A: '#38BDF8',   // FILE — sky blue, standar Title A
  INTRO_B: '#34D399',   // OPERATIONS — emerald, standar Title B / success
  CREATE: '#FB923C',    // mkdir, touch, mv — struktur & command aktif
  COPY: '#A78BFA',      // cp — objek kedua / duplikasi
  READ: '#22D3EE',      // cat, less, head, tail -f
  FIND: '#F472B6',      // find, locate
  DANGER: '#F43F5E',    // rm
  WARNING: '#FBBF24',   // satu-satunya pemakaian kuning: menunggu konfirmasi
  SUCCESS: '#34D399',
}

// ── Zona lokal (dalam ContentBodyV1, 732 × 965) ──
export const ZONE = {
  CAPTION: { yStart: 18, yEnd: 68 },
  GRID: { yStart: 92, yEnd: 468 },
  MOTION: { yStart: 495, yEnd: 615 },
  TERMINAL_BOTTOM: 858,
  CLOSING: { yStart: 884, yEnd: 946 },
}

// ── Rumus terminal adaptif ──
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
  { id: 'read',         badge: 'ACT 3 — BACA ISI YANG TEPAT',   badgeColor: COLORS.READ,   duration: 10.5 },
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
  CAT: 'cat menampilkan isi singkat',
  LESS: 'less membaca file panjang bertahap',
  HEAD: 'head menampilkan baris awal',
  TAILF: 'tail -f mengikuti log baru',
  FIND: 'find memindai lokasi nyata',
  LOCATE: 'locate memakai indeks tersimpan',
  TAKEAWAY: 'Terminal dan file manager, objek sama',
}

// ── Grid file manager — 3 × 2 tile stabil + 1 tile "berisiko" (old-draft.txt) ──
export const TILE = {
  SRC:       { id: 'src',       kind: 'folder', label: 'src/',          col: 0, row: 0 },
  ASSETS:    { id: 'assets',    kind: 'folder', label: 'assets/',       col: 1, row: 0 },
  README:    { id: 'readme',    kind: 'file', glyph: 'markdown', label: 'README.md',    col: 2, row: 0 },
  CHANGELOG: { id: 'changelog', kind: 'file', glyph: 'markdown', label: 'CHANGELOG.md', col: 0, row: 1 },
  CONFIG:    { id: 'config',    kind: 'file', glyph: 'config',   label: 'config.ini',   col: 1, row: 1 },
  APPLOG:    { id: 'applog',    kind: 'file', glyph: 'log',      label: 'app.log',      col: 2, row: 1 },
}

export const RISK_TILE = { id: 'old-draft', glyph: 'markdown', label: 'old-draft.txt' }

// Badge nested (file di dalam folder) — ditempel di sudut FolderTile, bukan
// slot grid terpisah, supaya kontrak "3 × 2 tile stabil" tidak berubah.
export const NESTED_BADGE = {
  INDEX_HTML: { id: 'index-html', parent: 'src',    glyph: 'html',  label: 'index.html' },
  BANNER:     { id: 'banner',     parent: 'assets', glyph: 'image', label: 'banner.png' },
}

export const GRID_GEOMETRY = {
  colCenters: [131, 341, 551],
  rowCenters: [200, 330],
  tileW: 190,
  tileH: 88,
  riskCenter: { x: 366, y: 430 },
  riskW: 190,
  riskH: 46,
}

// Tiap step = satu baris terminal. `gui` = event yang direspons GUI.
// `target` = id tile yang dituju command pulse (dipakai fokus ring + rail).
// `full` = true → command lewat 5 tahap (type→enter→travel→apply→explain).
// `full: false` (default untuk kind 'out') → langsung apply+explain saja,
// karena baris ini adalah output/lanjutan dari command sebelumnya.
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
  { act: 2, kind: 'cmd', full: true, text: '$ cat README.md', color: 'read', gui: 'cat', target: ['readme'] },
  { act: 2, kind: 'cmd', full: true, text: '$ less CHANGELOG.md', color: 'read', gui: 'less', target: ['changelog'], holdExtra: 1.2 },
  { act: 2, kind: 'cmd', full: true, text: '$ head config.ini', color: 'read', gui: 'head', target: ['config'] },
  { act: 2, kind: 'cmd', full: true, text: '$ tail -f app.log', color: 'read', gui: 'tailf', target: ['applog'], holdExtra: 1.3 },

  // ── Act 4 — temukan file ──
  { act: 3, kind: 'cmd', full: true, text: '$ find . -name "banner.png"', color: 'find', gui: 'find', target: ['assets'], holdExtra: 1.4 },
  { act: 3, kind: 'out', text: './assets/banner.png', color: 'muted' },
  { act: 3, kind: 'cmd', full: true, text: '$ locate banner.png', color: 'find', gui: 'locate', target: ['assets'], holdExtra: 0.5 },
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

// Verb capsule di command pulse — teks pendek, warna ikut kategori command.
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

// Label ChangeBadge — muncul dekat tile target 0.7–1.0 detik.
export const CHANGE_BADGE = {
  mkdir: '+ folder',
  touch: '+ file',
  cp: '+ copy',
  mv: 'moved',
  'rm-ask': 'menunggu (y/N)',
  'rm-confirm': 'removed',
  cat: 'dibaca',
  less: 'scroll',
  head: 'baris awal',
  tailf: 'live',
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
