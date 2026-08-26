// src/content/virtual-memory/data.js
export const VW = 820
export const VH = 1340

export const PHASES = [
  {
    id: 'analogy',
    badge: 'ACT 1 — APA ITU RAM?',
    badgeColor: '#38BDF8',
    caption: 'RAM = Meja Kerja kamu. Makin besar meja, makin banyak buku bisa dibuka sekaligus!',
    duration: 9.0,
  },
  {
    id: 'paging',
    badge: 'ACT 2 — HALAMAN (PAGING)',
    badgeColor: '#A78BFA',
    caption: 'Kernel memotong data jadi halaman 4KB. Seperti memotong buku jadi bab-bab kecil.',
    duration: 9.0,
  },
  {
    id: 'swap-out',
    badge: 'ACT 3 — RAM PENUH! (SWAP OUT)',
    badgeColor: '#F43F5E',
    caption: 'Meja penuh! Kernel pindahkan bab yang tidak dipakai ke Gudang (Disk Swap).',
    duration: 10.0,
  },
  {
    id: 'swap-in',
    badge: 'ACT 4 — AMBIL DARI GUDANG (SWAP IN)',
    badgeColor: '#FBBF24',
    caption: 'Butuh bab di gudang? Kernel ambil balik — tapi lambat! Ini sebabnya Swap terasa berat.',
    duration: 9.0,
  },
]

export const COUNTER_START = 0

// ─── RAM Slots (8 slot = 8 GB analogi) ───
export const RAM_SLOTS = [
  { id: 0, label: 'Slot A', gb: '1 GB' },
  { id: 1, label: 'Slot B', gb: '1 GB' },
  { id: 2, label: 'Slot C', gb: '1 GB' },
  { id: 3, label: 'Slot D', gb: '1 GB' },
  { id: 4, label: 'Slot E', gb: '1 GB' },
  { id: 5, label: 'Slot F', gb: '1 GB' },
]

// ─── Proses / Aplikasi yang berjalan ───
export const PROCESSES = [
  { id: 'browser', name: 'Browser', icon: 'browser', color: '#38BDF8', pages: 3, desc: 'Buka 15 Tab' },
  { id: 'game',    name: 'Game',    icon: 'game', color: '#A78BFA', pages: 2, desc: 'Resident Evil' },
  { id: 'ide',     name: 'IDE',     icon: 'editor', color: '#34D399', pages: 1, desc: 'VS Code' },
]

// ─── Latency comparison ───
export const LATENCY = [
  { label: 'CPU Cache (L3)',  ns: '~10 ns',    bar: 5,   color: '#34D399' },
  { label: 'RAM',            ns: '~100 ns',   bar: 25,  color: '#38BDF8' },
  { label: 'SSD (Swap)',     ns: '~0.1 ms',   bar: 65,  color: '#FBBF24' },
  { label: 'HDD (Swap)',     ns: '~10 ms',    bar: 100, color: '#F43F5E' },
]

// ─── Animation Timing Configs (Playful Enhancement) ───
export const ANIMATION_TIMING = {
  // ACT 1: Desk Items
  ACT1_ITEM_STAGGER: 0.3,        // Delay between item spawns (was 1.2s)
  ACT1_ITEM_DURATION: 0.4,       // Each item spawn animation duration
  ACT1_DESK_VIBRATE_START: 4.0,  // When desk starts vibrating
  ACT1_DESK_FULL_TIME: 6.5,      // Dramatic "PENUH!" moment
  
  // ACT 2: RAM Slots & Paging
  ACT2_SLOT_STAGGER: 0.15,       // Delay between RAM slot appearances
  ACT2_SLOT_DURATION: 0.3,       // Each slot appear duration
  ACT2_PAGE_ALLOC_DURATION: 0.6, // Each page allocation cycle
  ACT2_ARROW_MOVE_DURATION: 0.4, // Arrow movement duration
  
  // ACT 3: Swap Out
  ACT3_GLITCH_DURATION: 1.5,     // Page movement glitch duration
  ACT3_PAGE_MOVE_DURATION: 1.5,  // Page travel time (slow for drama)
  ACT3_SHAKE_INTENSITY: 8,       // Screen shake amplitude (pixels)
  
  // ACT 4: Swap In & Latency
  ACT4_PAGE_JOURNEY_DURATION: 2.0, // Slow journey for latency demonstration
  ACT4_LATENCY_BAR_DURATION: 0.8,  // Each latency bar fill duration
  ACT4_LATENCY_STAGGER: 0.4,       // Delay between latency bars
}

// ─── SFX Mapping (New Categories) ───
export const SFX_MAP = {
  // UI Sounds
  POP: { category: 'ui', name: 'pop' },
  BOUNCE: { category: 'ui', name: 'bounce' },
  CHIME: { category: 'ui', name: 'chime' },
  BEEP: { category: 'ui', name: 'beep' },
  PLINK: { category: 'ui', name: 'plink' },
  
  // Transitions
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
  GLITCH: { category: 'transitions', name: 'glitch' },
  
  // Impacts
  IMPACT: { category: 'impacts', name: 'impact' },
  LOCK: { category: 'impacts', name: 'lock' },
  UNLOCK: { category: 'impacts', name: 'unlock' },
  SWAP: { category: 'impacts', name: 'swap' },
  DISK_SPIN: { category: 'impacts', name: 'disk-spin' },
  
  // Warnings
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse' },
  CRITICAL_ALERT: { category: 'warnings', name: 'critical-alert' },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep' },
  PAGE_FAULT: { category: 'warnings', name: 'page-fault' },
  ERROR_HUM: { category: 'warnings', name: 'error-hum' },
  LATENCY_TICK: { category: 'warnings', name: 'latency-tick' },
  
  // Success
  VICTORY: { category: 'success', name: 'victory' },
  CONFIRM: { category: 'success', name: 'confirm' },
  COMPLETE: { category: 'success', name: 'complete' },
  CHARGE: { category: 'success', name: 'charge' },
  SSD_ACCESS: { category: 'success', name: 'ssd-access' },
  SWAP_IN_COMPLETE: { category: 'success', name: 'swap-in-complete' },
  
  // Legacy (existing)
  CLICK: { category: 'sfx', name: 'click' },
  ERROR: { category: 'sfx', name: 'error' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SCAN: { category: 'sfx', name: 'scan' },
  SUCCESS: { category: 'sfx', name: 'success' },
  TYPING: { category: 'sfx', name: 'typing' },
  WARNING: { category: 'sfx', name: 'warning' },
  WHOOSH: { category: 'sfx', name: 'whoosh' },
}
