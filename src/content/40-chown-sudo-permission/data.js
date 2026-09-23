// src/content/40-chown-sudo-permission/data.js
// Implementasi PLAN — 40 File Permission Lanjutan: chown, su, sudo & sudoers.
// Lihat _docs/CHOWN_SUDO_PERMISSION_PLAN.md. Empat Act: jebakan Permission
// Denied & bahaya chmod 777 -> chown mengubah kepemilikan -> su vs sudo ->
// buku aturan /etc/sudoers & audit trail.

import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111C31',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#64748B',

  INTRO_A: '#FBBF24', // amber — CHOWN &
  INTRO_B: '#34D399', // emerald — SUDO

  DANGER: '#F43F5E',
  SAFE: '#34D399',
  OWNER: '#FBBF24',
  SU: '#A78BFA',
  SUDO: '#22D3EE',
  POLICY: '#FBBF24',
  AUDIT: '#F472B6',
  WAITING: '#FBBF24',
}

// Local coordinate ContentBodyV1 (732 x 965) — satu STAGE utama dipakai ulang
// tiap Act (hanya satu Act tampil per waktu lewat gating phaseIdx), plus
// caption di atas dan closing map di bawah.
export const ZONE = {
  CAPTION: { yStart: 16, yEnd: 62 },
  STAGE:   { yStart: 78, yEnd: 894 },
  CLOSING: { yStart: 910, yEnd: 958 },
}

