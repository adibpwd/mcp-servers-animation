// src/content/17-rest-api/data.js
// ─────────────────────────────────────────────────────────────
// REVISI 06: empat Act tanpa jeda kosong. GET tuntas di Act 1-2.
// CRUD (POST/PUT/PATCH/DELETE) dikirim LANGSUNG dari aksi UI browser
// di Act 3-4. API Service Hub terlihat redup sejak Act 1.
// REVISI 07: 3 user (Adib/Jokowo/Prabowo), tema NETWORKING.
// REVISI 08 (lihat revisi/2026-09-12-revisi-08.md): PERBAIKAN BUG —
// (1) Jokowo/Prabowo TIDAK BOLEH tampil sebelum di-POST — presence di
//     cabinet baru true setelah POST sukses, dan kartu profil di
//     browser baru muncul setelah GET_JOKOWO/GET_PRABOWO terpisah
//     (server tidak otomatis "mengirim balik" isi data hasil POST —
//     harus di-fetch ulang, sesuai semantik REST asli).
// (2) Warna judul intro "REST API" belum pernah dipakaikan tema
//     NETWORKING_MINT/NETWORKING_SKY (masih hardcode CLIENT/SERVICE).
// (3) browserLoading di-set tapi tidak pernah dibaca render — profil
//     Adib tampil penuh sebelum GET selesai. Act 3 dipecah jadi
//     create (POST) + fetch (GET) berpasangan per user, Act 4 tetap
//     mutate+delete. Durasi total naik dari 39s → ~45s karena 2 GET
//     tambahan (semantik lebih benar > durasi pas 39s).
// Icon tetap inline SVG (bukan PNG ChatGPT-pipeline).
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',       // Sky — browser, request, client
  PROFILE_NEW: '#A78BFA',  // Violet — rambut ungu / profil versi baru (PUT)
  SERVICE: '#FBBF24',      // Amber — API Service, processor, highlight aksi
  SUCCESS: '#34D399',      // Green — sukses & status response

  // REVISI-07: Networking theme colors
  NETWORKING_MINT: '#2CD1A8',  // Mint green untuk kategori NETWORKING intro
  NETWORKING_SKY: '#38BDF8',   // Sky blue untuk "API"

  // alias supaya kode lama yang masih mereferensikan nama zona lama
  // (network/request/response) tidak perlu diganti semua sekaligus
  NETWORK: '#FBBF24',
  REQUEST: '#FBBF24',
  RESPONSE: '#34D399',
}

