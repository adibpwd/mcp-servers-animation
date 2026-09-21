// src/content/44-ssh/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-01 (lihat revisi/2026-09-18-revisi-01-lima-act.md):
// SSH_PLAN.md punya 2 storyboard — awal (4 Act) dan revisi 2026-09-16
// (7 Act, "peta lengkap"). Atas konfirmasi eksplisit user, dieksekusi
// SATU video 5-Act yang MENGGABUNGKAN seluruh isi 7-Act (bukan memotong
// konten), lewat 2 merge:
//   Act1 = 7-Act Act1(target)+Act2(host trust) + pembentukan kanal
//          terenkripsi dari plan awal (tidak ada di 7-Act eksplisit,
//          tapi tidak boleh hilang — SSH_PLAN §Batas akurasi poin 1).
//   Act2 = 7-Act Act3 (authentication vs authorization).
//   Act3 = 7-Act Act4 (shell / command / file transfer modes).
//   Act4 = 7-Act Act5(forwarding) + Act6(bastion/jump host/config/mux).
//   Act5 = 7-Act Act7 (key lifecycle/policy/logging/IR) + closing.
// Icon: inline SVG (bukan PNG ChatGPT-pipeline) — konsisten dengan
// 17-rest-api, tidak ada folder icons/ untuk topic ini.
// SFX: nama dipakai ulang dari daftar yang SUDAH diaudit di 17-rest-api
// (public/audio/*), tidak ada sourcing baru.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',      // Sky — client, laptop, request asal
  SERVER: '#FBBF24',      // Amber — sshd server, gate, processor
  TRUST: '#22D3EE',       // Cyan — host identity / fingerprint / trust
  TUNNEL: '#34D399',      // Emerald — kanal terenkripsi, sukses, CONNECT
  AUTH: '#A78BFA',        // Violet — identitas user, authentication
  AUTHZ: '#FB923C',       // Orange — authorization/policy gate
  FORWARD: '#38BDF8',     // Sky — forwarding listener
  BASTION: '#FBBF24',     // Amber — bastion/jump host
  RISK: '#F87171',        // Merah — batas risiko/larangan
  OPS: '#34D399',         // Emerald — operasi aman/lifecycle
}

