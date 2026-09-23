// src/content/41-exit-code/data.js
// ─────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/41-exit-code/_docs/EXIT_CODE_PLAN.md.
// Empat Act, scene-ui V1, koordinat LOCAL. Cerita: command dijalankan di
// shell lalu melempar sinyal angka ke `$?` (Act 1) — perbandingan file
// ditemukan (exit 0) vs file tidak ada (exit 1) (Act 2) — logika rantai
// `&&` (lanjut jika sukses) vs `||` (cadangan jika gagal) (Act 3) — exit
// code dibaca pipeline CI/CD untuk menentukan status build hijau/merah
// (Act 4).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat plan § Storyboard).
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

// Palet — plan: title EXIT (cyan) + CODE (emerald)
export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  EXIT: '#38BDF8',     // identitas utama — cyan
  CODE: '#34D399',     // identitas utama — emerald
  SUCCESS: '#34D399',  // exit code 0
  FAIL: '#F43F5E',     // exit code non-zero
  AND: '#A78BFA',      // operator &&
  OR: '#FB923C',       // operator ||
  CI: '#38BDF8',       // aksen pipeline CI/CD
}

// PHASES — 4 Act (~31.6s per loop: intro ~1s + Act1-4 + repeatDelay 1.2s)
export const PHASES = [
  { id: 'act1-signal', badge: 'ACT 1 — SINYAL RAHASIA $?', badgeColor: COLORS.EXIT, duration: 7.0 },
  { id: 'act2-compare', badge: 'ACT 2 — SUKSES 0 VS GAGAL NON-ZERO', badgeColor: COLORS.CODE, duration: 7.0 },
  { id: 'act3-chain', badge: 'ACT 3 — RANTAI LOGIKA && DAN ||', badgeColor: COLORS.AND, duration: 9.0 },
  { id: 'act4-cicd', badge: 'ACT 4 — EXIT CODE DI CI/CD PIPELINE', badgeColor: COLORS.CI, duration: 7.6 },
]

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS ·'
export const INTRO_DOMAIN = 'SHELL & SCRIPTING'
export const INTRO_TITLE_A = 'EXIT'
export const INTRO_TITLE_B = ' CODE'
export const INTRO_SUBTITLE = 'Bahasa rahasia status command: 0 vs non-zero'

// ── Layout LOCAL (origin DEFAULT_LAYOUT_V1.body = 44, 235) ──
export const AXIS_X = 410 - DEFAULT_LAYOUT_V1.body.x   // local 366 — sumbu tengah

export const TERMINAL_Y = 110    // Act 1 — jendela terminal command
export const VAR_Y = 260         // Act 1 — badge register "$?"
export const CASE_ROW_Y = 400    // Act 2 — dua kartu berdampingan
export const CHAIN_AND_Y = 555   // Act 3 — chain mkdir && cd
export const CHAIN_OR_Y = 675    // Act 3 — chain ping || echo
export const CI_Y = 840          // Act 4 — panel pipeline CI/CD

export const CAPTION_Y = [900, 900, 900, 900]   // caption bar konstan, bawah body

export const TERMINAL_CMD_1 = '$ ls file.txt'
export const TERMINAL_OUT_1 = 'file.txt'
export const TERMINAL_CMD_2 = '$ echo $?'

export const CASE_SUCCESS = { label: 'ls file.txt', detail: 'File ditemukan', code: '0', tag: 'SUKSES' }
export const CASE_FAIL = { label: 'ls missing.txt', detail: 'File tidak ada', code: '1', tag: 'GAGAL' }

export const CHAIN_AND_CMD = 'mkdir project && cd project'
export const CHAIN_OR_CMD = 'ping google.com || echo "Offline"'
export const CHAIN_OR_FALLBACK = 'Offline'

export const CI_STEPS = [
  { id: 'build', label: 'BUILD' },
  { id: 'test', label: 'TEST' },
  { id: 'deploy', label: 'DEPLOY' },
]
export const CI_RESULT_LABEL = 'BUILD PASSED'

// Teks deklaratif ≤5 kata, dekat objek
export const CAPTIONS = {
  // Act 1 — sinyal rahasia $?
  TERMINAL_RUN: 'Command dijalankan di shell',
  TERMINAL_DONE: 'Proses selesai, kirim sinyal',
  CHECK_VAR: 'Cek status dengan echo $?',
  VAR_SHOW: 'Angka status muncul di layar',

  // Act 2 — sukses 0 vs gagal non-zero
  CASE_FOUND: 'File ditemukan, sukses total',
  CASE_MISSING: 'File tidak ditemukan, gagal',
  RULE_ZERO: 'Nol selalu berarti sukses',

  // Act 3 — rantai && vs ||
  AND_INTRO: '&& — lanjut hanya jika sukses',
  AND_RUN: 'mkdir sukses, exit code nol',
  AND_CONT: 'Perintah cd ikut dijalankan',
  OR_INTRO: '|| — cadangan kalau gagal',
  OR_RUN: 'ping gagal, exit non-zero',
  OR_FALLBACK: 'Pesan cadangan langsung tampil',

  // Act 4 — exit code di CI/CD
  CI_START: 'Pipeline menjalankan tiap step',
  CI_STEP: 'Tiap step dicek exit code',
  CI_PASS: 'Semua nol, build lolos hijau',
}

// SFX — semua nama merujuk file nyata di public/audio (lihat AUDIO_MANIFEST.md)
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  NUMBER_TALLY: { category: 'ui', name: 'number-tally' },
  TYPING: { category: 'sfx', name: 'typing' },
  SUCCESS: { category: 'success', name: 'confirm' },
  ERROR: { category: 'sfx', name: 'error' },
  IMPACT: { category: 'impacts', name: 'impact' },
  RELIEF: { category: 'success', name: 'relief-settle' },
}
