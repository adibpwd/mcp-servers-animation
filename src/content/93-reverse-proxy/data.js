// 93-reverse-proxy/data.js
// Sumber tunggal: canvas, palet, teks, koordinat body-local, durasi Act, dan SFX_MAP.
// Semua koordinat zona = local coordinate ContentBodyV1 (body 732x965, y >= 0).

export const VW = 820
export const VH = 1340

// Palet (tetap dipakai lintas seri; hanya key yang terpakai topic ini).
export const COLORS = {
  DEEP: '#070913',
  MID: '#0B1120',
  LIGHT: '#0F172A',
  BORDER_EMPHASIZED: '#475569',
  TEXT_PRIMARY: '#E2E8F0',
  TEXT_SECONDARY: '#CBD5E1',
  MUTED: '#64748B',
  BLUE: '#38BDF8', // client, packet
  PURPLE: '#A78BFA', // rule / istilah teknis
  GREEN: '#34D399', // sukses, backend terpilih, response
  ORANGE: '#FB923C', // backend B
  RED: '#F43F5E', // rule tidak cocok
  CYAN: '#06B6D4', // proxy, jaringan
  YELLOW: '#FBBF24', // scan dot
}

// Durasi = akhir konten aktif + hold 1,3–1,8 detik (03 §1.E). Tidak ada buffer idle.
export const PHASES = [
  { id: 'satu-pintu-publik', badge: 'ACT 1 — SATU PINTU PUBLIK', badgeColor: COLORS.CYAN, duration: 10.0 },
  { id: 'proxy-memilih-tujuan', badge: 'ACT 2 — PROXY MEMILIH TUJUAN', badgeColor: COLORS.PURPLE, duration: 9.0 },
  { id: 'request-diteruskan', badge: 'ACT 3 — REQUEST DITERUSKAN', badgeColor: COLORS.BLUE, duration: 6.0 },
  { id: 'response-kembali', badge: 'ACT 4 — RESPONSE KEMBALI', badgeColor: COLORS.GREEN, duration: 8.1 },
]

// Intro
export const INTRO_CATEGORY = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'REVERSE'
export const INTRO_TITLE_B = ' PROXY'
export const INTRO_SUBTITLE = 'Satu pintu untuk banyak aplikasi'
export const INTRO_HOLD = 1.8
export const INTRO_MORPH = 0.8
export const INTRO_BG_ACT = 1 // Act (1-based) yang tampil sebagai background intro/thumbnail (revisi 01)

// Teks (deklaratif, tanpa kata ganti orang, tanpa emoji)
export const COPY = {
  CLIENT: 'CLIENT',
  CLIENT_IDLE: 'belum ada request',
  CLIENT_LOADING: 'loading...',
  CLIENT_DONE: 'response diterima',
  ENDPOINT: 'example.com:443',
  PROXY_TITLE: 'REVERSE PROXY',
  PROXY_SUB: 'nginx / apache',
  RULE_A: '/api → A',
  RULE_B: '/blog → B',
  BACKEND_A: 'BACKEND A',
  BACKEND_B: 'BACKEND B',
  BACKEND_A_SUB: 'internal :8080',
  BACKEND_B_SUB: 'internal :8081',
  BACKEND_A_PROC: 'menangani request',
  PACKET: 'GET /api',
  RESPONSE: '200 OK',
  TAKEAWAY: 'Satu pintu publik, banyak backend',
  NOTE_CLIENT_HOOK: ['Client hanya kenal satu pintu'],
  NOTE_CLIENT_DONE: ['Client menerima hasil'],
  NOTE_ENDPOINT: ['Alamat publik menuju proxy'],
  NOTE_GATE_1: ['Proxy jadi titik', 'masuk tunggal'],
  NOTE_GATE_2: ['Proxy membaca path', 'dan host request'],
  NOTE_GATE_3: ['Path /api cocok', 'dengan aturan A'],
  NOTE_GATE_4: ['Proxy meneruskan', 'request ke A'],
  NOTE_GATE_5: ['Response lewat proxy', 'kembali ke client'],
  NOTE_BE_A_1: ['Backend A dipilih'],
  NOTE_BE_A_2: ['Backend A menangani', 'request'],
  NOTE_BE_A_3: ['Backend A membuat', 'response'],
  NOTE_BE_B: ['Backend B', 'tidak dipilih'],
}

