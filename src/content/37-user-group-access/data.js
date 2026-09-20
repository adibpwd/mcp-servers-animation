// src/content/37-user-group-access/data.js
// Implementasi revisi-01 (2026-09-16) — src/content/37-user-group-access/revisi/
// 2026-09-16-revisi-01-dense-user-access-flow.md. Tujuh Act: identity masuk ->
// group membentuk konteks -> resource punya metadata -> resolver memilih kelas
// -> file bukan directory -> policy admin terpisah -> bukti & kembali normal.
// Karakter kedua: Yono Bakrie (id yono-bakrie) — anggota tim valid, BUKAN user
// gagal. Group project-team TIDAK PERNAH digambarkan sebagai pemberi izin sudo.

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

  INTRO_A: '#38BDF8',   // sky — USER
  INTRO_B: '#34D399',   // emerald — ACCESS

  USER: '#38BDF8',
  GROUP: '#A78BFA',
  OWNER_LANE: '#38BDF8',
  GROUP_LANE: '#A78BFA',
  OTHERS_LANE: '#94A3B8',
  SUCCESS: '#34D399',
  WAITING: '#FBBF24',
  UNSAFE: '#F43F5E',
  AUDIT: '#F472B6',
}

// Local coordinate ContentBodyV1 (732 x 965) — tujuh lane sesuai revisi-01 §9
// "Layout baru": caption, identity rail, relationship arena, resolver lane,
// resource semantic lane, admin/audit lane, closing.
export const ZONE = {
  CAPTION:       { yStart: 16,  yEnd: 62 },
  IDENTITY:      { yStart: 78,  yEnd: 192 },
  RELATIONSHIP:  { yStart: 208, yEnd: 424 },
  RESOLVER:      { yStart: 440, yEnd: 616 },
  RESOURCE_TYPE: { yStart: 632, yEnd: 774 },
  ADMIN:         { yStart: 790, yEnd: 902 },
  CLOSING:       { yStart: 918, yEnd: 958 },
}

export const CARD_ADIB = { x: 196, y: (ZONE.IDENTITY.yStart + ZONE.IDENTITY.yEnd) / 2 }
export const CARD_YONO = { x: 536, y: (ZONE.IDENTITY.yStart + ZONE.IDENTITY.yEnd) / 2 }
export const GROUP_CENTER = { x: 366, y: ZONE.RELATIONSHIP.yStart + 46 }
export const RESOURCE_DIR_CENTER = { x: 246, y: ZONE.RELATIONSHIP.yStart + 168 }
export const RESOURCE_FILE_CENTER = { x: 486, y: ZONE.RELATIONSHIP.yStart + 168 }
export const RESOLVER_TOP = { x: 366, y: ZONE.RESOLVER.yStart + 6 }
export const RESOLVER_LANES_Y = ZONE.RESOLVER.yStart + 56
export const TYPE_FILE_CENTER = { x: 226, y: (ZONE.RESOURCE_TYPE.yStart + ZONE.RESOURCE_TYPE.yEnd) / 2 }
export const TYPE_DIR_CENTER = { x: 506, y: (ZONE.RESOURCE_TYPE.yStart + ZONE.RESOURCE_TYPE.yEnd) / 2 }
export const GATE_CENTER = { x: 366, y: (ZONE.ADMIN.yStart + ZONE.ADMIN.yEnd) / 2 - 6 }
export const LEDGER_CENTER = { x: 366, y: ZONE.ADMIN.yEnd - 8 }
export const CLOSING_CENTER = { x: 366, y: (ZONE.CLOSING.yStart + ZONE.CLOSING.yEnd) / 2 }

