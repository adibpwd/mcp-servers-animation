// src/content/36-ssh-key/data.js
// ─────────────────────────────────────────────────────────────
// EKSEKUSI-01: eksekusi pertama topic ini mengikuti storyboard 4-Act
// apa adanya dari _docs/SSH_KEY_PLAN.md (Brute-Force → Keygen →
// Authorized Keys → Challenge-Response). Anchor 'client'/'server' dipakai
// lintas Act (continuity, pola sama dgn 44-ssh) — di Act 1 anchor
// 'client' berperan sebagai PENYERANG (actorKind='attacker', styling
// merah), di Act 2-4 kembali jadi laptop user sah (actorKind='user',
// styling sky). Pola "1 act = 1 file" (lihat
// docs/standardizations/07-act-scene-pattern.md) dan scene-ui V1
// (IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1) dipakai sesuai
// _docs/SSH_KEY_PLAN.md. SFX dipakai ulang dari daftar teraudit di
// 44-ssh (public/audio/*), tidak ada sourcing baru. Icon inline SVG,
// tidak ada folder icons/ untuk topic ini.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  CLIENT: '#38BDF8',   // Sky — laptop user sah
  SERVER: '#FBBF24',   // Amber — SSH server
  PUBLIC: '#22D3EE',   // Cyan — public key (boleh dibagikan)
  PRIVATE: '#34D399',  // Emerald — private key (rahasia)
  RISK: '#F87171',     // Merah — brute-force, bahaya, deny
  SUCCESS: '#34D399',  // Emerald — access granted
}

export const PHASES = [
  { id: 'brute-force', badge: 'ACT 1 — KELEMAHAN PASSWORD & BRUTE-FORCE', badgeColor: COLORS.RISK, duration: 22 },
  { id: 'keygen', badge: 'ACT 2 — PASANGAN KUNCI PUBLIK & PRIVAT', badgeColor: COLORS.PUBLIC, duration: 24 },
  { id: 'authorized-keys', badge: 'ACT 3 — MEMASANG GEMBOK DI SERVER', badgeColor: COLORS.SERVER, duration: 20 },
  { id: 'challenge-response', badge: 'ACT 4 — CHALLENGE-RESPONSE: TANPA PASSWORD', badgeColor: COLORS.PRIVATE, duration: 24 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_TITLE_A = 'SSH '
export const INTRO_TITLE_B = 'KEY'
export const INTRO_SUBTITLE = 'Kunci digital pengganti password'

// ── Layout spine — sama pola dengan 44-ssh (client atas, server bawah). ──
export const AXIS_X = 366
export const CLIENT_Y = 120
export const SERVER_Y = 905
export const CHANNEL_TOP = CLIENT_Y + 85
export const CHANNEL_BOTTOM = SERVER_Y - 85

export const SERVER_LABEL = 'SSH SERVER :22'
export const PORT_LABEL = 'autentikasi login'

// ── Anchor absolut bersama tiap Act (body-local ContentBodyV1). ──
export const NEAR_CLIENT = { x: AXIS_X, y: 300 }
export const MID = { x: AXIS_X, y: 500 }
export const NEAR_SERVER = { x: AXIS_X, y: 740 }
export const PUBLIC_PT = { x: AXIS_X + 150, y: 520 }
export const PRIVATE_PT = { x: AXIS_X - 150, y: 520 }
export const PUBLIC_CLIENT_PT = { x: AXIS_X + 150, y: 300 }
export const PRIVATE_CLIENT_PT = { x: AXIS_X - 150, y: 300 }
export const DRAWER_PT = { x: AXIS_X, y: 700 }
export const PASSWORD_CROSS_PT = { x: AXIS_X - 190, y: 300 }
export const GRANTED_PT = { x: AXIS_X, y: SERVER_Y - 170 }

// ═══════════════════════════════════════════════
// ACT 1 — Kelemahan Password & Bahaya Brute-Force
// ═══════════════════════════════════════════════
export const ACT1_BEATS = {
  attempts: ['123456', 'admin', 'password1', 'qwerty', 'letmein'],
  copy: {
    start: 'Robot mencoba login pakai tebakan password',
    rate: 'Ribuan percobaan per detik ke port 22',
    overload: 'Server kewalahan menahan serangan brute-force',
  },
}

// ═══════════════════════════════════════════════
// ACT 2 — Pasangan Kunci Publik & Privat (ssh-keygen)
// ═══════════════════════════════════════════════
export const ACT2_BEATS = {
  command: '$ ssh-keygen -t ed25519',
  publicFile: 'id_ed25519.pub',
  privateFile: 'id_ed25519',
  publicNote: 'GEMBOK PUBLIK — boleh dibagikan',
  privateNote: 'KUNCI PRIVAT — rahasia, jangan dibagikan',
  copy: {
    run: 'ssh-keygen membuat dua benda kembar',
    twin: 'Gembok publik dan kunci privat, sepasang matematis',
    after: 'Kunci privat tetap tinggal di laptop, tidak pernah dikirim',
  },
}

// ═══════════════════════════════════════════════
// ACT 3 — Memasang Gembok di Server (authorized_keys)
// ═══════════════════════════════════════════════
export const ACT3_BEATS = {
  command: '$ ssh-copy-id user@server',
  drawerLabel: '~/.ssh/authorized_keys',
  installedBadge: 'KEY TERPASANG',
  copy: {
    send: 'ssh-copy-id menyalin gembok publik ke server',
    install: 'Gembok publik masuk laci authorized_keys',
    after: 'Server sekarang mengenali gembok ini',
  },
}

// ═══════════════════════════════════════════════
// ACT 4 — Challenge-Response: Masuk Tanpa Ngetik Password
// ═══════════════════════════════════════════════
export const ACT4_BEATS = {
  challengeLabel: 'challenge terenkripsi',
  responseLabel: 'response terbukti',
  grantedBadge: 'ACCESS GRANTED',
  passwordLabel: 'ketik password',
  copy: {
    send: 'Server mengirim teka-teki terenkripsi ke laptop',
    unlock: 'Kunci privat membuka teka-teki itu seketika',
    verify: 'Server mencocokkan jawaban dengan gembok publik',
    after: 'Terbukti identitas tanpa mengetik password sekali pun',
  },
}

export const CLOSING_CAPTION = 'Kunci digital lebih kuat dari password yang bisa ditebak'

// ═══════════════════════════════════════════════
// SFX MAP — dipakai ulang dari daftar teraudit 44-ssh (public/audio/*).
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  TICK: { category: 'ui', name: 'tick' },
  CHIME: { category: 'ui', name: 'chime' },
  TALLY: { category: 'ui', name: 'number-tally' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },

  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  KEY_TURN: { category: 'impacts', name: 'key-turn' },

  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
  STAMP: { category: 'success', name: 'approval-stamp' },

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  SOFT_DENY: { category: 'warnings', name: 'soft-deny' },
}
