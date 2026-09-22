// src/content/91-linux-server/data.js
// ─────────────────────────────────────────────────────────────
// REVISI-01 (2026-09-19, lihat revisi/2026-09-19-revisi-01-flow-kausal-icon-chatgpt.md)
// — DISETUJUI & DIEKSEKUSI. Mengganti storyboard daftar-konsep (ChipRow)
// dengan satu kasus berjalan: toko online `toko.example` (toko-web) yang
// hidup di server, dibuka pelanggan, bisa mati, menyimpan data, dipantau,
// diperbarui, dan dipulihkan. Total 7 Act, 122s (lihat PHASES).
//
// Icon: hibrid — 28 PNG (icons/icons.json, BELUM digenerate — lihat
// icons/loader.js) untuk objek dikenali, inline SVG untuk elemen dengan
// gerak/state internal atau teks dinamis (lihat inline_svg_only di
// icons.json). getIcon(id) return null sampai PNG fisik ada; Animation.jsx
// WAJIB fallback ke bentuk SVG sederhana saat itu terjadi (tidak pernah
// crash tanpa PNG).
//
// Koordinat lokal ContentBodyV1 (0,0 = body.x/body.y, lebar 732 tinggi
// 965). Pusat horizontal x=366 (BUKAN 410 seperti versi lama — lihat
// revisi §2.4.d). Lihat STATIONS di bawah untuk peta posisi lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#0B1220',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',
  DNS: '#22D3EE',
  EDGE: '#FB923C',
  SERVICE: '#FBBF24',
  IDENTITY: '#A78BFA',
  DATA: '#34D399',
  OBSERVE: '#F472B6',
  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  RISK: '#F87171',
}

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
// Identitas seri (branding channel), bukan domain kasus — kasus tetap toko.example.
// Format sama dengan topic 34/60: segmen domain berwarna = warna Title A.
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'SERVER'
export const INTRO_TITLE_B = ' ROLE'
export const INTRO_SUBTITLE = 'Sistem yang menyediakan layanan'

// ── BREADCRUMB_STEPS — rantai akses Act 2 (revisi-02 §4.3). Enam langkah
// ber-icon; icon = ringkasan objek yang sama di scene (bukan objek baru).
// iconId disinkronkan dengan icons/icons.json; glyph = SVG inline (D2)
// untuk langkah yang belum punya PNG (nama, IP). ──
export const BREADCRUMB_STEPS = [
  { id: 'nama', label: 'nama', glyph: 'address', color: COLORS.CLIENT },
  { id: 'dns', label: 'DNS', iconId: 'dns-book', color: COLORS.DNS },
  { id: 'ip', label: 'IP', glyph: 'plate', color: COLORS.DNS },
  { id: 'rute', label: 'rute', iconId: 'internet-cloud', color: COLORS.MUTED },
  { id: 'port', label: '443', iconId: 'listening-socket', color: COLORS.SERVICE },
  { id: 'service', label: 'service', iconId: 'web-app-card', color: COLORS.SUCCESS },
]

