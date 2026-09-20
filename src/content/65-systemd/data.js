// src/content/65-systemd/data.js
// ─────────────────────────────────────────────────────────────
// REVISI 04 (eksekusi revisi-02 + revisi-03, lihat
// revisi/2026-09-20-revisi-04-eksekusi-peta-sistem.md). Ganti dari
// lajur tunggal (AXIS_X) jadi peta 7 stasiun tersebar (STATIONS),
// dengan garis alur (LINES) sebagai sumber kelahiran tiap stasiun
// (Aturan Asal-Usul, revisi-02 §3.2). Path Atlas (PATH_ATLAS)
// ditambah untuk Path Bar. Konten cerita (6 Act) TIDAK berubah,
// yang berubah: posisi, cara muncul, dan durasi per-Act (revisi-02
// §3.5: 12/12/16/12/15/13 vs lama 9/9.5/10/9.5/10/9).
//
// DEVIASI dari plan revisi-03 §9 (icon): generate PNG lewat Chrome
// extension `vm-icon-generator` + ChatGPT butuh interaksi browser
// manual yang di luar jangkauan sesi eksekusi ini. Sebagai gantinya,
// tiap stasiun pakai pictogram SVG inline sederhana (bukan PNG
// AI-generate) -- bisa diganti PNG asli nanti tanpa mengubah posisi
// atau timeline. Lihat revisi-04 §Icon untuk detail.
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

  PROCESS: '#38BDF8',
  UNIT: '#A78BFA',
  MANAGER: '#FBBF24',
  ACTIVE: '#34D399',
  FAILED: '#F43F5E',
  DEPENDENCY: '#818CF8',
  JOURNAL: '#2DD4BF',
  DIAGNOSIS: '#F472B6',
  SUCCESS: '#34D399',
}