export const PHASES = [
  { id: 'identity',  badge: 'ACT 1 — SIAPA YANG MASUK?',       badgeColor: COLORS.USER,       duration: 14.0 },
  { id: 'group',     badge: 'ACT 2 — GROUP MEMBENTUK KONTEKS', badgeColor: COLORS.GROUP,      duration: 15.0 },
  { id: 'resource',  badge: 'ACT 3 — RESOURCE PUNYA METADATA', badgeColor: COLORS.GROUP,      duration: 15.0 },
  { id: 'resolver',  badge: 'ACT 4 — RESOLVER MEMILIH KELAS',  badgeColor: COLORS.OWNER_LANE, duration: 18.0 },
  { id: 'semantics', badge: 'ACT 5 — FILE BUKAN DIRECTORY',    badgeColor: COLORS.SUCCESS,    duration: 17.0 },
  { id: 'admin',     badge: 'ACT 6 — POLICY ADMIN TERPISAH',   badgeColor: COLORS.WAITING,    duration: 18.0 },
  { id: 'audit',     badge: 'ACT 7 — BUKTI & KEMBALI NORMAL',  badgeColor: COLORS.AUDIT,      duration: 13.0 },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'USER '
export const INTRO_TITLE_B = 'ACCESS'
export const INTRO_SUBTITLE = 'Identity, group, resolver, dan izin admin sementara'

// ── Actors — Yono Bakrie menggantikan Nisa (revisi-01 §2). Anggota tim valid,
// bukan contoh user gagal. UID hanya label pedagogis, bukan permission. ──
export const USERS = [
  { id: 'adib', label: 'Adib', uid: 'UID 1001', primaryGroup: 'adib' },
  { id: 'yono-bakrie', label: 'Yono Bakrie', uid: 'UID 1002', primaryGroup: 'yono-bakrie' },
]

// ── Supplementary group — membership bersama, TIDAK PERNAH memberi akses
// otomatis dan TIDAK PERNAH terhubung ke admin gate (revisi-01 §8 "State yang
// dilarang"). ──
export const SUPPLEMENTARY_GROUP = {
  id: 'project-team',
  label: 'project-team',
  members: ['adib', 'yono-bakrie'],
}

// ── Resource — lahir Act 3, dipakai ulang di Act 4 (resolver) & Act 5
// (semantic file vs directory). Owner: Yono Bakrie; Adib mengakses lewat
// keanggotaan group, bukan owner. ──
export const RESOURCE_DIR = {
  id: 'team-notes',
  label: 'team-notes/',
  kind: 'directory',
  owner: 'yono-bakrie',
  group: 'project-team',
}

export const RESOURCE_FILE = {
  id: 'report',
  label: 'report.md',
  kind: 'file',
  owner: 'yono-bakrie',
  group: 'project-team',
}

// ── Act 4 — dua request capsule, tepat satu lane owner/group/others menyala
// per request (revisi-01 §8: "Allowed result sebelum resolver memilih class"
// dilarang). ──
export const RESOLVER_REQUESTS = [
  { id: 'req-adib', userLabel: 'Adib', resourceLabel: 'report.md', actionLabel: 'baca report.md', relation: 'group', reason: 'Adib anggota project-team, bukan owner' },
  { id: 'req-yono', userLabel: 'Yono Bakrie', resourceLabel: 'team-notes/', actionLabel: 'buka team-notes/', relation: 'owner', reason: 'Yono Bakrie adalah owner resource' },
]

export const RESOLVER_LANES = [
  { id: 'owner', label: 'OWNER', color: COLORS.OWNER_LANE },
  { id: 'group', label: 'GROUP', color: COLORS.GROUP_LANE },
  { id: 'others', label: 'OTHERS', color: COLORS.OTHERS_LANE },
]

// ── Act 5 — rwx bermakna berbeda untuk file vs directory (revisi-01 §5). ──
export const SEMANTIC_FILE = {
  label: 'report.md — FILE',
  rows: [
    { token: 'R', text: 'Membaca isi file' },
    { token: 'W', text: 'Mengubah isi file' },
    { token: 'X', text: 'Menjalankan file executable' },
  ],
}

export const SEMANTIC_DIR = {
  label: 'team-notes/ — DIRECTORY',
  rows: [
    { token: 'R', text: 'Melihat daftar entry' },
    { token: 'W', text: 'Membuat/menghapus entry' },
    { token: 'X', text: 'Traverse masuk directory' },
  ],
}

// ── Act 6-7 — sudo policy gate & audit. project-team TIDAK PERNAH terhubung
// ke gate ini (Batasan revisi-01 §11: tidak ada command/ACL/sudoers nyata). ──
export const ADMIN_ACTION = {
  requesterLabel: 'Adib',
  scopeLabel: 'satu system action (scope terbatas)',
}

export const AUDIT_ENTRY = {
  actorLabel: 'Adib',
  actionLabel: ADMIN_ACTION.scopeLabel,
  resultLabel: 'tercatat — privilege kembali normal',
}

// ── Caption per beat — copy layar deklaratif (revisi-01 §10). ──
export const CAPTIONS = {
  IDENTITY: 'Account memberi identity pada process',
  UID: 'Nama dipetakan ke identity sistem',
  GROUP: 'Group memberi konteks bersama',
  GROUP_NOTE: 'Membership, bukan akses otomatis',
  OWNERSHIP: 'Resource menyimpan owner dan group',
  RESOLVER: 'Satu class rule dipilih per request',
  RESOLVER_ADIB: 'Adib bukan owner, tapi anggota group',
  RESOLVER_YONO: 'Yono Bakrie adalah owner resource',
  FILE_VS_DIR: 'File dan directory memakai rwx berbeda',
  ADMIN: 'Group proyek bukan izin admin',
  SUDO: 'Policy memberi scope sementara',
  AUDIT: 'Tindakan admin meninggalkan bukti',
  CLOSING: 'Identity, lalu rule, lalu privilege seperlunya',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CONNECTOR_SNAP: { category: 'impacts', name: 'connector-snap' },
  ARRIVE: { category: 'ui', name: 'paper-arrive' },
  TICK: { category: 'ui', name: 'tick' },
  LOCK: { category: 'impacts', name: 'lock' },
  PAPER_OPEN: { category: 'ui', name: 'paper-open' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  CONFIRM: { category: 'success', name: 'confirm' },
  DING: { category: 'success', name: 'ding' },
}