export const PHASES = [
  { id: 'denied',  badge: 'ACT 1 — JEBAKAN PERMISSION DENIED', badgeColor: '#F43F5E', duration: 20.0 },
  { id: 'chown',   badge: 'ACT 2 — chown MENGUBAH KEPEMILIKAN', badgeColor: '#FBBF24', duration: 19.0 },
  { id: 'su_sudo', badge: 'ACT 3 — su VS sudo',                 badgeColor: '#22D3EE', duration: 22.0 },
  { id: 'sudoers', badge: 'ACT 4 — SUDOERS & AUDIT TRAIL',      badgeColor: '#F472B6', duration: 24.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'CHOWN & '
export const INTRO_TITLE_B = 'SUDO'
export const INTRO_SUBTITLE = 'Kepemilikan, identitas sementara & sudoers tanpa chmod 777'

// ── Posisi tetap dalam STAGE — dipakai lintas Act (server & file kartu
// muncul ulang di Act 1-2 pada posisi sama, supaya "before vs after" jelas). ──
const STAGE_TOP = ZONE.STAGE.yStart
export const NGINX_POS = { x: 178, y: STAGE_TOP + 78 }
export const FILE_POS = { x: 554, y: STAGE_TOP + 78 }
export const WALL_CENTER = { x: 554, y: STAGE_TOP + 78 }
export const ACCESS_LANES_Y = STAGE_TOP + 230
export const RESULT_BADGE_Y = STAGE_TOP + 340
export const COMMAND_LINE_Y = STAGE_TOP + 410
export const COMPARE_ROW_Y = STAGE_TOP + 490

// Act 3 — dua kolom su vs sudo
export const COL_SU = { x: 190, y: STAGE_TOP + 40 }
export const COL_SUDO = { x: 546, y: STAGE_TOP + 40 }
export const COMPARE_BAR_Y = STAGE_TOP + 470

// Act 4 — sudoers rule, gate, dua percobaan, audit ledger
export const SUDOERS_CARD_Y = STAGE_TOP + 36
export const GATE_CENTER = { x: 366, y: STAGE_TOP + 168 }
export const ATTEMPT_LANE_Y = STAGE_TOP + 252
export const RESULT_LANE_Y = STAGE_TOP + 330
export const LEDGER_TOP_Y = STAGE_TOP + 420

export const CLOSING_CENTER = { x: 366, y: (ZONE.CLOSING.yStart + ZONE.CLOSING.yEnd) / 2 }

// ── Actors & resource — Act 1-2. Nginx mencoba baca config, owner awalnya
// root:root, lalu di-chown ke www-data:www-data (bukan dibuka via 777). ──
export const NGINX_PROCESS = { label: 'nginx', role: 'process: www-data', prompt: '$ systemctl reload nginx' }

export const CONFIG_FILE = {
  label: 'nginx.conf',
  path: '/etc/nginx/nginx.conf',
  mode: '-rw-r-----',
  ownerBefore: 'root:root',
  ownerAfter: 'www-data:www-data',
}

export const CHMOD_777_CMD = '$ chmod 777 nginx.conf   # JANGAN!'
export const CHOWN_CMD = '$ chown www-data:www-data nginx.conf'

export const COMPARE_CHIPS = [
  { id: 'bad', label: 'chmod 777', desc: 'buka SEMUA gembok untuk siapapun', color: '#F43F5E', safe: false },
  { id: 'good', label: 'chown tepat sasaran', desc: 'kunci diberikan ke pemilik yang benar', color: '#34D399', safe: true },
]

// ── Act 3 — su (ganti identitas permanen) vs sudo (izin sementara terukur). ──
export const SU_FLOW = {
  actor: 'Adib',
  cmd: '$ su -',
  promptBefore: 'adib$',
  promptAfter: 'root#',
  note: 'Sesi penuh sebagai root — identitas berubah sampai ketik exit',
}

export const SUDO_FLOW = {
  actor: 'Adib',
  cmd: '$ sudo systemctl restart nginx',
  promptBefore: 'adib$',
  promptDuring: 'adib$ (root sesaat)',
  promptAfter: 'adib$',
  note: 'Satu perintah spesifik, identitas asli tetap adib, tercatat',
}

export const SU_SUDO_COMPARE = 'sudo = izin sekali pakai & tercatat · su = ganti kursi penuh'

// ── Act 4 — /etc/sudoers membatasi command apa saja yang boleh dieskalasi,
// dan setiap percobaan (granted maupun denied) tercatat di audit log. ──
export const SUDOERS_RULE = {
  fileLabel: '/etc/sudoers',
  ruleLine: 'adib  ALL=(ALL)  /usr/bin/systemctl restart nginx',
}

export const SUDO_ATTEMPTS = [
  {
    id: 'granted',
    cmd: 'sudo systemctl restart nginx',
    result: 'granted',
    resultLabel: 'MATCH policy — granted',
    logLabel: 'adib \u00b7 systemctl restart nginx \u00b7 GRANTED',
  },
  {
    id: 'denied',
    cmd: 'sudo rm -rf /var/log',
    result: 'denied',
    resultLabel: 'TIDAK ADA di policy — denied',
    logLabel: 'adib \u00b7 rm -rf /var/log \u00b7 DENIED',
  },
]

// ── Caption per beat — copy layar deklaratif. ──
export const CAPTIONS = {
  DENIED: 'nginx gagal membaca file konfigurasi',
  DENIED_BADGE: 'Permission Denied',
  TEMPTATION: 'Jalan pintas: chmod 777?',
  DANGER_777: 'chmod 777 membuka SEMUA gembok, bukan hanya punya nginx',
  CHOWN_INTRO: 'Solusi aman: pindahkan kepemilikan file',
  CHOWN_APPLIED: 'Owner berubah ke www-data:www-data',
  CHOWN_SUCCESS: 'nginx bisa baca tanpa membuka gembok publik',
  SU_SUDO_INTRO: 'Dua cara jalankan perintah sebagai admin',
  SU_TITLE: 'su — pindah kursi permanen',
  SUDO_TITLE: 'sudo — izin sementara terukur',
  SUDOERS_INTRO: '/etc/sudoers menentukan siapa boleh apa',
  SUDOERS_GRANTED: 'Perintah cocok policy — dieksekusi',
  SUDOERS_DENIED: 'Perintah di luar policy — diblokir',
  AUDIT: 'Granted maupun denied, semua tercatat',
  CLOSING: 'chown atur kepemilikan, sudo beri izin terukur — bukan chmod 777',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  PAPER_ARRIVE: { category: 'ui', name: 'paper-arrive' },
  PAPER_OPEN: { category: 'ui', name: 'paper-open' },
  CONNECTOR_SNAP: { category: 'impacts', name: 'connector-snap' },
  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  KEY_TURN: { category: 'impacts', name: 'key-turn' },
  SWAP: { category: 'impacts', name: 'swap' },
  ERROR: { category: 'sfx', name: 'error' },
  WARNING: { category: 'sfx', name: 'warning' },
  SCAN: { category: 'sfx', name: 'scan' },
  POLICY_SCAN: { category: 'sfx', name: 'policy-scan' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },
  SOFT_DENY: { category: 'warnings', name: 'soft-deny' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  STAMP: { category: 'success', name: 'approval-stamp' },
  GLITCH: { category: 'transitions', name: 'glitch' },
  WHOOSH: { category: 'transitions', name: 'whoosh' },
}