// Durasi per Act (revisi-02 §3.5) — estimasi, WAJIB diukur ulang dari
// timeline nyata saat preview (checklist 11.11, masih pending).
export const PHASES = [
  { id: 'process-to-service', badge: 'ACT 1 — DARI PROCESS KE SERVICE', badgeColor: COLORS.PROCESS, duration: 12.0 },
  { id: 'manager-lifecycle', badge: 'ACT 2 — MANAGER MENJALANKAN LIFECYCLE', badgeColor: COLORS.MANAGER, duration: 12.0 },
  { id: 'boot-dependency', badge: 'ACT 3 — BOOT & DEPENDENCY, ENABLE \u2260 START', badgeColor: COLORS.DEPENDENCY, duration: 16.0 },
  { id: 'process-gagal', badge: 'ACT 4 — KETIKA PROCESS GAGAL', badgeColor: COLORS.FAILED, duration: 12.0 },
  { id: 'jejak-journal', badge: 'ACT 5 — JEJAK DI JOURNAL', badgeColor: COLORS.JOURNAL, duration: 15.0 },
  { id: 'diagnosis-aman', badge: 'ACT 6 — DIAGNOSIS: IKUTI BUKTI', badgeColor: COLORS.DIAGNOSIS, duration: 13.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'WEB-DEMO.SERVICE'
export const INTRO_TITLE = 'SYSTEMD'
export const INTRO_SUBTITLE = 'Service yang dikelola, dijaga, dan diamati'

// ═══════════════════════════════════════════════
// PETA SISTEM — tujuh stasiun tersebar (revisi-02 §3.1, Bagian 4).
// Local coordinate di dalam ContentBodyV1 (body 732 x 965). Ukuran
// (w,h) DISESUAIKAN dari rencana asli Bagian 4 supaya tidak keluar
// dari body 0-732 dan tidak bertabrakan (deviasi tercatat di
// revisi-04 -- rencana asli 300x190 utk process/unit overflow di
// pinggir kanan pada cx=602).
// ═══════════════════════════════════════════════
// Ukuran dibesarkan dari draft awal supaya semua teks isi stasiun bisa
// >=11px (05-svg-layout-asset-pipeline.md standar caption/label), bukan
// 300x190 mentah dari rencana Bagian 4 (deviasi tercatat di revisi-04).
export const STATIONS = {
  processManual: { cx: 145, cy: 135, w: 250, h: 170, label: 'processManual' },
  unitFile: { cx: 587, cy: 135, w: 250, h: 170, label: 'unitFile' },
  manager: { cx: 366, cy: 330, w: 300, h: 170, label: 'manager' },
  managedProcess: { cx: 615, cy: 420, w: 190, h: 100, label: 'managedProcess' },
  bootTarget: { cx: 165, cy: 590, w: 280, h: 150, label: 'bootTarget' },
  journal: { cx: 560, cy: 590, w: 300, h: 230, label: 'journal' },
  diagnosis: { cx: 366, cy: 780, w: 430, h: 100, label: 'diagnosis' },
}
// Stamp payoff (Act 6 akhir) -- di bawah Diagnosis Terminal, bukan
// menimpa Journal lagi (perbaikan tabrakan revisi-02 §2.3).
export const CLOSING_Y = 912

// Garis alur -- tiap objek baru WAJIB lahir dari salah satu garis ini
// (Aturan Asal-Usul, revisi-02 §3.2 cara 1). Label singkat menempel
// di tengah garis lewat PathLabel.
export const LINES = [
  { id: 'process-to-unit', from: 'processManual', to: 'unitFile', label: 'dideklarasikan sebagai unit' },
  { id: 'unit-to-manager', from: 'unitFile', to: 'manager', label: 'dikenali systemd' },
  { id: 'manager-to-managed', from: 'manager', to: 'managedProcess', label: 'start request' },
  { id: 'manager-to-boot', from: 'manager', to: 'bootTarget', label: 'boot & dependency' },
  { id: 'managed-to-journal', from: 'managedProcess', to: 'journal', label: 'stdout/stderr' },
  { id: 'managed-to-diagnosis', from: 'managedProcess', to: 'diagnosis', label: 'status' },
  { id: 'journal-to-diagnosis', from: 'journal', to: 'diagnosis', label: 'log terfilter' },
]

// ═══════════════════════════════════════════════
// PATH ATLAS — lokasi Linux nyata per stasiun/Act (revisi-02 §3.3,
// revisi-03 Bagian 5). Dipakai Path Bar (crossfade) & path tag kecil
// di stasiun yang punya lokasi disk/runtime nyata.
// ═══════════════════════════════════════════════
export const PATH_ATLAS = {
  empty: '',
  unitFile: '/etc/systemd/system/web-demo.service',
  managedProcessInitial: '/proc/4021/',
  bootTarget: '/etc/systemd/system/multi-user.target.wants/',
  managedProcessRestarted: '/proc/4198/',
  journal: '/var/log/journal/',
}

// ═══════════════════════════════════════════════
// UNIT -- representasi DESKRIPTIF (bukan syntax unit file asli).
// ═══════════════════════════════════════════════
export const UNIT_INFO = {
  name: 'web-demo.service',
  description: 'Web demo backend',
  runs: 'node server.js',
  runsAs: 'app (non-root)',
  restartPolicy: 'on-failure, dibatasi',
  wantedBy: 'multi-user.target',
}

export const PROCESS_LABEL = 'PROCESS MANUAL'
export const UNIT_LABEL = 'UNIT DEFINITION'
export const MANAGER_LABEL = 'SYSTEMD MANAGER'
export const MANAGED_PROCESS_LABEL = 'MANAGED PROCESS'

// PID -- Process Manual & Managed Process pertama kali share PID sama
// (unit baru pertama start dari process yg sama); PID berubah cuma
// setelah restart (revisi-03 §6.2 catatan), menjawab temuan (a).
export const PID_INITIAL = 4021
export const PID_AFTER_RESTART = 4198

export const LIFECYCLE_META = {
  declared: { label: 'DECLARED', color: COLORS.UNIT, note: 'unit dikenali, belum jalan' },
  starting: { label: 'STARTING', color: COLORS.MANAGER, note: 'manager mengirim start request' },
  active: { label: 'ACTIVE', color: COLORS.ACTIVE, note: 'unit berjalan & diawasi' },
  failed: { label: 'FAILED', color: COLORS.FAILED, note: 'process berhenti tak terduga' },
  restarting: { label: 'RESTARTING', color: COLORS.MANAGER, note: 'restart terbatas, bukan tanpa batas' },
}

export const BOOT_TARGET = { id: 'target', label: 'multi-user.target', note: 'boot target' }
export const DEPENDENCIES = [
  { id: 'network', label: 'network-online.target', relation: 'Requires' },
  { id: 'docker', label: 'docker.service', relation: 'After' },
]
export const ENABLE_BADGE = { label: 'ENABLE', note: 'ikut boot target, lain waktu' }
export const START_BADGE = { label: 'START', note: 'jalan sekarang' }

export const JOURNAL_ENTRIES = [
  { id: 'j1', time: '08:12:01', source: 'MANAGER', text: 'Starting web-demo.service', highlighted: false },
  { id: 'j2', time: '08:12:01', source: 'APP', text: 'server listening on :8080', highlighted: false },
  { id: 'j3', time: '08:12:01', source: 'MANAGER', text: 'Started web-demo.service', highlighted: false },
  { id: 'j4', time: '08:14:47', source: 'APP', text: 'unhandled error, exiting', highlighted: true },
  { id: 'j5', time: '08:14:47', source: 'MANAGER', text: 'main process exited, code=1', highlighted: true },
  { id: 'j6', time: '08:14:48', source: 'MANAGER', text: 'Restart attempt 1/3 scheduled', highlighted: true },
  { id: 'j7', time: '08:14:49', source: 'APP', text: 'server listening on :8080', highlighted: false },
]

export const SOURCE_COLOR = {
  MANAGER: COLORS.MANAGER,
  APP: COLORS.PROCESS,
  KERNEL: COLORS.MUTED,
}

// DIAGNOSIS_STEPS -- field `question` diganti `statement`, pernyataan
// bukan kalimat tanya (temuan c, revisi-03 §10.1).
export const DIAGNOSIS_STEPS = [
  { id: 'status', label: 'STATUS', statement: 'Cek unit: dikelola & active', source: 'Unit status ringkas' },
  { id: 'journal', label: 'JOURNAL', statement: 'Journal: waktu gagal & restart', source: 'Journal disaring per unit & waktu' },
  { id: 'context', label: 'KONTEKS', statement: 'Konteks: alasan app berhenti', source: 'Waktu, boot, app stderr' },
]

export const CLOSING_STAMPS = [
  { top: 'ACTIVE \u2260 SEHAT', sub: 'log & health check tetap perlu' },
  { top: 'IKUTI BUKTI', sub: 'status \u2192 journal \u2192 waktu' },
]

// CAPTIONS -- isi teks TIDAK berubah (revisi-03 §10.2, sudah ≤5 kata).
// Cara render berubah dari say()+bar jadi IconCaption/PathLabel yang
// menempel ke stasiun/garis relevan (dipetakan di Animation.jsx per Act).
export const CAPTIONS = {
  RAW_PROCESS: 'Process biasa, belum dikelola',
  UNIT_DECLARED: 'Unit file menyatakan cara menjalankannya',
  SERVICE_BORN: 'systemd mengenali sebagai service',
  MANAGER_STARTS: 'Manager mengirim start request',
  BECOMES_ACTIVE: 'Unit menjadi active',
  PID_NOTE: 'PID bisa berubah, unit tetap sama',
  BOOT_TARGET: 'Target boot memicu dependency',
  DEP_CHAIN: 'Requires & After menentukan urutan',
  ENABLE_VS_START: 'Enable dan start, dua hal berbeda',
  PROCESS_DIES: 'Process berhenti tiba-tiba',
  STATE_FAILED: 'Status berubah jadi failed',
  BOUNDED_RESTART: 'Restart dicoba, tapi terbatas',
  BACK_ACTIVE: 'Kembali active, tapi tetap perlu dicek',
  STDOUT_TO_JOURNAL: 'stdout & stderr masuk journal',
  MANAGER_EVENTS: 'Event manager ikut tercatat',
  TIMELINE_GROWS: 'Journal jadi jejak waktu',
  READ_STATUS: 'Mulai dari status ringkas',
  FILTER_JOURNAL: 'Saring journal per unit & waktu',
  CHECK_CONTEXT: 'Tambahkan konteks boot & waktu',
  TAKEAWAY: 'Jangan menebak, ikuti bukti',
}

// SFX_MAP -- WHOOSH, SLIDE_IN, LOCK sebelumnya dead config (temuan f),
// sekarang semua dipanggil (lihat Animation.jsx). Cross-check: setiap
// entry di sini WAJIB dipanggil minimal sekali (06-audio-sfx.md §3).
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
