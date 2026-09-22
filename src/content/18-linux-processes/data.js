// src/content/60-linux-processes/data.js
// Eksekusi sesuai _docs/LINUX_PROCESSES_PLAN.md.
// Cerita: file browser-app.bin diam di disk → dijalankan → jadi process
// hidup dengan PID. Editor & music-app menyusul (Act 2), tiap process
// memakai resource beda (Act 3), lalu terminal `ps` melihat semuanya
// sekaligus (Act 4). Batas akurasi: TIDAK membahas kill/signal, thread
// scheduling, zombie process, atau systemd (lihat PLAN §Batasan).

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
  SUCCESS: '#34D399',
  PROGRAM: '#60A5FA',   // file diam di disk (belum jadi process)
  PID: '#A78BFA',       // chrome tag PID (dipakai di semua process)
  CPU: '#22D3EE',       // bar CPU
  MEM: '#FB923C',       // bar MEM
  BROWSER: '#38BDF8',
  EDITOR: '#FBBF24',
  MUSIC: '#F472B6',
  WARNING: '#F87171', // revisi-01: resource-spike icon + ps-highlight-culprit
}

export const PHASES = [
  { id: 'alive',    badge: 'ACT 1 — FILE MENJADI PROCESS',      badgeColor: COLORS.PROGRAM, duration: 9.5 },
  { id: 'pid',      badge: 'ACT 2 — SETIAP PROCESS PUNYA PID',  badgeColor: COLORS.PID,     duration: 10.5 },
  { id: 'resource', badge: 'ACT 3 — PROCESS MEMAKAI RESOURCE',  badgeColor: COLORS.CPU,     duration: 9.5 },
  { id: 'ps',       badge: 'ACT 4 — LIHAT DARI TERMINAL',       badgeColor: COLORS.SUCCESS, duration: 10.5 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'LINUX '
export const INTRO_TITLE_B = 'PROCESSES'
export const INTRO_SUBTITLE = 'Program yang sedang hidup di sistem'

// revisi-03: fix judul hero "LINUX PROCESSES" mepet/terpotong di tepi kanan
// canvas 820px pada fontSize hero 72 (estimateTextWidth 0.55/char meleset
// dari lebar render asli Arial Black bold all-caps). Solusi resmi shared
// component untuk title kepanjangan: prop `titleLines` (pecah jadi 2 baris
// stack, auto-clamp margin kiri/kanan) — lihat IntroHeaderMorphV1 UPDATE 2.
// Compact/header TETAP 1 baris dari INTRO_TITLE_A/B di atas, tidak berubah.
export const INTRO_TITLE_LINES = [
  [{ label: 'LINUX', color: COLORS.PROGRAM }],
  [{ label: 'PROCESSES', color: COLORS.SUCCESS }],
]

// Satu file di disk: browser-app.bin. Jadi anchor Act 1 → Act 4 (browser
// process, lihat continuity map di PLAN §Continuity map).
export const PROGRAM_LABEL = 'browser-app.bin'
export const PROGRAM_RUN_LABEL = 'jalankan'

// Tiga process persistent Act 2 → Act 4 (state contract: "Tiga card + PID").
// slotX = posisi kolom di Process arena & Resource meter (grid 150/366/582,
// konsisten dengan pola grid 3-kolom topic lain, mis. 26-terminal-navigation).
export const PROCESSES = [
  { id: 'browser', name: 'browser',   pid: 1042, color: COLORS.BROWSER, cpu: 58, mem: 74, slotX: 150, iconId: 'icon-browser' },
  { id: 'editor',  name: 'editor',    pid: 1058, color: COLORS.EDITOR,  cpu: 22, mem: 30, slotX: 366, iconId: 'icon-editor' },
  { id: 'music',   name: 'music-app', pid: 1071, color: COLORS.MUSIC,  cpu: 9,  mem: 16, slotX: 582, iconId: 'icon-music' },
]

// revisi-01 §3.4 beat "resource-spike" — browser (process paling boros) naik
// lagi setelah nilai awal, memicu real-case "laptop mulai terasa berat".
export const BROWSER_SPIKE = { cpu: 81, mem: 88 }

// Ilustrasi transient Act 2 ("satu program dapat berulang", batas akurasi
// #2) — PID instance kedua dari browser, TIDAK jadi card ke-4 permanen.
export const CLONE_PID = 1090

// Draft teks in-video — hasil revisi-01 (hapus narration bubble global,
// caption jadi badge lokal per elemen; lihat revisi/2026-09-19-revisi-01-*.md
// §2.3 & §3.3). Deklaratif, ringkas, tanpa emoji, tanpa kata ganti orang.
export const CAPTIONS = {
  HOOK: 'Klik... apa yang terjadi?',
  LAUNCH: 'Saat berjalan, ia menjadi process',
  CLIFFHANGER: 'Tapi browser tidak sendirian...',
  PID: 'Process memiliki PID',
  CLONE: 'Satu program dapat berulang',
  PID_REUSE: 'PID bisa dipakai ulang',
  RESOURCE: 'Process memakai resource',
  RESOURCE_DIFF: 'CPU dan memory dapat berbeda',
  SPIKE: 'Laptop mulai terasa berat',
  PS: 'ps melihat process hidup',
  PS_PID: 'PID membantu mengenali target',
  PAYOFF: 'PID 1042 browser paling boros, bikin laptop lambat',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  TALLY: { category: 'ui', name: 'number-tally' },
  PAPER: { category: 'ui', name: 'paper-arrive' },
  DING: { category: 'success', name: 'ding' },
  WARNING: { category: 'warnings', name: 'alert-pulse' }, // revisi-01: resource-spike
}
