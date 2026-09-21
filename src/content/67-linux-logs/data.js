// src/content/67-linux-logs/data.js
// ─────────────────────────────────────────────────────────────
// Topic baru dari nol (override keputusan merge di
// _docs/LINUX_LOGS_MERGE_PLAN.md). Struktur & pola visual (STATIONS,
// LINES, PATH_ATLAS, Stamp, IconCaption) meniru pola Topic 65 (systemd,
// sudah tervalidasi no-overlap) tapi konten & peran stasiun diganti
// total untuk materi logging umum (journald, syslog, rotasi, audit,
// incident timeline). Lihat _docs/LINUX_LOGS_STANDALONE_PLAN.md.
// ─────────────────────────────────────────────────────────────

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  EVENT: '#38BDF8',
  LOGFILE: '#A78BFA',
  JOURNALD: '#2DD4BF',
  REMOTE: '#FBBF24',
  ROTATION: '#F97316',
  TIMELINE: '#818CF8',
  DIAGNOSIS: '#F472B6',
  ACTIVE: '#34D399',
  WARN: '#F43F5E',
}

export const PHASES = [
  { id: 'dua-jalur', badge: 'ACT 1 — DARI EVENT KE DUA JALUR', badgeColor: COLORS.EVENT, duration: 9.0 },
  { id: 'journald', badge: 'ACT 2 — JOURNALD: TERSTRUKTUR & BISA DIFILTER', badgeColor: COLORS.JOURNALD, duration: 8.5 },
  { id: 'log-files', badge: 'ACT 3 — LOG FILES: TEKS DI /var/log', badgeColor: COLORS.LOGFILE, duration: 8.0 },
  { id: 'rotasi-retensi', badge: 'ACT 4 — ROTASI & RETENSI: LOG TIDAK ABADI', badgeColor: COLORS.ROTATION, duration: 9.0 },
  { id: 'terpusat-audit', badge: 'ACT 5 — TERPUSAT & AUDIT TRAIL', badgeColor: COLORS.REMOTE, duration: 11.0 },
  { id: 'rekonstruksi', badge: 'ACT 6 — REKONSTRUKSI: IKUTI JEJAK WAKTU', badgeColor: COLORS.DIAGNOSIS, duration: 10.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE = 'LOG SYSTEM'
export const INTRO_SUBTITLE = 'Jejak yang tercatat, kalau tahu cara bacanya'

// ═══════════════════════════════════════════════
// PETA SISTEM — 7 stasiun, koordinat reuse dari Topic 65 (sudah
// tervalidasi no-overlap, lihat data.js Topic 65 catatan gap>=20).
// ═══════════════════════════════════════════════
export const STATIONS = {
  rawEvent: { cx: 145, cy: 135, w: 250, h: 170, label: 'rawEvent' },
  logFiles: { cx: 587, cy: 135, w: 250, h: 170, label: 'logFiles' },
  journald: { cx: 366, cy: 330, w: 300, h: 175, label: 'journald' },
  remoteAudit: { cx: 624, cy: 420, w: 176, h: 100, label: 'remoteAudit' },
  rotation: { cx: 165, cy: 590, w: 280, h: 150, label: 'rotation' },
  timeline: { cx: 540, cy: 600, w: 340, h: 220, label: 'timeline' },
  diagnosis: { cx: 366, cy: 780, w: 430, h: 100, label: 'diagnosis' },
}
export const CLOSING_Y = 912

export const LINES = [
  { id: 'event-to-journald', from: 'rawEvent', to: 'journald', label: 'event ditangkap' },
  { id: 'journald-to-logfiles', from: 'journald', to: 'logFiles', label: 'diteruskan ke rsyslog' },
  { id: 'journald-to-remote', from: 'journald', to: 'remoteAudit', label: 'forward ke server pusat' },
  { id: 'journald-to-rotation', from: 'journald', to: 'rotation', label: 'kena kebijakan retensi' },
  { id: 'remote-to-timeline', from: 'remoteAudit', to: 'timeline', label: 'audit trail tercatat' },
  { id: 'remote-to-diagnosis', from: 'remoteAudit', to: 'diagnosis', label: 'cross-check sumber' },
  { id: 'timeline-to-diagnosis', from: 'timeline', to: 'diagnosis', label: 'urutan waktu' },
  { id: 'rotation-to-diagnosis', from: 'rotation', to: 'diagnosis', label: 'ingat: log tidak abadi' },
]

export const PATH_ATLAS = {
  empty: '',
  journald: '/var/log/journal/',
  logFiles: '/var/log/syslog',
  rotationConf: '/etc/systemd/journald.conf',
  remoteConf: '/etc/rsyslog.d/50-remote.conf',
}

export const EVENT_INFO = {
  name: 'web-demo app',
  writesVia: 'stdout / stderr / syslog()',
  example: 'user login failed: alice',
}

export const RAW_EVENT_LABEL = 'APP / PROCESS'
export const JOURNALD_LABEL = 'JOURNALD'
export const LOGFILES_LABEL = 'LOG FILES'
export const REMOTE_LABEL = 'REMOTE / AUDIT'

export const JOURNALD_FIELDS = [
  { key: 'PRIORITY', value: '3 (err)' },
  { key: '_PID', value: '4021' },
  { key: '_SYSTEMD_UNIT', value: 'web-demo.service' },
  { key: 'MESSAGE', value: 'user login failed: alice' },
]

export const LOGFILE_PREVIEW = [
  'Jan 21 08:12:01 host app[4021]: server listening on :8080',
  'Jan 21 08:14:47 host app[4021]: user login failed: alice',
]

export const ROTATION_INFO = {
  journald: { label: 'AUTO VACUUM', note: 'SystemMaxUse=500M' },
  logrotate: { label: 'ROTATE + HAPUS', note: 'logrotate, retensi 30 hari' },
}

export const REMOTE_INFO = {
  target: 'log-server:514',
  note: 'siapa, apa, kapan — tercatat',
}

// TIMELINE_ENTRIES -- pola sama seperti JOURNAL_ENTRIES Topic 65,
// merepresentasikan insiden yang direkonstruksi lintas sumber.
export const TIMELINE_ENTRIES = [
  { id: 't1', time: '08:12:01', source: 'JOURNALD', text: 'web-demo.service started', highlighted: false },
  { id: 't2', time: '08:12:01', source: 'SYSLOG', text: 'server listening on :8080', highlighted: false },
  { id: 't3', time: '08:14:47', source: 'AUDIT', text: 'login failed: alice, 3x', highlighted: true },
  { id: 't4', time: '08:14:48', source: 'JOURNALD', text: 'rate-limit triggered', highlighted: true },
  { id: 't5', time: '08:14:50', source: 'AUDIT', text: 'login failed: alice, IP diblok', highlighted: true },
  { id: 't6', time: '08:15:02', source: 'SYSLOG', text: 'firewall rule applied', highlighted: false },
  { id: 't7', time: '08:15:05', source: 'JOURNALD', text: 'incident tercatat lengkap', highlighted: false },
]

export const SOURCE_COLOR = {
  JOURNALD: COLORS.JOURNALD,
  SYSLOG: COLORS.LOGFILE,
  AUDIT: COLORS.REMOTE,
}

export const DIAGNOSIS_STEPS = [
  { id: 'timestamp', label: 'TIMESTAMP', statement: 'Urutkan semua entri per waktu', source: 'Jangan percaya urutan tampilan' },
  { id: 'source', label: 'SOURCE', statement: 'Bedakan journald, syslog, audit', source: 'Tiap sumber punya sudut berbeda' },
  { id: 'context', label: 'KONTEKS', statement: 'Gabungkan jadi satu cerita utuh', source: 'Baru simpulkan apa yang terjadi' },
]

export const CLOSING_STAMPS = [
  { top: 'LOG BISA SENSITIF', sub: 'jangan simpan rahasia mentah' },
  { top: 'IKUTI JEJAK WAKTU', sub: 'urutan waktu = rekonstruksi insiden' },
]

export const CAPTIONS = {
  RAW_EVENT: 'App menulis event, belum masuk log manapun',
  JOURNALD_CAPTURES: 'journald menangkap semua event',
  JOURNALD_STRUCTURED: 'Disimpan terstruktur, bisa difilter',
  FIELDS_SHOWN: 'Field: priority, unit, pesan',
  FORWARD_LOGFILES: 'Diteruskan juga ke rsyslog',
  LOGFILES_PLAIN: 'Jadi baris teks polos di /var/log',
  GREP_ABLE: 'Bisa dibaca manusia, dicari pakai grep',
  FORWARD_REMOTE: 'journald juga forward ke server pusat',
  BECOMES_AUDIT: 'Di sana jadi audit trail',
  ROTATION_HITS: 'Semua log kena kebijakan retensi',
  NOT_ETERNAL: 'Log tidak abadi, ada batas & rotasi',
  AUDIT_TO_TIMELINE: 'Audit trail masuk ke timeline insiden',
  TIMELINE_GROWS: 'Timeline jadi jejak lintas sumber',
  READ_TIMESTAMP: 'Mulai dari urutan waktu',
  SEPARATE_SOURCE: 'Pisahkan per sumber log',
  MERGE_CONTEXT: 'Gabungkan jadi konteks penuh',
  TAKEAWAY: 'Log bukan abadi, tapi jejaknya berharga',
}

// SFX_MAP -- reuse kategori yang sama dengan Topic 65 (sudah
// tersourcing & terverifikasi di 06-audio-sfx.md).
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  DING: { category: 'success', name: 'ding' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  SUCCESS: { category: 'sfx', name: 'success' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
