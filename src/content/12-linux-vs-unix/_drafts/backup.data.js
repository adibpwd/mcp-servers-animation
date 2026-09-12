// src/content/linux-vs-unix/data.js
// ─────────────────────────────────────────────────────────────
// Linux vs Unix — Data & Constants
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

// ═══════════════════════════════════════════════════════════
// SIZE MAP
// ═══════════════════════════════════════════════════════════

export const SIZE_MAP = {
  XL: 120,  // macOS, Android
  L: 90,    // Ubuntu
  M: 70,    // Windows
  S: 50,    // Solaris, AIX, HP-UX, Fedora, Arch, Debian
  XS: 40,   // FreeBSD
}

// ═══════════════════════════════════════════════════════════
// UNIX FAMILY
// ═══════════════════════════════════════════════════════════

export const UNIX_FAMILY = [
  { id: 'macos',   name: 'macOS',   year: 2001, company: 'Apple',   size: 'XL', color: '#A3A3A3', icon: 'macos' },
  { id: 'solaris', name: 'Solaris', year: 1992, company: 'Oracle', size: 'S',  color: '#EF4444', icon: 'solaris' },
  { id: 'aix',     name: 'AIX',     year: 1986, company: 'IBM',    size: 'S',  color: '#3B82F6', icon: 'aix' },
  { id: 'hpux',    name: 'HP-UX',   year: 1984, company: 'HP',     size: 'S',  color: '#8B5CF6', icon: 'hpux' },
  { id: 'freebsd', name: 'FreeBSD', year: 1993, company: null,     size: 'XS', color: '#AB2B28', icon: 'freebsd' },
]

// ═══════════════════════════════════════════════════════════
// LINUX FAMILY
// ═══════════════════════════════════════════════════════════

export const LINUX_FAMILY = [
  { id: 'android', name: 'Android', year: 2008, company: 'Google',    size: 'XL', color: '#3DDC84', icon: 'android' },
  { id: 'ubuntu',  name: 'Ubuntu',  year: 2004, company: 'Canonical', size: 'L',  color: '#E95420', icon: 'ubuntu' },
  { id: 'fedora',  name: 'Fedora',  year: 2003, company: 'Red Hat',  size: 'S',  color: '#3C6EB4', icon: 'fedora' },
  { id: 'arch',    name: 'Arch',    year: 2002, company: null,       size: 'S',  color: '#1793D1', icon: 'arch' },
  { id: 'debian',  name: 'Debian',  year: 1993, company: null,       size: 'S',  color: '#A80030', icon: 'debian' },
]

// ═══════════════════════════════════════════════════════════
// WINDOWS
// ═══════════════════════════════════════════════════════════

export const WINDOWS = {
  id: 'windows', name: 'Windows', year: 1985, company: 'Microsoft', size: 'M', color: '#3B82F6', icon: 'windows',
  kernel: 'NT Kernel', wslNote: 'Windows Subsystem for Linux',
}

// ═══════════════════════════════════════════════════════════
// PHASE 1 LAYOUT POSITIONS (x, y) — relative to canvas center
// ═══════════════════════════════════════════════════════════

// Cluster centers
export const UNIX_CLUSTER_CENTER = { x: 220, y: 480 }
export const LINUX_CLUSTER_CENTER = { x: 600, y: 480 }
export const POSIX_HUB = { x: 410, y: 250 }
export const WINDOWS_CORNER = { x: 650, y: 1050 }

// Individual positions within clusters (offsets from cluster center)
export const UNIX_POSITIONS = {
  macos:   { x: -60, y: -80 },
  solaris: { x: -120, y: 30 },
  aix:     { x: 0, y: 30 },
  hpux:    { x: 120, y: 30 },
  freebsd: { x: 0, y: 100 },
}

export const LINUX_POSITIONS = {
  android: { x: 60, y: -80 },
  ubuntu:  { x: -60, y: 20 },
  fedora:  { x: 120, y: 20 },
  arch:    { x: -120, y: 90 },
  debian:  { x: 0, y: 90 },
}

// ═══════════════════════════════════════════════════════════
// PHASES
// ═══════════════════════════════════════════════════════════

export const PHASES = [
  { badge: 'UNIX FAMILY',      badgeColor: '#06B6D4', caption: 'From one kernel to an ecosystem',         duration: 12 },
  { badge: 'WHERE UNIX LIVES', badgeColor: '#06B6D4', caption: 'Still running critical infrastructure', duration: 10 },
  { badge: 'LINUX DOMINANCE',  badgeColor: '#06B6D4', caption: 'Open source ate the world',              duration: 10 },
  { badge: 'POSIX BROTHERS',   badgeColor: '#06B6D4', caption: 'Different roots, same POSIX DNA',        duration: 5 },
]

export const COUNTER_START = 0

// ═══════════════════════════════════════════════════════════
// PHASE 2: USE CASES
// ═══════════════════════════════════════════════════════════

export const UNIX_USE_CASES = [
  { device: 'Mainframe',        os: 'AIX',              usage: 'Banks, Insurance, Government', icon: '🏢', color: '#3B82F6' },
  { device: 'Enterprise Server', os: 'Oracle Solaris',  usage: 'Databases, Mission-critical',  icon: '🖥️', color: '#EF4444' },
  { device: 'Network Equipment', os: 'Cisco IOS/VxWorks', usage: 'Routers, Firewalls, IoT',   icon: '🌐', color: '#06B6D4' },
  { device: 'Personal',         os: 'macOS/FreeBSD',    usage: 'Dev workstations, NAS',      icon: '💻', color: '#9CA3AF' },
]