// ── PHASES — durasi diukur ulang dari estimasi storyboard revisi §3.6.
// WAJIB diukur ulang lagi dari timeline nyata setelah preview manual. ──
export const PHASES = [
  { id: 'server-adalah-peran', badge: 'ACT 1 — SERVER ADALAH PERAN', badgeColor: COLORS.CLIENT, duration: 14 },
  { id: 'permintaan-masuk', badge: 'ACT 2 — PERMINTAAN MASUK', badgeColor: COLORS.DNS, duration: 24 },
  { id: 'service-bekerja', badge: 'ACT 3 — SERVICE BEKERJA', badgeColor: COLORS.SERVICE, duration: 18 },
  { id: 'data-dan-identity', badge: 'ACT 4 — DATA DAN IDENTITY', badgeColor: COLORS.IDENTITY, duration: 18 },
  { id: 'bukti-kesehatan', badge: 'ACT 5 — BUKTI KESEHATAN', badgeColor: COLORS.OBSERVE, duration: 16 },
  { id: 'perubahan-dan-pemulihan', badge: 'ACT 6 — PERUBAHAN & PEMULIHAN', badgeColor: COLORS.EDGE, duration: 20 },
  { id: 'server-posture', badge: 'ACT 7 — SERVER POSTURE', badgeColor: COLORS.DATA, duration: 12 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ── Case Strip — satu-satunya channel kalimat "kasus" per Act (revisi §3.2). ──
export const CASE_STRIP = {
  act1: 'Kasus: aplikasi toko butuh tempat berjalan.',
  act2: 'Kasus: pelanggan membuka toko.example.',
  act3: 'Kasus: aplikasi toko mati mendadak.',
  act4: 'Kasus: aplikasi toko membaca data pesanan.',
  act5: 'Kasus: pesanan melambat, penyebab belum jelas.',
  act6: 'Kasus: rilis versi baru bermasalah.',
  act7: 'Kasus: server toko diaudit sebelum ramai.',
}

// ── STATIONS — peta posisi tetap lintas Act, local coordinate
// ContentBodyV1 (revisi §4.2-4.3). Pusat horizontal x=366. ──
export const BODY_CENTER_X = 366

export const CLIENT_STATION = { x: 110, y: 120 }
export const SERVER_ANCHOR = { x: 366, y: 640 } // persistent, Act 1 settle → Act 7
export const APP_TILE_DOCKED = { x: 440, y: 640 }
export const APP_TILE_SOURCE = { x: 366, y: 90 }

export const DNS_STATION = { x: 600, y: 120 }
export const CLOUD_STATION = { x: 366, y: 300 }
export const ROUTER_HOP_STATIONS = [{ x: 300, y: 380 }, { x: 366, y: 420 }]
export const FIREWALL_STATION = { x: 366, y: 470 }
export const RULES_CARD_STATION = { x: 590, y: 470 }
export const LISTEN_SOCKET_STATION = { x: 366, y: 590 }

export const SERVICE_MANAGER_STATION = { x: 366, y: 470 } // tidak aktif bersamaan dgn firewall
export const PROCESS_SHELF = { db: { x: 170, y: 330 }, app: { x: 366, y: 330 } }

export const IDENTITY_COLUMN = [
  { x: 110, y: 280 }, { x: 110, y: 400 }, { x: 110, y: 520 },
]
export const ACCESS_GATE_STATION = { x: 450, y: 400 }
export const DATA_VAULT_ACT4 = { x: 590, y: 420 }
export const DATA_VAULT_ACT6 = { x: 600, y: 720 }
export const PERMISSION_CARD_STATION = { x: 590, y: 550 }

export const MONITOR_DASHBOARD_STATION = { x: 366, y: 290 }
export const LOG_SCROLL_STATION = { x: 120, y: 470 }
export const HEALTH_PROBE_STATION = { x: 600, y: 470 }
export const ALERT_BELL_STATION = { x: 620, y: 300 }

export const STAGING_PAD_STATION = { x: 140, y: 330 }
export const RELEASE_STACK_STATION = { x: 140, y: 430 }
export const BACKUP_VAULT_STATION = { x: 130, y: 720 }
export const RESTORE_AREA_STATION = { x: 366, y: 420 } // lalu jadi RUNBOOK_STATION
export const RUNBOOK_STATION = { x: 366, y: 420 }

export const PILLAR_STATIONS = [
  { x: 130, y: 500 }, { x: 602, y: 500 }, { x: 130, y: 740 }, { x: 602, y: 740 },
]

export const FOUR_MACHINES_Y = 330
export const FOUR_MACHINES_X = [105, 279, 453, 627]

// ── Act 1 — 4 bentuk compute, disinkronkan dengan iconId icons.json. ──
export const COMPUTE_FORMS = [
  { id: 'laptop', iconId: 'laptop-machine', label: 'Laptop', caption: 'Laptop pun bisa jadi server.' },
  { id: 'vm', iconId: 'vm-partition', label: 'Virtual machine', caption: 'Satu mesin, banyak server.' },
  { id: 'cloud', iconId: 'cloud-instance', label: 'Cloud instance', caption: 'Mesin sewaan di cloud.' },
  { id: 'minipc', iconId: 'mini-pc', label: 'Mini-PC / edge', caption: 'Server kecil di jaringan lokal.' },
]

// ── Kasus toko.example — jangkar cerita seluruh 7 Act (revisi §3.1). ──
export const CASE_INFO = {
  appName: 'toko-web',
  domain: 'toko.example',
  ip: '203.0.113.10', // TEST-NET-3, dokumentasi — bukan IP nyata
  path: 'GET /',
}

// ── SFX_MAP — dibersihkan (revisi §10.2): TELEPORT dihapus (tidak
// dipakai, bertentangan dengan aturan tanpa lompat). Semua entri di
// bawah dipanggil di Animation.jsx, diverifikasi ada di public/audio/. ──
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh-2' },

  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  KEY_TURN: { category: 'impacts', name: 'key-turn' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  COMPLETE: { category: 'success', name: 'complete' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  SOFT_DENY: { category: 'warnings', name: 'soft-deny' },
}

// ── BEATS — menggantikan ACTx_BEATS + COPY lama (revisi §10.1). Semua
// caption: pernyataan, ≤5 kata (kecuali breadcrumb/callback ringkasan),
// tanpa emoji, tanpa kata ganti orang. Menempel di objek (IconCaption/
// PathLabel), BUKAN CaptionBar global. ──
export const BEATS = {
  act1: {
    appSource: 'Satu aplikasi web.',
    perMachine: [
      'Laptop pun bisa jadi server.',
      'Satu mesin, banyak server.',
      'Mesin sewaan di cloud.',
      'Server kecil di jaringan lokal.',
    ],
    clientSends: 'Client mengirim permintaan.',
    allAnswer: 'Semua mesin menjawab sama.',
    convergeDone: 'Server adalah peran, bukan bentuk.',
    cliffhanger: 'Permintaan belum tahu jalurnya.',
  },
  act2: {
    addressUnknown: 'Client hanya tahu nama.',
    dnsAsked: 'DNS ditanya alamat nama.',
    ipKnown: 'Nama berubah jadi IP.',
    route: 'Rute jaringan menuju IP.',
    portMatch: 'Port 443 cocok kebijakan.',
    portClosed: 'Port lain tetap tertutup.',
    handshake: 'Koneksi dibentuk tiga langkah.',
    connected: 'Server menerima koneksi.',
    breadcrumb: 'Akses adalah rantai, bukan alamat.',
    cliffhanger: 'Di balik pintu, proses menunggu.',
  },
  act3: {
    managerIntro: 'Service manager menjaga proses.',
    dependencyFirst: 'Dependency dijalankan lebih dulu.',
    doorOpen: 'Proses membuka pintu 443.',
    resourceBound: 'Resource dibatasi dan diawasi.',
    pageServed: 'Halaman tampil di client.',
    crashed: 'Proses mati, permintaan gagal.',
    restarted: 'Proses dihidupkan ulang otomatis.',
    recovered: 'Layanan kembali melayani.',
    lifecycle: 'Layanan butuh lifecycle.',
  },

  act4: {
    caseIntro: 'Data pesanan tersimpan di server.',
    gateGrows: 'Gate memeriksa identitas peminta.',
    identityLabels: ['Akun layanan', 'Admin', 'Tidak dikenal'],
    permissionsDiffer: 'Izin tiap identitas berbeda.',
    granted: 'Akun layanan boleh baca-tulis.',
    partial: 'Admin hanya boleh membaca.',
    denied: 'Identitas asing ditolak.',
    minimum: 'Akses diberi seperlunya saja.',
  },
  act5: {
    logged: 'Tiap kejadian dicatat sebagai log.',
    notEnough: 'Status hijau saja belum cukup.',
    metrics: 'Metrics mengukur angka dari waktu.',
    healthCheck: 'Health check menguji layanan berkala.',
    degrade: 'Latensi naik, error bertambah.',
    failing: 'Health check mulai gagal.',
    alerted: 'Alert memberi tahu pemilik layanan.',
    unified: 'Logs, metrics, dan alert menyatu.',
  },
  act6: {
    staged: 'Versi baru diuji di staging.',
    passed: 'Lolos uji staging.',
    deployed: 'Versi baru berjalan di production.',
    failed: 'Health check gagal setelah rilis.',
    rollback: 'Rollback kembali ke versi stabil.',
    backedUp: 'Backup disalin ke lokasi terpisah.',
    unverified: 'Salinan ada, pemulihan belum terbukti.',
    restoreTest: 'Restore diuji di area terpisah.',
    proven: 'Uji restore membuktikan pemulihan.',
    documented: 'Langkah pemulihan dicatat di runbook.',
  },
  act7: {
    balanced: 'Empat sisi harus seimbang.',
    callback: 'Laptop atau cloud, server dioperasikan.',
  },
}

// ── Act 7 — Server posture. Tiap pilar bawa 2 sub-label icon bukti
// dari Act sebelumnya (bukan kotak kosong — revisi §6.7). ──
export const POSTURE_PILLARS = [
  { id: 'security', label: 'Security', color: COLORS.RISK, evidence: ['firewall', 'least privilege'], icons: ['firewall-wall', 'service-account'] },
  { id: 'reliability', label: 'Reliability', color: COLORS.SUCCESS, evidence: ['lifecycle', 'rollback'], icons: ['service-manager', 'release-package'] },
  { id: 'capacity', label: 'Cost/Capacity', color: COLORS.WARNING, evidence: ['resource', 'metrics'], icons: ['cpu-chip', 'monitor-dashboard'] },
  { id: 'documentation', label: 'Documentation', color: COLORS.IDENTITY, evidence: ['runbook', 'alert owner'], icons: ['runbook-doc', 'alert-bell'] },
]
