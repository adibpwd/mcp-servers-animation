// src/content/39-oom-killer/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/39-oom-killer/_docs/OOM_KILLER_PLAN.md.
// Empat Act, scene-ui V1, koordinat LOCAL. Cerita: RAM fisik + Swap
// nyaris 100% penuh — Kernel gagal alokasi halaman baru — OOM Killer
// aktif, hitung oom_score tiap proses (Database krusial vs System
// daemon vs Worker leak) — Worker dapat skor tertinggi — SIGKILL (9)
// dikirim, memori lega, jejak tercatat di dmesg.
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat plan § Storyboard).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan: title OOM (rose) + KILLER (amber)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  OOM: '#EC4899',      // identitas utama — rose
  KILLER: '#F59E0B',   // identitas utama — amber
  RAM: '#F43F5E',      // tekanan memori fisik
  SWAP: '#FB923C',     // tekanan swap
  KERNEL: '#A78BFA',   // alarm kernel
  DB: '#38BDF8',       // Process A — Database (krusial)
  DAEMON: '#34D399',   // Process B — System daemon (penting)
  WORKER: '#FB7185',   // Process C — Worker leak (korban)
  SUCCESS: '#34D399',  // memori lega / log tercatat
  DENY: '#F43F5E',     // SIGKILL / proses mati
}

// PHASES — 4 Act (~32s per loop: intro ~1s + Act1-4 + repeatDelay 1.2s)
export const PHASES = [
  { id: 'act1-pressure', badge: 'ACT 1 — TEKANAN MEMORI 99.9%', badgeColor: COLORS.RAM, duration: 6.9 },
  { id: 'act2-alarm', badge: 'ACT 2 — ALARM DARURAT KERNEL', badgeColor: COLORS.KERNEL, duration: 5.9 },
  { id: 'act3-score', badge: 'ACT 3 — HITUNG SKOR OOM_SCORE', badgeColor: COLORS.OOM, duration: 9.3 },
  { id: 'act4-kill', badge: 'ACT 4 — SIGKILL & JEJAK DMESG', badgeColor: COLORS.KILLER, duration: 9.4 },
]

export const INTRO_CATEGORY_LABEL = 'LINUX DEEP DIVE'
export const INTRO_DOMAIN = 'MEMORY & KERNEL'
export const INTRO_TITLE_A = 'OOM'
export const INTRO_TITLE_B = ' KILLER'
export const INTRO_SUBTITLE = 'Algojo darurat saat RAM 100% penuh'

// ── Layout LOCAL (origin DEFAULT_LAYOUT_V1.body = 44, 235) ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x   // local 366 — sumbu tengah

export const METER_PANEL_Y = 90     // panel RAM + Swap meter
export const APP_CARD_Y = 205       // kartu "aplikasi rakus"
export const ALARM_Y = 320          // kartu alarm kernel
export const PROC_A_Y = 450         // kartu Process A — Database
export const PROC_B_Y = 535         // kartu Process B — System daemon
export const PROC_C_Y = 620         // kartu Process C — Worker leak
export const LOG_Y = 770            // panel dmesg

export const CAPTION_Y = [900, 900, 900, 900]   // caption bar konstan, bawah body

export const METER_LABEL = { ram: 'RAM FISIK', swap: 'SWAP' }
export const APP_LABEL = 'APLIKASI RAKUS'
export const ALARM_LABEL = 'KERNEL OOM SUBSYSTEM'
export const ALARM_STATUS_IDLE = 'MEMANTAU'
export const ALARM_STATUS_ACTIVE = 'STATUS DARURAT AKTIF'
export const LOG_LABEL = 'dmesg / var/log/messages'

// Tiga proses yang dipindai kernel — oom_score 0..1000 (Linux badness scale)
export const PROCESSES = {
  A: { id: 'A', name: 'DATABASE', pid: '2210', mem: '512MB', tag: 'KRUSIAL', color: 'DB', score: 12 },
  B: { id: 'B', name: 'SYSTEM DAEMON', pid: '918', mem: '128MB', tag: 'PENTING', color: 'DAEMON', score: 34 },
  C: { id: 'C', name: 'WORKER NODE', pid: '4821', mem: '2.8GB', tag: 'MEMORY LEAK', color: 'WORKER', score: 891 },
}

// Baris log dmesg — ditampilkan progresif Act 4 (teks flavor, bukan kutipan)
export const LOG_LINES = [
  '[124092.881] oom-kill: constraint=CONSTRAINT_NONE',
  '[124092.882] Out of memory: Killed process 4821 (worker-node)',
  '[124092.883] oom_score 891, oom_score_adj 0',
  '[124092.884] total-vm:2871232kB, freed:737024kB',
]

// Teks deklaratif ≤5 kata, dekat objek
export const CAPTIONS = {
  // Act 1 — tekanan memori
  RAM_FULL: 'RAM fisik nyaris penuh',
  APP_HUNGRY: 'Aplikasi terus minta memori',
  SWAP_FULL: 'Swap ikut habis',
  NO_ALLOC: 'Tidak ada halaman tersisa',

  // Act 2 — alarm kernel
  KERNEL_DETECT: 'Kernel deteksi alokasi gagal',
  ALARM_ON: 'Status darurat OOM aktif',
  PROTECT_OS: 'Selamatkan OS, bukan aplikasi',

  // Act 3 — hitung skor korban
  SCAN_START: 'Pindai semua proses aktif',
  SCORE_DB: 'Database: skor rendah, krusial',
  SCORE_DAEMON: 'Daemon: skor rendah, penting',
  SCORE_WORKER: 'Worker: skor oom_score tertinggi',
  PICK_VICTIM: 'Proses rakus jadi korban',

  // Act 4 — eksekusi & log
  SEND_SIGKILL: 'Kernel kirim SIGKILL (9)',
  PROCESS_DEAD: 'Proses dihentikan paksa',
  MEMORY_FREED: 'Memori langsung lega kembali',
  LOGGED: 'Jejak tercatat di dmesg',
}

// SFX — semua nama merujuk file nyata di public/audio (lihat AUDIO_MANIFEST.md)
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  SCAN: { category: 'sfx', name: 'scan' },
  IMPACT: { category: 'impacts', name: 'impact' },
  RELIEF: { category: 'success', name: 'relief-settle' },
  TYPING: { category: 'sfx', name: 'typing' },
}