// ═══════════════════════════════════════════════════════════
// PHASE 3: MARKET DOMINANCE
// ═══════════════════════════════════════════════════════════

export const LINUX_DOMINANCE = [
  { category: 'Servers',          linux: 96.3, unix: 3.7 },
  { category: 'Cloud',            linux: 90,   unix: 10 },
  { category: 'Supercomputers',   linux: 100,  unix: 0 },
  { category: 'Mobile (Android)', linux: 72,   unix: 28 },
  { category: 'Desktop',          linux: 4,    unix: 15 },
]

// ═══════════════════════════════════════════════════════════
// ANIMATION TIMING CONSTANTS
// ═══════════════════════════════════════════════════════════

export const TIMING = {
  PHASE1_NODE_SPAWN_STAGGER: 0.6,
  PHASE1_NODE_SPAWN_DURATION: 0.5,
  PHASE1_CONNECTOR_DRAW_DURATION: 0.4,
  PHASE2_CARD_STAGGER: 2.5,
  PHASE2_CARD_DURATION: 0.6,
  PHASE3_BAR_STAGGER: 2.0,
  PHASE3_BAR_DURATION: 1.2,
}

// ═══════════════════════════════════════════════════════════
// SPAWN PATHS (for playful node entrance animations)
// ═══════════════════════════════════════════════════════════

export const SPAWN_PATHS = {
  // Unix nodes spawn from left/top
  hpux:    { startX: -200, startY: 300 },
  aix:     { startX: -150, startY: 150 },
  solaris: { startX: -200, startY: 500 },
  freebsd: { startX: 100, startY: -100 },
  macos:   { startX: -100, startY: 100 },
  
  // Linux nodes spawn from right
  android: { startX: 900, startY: 200 },
  ubuntu:  { startX: 900, startY: 400 },
  fedora:  { startX: 900, startY: 500 },
  arch:    { startX: 900, startY: 600 },
  debian:  { startX: 900, startY: 700 },
}

// ═══════════════════════════════════════════════════════════
// CAPTION TEXTS (storytelling)
// ═══════════════════════════════════════════════════════════

export const CAPTIONS = {
  PHASE1: {
    BELL_LABS: "1970, Unix lahir di Bell Labs...",
    HPUX: "1984: HP-UX untuk server enterprise",
    AIX: "1986: IBM AIX untuk mainframe",
    SOLARIS: "1992: Solaris untuk mission-critical",
    FREEBSD: "1993: FreeBSD untuk networking",
    MACOS: "2001: macOS - Unix jadi elegan!",
    POSIX_CONNECTED: "Semua terhubung ke POSIX standard...",
    LINUX_INTRO: "1991, Linus Torvalds: 'I'm doing a free OS...'",
    ANDROID: "Android! 72% smartphone dunia!",
    UBUNTU: "Ubuntu!",
    LINUX_FAMILY: "Fedora! Arch! Debian!",
    WINDOWS_WANTS: "Windows: 'Aku juga mau POSIX!'",
    WINDOWS_REJECTED: "Ditolak! NT Kernel bukan Unix...",
    WINDOWS_EXPELLED: "Windows diasingkan...",
    WSL_ARRIVES: "2016, Windows bikin WSL...",
    WSL_SUCCESS: "Sekarang bisa jalankan Linux di Windows!"
  },
  PHASE2: {
    INTRO: "Unix sekarang di mana?",
    MAINFRAME: "Bank & Asuransi masih pakai AIX di mainframe!",
    ENTERPRISE: "Database Oracle & mission-critical apps!",
    NETWORK: "Router & firewall dunia pakai Unix-based OS!",
    PERSONAL: "Developer workstation & NAS server!",
    OUTRO: "Unix masih everywhere - just invisible!"
  },
  PHASE3: {
    INTRO: "Tapi Linux... DOMINASI!",
    SERVERS: "96.3% web server pakai Linux!",
    CLOUD: "AWS, Google Cloud, Azure... semua Linux!",
    SUPERCOMPUTERS: "100% TOP500 supercomputer = Linux!",
    MOBILE: "Android (Linux) = 72% smartphone!",
    DESKTOP: "Desktop? Cuma 4%... tapi siapa peduli? 😅",
    OUTRO: "Linux ate the world!"
  },
  PHASE4: {
    INTRO: "Tapi... mereka tetap saudara!",
    VENN: "Sama-sama POSIX compliant",
    TOOLS: "Shared tools: ls, grep, pipes, chmod...",
    OUTRO: "Different roots, same POSIX DNA"
  }
}

// ═══════════════════════════════════════════════════════════
// SOUND EFFECT NAMES (reference to audio files)
// ═══════════════════════════════════════════════════════════

export const SFX = {
  NODE_SPAWN: 'pop',
  NODE_LAND: 'bounce',
  ALL_NODES_COMPLETE: 'chime',
  CONNECTOR_DRAW: 'tick',
  CONNECTOR_COMPLETE: 'whoosh',
  LINUX_DRAMATIC_ENTER: 'swoosh',
  ANDROID_IMPACT: 'impact',
  WINDOWS_REJECTED: 'error-beep',
  WINDOWS_EXPELLED: 'glitch',
  WSL_CABLE: 'swoosh-2',
  WSL_SUCCESS: 'shimmer',
  CARD_ENTER: 'slide-in',
  CARD_COMPLETE: 'ding',
  BAR_GROW: 'charge',
  BAR_COMPLETE: 'confirm',
  BAR_100_VICTORY: 'victory',
  DESKTOP_SAD: 'plink',
  PHASE_COMPLETE: 'complete'
}
