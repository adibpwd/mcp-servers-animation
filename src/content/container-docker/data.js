// src/content/container-docker/data.js
// ─────────────────────────────────────────────────────────────
// Docker Container vs VM — cerita: laptop lemot jalanin 3 app pakai
// 3 Virtual Machine (hardware virtualization, tiap VM boot kernel
// sendiri) → kenalan Docker (OS-level virtualization, shared kernel
// host + namespace/cgroup) → payoff: laptop sama, jauh lebih ringan,
// TAPI ada trade-off keamanan (kapan VM tetap perlu).
// Lihat _docs/CONTAINER_DOCKER_PLAN.md untuk story spine lengkap.
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',

  VM: '#FB923C',           // orange — Virtual Machine, guest OS penuh
  VM_DIM: '#7C2D12',
  CONTAINER: '#34D399',    // green — Docker container, ringan
  CONTAINER_DIM: '#065F46',
  KERNEL: '#38BDF8',       // sky blue — kernel host yang di-share
  KERNEL_DIM: '#075985',
  HYPERVISOR: '#A78BFA',   // violet — lapisan hypervisor (VM only)
  HYPERVISOR_DIM: '#4C1D95',
  ISOLATION: '#F43F5E',    // rose — batas isolasi
  ISOLATION_DIM: '#4C0519',
  DOCKER: '#2496ED',       // docker brand blue
  DOCKER_DIM: '#0C4A6E',
}

export const PHASES = [
  {
    id: 'three-vms-hook',
    badge: 'ACT 1 — 3 APP, 3 OS PENUH?',
    badgeColor: COLORS.VM,
    caption: 'Kenapa jalanin app kecil aja laptop udah teriak?',
    duration: 9.0,
  },
  {
    id: 'what-is-vm',
    badge: 'ACT 2 — VM = KOMPUTER PALSU YANG LENGKAP',
    badgeColor: COLORS.HYPERVISOR,
    caption: 'Tiap VM = 1 OS utuh, boot dari nol tiap kali.',
    duration: 9.0,
  },
  {
    id: 'what-is-container',
    badge: 'ACT 3 — CONTAINER BUKAN VM YANG DIKECILIN',
    badgeColor: COLORS.CONTAINER,
    caption: 'Container numpang 1 kernel yang sama.',
    duration: 11.0,
  },
  {
    id: 'tradeoff-compare',
    badge: 'ACT 4 — RINGAN, TAPI ADA HARGANYA',
    badgeColor: COLORS.ISOLATION,
    caption: 'Numpang kernel = kelebihan sekaligus kelemahan.',
    duration: 10.0,
  },
  {
    id: 'lightweight-payoff',
    badge: 'ACT 5 — 3 APP, 1 KERNEL, LAPTOP ADEM',
    badgeColor: COLORS.DOCKER,
    caption: 'Laptop yang sama, jauh lebih lega.',
    duration: 9.0,
  },
]

export const TOTAL_DURATION = PHASES.reduce((acc, p) => acc + p.duration, 0)

// ═══════════════════════════════════════════════
// INTRO — hacker typing → header morph (pola sama seperti tailscale,
// lihat revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md Phase 1 Opsi A)
// ═══════════════════════════════════════════════
export const INTRO_CATEGORY = 'LINUX DEEP DIVE'

// ═══════════════════════════════════════════════
// ACT 1 — 3 App, 3 Rumah Penuh (hook)
// ═══════════════════════════════════════════════
export const APPS = [
  { id: 'node', label: 'NODE', icon: 'node-icon' },
  { id: 'python', label: 'PYTHON', icon: 'python-icon' },
  { id: 'redis', label: 'REDIS', icon: 'redis-icon' },
]
export const HOOK_QUESTION = 'Kenapa jalanin app kecil aja laptop udah teriak?'
export const HOOK_CLIFFHANGER = 'Masa iya tiap app butuh 1 OS penuh sendiri-sendiri?'

// ═══════════════════════════════════════════════
// ACT 2 — Apa itu Virtual Machine?
// ═══════════════════════════════════════════════
export const VM_INSIGHT = 'Tiap VM = 1 OS Utuh, Boot dari Nol'
export const VM_CAPTION = 'Bukan app-nya yang berat — OS pembungkusnya.'

// ═══════════════════════════════════════════════
// ACT 3 — Docker: Bukan VM Mini!
// ═══════════════════════════════════════════════
export const CONTAINER_QUESTION = 'Kalau bukan VM mini... container itu apaan?'
export const CONTAINER_INSIGHT = 'Container Numpang 1 Kernel yang Sama'
export const NAMESPACE_LABEL = 'Namespace = sekat privasi'
export const CGROUP_LABEL = 'Cgroup = jatah resource'
export const CONTAINER_PAYOFF = 'App + dependency doang, numpang kernel yang sama.'

// ═══════════════════════════════════════════════
// ACT 4 — Bukan Cuma "Lebih Kecil"
// ═══════════════════════════════════════════════
export const SIZE_COMPARE = { vm: 'GB', container: 'MB' }
export const BOOTTIME_COMPARE = { vm: 'MENIT', container: 'DETIK' }
export const TRADEOFF_QUESTION = 'Kalau container jauh lebih enak, kenapa VM masih dipakai?'
export const TRADEOFF_CAPTION = 'Container ringan karena numpang kernel. Numpang itu jadi kelebihan sekaligus kelemahannya.'

// ═══════════════════════════════════════════════
// ACT 5 — Payoff (jawab hook Act 1)
// ═══════════════════════════════════════════════
export const CLOSING_NOTE = 'VM tetap dipakai kalau butuh isolasi lebih kuat atau OS/kernel beda total.'
export const CLOSING_LINE = 'Container bukan versi kecil dari VM — beda cara ngebungkusnya.'
export const CLOSING_BRAND = 'Itu yang bikin laptop lo lega.'

// ═══════════════════════════════════════════════
// SFX MAP — hanya nama yang sudah tersedia di public/audio/*
// ═══════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  CHIME: { category: 'ui', name: 'chime' },
  TICK: { category: 'ui', name: 'tick' },
  BEEP: { category: 'ui', name: 'beep' },

  WHOOSH: { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  GLITCH: { category: 'transitions', name: 'glitch' },
  TELEPORT: { category: 'transitions', name: 'teleport' },   // intro morph

  DISK_SPIN: { category: 'impacts', name: 'disk-spin' },   // VM boot berat
  SWAP: { category: 'impacts', name: 'swap' },              // shared kernel "dipinjam"
  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },

  CONFIRM: { category: 'success', name: 'confirm' },
  VICTORY: { category: 'success', name: 'victory' },
  DING: { category: 'success', name: 'ding' },
  COMPLETE: { category: 'success', name: 'complete' },
  SHIMMER: { category: 'success', name: 'shimmer' },        // meter turun smooth
  CHARGE: { category: 'success', name: 'charge' },           // intro morph accent

  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },

  SCAN: { category: 'sfx', name: 'scan' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SUCCESS: { category: 'sfx', name: 'success' },
  ERROR: { category: 'sfx', name: 'error' },
  TYPING: { category: 'sfx', name: 'typing', boost: 2.2 },   // intro hacker-typing
}