// REVISI-08: Budget durasi diukur ULANG dari timeline nyata setelah
// eksekusi (bukan tebakan) — 4 sendRequest penuh (POST_JOKOWO,
// GET_JOKOWO, POST_PRABOWO, GET_PRABOWO) + PUT di Act 3 ternyata makan
// ~26.5s, bukan 18s seperti estimasi awal sebelum timeline ditulis.
// Total: 3.5+8.5+26.5+15=53.5s. Angka ini cuma dokumentasi/badge info,
// TIDAK dipakai sebagai hard cutoff oleh export pipeline (vite-plugin-
// export.js mengukur wall-time proses export, bukan baca TOTAL_DURATION).
export const PHASES = [
  {
    id: 'get-depart',
    badge: 'ACT 1 — ADIB KIRIM GET',
    badgeColor: COLORS.CLIENT,
    duration: 3.5,
  },
  {
    id: 'get-complete',
    badge: 'ACT 2 — API MENGEMBALIKAN PROFIL ADIB',
    badgeColor: COLORS.SERVICE,
    duration: 8.5,
  },
  {
    id: 'create-fetch',
    badge: 'ACT 3 — BROWSER MEMBUAT & MENGAMBIL DATA BARU',
    badgeColor: COLORS.PROFILE_NEW,
    duration: 26.5,
  },
  {
    id: 'update-delete',
    badge: 'ACT 4 — BROWSER MENGGANTI, MENGUBAH & MENGHAPUS',
    badgeColor: COLORS.SUCCESS,
    duration: 15.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// REVISI-07: Ubah kategori ke NETWORKING (mint green #2CD1A8)
// REVISI-08 Bug F: dipecah jadi 2 konstanta supaya domain "ADIB-DEV.COM"
// bisa diwarnai beda dari label kategori "NETWORKING" di render.
// INTRO_CATEGORY lama tetap ada (gabungan keduanya) untuk backward-compat.
export const INTRO_CATEGORY_LABEL = 'NETWORKING'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_CATEGORY = `${INTRO_CATEGORY_LABEL} · ${INTRO_DOMAIN}`
export const INTRO_TITLE = 'REST API'
export const INTRO_SUBTITLE = 'Browser → API Service → Profil'

// ── Layout — 1 jalur vertikal x=410. ApiServiceHub SATU box gabungan
// (gate → processor → cabinet), terlihat redup sejak Act 1 (revisi-06
// §3.1), bukan pop-in terlambat di Act 3 seperti revisi-05. ──
export const AXIS_X = 410
// REVISI-08 Bug F: CLIENT_Y dinaikkan dari 210 → 325 supaya browser
// panel (dan dot traffic-light-nya) tidak lagi nabrak header intro
// (subtitle header ada di y≈130-150). Semua turunan CLIENT_Y di bawah
// (CARD_JOKOWO_Y, CARD_PRABOWO_Y, FLOW_WAYPOINTS.P0_CLIENT) otomatis
// ikut turun karena sudah dihitung relatif, bukan angka absolut.
export const CLIENT_Y = 325
export const SERVICE_Y = 780

// REVISI-08: Posisi mini-card Jokowo/Prabowo — TERPISAH dari panel
// utama Adib, muncul di bawahnya. Ini "window/card berbeda" yang
// dimaksud: bukan baris teks di dalam panel Adib, tapi kartu sendiri
// yang pop-in hanya setelah GET_JOKOWO / GET_PRABOWO selesai.
export const CARD_JOKOWO_Y = CLIENT_Y + 175
export const CARD_PRABOWO_Y = CLIENT_Y + 250

// ── FlowchartSpine — waypoint dipadatkan mengikuti hub tunggal.
// P3 (gate) & P4 (processor) cuma beda ~40-70px di dalam hub yang sama. ──
export const FLOW_WAYPOINTS = {
  P0_CLIENT: CLIENT_Y + 90,          // titik lahir tiket, di bawah browser
  P1_REQUEST_EXIT: SERVICE_Y - 260,
  P2_NETWORK_MID: SERVICE_Y - 140,
  P3_GATE: SERVICE_Y - 60,           // endpoint gate, bagian atas hub
  P4_PROCESSOR: SERVICE_Y,           // processor, tengah hub
  P5_CABINET: SERVICE_Y + 70,        // lemari kartu, bagian bawah hub
}

// Batas hold umum §3.3 revisi-06 (detik) — dipakai sebagai referensi
// saat menulis timeline, bukan dibaca langsung oleh Animation.jsx.
export const HOLD_LIMITS = {
  beforeDepart: 0.25,
  gateToProcessor: 0.35,
  responseToNextRequest: 0.40,
  ingress: 0.30,
}

export const CLIENT_LABEL = 'BROWSER'
export const SERVICE_LABEL = 'API SERVICE'
export const RESOURCE_LABEL = 'user cabinet'

// Profil Adib — SATU sumber kebenaran data visual. `hair` berubah lewat
// PUT (Act 3), `role` berubah lewat PATCH (Act 4). Bukan field baru yang
// ditambah dadakan di tengah timeline.
export const ADIB_PROFILE = { name: 'Adib', age: 12, role: 'Student', hair: 'black' }

// REVISI-07: Tiga user untuk demonstrasi operasi lengkap
// REVISI-08 Bug F: nama diperbaiki dari 'Jokowo' (typo) jadi 'Jokowi'.
export const JOKOWO_PROFILE = { name: 'Raditya Dika', age: 24, role: 'Student', hair: 'black' }
export const PRABOWO_PROFILE = { name: 'Deddy Corbuzier', age: 28, role: 'Engineer', hair: 'black' }

export const NINA_NAME = 'Adib'
export const SELECTED_SLOT = 1   // Adib tetap di slot 1
export const JOKOWO_SLOT = 2     // REVISI-07: Jokowo di slot 2
export const PRABOWO_SLOT = 3    // REVISI-07: Prabowo di slot 3
export const SELECTED_ITEM = 'Adib'

// Lemari kartu anggota (REVISI-07: 3 user Adib/Jokowo/Prabowo)
// Slot 0: placeholder generic; Slot 1: Adib (permanent);
// Slot 2: Jokowo (kosong sampai POST — REVISI-08); Slot 3: Prabowo
// (kosong sampai POST — REVISI-08). `filled` di sini HANYA nilai
// awal render pertama; state React (jokowoPresent/prabowoPresent,
// default false) yang menentukan tampilan sesungguhnya sepanjang
// timeline lewat cabinetSlots.map() di Animation.jsx.
export const CABINET_SLOTS = [
  { id: 'slot0', name: 'User 00', filled: true, kind: 'generic' },
  { id: 'slot1', name: ADIB_PROFILE.name, age: ADIB_PROFILE.age, role: ADIB_PROFILE.role, hair: ADIB_PROFILE.hair, filled: true, kind: 'adib' },
  { id: 'slot2', name: JOKOWO_PROFILE.name, age: JOKOWO_PROFILE.age, role: JOKOWO_PROFILE.role, hair: JOKOWO_PROFILE.hair, filled: false, kind: 'jokowo' },
  { id: 'slot3', name: PRABOWO_PROFILE.name, age: PRABOWO_PROFILE.age, role: PRABOWO_PROFILE.role, hair: PRABOWO_PROFILE.hair, filled: false, kind: 'prabowo' },
]

// ═══════════════════════════════════════════════
// REQUESTS — satu konfigurasi per method (REVISI-07: dengan 3 user)
// GET: Adib (Act 1-2)
// POST + GET: Jokowo & Prabowo (Act 3, Beat A) — REVISI-08: tiap POST
// diikuti GET terpisah supaya kartu di browser hanya muncul setelah
// benar-benar di-fetch (action 'fetch-card', BUKAN otomatis nempel
// begitu POST sukses).
// PUT: Adib rambut ungu (Act 3, Beat B)
// PATCH: Jokowo role Student → Professional (Act 4, Beat A)
// DELETE: Prabowo (Act 4, Beat B)
// ═══════════════════════════════════════════════
export const REQUESTS = {
  GET: {
    method: 'GET', path: '/users/adib', status: '200', statusLabel: '200 OK',
    responseLabel: 'Profil Adib', action: 'read', targetSlot: SELECTED_SLOT,
    browserLabel: 'Lihat Profil', caption: 'Adib meminta profil',
  },
  POST_JOKOWO: {
    method: 'POST', path: '/users', status: '201', statusLabel: '201 Created',
    responseLabel: 'Kartu Raditya Dika dibuat', action: 'insert', targetSlot: JOKOWO_SLOT,
    targetName: JOKOWO_PROFILE.name, browserLabel: 'Tambah Raditya Dika', caption: 'Browser membuat kartu Raditya Dika',
  },
  POST_PRABOWO: {
    method: 'POST', path: '/users', status: '201', statusLabel: '201 Created',
    responseLabel: 'Kartu Deddy Corbuzier dibuat', action: 'insert', targetSlot: PRABOWO_SLOT,
    targetName: PRABOWO_PROFILE.name, browserLabel: 'Tambah Deddy Corbuzier', caption: 'Browser membuat kartu Deddy Corbuzier',
  },
  // REVISI-08: GET terpisah setelah POST — server tidak otomatis
  // "mengirim balik" isi resource baru; browser harus fetch ulang
  // supaya kartu profil Jokowo/Prabowo muncul di panel browser.
  GET_JOKOWO: {
    method: 'GET', path: '/users/jokowo', status: '200', statusLabel: '200 OK',
    responseLabel: 'Kartu Raditya Dika diambil', action: 'fetch-card', targetSlot: JOKOWO_SLOT,
    browserLabel: 'Lihat Kartu Raditya Dika', caption: 'Browser mengambil kartu Raditya Dika',
  },
  GET_PRABOWO: {
    method: 'GET', path: '/users/prabowo', status: '200', statusLabel: '200 OK',
    responseLabel: 'Kartu Deddy Corbuzier diambil', action: 'fetch-card', targetSlot: PRABOWO_SLOT,
    browserLabel: 'Lihat Kartu Deddy Corbuzier', caption: 'Browser mengambil kartu Deddy Corbuzier',
  },
  PUT: {
    method: 'PUT', path: '/users/adib', status: '200', statusLabel: '200 Replaced',
    responseLabel: 'Kartu Adib diganti penuh', action: 'replace', targetSlot: SELECTED_SLOT,
    newHair: 'purple', browserLabel: 'Simpan Profil Lengkap', caption: 'Browser mengganti penuh kartu Adib',
  },
  PATCH_JOKOWO: {
    method: 'PATCH', path: '/users/jokowo', status: '200', statusLabel: '200 Updated',
    responseLabel: 'Role Raditya Dika diubah', action: 'patch', targetSlot: JOKOWO_SLOT,
    newRole: 'Professional', browserLabel: 'Ubah Raditya Dika ke Professional', caption: 'Browser mengubah role Raditya Dika',
  },
  DELETE_PRABOWO: {
    method: 'DELETE', path: '/users/prabowo', status: '204', statusLabel: '204 No Content',
    responseLabel: 'Kartu Deddy Corbuzier dihapus', action: 'archive', targetSlot: PRABOWO_SLOT,
    browserLabel: 'Hapus Deddy Corbuzier', caption: 'Browser menghapus kartu Deddy Corbuzier',
  },
}

// ═══════════════════════════════════════════════
// INTRO HEADER — koordinat lerp gaya Tailscale (revisi-06 §6), TANPA
// typing/cursor. Satu grup teks persisten di-morph dari hero centered
// jadi header kiri-atas dalam 0,8 detik power3.inOut.
// ═══════════════════════════════════════════════
export const HEADER_MORPH = {
  tagline: { heroY: 550, headerX: 44, headerY: 50, heroFs: 18, headerFs: 13 },
  title: { heroY: 640, headerX: 44, headerY: 100, heroFs: 72, headerFs: 44 },
  subtitle: { heroY: 716, headerX: 44, headerY: 130, heroFs: 20, headerFs: 15 },
}

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

  SUCCESS: { category: 'sfx', name: 'success' },
  TYPING: { category: 'sfx', name: 'typing' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  CLICK: { category: 'sfx', name: 'click' },
}
