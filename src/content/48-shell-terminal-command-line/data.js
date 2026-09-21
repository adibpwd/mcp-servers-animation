// src/content/48-shell-terminal-command-line/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-01 (full 6-Act) + EKSEKUSI-02 (revisi-01: Act 1 command journey)
// + EKSEKUSI-03 (revisi-02: Act 3-6 diganti jadi satu kasus kausal per Act
// — before → intent → travel → apply → after — bukan row/chip istilah).
// Anchor (terminal, PTY, shell, system) tetap dari Act 1-2, tidak di-reset.
// Icon: inline SVG saja untuk first pass.
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111C31',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  TERMINAL: '#38BDF8',
  PTY: '#A78BFA',
  SHELL: '#FBBF24',
  BUILTIN: '#34D399',
  EXEC: '#22D3EE',
  SYSTEM: '#F472B6',
  STDIN: '#38BDF8',
  STDOUT: '#34D399',
  STDERR: '#F87171',
  MODE: '#A78BFA',
  SCRIPT: '#34D399',
  RISK: '#F87171',
  SUCCESS: '#34D399',
}

export const PHASES = [
  { id: 'command-works', badge: 'ACT 1 — SATU COMMAND BEKERJA',       badgeColor: COLORS.TERMINAL, duration: 15 },
  { id: 'builtin-exec',  badge: 'ACT 2 — BUILTIN VS EXECUTABLE',       badgeColor: COLORS.SHELL,    duration: 17 },
  { id: 'decisions',     badge: 'ACT 3 — SHELL MEMBACA STRUKTUR',      badgeColor: COLORS.EXEC,     duration: 17 },
  { id: 'data-paths',    badge: 'ACT 4 — GREP: TIGA JALUR DATA',       badgeColor: COLORS.STDOUT,   duration: 16 },
  { id: 'contexts',      badge: 'ACT 5 — SATU COMMAND, TIGA KONTEKS',  badgeColor: COLORS.MODE,     duration: 16 },
  { id: 'safe-script',   badge: 'ACT 6 — QUOTE, STATUS, CLEANUP',      badgeColor: COLORS.SCRIPT,   duration: 17 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'SHELL '
export const INTRO_TITLE_B = 'EXPLAINED'
export const INTRO_SUBTITLE = 'Terminal, command line, dan penerjemah'

export const ARCH_LABELS = {
  terminal: 'Terminal Emulator',
  commandLine: 'Command Line',
  pty: 'PTY',
  shell: 'Shell',
  builtin: 'Builtin',
  builtinDetail: 'Dijalankan shell sendiri, tanpa process baru',
  exec: 'External Executable',
  execDetail: 'Dicari di PATH, jalan sebagai process terpisah',
  system: 'System & Resources',
  systemDetail: 'Kernel: CPU, memori, file descriptor',
}

export const COMMAND_TEXT = 'pwd'
export const OUTPUT_TEXT = '/home/adib'

export const ACT1_BEATS = {
  closing: 'Terminal menampilkan. Shell mengatur.',
}

export const EXT_COMMAND_TEXT = 'ls -la'

export const ACT2_BEATS = {
  question: 'Kenapa pwd langsung selesai, tapi ls butuh pencarian?',
  builtinRecap: 'pwd adalah builtin — shell menjalankannya sendiri',
  lookup: 'Command baru diketik: ls -la',
  path: 'ls -la dicari lewat PATH, lalu dijalankan sebagai process',
  system: 'Kernel menjalankan process dan menghubungkan resource',
  payoff: 'Builtin dan executable punya jalur berbeda',
}

export const ACT3_CASE = {
  command: 'echo "$HOME"/notes/*.txt',
  homeVar: '$HOME',
  homeValue: '/home/adib',
  files: [
    { id: 'todo', name: 'todo.txt', match: true },
    { id: 'idea', name: 'idea.txt', match: true },
    { id: 'image', name: 'image.png', match: false },
  ],
}

export const ACT3_BEATS = {
  question: 'Apakah baris command diperlakukan sebagai teks biasa?',
  quote: 'Quote melindungi $HOME dari ikut terbelah',
  expand: '$HOME dan *.txt di-expand sebelum dijalankan',
  resolve: 'echo adalah builtin — shell menjalankannya sendiri',
  status: 'Output dan status keluar terpisah',
  payoff: 'Shell membaca struktur command',
}

export const ACT4_CASE = {
  command: 'grep error',
  sources: [
    { id: 'applog', name: 'app.log', ok: true },
    { id: 'missinglog', name: 'missing.log', ok: false },
  ],
  matchLines: ['13: error disk full', '47: error timeout'],
  errorLine: 'missing.log: No such file',
  redirectTarget: 'errors.txt',
}

export const ACT4_BEATS = {
  question: 'Ke mana input, output, dan error pergi?',
  stdin: 'Baris log masuk lewat stdin — hanya yang cocok "error" dipakai',
  stdout: 'Hasil normal keluar lewat stdout, lalu di-redirect ke file',
  stderr: 'Source yang tidak ada keluar lewat stderr — jalur terpisah',
  payoff: 'Output dan error punya jalur sendiri',
}

export const ACT5_CASE = {
  command: 'pwd',
  contexts: [
    { id: 'interactive', label: 'Interactive', badge: 'INTERACTIVE' },
    { id: 'login', label: 'Login / Startup', badge: 'STARTUP' },
    { id: 'noninteractive', label: 'Non-interactive', badge: 'NO PROMPT' },
    { id: 'remote', label: 'Remote', badge: 'SSH → server' },
  ],
}

export const ACT5_BEATS = {
  question: 'Mengapa terminal baru dan script bisa berbeda?',
  interactive: 'Prompt lokal — shell menjalankan langsung dari input manusia',
  login: 'Startup config dibaca sebelum prompt pertama muncul',
  noninteractive: 'Script mengirim command tanpa prompt manusia',
  remote: 'Shell berjalan di host lain — terminal lokal hanya menampilkan',
  payoff: 'Konteks menentukan cara shell berjalan',
}

export const ACT6_CASE = {
  filename: 'April Report.txt',
  ghostParts: ['April', 'Report.txt'],
  targetShellDefault: 'bash',
  targetShellAlt: 'sh',
  syntaxFlag: '$(...) — Bash-only',
}

export const ACT6_BEATS = {
  question: 'Apa yang perlu dijaga saat mengotomasi?',
  shield: 'Quote menjaga nama file tetap satu argument',
  ghost: 'Tanpa quote, spasi bisa memecah data jadi dua',
  check: 'Status gagal menghentikan langkah berikutnya',
  cleanup: 'Cleanup tetap jalan walau happy path tidak tercapai',
  targetshell: 'Syntax tertentu hanya berlaku di shell target yang cocok',
  payoff: 'Data di-quote; error menghentikan langkah',
}

export const CLOSING_CAPTION = 'Shell adalah bahasa dan pengelola proses'

export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  PAPER_OPEN: { category: 'ui', name: 'paper-open' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  SWOOSH_QUICK: { category: 'transitions', name: 'light-swoosh-quick' },
  CONNECTOR_SNAP: { category: 'impacts', name: 'connector-snap' },
  LOCK: { category: 'impacts', name: 'lock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
