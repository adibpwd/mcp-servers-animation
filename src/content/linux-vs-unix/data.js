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
  { id: 'macos',   name: 'macOS',   year: 2001, company: 'Apple',   size: 'XL', color: '#A3A3A3', icon: '' },
  { id: 'solaris', name: 'Solaris', year: 1992, company: 'Oracle', size: 'S',  color: '#EF4444', icon: '' },
  { id: 'aix',     name: 'AIX',     year: 1986, company: 'IBM',    size: 'S',  color: '#3B82F6', icon: '' },
  { id: 'hpux',    name: 'HP-UX',   year: 1984, company: 'HP',     size: 'S',  color: '#8B5CF6', icon: '' },
  { id: 'freebsd', name: 'FreeBSD', year: 1993, company: null,     size: 'XS', color: '#AB2B28', icon: '' },
]

// ═══════════════════════════════════════════════════════════
// LINUX FAMILY
// ═══════════════════════════════════════════════════════════

export const LINUX_FAMILY = [
  { id: 'android', name: 'Android', year: 2008, company: 'Google',    size: 'XL', color: '#3DDC84', icon: '' },
  { id: 'ubuntu',  name: 'Ubuntu',  year: 2004, company: 'Canonical', size: 'L',  color: '#E95420', icon: '' },
  { id: 'fedora',  name: 'Fedora',  year: 2003, company: 'Red Hat',  size: 'S',  color: '#3C6EB4', icon: '' },
  { id: 'arch',    name: 'Arch',    year: 2002, company: null,       size: 'S',  color: '#1793D1', icon: '' },
  { id: 'debian',  name: 'Debian',  year: 1993, company: null,       size: 'S',  color: '#A80030', icon: '' },
]

// ═══════════════════════════════════════════════════════════
// WINDOWS
// ═══════════════════════════════════════════════════════════

export const WINDOWS = {
  id: 'windows', name: 'Windows', year: 1985, company: 'Microsoft', size: 'M', color: '#3B82F6', icon: '',
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
