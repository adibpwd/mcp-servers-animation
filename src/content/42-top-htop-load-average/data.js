// src/content/42-top-htop-load-average/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai
// src/content/42-top-htop-load-average/_docs/TOP_HTOP_LOAD_AVERAGE_PLAN.md.
// Empat Act, scene-ui V1, koordinat LOCAL, pola "1 act = 1 file"
// (lihat docs/standardizations/07-act-scene-pattern.md). Cerita:
// dashboard top/htop (CPU, Memory, daftar proses) — membaca 3 angka
// Load Average (1m/5m/15m) dan tren naik-turunnya — mengoreksi angka
// itu dengan jumlah Core CPU lewat analogi jalan tol — membedakan
// beban tinggi karena CPU Bound murni vs I/O Wait (disk bottleneck).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat plan § Storyboard).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan: title LOAD (cyan) + AVERAGE (emerald)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  LOAD: '#22D3EE',      // identitas utama — cyan
  AVERAGE: '#34D399',   // identitas utama — emerald
  CPU: '#22D3EE',       // meter CPU
  MEM: '#A78BFA',       // meter Memory
  TASK: '#38BDF8',      // baris daftar proses
  WARN: '#F59E0B',      // angka 5 menit / peringatan sedang
  DANGER: '#F43F5E',    // angka 15 menit / rasio tidak aman
  SUCCESS: '#34D399',   // angka 1 menit / rasio aman
  LANE_USED: '#22D3EE', // lajur tol terpakai
  LANE_FREE: '#1E293B', // lajur tol kosong
  CPUBOUND: '#F59E0B',  // panel CPU Bound
  IOWAIT: '#FB7185',    // panel I/O Wait
}

// PHASES — 4 Act (~32s per loop: intro ~1s + Act1-4 + repeatDelay 1.2s)
export const PHASES = [
  { id: 'act1-dashboard', badge: 'ACT 1 — DASHBOARD DETAK JANTUNG SERVER', badgeColor: '#22D3EE', duration: 7.0 },
  { id: 'act2-numbers', badge: 'ACT 2 — TIGA ANGKA MISTERIUS', badgeColor: '#22D3EE', duration: 7.8 },
  { id: 'act3-core', badge: 'ACT 3 — KORELASI JUMLAH CORE CPU', badgeColor: '#34D399', duration: 8.6 },
  { id: 'act4-bottleneck', badge: 'ACT 4 — CPU BOUND vs I/O WAIT', badgeColor: '#FB7185', duration: 8.4 },
]

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS · '
export const INTRO_DOMAIN = 'MONITORING & TROUBLESHOOTING'
export const INTRO_TITLE_A = 'LOAD'
export const INTRO_TITLE_B = ' AVERAGE'
export const INTRO_SUBTITLE = 'Membaca detak jantung & beban server'

// ── Layout LOCAL (origin DEFAULT_LAYOUT_V1.body = 44, 235) ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x   // local 366 — sumbu tengah

// ── Act 1 — dashboard top/htop ──
export const CPU_METER_Y = 90
export const MEM_METER_Y = 150
export const TASK_LIST_Y = 250      // baris pertama; tiap baris +58

// ── Act 2 — tiga angka Load Average ──
export const NUMBERS_Y = 420
export const TREND_Y = 560

// ── Act 3 — analogi jalan tol ──
export const TOLL_Y = 460
export const RATIO_Y = 640

// ── Act 4 — CPU Bound vs I/O Wait ──
export const COMPARE_Y = 420

export const METER_LABEL = { cpu: 'CPU', mem: 'MEMORY' }
export const CPU_FILL = 0.62
export const MEM_FILL = 0.45

// Tiga proses paling rakus resource pada dashboard top/htop
export const TASKS = [
  { pid: '1102', name: 'nginx', cpu: '34.2%', mem: '2.1%' },
  { pid: '2044', name: 'node-api', cpu: '21.5%', mem: '4.8%' },
  { pid: '3390', name: 'mysqld', cpu: '9.8%', mem: '12.4%' },
]

// Tiga angka Load Average — cerita: 15 menit lalu tinggi (3.50), makin
// turun mendekati sekarang (1.20 → 0.50) — tren beban sedang mereda.
export const LOAD_NUMBERS = [
  { key: '15m', label: '15 MENIT LALU', value: 3.50, colorKey: 'DANGER' },
  { key: '5m', label: '5 MENIT LALU', value: 1.20, colorKey: 'WARN' },
  { key: '1m', label: '1 MENIT TERAKHIR', value: 0.50, colorKey: 'SUCCESS' },
]

// Analogi jalan tol — Core CPU = jumlah lajur
export const CORE_COUNT = 4
export const CURRENT_LOAD = 2.0
export const LOAD_RATIO = CURRENT_LOAD / CORE_COUNT   // 0.5 → 50% terpakai

// Perbandingan %Cpu(s) ala output top — us: user, sy: system, wa: I/O wait
export const CPU_BOUND_STATS = { us: 92, sy: 5, wa: 1 }
export const IO_WAIT_STATS = { us: 8, sy: 4, wa: 81 }

// Teks deklaratif ≤5 kata, dekat objek
export const CAPTIONS = {
  // Act 1 — dashboard top/htop
  TOP_INTRO: 'Ini tampilan top / htop',
  CPU_MEM_LIVE: 'CPU dan Memory real-time',
  TASK_LIST: 'Daftar proses paling rakus',

  // Act 2 — tiga angka misterius
  THREE_NUMBERS: 'Load Average: 3 angka penting',
  READ_15M: '15 menit lalu: beban tinggi',
  READ_5M: '5 menit lalu: mulai mereda',
  READ_1M: '1 menit terakhir: makin ringan',
  TREND_DOWN: 'Tren: beban server sedang mereda',

  // Act 3 — korelasi jumlah Core
  NEED_CONTEXT: 'Angka Load butuh konteks: Core',
  TOLL_ANALOGY: 'Analogi: Core CPU = lajur tol',
  RATIO_CALC: 'Load dibagi Core = rasio pakai',
  RATIO_RESULT: '2.0 dibagi 4 Core = 50% terpakai',
  SAFE_ZONE: 'Aman selama rasio di bawah 1.0',

  // Act 4 — CPU Bound vs I/O Wait
  WHY_HIGH: 'Load tinggi, tapi kenapa?',
  CPU_BOUND: 'CPU Bound: proses hitung berat',
  IO_WAIT: 'I/O Wait: menunggu baca-tulis disk',
  DISK_BOTTLENECK: 'wa tinggi, disk jadi bottleneck',
}

// SFX — semua nama merujuk file nyata di public/audio
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  SCAN: { category: 'sfx', name: 'scan' },
  DING: { category: 'success', name: 'ding' },
  RELIEF: { category: 'success', name: 'relief-settle' },
}
