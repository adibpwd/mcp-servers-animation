// src/content/35-cron-job/data.js
// ─────────────────────────────────────────────────────────────
// Lihat _docs/CRON_JOB_PLAN.md untuk storyboard 4 Act, model mental,
// dan batas aman (tidak ada command destructive, tidak ada path
// sistem nyata selain contoh generik /backup.sh & /var/log/backup.log).
// Scene shell: scene-ui V1 (portrait 820x1340) — IntroHeaderMorphV1 +
// ActBadgeNavigatorV1 + ContentBodyV1.
// Icon: inline SVG (tidak ada folder icons/), pola sama 81-network-interface.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111827',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CRON: '#38BDF8',    // Cyan — daemon crond / identitas utama
  JOB: '#34D399',     // Emerald — job/script yang dijalankan
  FIELD: '#FBBF24',   // Amber — field waktu crontab
  WILDCARD: '#A78BFA',// Violet — simbol wildcard/step
  WORKER: '#F472B6',  // Pink — proses worker
  LOG: '#22D3EE',     // Cyan muda — log file

  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  RISK: '#F87171',
}

// Total durasi diukur ulang dari timeline nyata setelah preview manual —
// angka di bawah estimasi awal untuk badge saja (pola sama 81-network-interface).
export const PHASES = [
  { id: 'daemon-tak-tidur', badge: 'ACT 1 — DAEMON TAK PERNAH TIDUR', badgeColor: COLORS.CRON, duration: 9 },
  { id: 'lima-bintang', badge: 'ACT 2 — MEMBACA 5 BINTANG CRONTAB', badgeColor: COLORS.FIELD, duration: 11 },
  { id: 'memicu-worker', badge: 'ACT 3 — MEMICU SCRIPT DAN WORKER', badgeColor: COLORS.WORKER, duration: 9 },
  { id: 'log-redirection', badge: 'ACT 4 — EKSEKUSI SILENT DAN LOG', badgeColor: COLORS.LOG, duration: 9 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS · AUTOMATION'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'CRON'
export const INTRO_TITLE_B = ' JOB'
export const INTRO_SUBTITLE = 'Robot penjadwal otomatis di Linux'

// Copy layar — deklaratif, tanpa kata tanya/emoji/kata ganti orang
// (lihat 03-planning-storytelling-quality-gate.md § Wording).
export const COPY = {
  CROND_NEVER_SLEEPS: 'Daemon crond memeriksa jadwal setiap menit.',
  FIVE_FIELDS_ONE_LINE: 'Lima kolom waktu menentukan satu jadwal.',
  MATCH_TRIGGERS_WORKER: 'Jadwal cocok memicu proses worker baru.',
  SILENT_NEEDS_REDIRECT: 'Eksekusi diam-diam butuh redirect log.',
}

// ── Anchor persisten — daemon "crond" yang settle di akhir Act 1 dan
// TIDAK dihapus sampai penutup Act 3 (Continuity Contract §1.O, pola
// sama ANCHOR_POS 81-network-interface). Act 4 (log redirection)
// sengaja TIDAK memakai anchor ini — fokusnya pindah ke script/worker
// dan file log, bukan daemon itu sendiri. ──
export const ANCHOR_POS = { x: 366, y: 470 }

// ── Act 1 — Daemon tak pernah tidur: crond berjalan nonstop di
// background memeriksa daftar jadwal setiap menit. ──
export const SCHEDULED_JOBS = [
  { id: 'backup', label: 'Backup DB', desc: 'Setiap jam 2 pagi', color: COLORS.CRON },
  { id: 'cleanup', label: 'Bersihkan Tmp', desc: 'Setiap 30 menit', color: COLORS.CRON },
  { id: 'report', label: 'Kirim Laporan', desc: 'Setiap hari Senin', color: COLORS.CRON },
]

export const ACT1_BEATS = {
  hook: { caption: 'Setiap menit, crond bangun memeriksa jadwal.' },
  reveal: { caption: COPY.CROND_NEVER_SLEEPS },
  settle: { caption: 'Fokus ke satu proses: crond.' },
}

// ── Act 2 — Membaca 5 bintang crontab: 5 kolom waktu + arti simbol. ──
export const CRONTAB_FIELDS = [
  { id: 'minute', label: 'Menit', range: '0-59' },
  { id: 'hour', label: 'Jam', range: '0-23' },
  { id: 'dom', label: 'Tanggal', range: '1-31' },
  { id: 'month', label: 'Bulan', range: '1-12' },
  { id: 'dow', label: 'Hari', range: '0-6' },
]

// ── REVISI-01: 3 pola nyata (multi-case) menggantikan 1 contoh statis.
// `highlightFields` = id CRONTAB_FIELDS yang jadi kunci makna pola ini. ──
export const CRON_CASES = [
  {
    id: 'daily',
    pattern: ['0', '2', '*', '*', '*'],
    highlightFields: ['minute', 'hour'],
    badge: 'Jam 02:00 pagi, setiap hari. (Backup database)',
    color: COLORS.CRON,
  },
  {
    id: 'interval',
    pattern: ['*/15', '*', '*', '*', '*'],
    highlightFields: ['minute'],
    badge: 'Setiap 15 menit sekali, nonstop. (Bersihkan tmp)',
    color: COLORS.WILDCARD,
  },
  {
    id: 'weekly',
    pattern: ['0', '9', '*', '*', '1'],
    highlightFields: ['hour', 'dow'],
    badge: 'Senin jam 09:00 pagi, tiap minggu. (Kirim laporan)',
    color: COLORS.FIELD,
  },
]

export const ACT2_BEATS = {
  intro: { caption: 'Satu baris crontab punya lima slot waktu.' },
  layering: { caption: 'Pola yang sama, makna berbeda tiap kasus.' },
  closing: { caption: COPY.FIVE_FIELDS_ONE_LINE },
}

// ── Act 3 — Memicu script & worker: jarum jam menyentuh 02:00, crond
// memicu worker baru menjalankan /backup.sh. ──
export const CLOCK_TARGET = '02:00'

export const WORKER_STEPS = [
  { id: 'match', label: 'Pola cocok', desc: 'Waktu saat ini == jadwal', color: COLORS.CRON },
  { id: 'fork', label: 'Fork worker', desc: 'Proses anak baru dibuat', color: COLORS.WORKER },
  { id: 'run', label: 'Jalankan script', desc: '/backup.sh dieksekusi', color: COLORS.JOB },
]

export const ACT3_BEATS = {
  intro: { caption: 'Jadwal menunggu waktu yang cocok.' },
  matched: { caption: 'Pukul 02:00, pola langsung cocok.' },
  closing: { caption: COPY.MATCH_TRIGGERS_WORKER },
}

// ── Act 4 — Eksekusi silent & log redirection: stdout/stderr yang
// tidak diarahkan akan hilang begitu saja. ──
export const LOG_STREAMS = [
  { id: 'stdout', label: 'stdout', desc: 'Output normal script', color: COLORS.JOB },
  { id: 'stderr', label: 'stderr', desc: 'Pesan error script', color: COLORS.RISK },
]

export const LOG_TARGET = { path: '/var/log/backup.log', redirect: '>> ... 2>&1' }

export const ACT4_BEATS = {
  intro: { caption: 'Cron job berjalan tanpa layar.' },
  risk: { caption: 'Tanpa redirect, hasil eksekusi hilang begitu saja.' },
  closing: { caption: COPY.SILENT_NEEDS_REDIRECT },
}

// ── SFX_MAP — nama file diverifikasi sama dengan yang dipakai
// 81-network-interface/data.js (sudah diaudit ada di public/audio/). ──
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh-2' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  COMPLETE: { category: 'success', name: 'complete' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  SOFT_DENY: { category: 'warnings', name: 'soft-deny' },
}