// Total durasi diukur ulang dari timeline nyata setelah eksekusi (bukan
// tebakan) — angka di bawah hanya estimasi awal untuk badge, konsisten
// dengan pola 17-rest-api REVISI-08. EKSEKUSI-03 (lihat
// revisi/2026-09-21-revisi-03-payload-read-hold-pauses.md): durasi Act 2–5
// dinaikkan untuk menampung jeda baca payload (readHold).
export const PHASES = [
  { id: 'connect-trust', badge: 'ACT 1 — HUBUNGI & VERIFIKASI SERVER', badgeColor: COLORS.TRUST, duration: 24 },
  { id: 'authn-authz', badge: 'ACT 2 — LOGIN vs HAK AKSES', badgeColor: COLORS.AUTH, duration: 27 },
  { id: 'channel-modes', badge: 'ACT 3 — SATU KANAL, BANYAK MODE', badgeColor: COLORS.SERVER, duration: 34 },
  { id: 'forward-bastion', badge: 'ACT 4 — ARAHKAN TRAFIK & JARINGAN PRIVAT', badgeColor: COLORS.FORWARD, duration: 36 },
  { id: 'ops-scale', badge: 'ACT 5 — OPERASI AMAN DI SKALA', badgeColor: COLORS.OPS, duration: 26 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'SSH'
export const INTRO_TITLE_B = 'CONNECT'
export const INTRO_SUBTITLE = 'Terminal aman menuju komputer jauh'

// ── Layout — spine vertikal x=AXIS_X, client di atas, server di bawah,
// zona tengah (INSET) dipakai bergantian oleh tiap Act untuk diagram
// spesifik (fingerprint, gate, channel branch, forwarding, dashboard) —
// anchor client/server/channel TIDAK pernah dihapus, hanya di-morph
// atau diredupkan (continuity, lihat SSH_PLAN.md §Continuity map). ──
export const AXIS_X = 366
export const CLIENT_Y = 120
export const SERVER_Y = 905
export const INSET_TOP = 250
export const INSET_BOTTOM = 800

// Titik channel line dari bawah client sampai atas server.
export const CHANNEL_TOP = CLIENT_Y + 85
export const CHANNEL_BOTTOM = SERVER_Y - 85

export const CLIENT_LABEL = 'CLIENT'
export const SERVER_LABEL = 'SSH SERVER (sshd)'
export const HOST_LABEL = 'host: server-jauh.internal  port: 22'

// ── Titik anchor absolut bersama Act 2–5 (body-local ContentBodyV1) ──
// Dipakai timeline Animation.jsx DAN file per-act (acts/*.jsx) sebagai
// posisi base kartu/kapsul sebelum di-morph oleh pop state (standarisasi
// "1 act = 1 file", lihat docs/standardizations/07-act-scene-pattern.md).
export const NEAR_CLIENT = { x: AXIS_X, y: 300 }
export const MID = { x: AXIS_X, y: 500 }
export const NEAR_SERVER = { x: AXIS_X, y: 740 }
export const ALT_METHODS_PT = { x: AXIS_X, y: 230 }
export const GATE_PT = { x: AXIS_X, y: 560 }
export const SCOPE_PT = { x: AXIS_X, y: 610 }
export const SHELL_OUTPUT_CARD_PT = { x: AXIS_X, y: 340 }
export const LISTENER_PT = { x: AXIS_X, y: 360 }
export const AUDIT_PT = { x: AXIS_X, y: 640 }

// ═══════════════════════════════════════════════
// ACT 1 — Hubungi & Verifikasi Server
// (7-Act Act1 target + Act2 host-trust + pembentukan kanal terenkripsi
// dari plan awal §Batas akurasi poin 1 — tidak boleh hilang).
// ═══════════════════════════════════════════════
export const ACT1_BEATS = {
  target: {
    caption: 'Client menghubungi SSH server',
    sub: 'Host dan port menentukan tujuan',
  },
  fingerprint: {
    caption: 'Fingerprint server diperiksa',
    knownHosts: 'known_hosts: SHA256:9f:2c:aa:...',
    seenHost: 'host key diterima: SHA256:9f:2c:aa:...',
  },
  trust: {
    caption: 'Identitas tujuan tervalidasi sebelum login',
    badge: 'HOST TERPERCAYA',
  },
  tunnel: {
    caption: 'SSH membentuk kanal terenkripsi',
    sub: 'Isi terminal terlindungi dari jaringan publik',
  },
}

// ═══════════════════════════════════════════════
// ACT 2 — Login vs Hak Akses
// EKSEKUSI-02 (lihat revisi/2026-09-19-revisi-02-case-based-payload-flow.md):
// diganti dari chip-row generic (IDENTITY_METHODS/AUTHZ_OUTCOMES) menjadi
// SATU studi kasus bernama "Akun Deploy Terbatas" dengan alur
// before → intent → travel → apply → after. Password/SSH Key/Certificate/
// MFA jadi label alternatif kecil DI LUAR jalur utama, bukan urutan item.
// ═══════════════════════════════════════════════
export const ACT2_CASE = {
  identityId: 'deploy-bot',
  identityLabel: 'deploy-bot',
  proofLabel: 'public-key proof',
  altMethods: ['Password', 'SSH Key', 'Certificate', 'MFA'],
  verifierLabel: 'verifier',
  verifiedBadge: 'verified user',
  policyLabel: 'deploy policy',
  scopeToken: 'release only',
  outcomes: [
    { id: 'shell', label: 'Full Shell', selected: false },
    { id: 'sftp-only', label: 'SFTP-only', selected: false },
    { id: 'restricted', label: 'Restricted Task', selected: true },
  ],
  receiptLabel: 'task receipt',
  copy: {
    identity: 'Identitas deploy-bot melewati kanal terenkripsi',
    authenticate: 'Proof token diverifikasi — signature cocok',
    authorize: 'Policy server membaca scope, memilih hak akses',
    apply: 'Restricted task menyala, shell penuh tetap redup',
    after: 'Login dan hak akses berbeda.',
  },
}

// ═══════════════════════════════════════════════
// ACT 3 — Satu Kanal Membawa Shell, Command, dan File
// EKSEKUSI-02: diganti dari chip-row (CHANNEL_MODES/FILE_TRANSFER_MECHANISMS)
// menjadi SATU kasus berurutan "Inspect lalu Kirim Artefak" — shell →
// remote task → file transfer, tiap payload lewat channel yang SAMA dengan
// bentuk capsule berbeda. SCP/SFTP/rsync/SSHFS jadi label kecil di file tray.
// ═══════════════════════════════════════════════
export const ACT3_CASE = {
  shell: {
    command: 'uptime',
    prompt: 'user@server-jauh:~$ uptime',
    outputBadge: 'server',
    output: 'health OK — up 14 hari',
    copy: 'Command capsule pergi, output kembali berlabel server',
  },
  task: {
    command: 'check-service',
    statusToken: 'status: ok',
    copy: 'Task capsule membawa status, bukan sesi interaktif',
  },
  file: {
    fileName: 'release.tar',
    mechanisms: ['SCP', 'SFTP', 'rsync', 'SSHFS'],
    copy: 'File capsule mendarat di file tray remote',
  },
  after: 'Kanal sama dapat membawa data berbeda.',
}

// ═══════════════════════════════════════════════
// ACT 4 — Jangkau Layanan Privat dengan Jalur yang Jelas
// EKSEKUSI-02: diganti dari 4-card FORWARDING_MODES + BASTION_BEAT (chain
// statis) menjadi SATU kasus "Aplikasi Lokal Menuju Database Privat" (local
// listener → tunnel → private DB → result) yang dilanjutkan singkat oleh
// bastion (packet yang SAMA lewat client → bastion → target).
// ═══════════════════════════════════════════════
export const ACT4_CASE = {
  localApp: { label: 'Local App' },
  listenerLabel: 'localhost',
  dbNode: { label: 'Private DB' },
  copy: {
    before: 'Local app hanya melihat listener di localhost',
    listener: 'Local-only listener lahir di client',
    travel: 'Query capsule masuk tunnel menuju database privat',
    apply: 'Database mengirim result capsule kembali',
    after: 'Listener dan tujuan menentukan arah.',
  },
  bastion: {
    label: 'Bastion / Jump Host',
    targetLabel: 'Private Target',
    copy: 'Packet yang sama melewati bastion menuju target privat',
    note: 'Verifikasi host akhir tidak boleh dilemahkan',
  },
}

// ═══════════════════════════════════════════════
// ACT 5 — Akses Aman Memerlukan Siklus Hidup dan Bukti
// EKSEKUSI-02: diganti dari 4-card dashboard statis (OPS_CARDS) menjadi
// SATU kasus "Key Dicabut Saat Akses Tidak Lagi Diperlukan" — key aktif →
// lifecycle event → percobaan koneksi baru → policy gate menolak → audit
// timeline mencatat allow lama dan deny baru + alert dot.
// ═══════════════════════════════════════════════
export const ACT5_CASE = {
  keyId: 'deploy-key',
  statusActive: 'active',
  statusRevoked: 'revoked',
  events: [
    { id: 'allow', label: 'allow — deploy-key', kind: 'allow' },
    { id: 'deny', label: 'deny — deploy-key', kind: 'deny' },
  ],
  copy: {
    valid: 'Key aktif dipakai, koneksi tercatat di audit timeline',
    lifecycle: 'Owner/expiry mencabut key — bukan hilang mendadak',
    nextAttempt: 'Koneksi baru membawa identitas yang sama',
    deny: 'Verifier menemukan status revoked, policy gate menutup',
    after: 'Akses perlu dapat dicabut dan diaudit.',
  },
}

export const CLOSING_CAPTION = 'Enkripsi penting, verifikasi dan policy juga'

// ═══════════════════════════════════════════════
// SFX MAP — nama dipakai ulang dari daftar yang sudah diaudit di
// 17-rest-api (public/audio/*), tidak ada sourcing baru.
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
}
