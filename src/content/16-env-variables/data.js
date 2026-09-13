// src/content/env-variables/data.js
// ─────────────────────────────────────────────────────────────
// Environment Variables & .env — cerita: app yang jalan mulus di
// laptop tapi crash di server production (kode identik) → ternyata
// config di-hardcode di kode → solusi: environment variable, tiap
// mesin baca "catatan" (.env) sendiri → catatan itu berisi rahasia,
// jadi wajib masuk .gitignore, bukan ikut ke-commit.
// Lihat _docs/ENV_VARIABLES_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  DEV: '#38BDF8',       // sky blue — laptop developer
  SERVER: '#06B6D4',    // cyan — server production
  DANGER: '#F43F5E',    // rose — crash, error, secret leak
  SUCCESS: '#34D399',   // green — config benar, app jalan normal
  CONFIG: '#FBBF24',    // yellow — sticky note / env var
  GIT: '#FB923C',       // orange — kotak git/repository
}

export const PHASES = [
  {
    id: 'same-code-hook',
    badge: 'ACT 1 — KODE SAMA, KENAPA BEDA HASIL?',
    badgeColor: COLORS.DEV,
    duration: 8.0,
  },
  {
    id: 'hardcode-vs-envvar',
    badge: 'ACT 2 — CATATAN BEDA, KODE TETAP SAMA',
    badgeColor: COLORS.CONFIG,
    duration: 10.5,
  },
  {
    id: 'dont-commit-env',
    badge: 'ACT 3 — JANGAN TITIP RAHASIA KE GIT',
    badgeColor: COLORS.GIT,
    duration: 10.5,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY = 'DEVELOPER TOOLS'

// ═══════════════════════════════════════════════
// ACT 1 — Kode Sama, Kenapa Beda Hasil? (hook)
// ═══════════════════════════════════════════════
export const DEV_LABEL = 'LOCAL (DEV)'
export const SERVER_LABEL = 'PRODUCTION'
export const CODE_SNIPPET_ACT1 = 'connect("localhost")'
export const HOOK_QUESTION = 'Kodenya sama persis... kok bisa beda?'
export const HOOK_CLIFFHANGER = 'Coba bongkar, kenapa bisa beda.'

// ═══════════════════════════════════════════════
// ACT 2 — Hardcode vs Environment Variable
// ═══════════════════════════════════════════════
export const HARDCODE_LINE = 'DB_HOST = "localhost"'
export const HARDCODE_BADGE = 'HARDCODE'
export const HARDCODE_INSIGHT = 'Config ketulis langsung di kode — cuma benar di 1 tempat.'
export const ENVVAR_LINE = 'DB_HOST = process.env.DB_HOST'
export const STICKY_DEV_TEXT = 'DB_HOST=localhost'
export const STICKY_SERVER_TEXT = 'DB_HOST=prod-db.internal'
export const ENVVAR_INSIGHT = 'Kode baca catatan, catatan beda-beda tiap tempat.'

// ═══════════════════════════════════════════════
// ACT 3 — Jangan Titip Rahasia ke Git
// ═══════════════════════════════════════════════
export const SECRET_LINES = ['DB_PASSWORD=********', 'API_KEY=********']
export const SECRET_BADGE = 'RAHASIA'
export const SCANNER_WARNING = 'Bot scanner bisa nemuin dalam hitungan menit.'
export const LEAK_CAPTION = 'Rahasia bocor, siapa saja bisa pakai.'
export const GIT_HISTORY_NOTE = 'Riwayat commit nyimpan itu, walau file dihapus.'
export const GITIGNORE_LABEL = '.gitignore'
export const ENV_EXAMPLE_TEXT = 'DB_HOST=\nAPI_KEY='
export const ENV_EXAMPLE_LABEL = '.env.example'
export const CLOSING_PAYOFF = 'Kode sama, catatan beda tiap tempat.'
export const CLOSING_LINE = 'Catatan itu rahasia — jangan sampai bocor.'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// (dicek manual sebelum eksekusi, tidak perlu sourcing baru,
// lihat docs/standardizations/06-audio-sfx.md §2)
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  TICK: { category: 'ui', name: 'tick' },
  BOUNCE: { category: 'ui', name: 'bounce' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  CHARGE: { category: 'success', name: 'charge' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },

  ERROR: { category: 'sfx', name: 'error' },
  SUCCESS: { category: 'sfx', name: 'success' },
  TYPING: { category: 'sfx', name: 'typing' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  CLICK: { category: 'sfx', name: 'click' },
}
