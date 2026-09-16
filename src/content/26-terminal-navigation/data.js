// src/content/26-terminal-navigation/data.js
// REVISI-02 (2026-09-13) — lihat revisi/2026-09-13-revisi-02-real-terminal-workflows.md
// Cerita: Adib menyiapkan project "landing-page" dari Downloads ke
// ~/Projects lalu menjalankannya. Empat Act, terminal jadi anchor utama,
// GUI/file manager di sisi/bawahnya cuma nunjukin before/after command aktif.

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
  NAV: '#38BDF8',       // navigasi: pwd, ls, cd
  MODIFY: '#FBBF24',    // file operations: mkdir, touch, cp, mv
  INSPECT: '#22D3EE',   // baca: cat, less, ls -la
  SUCCESS: '#34D399',
  DANGER: '#F87171',    // rm -i confirm (lembut, bukan alarm penuh)
  PACKAGE: '#F472B6',
  CHAIN: '#A78BFA',
}

export const PHASES = [
  { id: 'route',     badge: 'ACT 1 — KENALI POSISI DAN RUTE',       badgeColor: COLORS.NAV,     duration: 10.5 },
  { id: 'workspace', badge: 'ACT 2 — SUSUN WORKSPACE',               badgeColor: COLORS.MODIFY,  duration: 11.0 },
  { id: 'manage',    badge: 'ACT 3 — KELOLA DAN EDIT DENGAN AMAN',   badgeColor: COLORS.INSPECT, duration: 12.5 },
  { id: 'workflow',  badge: 'ACT 4 — SIAPKAN DAN JALANKAN WORKFLOW', badgeColor: COLORS.PACKAGE, duration: 12.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'TERMINAL '
export const INTRO_TITLE_B = 'NAVIGATION'
export const INTRO_SUBTITLE = 'Tahu lokasi, lihat isi, lalu berpindah'

// Revisi-03 (2026-09-14) — ambient chapter marker pada intro, bukan badge
// aktif (badge lengkap tetap PHASES[0].badge, dipakai ActBadgeNavigatorV1
// setelah intro). Lihat revisi/2026-09-14-revisi-03-act-1-intro-ambient.md
export const INTRO_ACT_LABEL = 'ACT 1'

export const HOME = '/home/adib'
export const PATH_PROJECTS = '/home/adib/Projects'
export const PATH_LANDING = '/home/adib/Projects/landing-page'
export const PATH_DOWNLOADS = '/home/adib/Downloads'
export const PATH_DEMO = '/home/adib/Projects/landing-page/demo'

export const CAPTIONS = {
  HOOK: 'Lokasi terminal belum jelas',
  PWD: 'pwd menunjukkan lokasi aktif',
  LS: 'ls melihat isi tanpa berpindah',
  CD_DOWNLOADS: 'cd masuk satu folder',
  CD_UP: '.. naik satu level',
  CD_HOME: '~ selalu kembali ke home',
  MKDIR: 'mkdir -p menyusun banyak folder sekaligus',
  TOUCH: 'touch membuat file kosong',
  LS_LA: '-a menyertakan item tersembunyi',
  CP: 'cp menggandakan, asal tetap ada',
  MV: 'mv memindahkan sekaligus mengganti nama',
  READ: 'Baca isi sebelum mengubah',
  EDIT: 'Editor terminal menyimpan satu perubahan',
  RM: 'rm -i minta konfirmasi sebelum hapus',
  APT: 'Package manager memasang tool ke sistem',
  AND: '&& lanjut hanya kalau langkah sebelumnya sukses',
  SEMI: '; tetap jalan tanpa menunggu keberhasilan',
  TAKEAWAY: 'Cek posisi, susun aman, baru jalankan',
}

// Tiap step = satu baris terminal. `gui` menandai event yang harus direspons
// GUI/file-manager di Animation.jsx (lihat switch di useEffect timeline).
export const TERMINAL_STEPS = [
  // ── Act 1 — kenali posisi & rute ──
  { act: 0, kind: 'cmd', text: '$ pwd', color: 'nav' },
  { act: 0, kind: 'out', text: '/home/adib', color: 'muted' },
  { act: 0, kind: 'cmd', text: '$ ls', color: 'nav' },
  { act: 0, kind: 'out', text: 'Downloads  Documents  Projects', color: 'muted' },
  { act: 0, kind: 'cmd', text: '$ cd Downloads', color: 'nav', prompt: '~/Downloads', gui: 'cd-downloads' },
  { act: 0, kind: 'cmd', text: '$ cd ..', color: 'nav', prompt: '~', gui: 'cd-up' },
  { act: 0, kind: 'cmd', text: '$ cd ~', color: 'nav', prompt: '~', gui: 'cd-home' },
  { act: 0, kind: 'cmd', text: '$ cd Projects', color: 'nav', prompt: '~/Projects', gui: 'cd-projects' },

  // ── Act 2 — susun workspace ──
  { act: 1, kind: 'cmd', text: '$ mkdir -p landing-page/{src,assets}', color: 'modify', gui: 'mkdir' },
  { act: 1, kind: 'cmd', text: '$ cd landing-page', color: 'nav', prompt: '~/Projects/landing-page', gui: 'cd-landing' },
  { act: 1, kind: 'cmd', text: '$ touch README.md .gitignore', color: 'modify', gui: 'touch' },
  { act: 1, kind: 'cmd', text: '$ ls -la', color: 'inspect', gui: 'ls-la' },
  { act: 1, kind: 'out', text: '.gitignore  README.md  assets/  src/', color: 'muted' },

  // ── Act 3 — kelola & edit dengan aman ──
  { act: 2, kind: 'cmd', text: '$ cp ~/Downloads/screenshot-draft.png assets/', color: 'modify', gui: 'cp' },
  { act: 2, kind: 'cmd', text: '$ mv ~/Documents/brief.txt README.md', color: 'modify', gui: 'mv' },
  { act: 2, kind: 'cmd', text: '$ cat README.md', color: 'inspect', gui: 'read' },
  { act: 2, kind: 'cmd', text: '$ nano README.md', color: 'inspect', gui: 'edit' },
  { act: 2, kind: 'cmd', text: '$ rm -i old-draft.txt', color: 'danger', gui: 'rm-ask' },
  { act: 2, kind: 'out', text: 'rm: remove old-draft.txt? y', color: 'danger', gui: 'rm-confirm' },

  // ── Act 4 — siapkan & jalankan workflow ──
  { act: 3, kind: 'cmd', text: '$ sudo apt install ripgrep', color: 'package', gui: 'apt' },
  { act: 3, kind: 'out', text: '(contoh Debian/Ubuntu — distro lain beda)', color: 'muted' },
  { act: 3, kind: 'cmd', text: '$ mkdir demo && cd demo && touch notes.txt', color: 'chain', gui: 'chain-and' },
  { act: 3, kind: 'cmd', text: '$ pwd; ls', color: 'chain', gui: 'chain-semi' },
  { act: 3, kind: 'out', text: '.../demo', color: 'muted' },
  { act: 3, kind: 'out', text: 'notes.txt', color: 'muted' },
]

// Warna tampilan per kategori command — dipakai TermLine di Animation.jsx
export const LINE_COLOR = {
  nav: COLORS.NAV,
  modify: COLORS.MODIFY,
  inspect: COLORS.INSPECT,
  danger: COLORS.DANGER,
  package: COLORS.PACKAGE,
  chain: COLORS.CHAIN,
  muted: COLORS.MUTED,
}

export const LABELS = {
  DOWNLOADS: 'Downloads',
  DOCUMENTS: 'Documents',
  PROJECTS: 'Projects',
  LANDING: 'landing-page',
  SRC: 'src',
  ASSETS: 'assets',
  README: 'README.md',
  GITIGNORE: '.gitignore',
  SCREENSHOT: 'screenshot-draft.png',
  BRIEF: 'brief.txt',
  OLD_DRAFT: 'old-draft.txt',
  RIPGREP: 'ripgrep',
  DEMO: 'demo',
  NOTES: 'notes.txt',
}

export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  COPY: { category: 'ui', name: 'paper-arrive' },
  RENAME: { category: 'transitions', name: 'swoosh-2' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DENY: { category: 'warnings', name: 'soft-deny' },
  SAVE: { category: 'success', name: 'ding' },
  PACKAGE: { category: 'success', name: 'shimmer' },
  CHAIN_TICK: { category: 'ui', name: 'tick' },
}
