// src/content/27-file-operations/data.js
// Eksekusi revisi-02 (2026-09-16) — lihat revisi/2026-09-16-revisi-02-merged-file-workflow.md
// Cerita: Rani merapikan project "website-demo" — buat folder, salin aset,
// pindah brief jadi README, baca beberapa jenis file, lalu cari aset yang
// lupa lokasinya. File manager selalu di atas, terminal ringkas di bawah.

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
  CREATE: '#FBBF24',   // mkdir, touch
  COPY: '#34D399',     // cp
  MOVE: '#A78BFA',     // mv
  DANGER: '#F87171',   // rm -i
  READ: '#22D3EE',     // cat, less, head, tail -f
  FIND: '#F472B6',     // find, locate
  SUCCESS: '#34D399',
}

export const PHASES = [
  { id: 'create-copy', badge: 'ACT 1 — BUAT DAN SALIN',        badgeColor: COLORS.CREATE, duration: 7.0 },
  { id: 'move-delete',  badge: 'ACT 2 — PINDAH DAN HAPUS AMAN', badgeColor: COLORS.MOVE,   duration: 6.5 },
  { id: 'read',         badge: 'ACT 3 — BACA ISI YANG TEPAT',   badgeColor: COLORS.READ,   duration: 9.5 },
  { id: 'find',         badge: 'ACT 4 — TEMUKAN FILE',          badgeColor: COLORS.FIND,   duration: 8.5 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'FILE '
export const INTRO_TITLE_B = 'OPERATIONS'
export const INTRO_SUBTITLE = 'Buat, salin, pindah, hapus dengan aman'
export const INTRO_ACT_LABEL = 'ACT 1'

export const PROJECT_PATH = '~/Projects/website-demo'
export const SOURCE_BANNER = '~/Downloads/banner-draft.png'
export const SOURCE_BRIEF = '~/Documents/brief.txt'

export const LABELS = {
  SRC: 'src/',
  ASSETS: 'assets/',
  INDEX_HTML: 'index.html',
  BANNER: 'banner.png',
  README: 'README.md',
  CHANGELOG: 'CHANGELOG.md',
  CONFIG: 'config.ini',
  APP_LOG: 'app.log',
  OLD_DRAFT: 'old-draft.txt',
}

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

// Tiap step = satu baris terminal. `gui` menandai event yang direspons GUI
// file manager (Animation.jsx). `holdExtra` = jeda tambahan (detik) sesudah
// step ini sebelum step berikutnya, dipakai untuk momen yang butuh waktu
// lebih (branch cp, scroll less, streaming tail -f, scan find).
export const TERMINAL_STEPS = [
  // ── Act 1 — buat dan salin ──
  { act: 0, kind: 'cmd', text: '$ mkdir -p src assets', color: 'create', gui: 'mkdir' },
  { act: 0, kind: 'cmd', text: '$ touch src/index.html', color: 'create', gui: 'touch' },
  { act: 0, kind: 'cmd', text: '$ cp ~/Downloads/banner-draft.png assets/banner.png', color: 'copy', gui: 'cp', holdExtra: 0.4 },
  { act: 0, kind: 'out', text: 'copied: banner.png', color: 'muted' },

  // ── Act 2 — pindah dan hapus aman ──
  { act: 1, kind: 'cmd', text: '$ mv ~/Documents/brief.txt README.md', color: 'move', gui: 'mv', holdExtra: 0.3 },
  { act: 1, kind: 'cmd', text: '$ rm -i old-draft.txt', color: 'danger', gui: 'rm-ask' },
  { act: 1, kind: 'out', text: 'rm: remove old-draft.txt? y', color: 'danger', gui: 'rm-confirm', holdExtra: 0.3 },

  // ── Act 3 — baca isi yang tepat ──
  { act: 2, kind: 'cmd', text: '$ cat README.md', color: 'read', gui: 'cat' },
  { act: 2, kind: 'cmd', text: '$ less CHANGELOG.md', color: 'read', gui: 'less', holdExtra: 1.2 },
  { act: 2, kind: 'cmd', text: '$ head config.ini', color: 'read', gui: 'head' },
  { act: 2, kind: 'cmd', text: '$ tail -f app.log', color: 'read', gui: 'tailf', holdExtra: 1.3 },

  // ── Act 4 — temukan file ──
  { act: 3, kind: 'cmd', text: '$ find . -name "banner.png"', color: 'find', gui: 'find', holdExtra: 1.4 },
  { act: 3, kind: 'out', text: './assets/banner.png', color: 'muted' },
  { act: 3, kind: 'cmd', text: '$ locate banner.png', color: 'find', gui: 'locate', holdExtra: 0.5 },
  { act: 3, kind: 'out', text: 'catatan: indeks bisa tertinggal', color: 'muted' },
]

export const LINE_COLOR = {
  create: COLORS.CREATE,
  copy: COLORS.COPY,
  move: COLORS.MOVE,
  danger: COLORS.DANGER,
  read: COLORS.READ,
  find: COLORS.FIND,
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
