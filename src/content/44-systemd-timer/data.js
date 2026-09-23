// src/content/44-systemd-timer/data.js
// ─────────────────────────────────────────────────────────────
// Lihat _docs/SYSTEMD_TIMER_PLAN.md untuk storyboard 4 Act, model mental,
// dan batas aman (tidak ada command destructive, tidak ada path sistem
// nyata selain contoh generik backup.timer/backup.service &
// /var/log/backup.log). Scene shell: scene-ui V1 (portrait 820x1340) —
// IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1.
// Icon: inline SVG (tidak ada folder icons/), pola sama 35-cron-job.
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

  SYSTEMD: '#38BDF8',  // Cyan — identitas utama systemd
  TIMER: '#34D399',    // Emerald — unit .timer / jadwal
  SERVICE: '#FBBF24',  // Amber — unit .service / pekerjaan
  CRON_OLD: '#64748B', // Slate — cron job lama (dibandingkan, Act 1)

  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  RISK: '#F87171',
}

// Total durasi diukur ulang dari timeline nyata setelah preview manual —
// angka di bawah estimasi awal untuk badge saja (pola sama 35-cron-job).
export const PHASES = [
  { id: 'batasan-cron', badge: 'ACT 1 — BATASAN CRON JOB BIASA', badgeColor: COLORS.CRON_OLD, duration: 8 },
  { id: 'anatomi-unit', badge: 'ACT 2 — ANATOMI PASANGAN UNIT', badgeColor: COLORS.SYSTEMD, duration: 10 },
  { id: 'persistent', badge: 'ACT 3 — PERSISTENT=TRUE & ONBOOTSEC', badgeColor: COLORS.TIMER, duration: 10 },
  { id: 'observabilitas', badge: 'ACT 4 — OBSERVABILITAS LIST-TIMERS', badgeColor: COLORS.SYSTEMD, duration: 9 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS · AUTOMATION'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'SYSTEMD'
export const INTRO_TITLE_B = ' TIMER'
export const INTRO_SUBTITLE = 'Pengganti modern cron job'

// Copy layar — deklaratif, tanpa kata tanya/emoji/kata ganti orang
// (lihat 03-planning-storytelling-quality-gate.md § Wording).
export const COPY = {
  CRON_HAS_LIMITS: 'Cron job punya tiga batasan mendasar.',
  UNIT_PAIR_ANATOMY: 'File .service mendefinisikan pekerjaan yang dijalankan.',
  PERSISTENT_CATCHUP: 'Persistent=true memicu eksekusi susulan otomatis.',
  OBSERVABILITY_CENTRAL: 'journalctl merangkum seluruh riwayat eksekusi.',
}

// ── Anchor persisten — "systemd" (gear icon) yang settle di akhir Act 1
// dan TIDAK dihapus sampai penutup Act 3 (Continuity Contract §1.O, pola
// sama ANCHOR_POS 35-cron-job). Act 4 (observabilitas) SENGAJA tidak
// memakai anchor ini — fokus pindah ke terminal/journalctl. ──
export const ANCHOR_POS = { x: 366, y: 470 }

// ── Act 1 — Batasan cron job biasa: server mati pas tengah malam, log
// tercecer, tidak ada monitoring status native. ──
export const CRON_LIMITS = [
  { id: 'downtime', label: 'Server Mati', desc: 'Job terlewat, tanpa retry', color: COLORS.RISK },
  { id: 'scattered-log', label: 'Log Tercecer', desc: 'Tersebar di file berbeda', color: COLORS.WARNING },
  { id: 'no-monitor', label: 'Tanpa Monitoring', desc: 'Tidak ada status native', color: COLORS.MUTED },
]

export const ACT1_BEATS = {
  hook: { caption: 'Server mati tepat saat jadwal cron job jam 2 pagi.' },
  reveal: { caption: COPY.CRON_HAS_LIMITS },
  settle: { caption: 'Systemd Timer hadir sebagai penggantinya.' },
}

// ── Act 2 — Anatomi pasangan unit: backup.timer (jadwal) memicu
// backup.service (pekerjaan). ──
export const UNIT_PAIR = [
  { id: 'timer', label: 'backup.timer', desc: 'OnCalendar=*-*-* 02:00:00', color: COLORS.TIMER },
  { id: 'service', label: 'backup.service', desc: 'ExecStart=/usr/local/bin/backup.sh', color: COLORS.SERVICE },
]

export const ACT2_BEATS = {
  intro: { caption: 'Systemd Timer bekerja sebagai pasangan dua unit.' },
  layering: { caption: 'File .timer mendefinisikan jadwal eksekusi.' },
  closing: { caption: COPY.UNIT_PAIR_ANATOMY },
}

// ── Act 3 — Persistent=true & OnBootSec: simulasi server mati jam 02:00,
// hidup kembali jam 03:00, tugas terlewat langsung dieksekusi susulan. ──
export const CLOCK_DOWN = '02:00'
export const CLOCK_UP = '03:00'

export const CATCHUP_STEPS = [
  { id: 'missed', label: 'Jadwal Terlewat', desc: 'Server mati saat 02:00', color: COLORS.RISK },
  { id: 'boot', label: 'Server Menyala', desc: 'Jam 03:00 kembali online', color: COLORS.TIMER },
  { id: 'catchup', label: 'Eksekusi Susulan', desc: 'Persistent=true memicu langsung', color: COLORS.SUCCESS },
]

export const ACT3_BEATS = {
  intro: { caption: 'Jadwal menunggu waktu yang cocok, tapi server mati.' },
  matched: { caption: 'Pukul 03:00, server kembali menyala.' },
  closing: { caption: COPY.PERSISTENT_CATCHUP },
}

// ── Act 4 — Observabilitas dengan systemctl list-timers: hitung mundur
// next execution, waktu eksekusi terakhir, dan inspeksi log journalctl.
// Act ini SENGAJA tidak memakai anchor "systemd" (fokus pindah ke
// terminal/journal, lihat catatan ANCHOR_POS di atas). ──
export const LIST_TIMERS_ROW = {
  unit: 'backup.timer',
  next: 'Tomorrow 02:00:00',
  left: '5h 12min',
  last: 'Today 02:00:00',
}

export const JOURNAL_ENTRIES = [
  { id: 'start', label: 'Started backup.service', color: COLORS.TIMER },
  { id: 'run', label: 'Menjalankan backup.sh', color: COLORS.SERVICE },
  { id: 'done', label: 'Finished, status=0/SUCCESS', color: COLORS.SUCCESS },
]

export const ACT4_BEATS = {
  intro: { caption: 'Status timer bisa dipantau langsung dari command line.' },
  risk: { caption: 'systemctl list-timers menunjukkan jadwal berikutnya.' },
  closing: { caption: COPY.OBSERVABILITY_CENTRAL },
}

// ── SFX_MAP — nama file diverifikasi sama dengan yang dipakai
// 35-cron-job/data.js (sudah diaudit ada di public/audio/). ──
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
