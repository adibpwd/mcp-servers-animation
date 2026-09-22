// src/content/92-web-server/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-02 (revisi 01, lihat revisi/2026-09-18-1213-revisi-01.md):
// listener bernama Nginx/Apache dengan ring HTTP/HTTPS, static file
// bertile nyata (about.html/style.css), app upstream bertile Node.js,
// storyboard 4 Act baru: siapa menerima → halaman statis → data
// dinamis → response selalu kembali lewat web server. Batas Aman: tidak
// ada config block, command instalasi, port scan, domain/IP nyata.
// Scene shell: scene-ui V1 (portrait 820x1340).
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  BROWSER: '#38BDF8',   // Sky — browser/request, identitas "WEB"
  LISTENER: '#34D399',  // Emerald — listener Nginx/Apache, identitas "SERVER"
  STATIC: '#FBBF24',    // Amber — file statis (disk)
  APP: '#A78BFA',       // Violet — app upstream (Node.js/Python/dst)
  RESPONSE: '#34D399',  // Emerald — response capsule
  LOG: '#22D3EE',       // Cyan — log line pembukti

  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  RISK: '#F87171',
}

export const PHASES = [
  { id: 'siapa-menerima', badge: 'ACT 1 — SIAPA YANG MENERIMA?', badgeColor: COLORS.LISTENER, duration: 9 },
  { id: 'halaman-statis', badge: 'ACT 2 — HALAMAN STATIS', badgeColor: COLORS.STATIC, duration: 10 },
  { id: 'data-dinamis', badge: 'ACT 3 — DATA DINAMIS', badgeColor: COLORS.APP, duration: 10 },
  { id: 'response-kembali', badge: 'ACT 4 — RESPONSE KEMBALI LEWAT WEB SERVER', badgeColor: COLORS.RESPONSE, duration: 10 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'WEB'
export const INTRO_TITLE_B = ' SERVER'
export const INTRO_SUBTITLE = 'Penerima request pertama'

// ── Anchor persisten — 1 card listener (Nginx/Apache) yang settle di
// akhir Act 1 dan TIDAK PERNAH dihapus sampai penutup Act 4. ──
export const LISTENER_POS = { x: 366, y: 470 }
export const BROWSER_POS = { x: 366, y: 210 }
export const STATIC_POS = { x: 206, y: 700 }
export const APP_POS = { x: 526, y: 700 }

// ── Contoh listener — tampil setara, bukan perbandingan performa
// (Batas Aman revisi). ──
export const LISTENER_EXAMPLES = 'Nginx · Apache'

export const COPY = {
  BROWSER_HAS_URL: 'Browser membuka URL, web server masih redup.',
  LISTENER_RECEIVES: 'Web server (Nginx/Apache) menerima di ring HTTP/HTTPS.',
  PATH_DECIDES: 'Path menentukan jenis resource yang dipilih.',
  FILE_ALREADY_EXISTS: 'File sudah ada di disk sebelum request datang.',
  APP_BUILDS_RESPONSE: 'App membuat response, bukan mengambil file.',
  RESPONSE_VIA_SERVER: 'Response selalu kembali lewat web server.',
}

// ── Act 1 — Siapa yang menerima?: browser → request → ring listener. ──
export const ACT1_BEATS = {
  hook: { caption: COPY.BROWSER_HAS_URL },
  travel: { caption: 'Request bergerak ke ring HTTP/HTTPS.' },
  reveal: { caption: COPY.LISTENER_RECEIVES },
}

// ── Act 2 — Halaman statis: path /about, tile sudah ada, app tetap idle. ──
export const STATIC_FILES = [
  { id: 'about', label: 'about.html', y: -22 },
  { id: 'style', label: 'style.css', y: 0 },
  { id: 'logo', label: 'logo.png', y: 22 },
]
export const STATIC_PATH = '/about'

export const ACT2_BEATS = {
  intro: { caption: `Path ${STATIC_PATH} dipilih — file sudah ada di disk.` },
  reading: { caption: COPY.FILE_ALREADY_EXISTS },
  closing: { caption: 'File tile disalin menjadi response, app upstream tetap idle.' },
}

// ── Act 3 — Data dinamis: path /api/profile, app idle sampai packet tiba. ──
export const APP_RUNTIME_LABEL = 'Node.js'
export const APP_RUNTIME_ALT = '(atau Python, PHP-FPM, Java)'
export const DYNAMIC_PATH = '/api/profile'

export const ACT3_BEATS = {
  intro: { caption: `Path ${DYNAMIC_PATH} dipilih — app upstream masih idle.` },
  forwarding: { caption: 'Request diteruskan ke app, file statis tidak berubah.' },
  building: { caption: COPY.APP_BUILDS_RESPONSE },
  closing: { caption: 'App menghasilkan JSON, bukan mengambil file tile.' },
}

// ── Act 4 — Response selalu kembali lewat web server: JSON app →
// listener → browser; dua jalur dibandingkan singkat lewat log. ──
export const ACT4_BEATS = {
  intro: { caption: 'JSON berada di app upstream, browser masih menunggu.' },
  leaving: { caption: 'Response kembali lewat web server, bukan langsung dari app.' },
  rendered: { caption: 'Browser menampilkan data dari path yang diminta.' },
  closing: { caption: COPY.RESPONSE_VIA_SERVER },
}

export const CLOSING_LINE = 'Static dibaca langsung, dinamis lewat app — keduanya kembali lewat web server.'

// ── SFX_MAP — nama file diverifikasi ada di public/audio/ (audit
// sebelum dipakai, sama seperti 81-network-interface/data.js). ──
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh-2' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  SHIMMER: { category: 'success', name: 'shimmer' },
  COMPLETE: { category: 'success', name: 'complete' },
}