// Zona body-local (pusat elemen). CX = (732 / 2).
const CX = 366
export const ZONES = {
  CX,
  CLIENT: { x: CX, y: 70, w: 200, h: 80 },
  ENDPOINT: { x: CX, y: 215, w: 240, h: 40 },
  GATE: { x: CX, y: 380, w: 380, h: 160 }, // y 300–460
  GATE_ENTRY: { x: CX, y: 288 }, // packet/response diserap/lahir di tepi atas gate
  SCAN_SPAWN: { x: CX, y: 306 },
  SCAN_Y: 386, // scan dot bergerak di atas baris chip (chip top 397)
  RULE_A: { x: 276, y: 415, w: 150, h: 36 },
  RULE_B: { x: 456, y: 415, w: 150, h: 36 },
  EXIT_A: { x: 276, y: 462 }, // tepi bawah gate di bawah chip A
  BACKEND_A: { x: 200, y: 720, w: 190, h: 76 },
  BACKEND_B: { x: 532, y: 720, w: 190, h: 76 },
  BACKEND_ENTRY_Y: 684, // tepi atas kartu backend (y 682) + 2: packet/response masuk/keluar dari belakang kartu
  LINE_A: { x1: 276, y1: 460, x2: 200, y2: 682 },
  LINE_B: { x1: 456, y1: 460, x2: 532, y2: 682 },
  PACKET_START: { x: CX, y: 126 },
  PACKET_ABOVE_ENDPOINT: { x: CX, y: 172 },
  RESPONSE_END: { x: CX, y: 116 },
  NOTE_CLIENT: { x: 490, y: 74 },
  NOTE_ENDPOINT: { x: 502, y: 219 },
  NOTE_GATE: { x: 572, y: 330 },
  NOTE_BE_A: { x: 200, y: 790 },
  NOTE_BE_B: { x: 532, y: 790 },
  TAKEAWAY: { x: CX, y: 870, w: 520, h: 48 },
}

// SFX_MAP — semua path diverifikasi ada di public/audio.
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  CLICK: { category: 'ui', name: 'bubble-pop' }, // sfx/click terlalu pelan (-37 dB); bubble-pop -18 dB
  CONNECT: { category: 'impacts', name: 'connector-snap' },
  PACKET_SEND: { category: 'transitions', name: 'swoosh' },
  BEAM: { category: 'transitions', name: 'light-swoosh-quick' },
  TICK: { category: 'ui', name: 'tick' },
  MATCH: { category: 'ui', name: 'plink' },
  SUCCESS: { category: 'success', name: 'confirm' },
  TAKEAWAY: { category: 'ui', name: 'chime' },
}

// State awal: dipakai timeline untuk reset loop (t=0) dan acts/ sebagai dasar mode summary.
export const INITIAL_VIS = {
  client: 0, clientDone: 0, endpoint: 0, endpointPulse: 0, gate: 0, gatePulse: 0,
  ruleA: 0, ruleB: 0, ruleAMatch: 0, ruleBMiss: 0,
  lines: 0, lineALit: 0, beA: 0, beB: 0, beAActive: 0, beAProc: 0,
  nClient: 0, nEndpoint: 0, nGate: 0, nBeA: 0, nBeB: 0, takeaway: 0,
}

export const INITIAL_ACTORS = {
  pk1: { x: ZONES.PACKET_START.x, y: ZONES.PACKET_START.y, s: 0 },
  pk2: { x: ZONES.EXIT_A.x, y: ZONES.EXIT_A.y, s: 0 },
  dot: { x: ZONES.SCAN_SPAWN.x, y: ZONES.SCAN_SPAWN.y, s: 0 },
  rs1: { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_ENTRY_Y, s: 0 },
  rs2: { x: ZONES.GATE_ENTRY.x, y: ZONES.GATE_ENTRY.y, s: 0 },
}

export const INITIAL_TXT = {
  client: COPY.NOTE_CLIENT_HOOK,
  gate: COPY.NOTE_GATE_1,
  beA: COPY.NOTE_BE_A_1,
}
