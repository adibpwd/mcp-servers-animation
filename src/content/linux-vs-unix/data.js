// src/content/linux-vs-unix/data-history.js
// ─────────────────────────────────────────────────────────────
// Linux vs Unix — HISTORY TIMELINE narrative
// Act 1: Lahirnya Unix (1969) → Act 2: Unix pecah & POSIX →
// Act 3: Lahirnya Linux (1991) → Act 4: Ledakan distro (pohon keluarga) →
// Act 5: Skor akhir 2026 (pemakaian + jumlah varian)
// ─────────────────────────────────────────────────────────────

export const VW = 820
export const VH = 1340

export const COLORS = {
  UNIX: '#38BDF8',      // biru — tua, mapan (standar sama seperti aksen RAM di RAM vs Swap)
  UNIX_DIM: '#0C4A6E',
  LINUX: '#2CD1A8',     // hijau-cyan — muda, terbuka
  LINUX_DIM: '#0F766E',
  BG: '#070913',
  PANEL: '#0F172A',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  GOLD: '#22D3EE',       // cyan — aksen highlight (dulu oren/amber, sekarang biru muda)
}

export const PHASES = [
  {
    id: 'birth-unix',
    badge: 'ACT 1 — LAHIRNYA UNIX (1969)',
    badgeColor: COLORS.UNIX,
    caption: 'Di Bell Labs, dua orang bikin sistem operasi kecil di komputer bekas. Cikal-bakal segalanya.',
    duration: 9.5,
  },
  {
    id: 'unix-split',
    badge: 'ACT 2 — UNIX PECAH & MENYEBAR (1970an–80an)',
    badgeColor: COLORS.UNIX,
    caption: 'Unix disebar gratis ke kampus. Semua orang mengubahnya sendiri-sendiri — lahirlah banyak "Unix".',
    duration: 11.5,
  },
  {
    id: 'birth-linux',
    badge: 'ACT 3 — LAHIRNYA LINUX (1991)',
    badgeColor: COLORS.LINUX,
    caption: 'Mahasiswa 21 tahun di Helsinki bikin kernel-nya sendiri. Digabung proyek GNU, jadilah OS gratis penuh.',
    duration: 9.5,
  },
  {
    id: 'distro-boom',
    badge: 'ACT 4 — LEDAKAN DISTRO LINUX (1993–sekarang)',
    badgeColor: COLORS.LINUX,
    caption: 'Karena kodenya bebas dipakai siapa saja, Linux beranak-pinak jadi ratusan "distro" berbeda.',
    duration: 13.0,
  },
  {
    id: 'final-score',
    badge: 'ACT 5 — SKOR AKHIR: 2026',
    badgeColor: COLORS.GOLD,
    caption: '57 tahun kemudian, siapa menang di mana?',
    duration: 11.0,
  },
]

// ═══════════════════════════════════════════════════════════
// ACT 1 — Kelahiran Unix
// ═══════════════════════════════════════════════════════════
export const UNIX_BIRTH = {
  year: 1969,
  place: 'Bell Labs, AT&T (New Jersey, USA)',
  people: ['Ken Thompson', 'Dennis Ritchie'],
  machine: 'PDP-7 (komputer bekas yang nganggur)',
  milestone1: { year: 1971, text: 'Unix v1 — manual pertama terbit' },
  milestone2: { year: 1973, text: 'Ditulis ulang pakai bahasa C — jadi mudah dipindah ke komputer lain' },
}

// ═══════════════════════════════════════════════════════════
// ACT 2 — Unix menyebar & pecah jadi banyak varian + POSIX
// ═══════════════════════════════════════════════════════════
export const UNIX_SPLIT_EVENTS = [
  { year: 1977, id: 'bsd',     name: 'BSD',    org: 'Univ. California, Berkeley', note: 'Mahasiswa Berkeley modifikasi Unix jadi versi sendiri', x: 120, y: 0 },
  { year: 1983, id: 'gnu',     name: 'GNU Project', org: 'Richard Stallman, FSF', note: 'Misi: bikin Unix-tiruan yang 100% gratis & terbuka', x: 620, y: 0, special: true },
  { year: 1984, id: 'hpux',    name: 'HP-UX',  org: 'Hewlett-Packard', note: 'Unix versi korporat, untuk server bisnis', x: 300, y: 90 },
  { year: 1986, id: 'aix',     name: 'AIX',    org: 'IBM',   note: 'Unix versi IBM, untuk mainframe & server besar', x: 400, y: 130 },
  { year: 1988, id: 'posix',   name: 'POSIX',  org: 'IEEE (standar bersama)', note: '"Aturan main" biar semua Unix nyambung satu sama lain', x: 220, y: 170, special: true },
  { year: 1992, id: 'solaris', name: 'Solaris', org: 'Sun Microsystems', note: 'Unix populer di dunia perusahaan tahun 90–2000an', x: 500, y: 60 },
]

// ═══════════════════════════════════════════════════════════
// ACT 3 — Kelahiran Linux
// ═══════════════════════════════════════════════════════════
export const LINUX_BIRTH = {
  year: 1991,
  place: 'Helsinki, Finlandia',
  person: 'Linus Torvalds',
  age: 21,
  detail: 'Mahasiswa iseng bikin kernel sendiri, ditulis di forum Usenet — awalnya cuma hobi.',
  fusion: {
    year: 1992,
    text: 'Kernel Linux + tools GNU (yang sudah ada sejak 1983) + lisensi GPL = Sistem Operasi GNU/Linux, 100% gratis & boleh diubah siapa saja.',
  },
}

// ═══════════════════════════════════════════════════════════
// ACT 4 — Ledakan distro Linux (pohon keluarga)
// x = tahun-relative posisi horizontal, y = jalur silsilah (lane)
// ═══════════════════════════════════════════════════════════
export const DISTRO_TREE = [
  { id: 'kernel',  name: 'Linux Kernel', year: 1991, lane: 2, parent: null,    color: COLORS.LINUX },
  { id: 'slack',   name: 'Slackware',    year: 1993, lane: 0, parent: 'kernel', color: '#38BDF8' },
  { id: 'debian',  name: 'Debian',       year: 1993, lane: 1, parent: 'kernel', color: '#A80030' },
  { id: 'redhat',  name: 'Red Hat',      year: 1994, lane: 3, parent: 'kernel', color: '#EE0000' },
  { id: 'suse',    name: 'SUSE',         year: 1994, lane: 4, parent: 'kernel', color: '#73BA25' },
  { id: 'gentoo',  name: 'Gentoo',       year: 2000, lane: 3, parent: 'redhat', color: '#54487A' },
  { id: 'arch',    name: 'Arch',         year: 2002, lane: 0, parent: 'slack',  color: '#1793D1' },
  { id: 'fedora',  name: 'Fedora',       year: 2003, lane: 3, parent: 'redhat', color: '#3C6EB4' },
  { id: 'ubuntu',  name: 'Ubuntu',       year: 2004, lane: 1, parent: 'debian', color: '#E95420' },
  { id: 'centos',  name: 'CentOS',       year: 2004, lane: 4, parent: 'redhat', color: '#932279' },
  { id: 'mint',    name: 'Linux Mint',   year: 2006, lane: 1, parent: 'ubuntu', color: '#87CF3E' },
  { id: 'android', name: 'Android',      year: 2008, lane: 2, parent: 'kernel', color: '#3DDC84' },
  { id: 'manjaro', name: 'Manjaro',      year: 2011, lane: 0, parent: 'arch',   color: '#35BF5C' },
  { id: 'popos',   name: 'Pop!_OS',      year: 2017, lane: 1, parent: 'ubuntu', color: '#48B9C7' },
]

export const DISTRO_COUNT_MILESTONES = [
  { year: 1993, count: 1 },
  { year: 2000, count: 12 },
  { year: 2010, count: 200 },
  { year: 2026, count: 600 },
]

// ═══════════════════════════════════════════════════════════
// ACT 5 — Skor akhir 2026
// ═══════════════════════════════════════════════════════════
export const UNIX_TODAY = {
  headline: 'Sedikit varian, tapi kuat di ceruknya',
  variantLabel: 'Segelintir varian aktif',
  variantSub: 'macOS/iOS (Apple) · FreeBSD/OpenBSD · Solaris · AIX · HP-UX',
  stats: [
    { label: 'macOS + iOS (Apple, turunan BSD)', value: 'Miliaran perangkat', color: COLORS.UNIX },
    { label: 'FreeBSD',  value: 'Netflix CDN, PlayStation', color: COLORS.UNIX },
    { label: 'Solaris / AIX / HP-UX', value: 'Server enterprise lama', color: COLORS.UNIX_DIM },
  ],
}

export const LINUX_TODAY = {
  headline: 'Ratusan varian, mendominasi infrastruktur dunia',
  variantLabel: '600+ distro aktif',
  variantSub: 'Ubuntu · Debian · Fedora · Arch · Mint · dan ratusan lainnya',
  stats: [
    { label: 'Top 500 Supercomputer dunia', value: '~100% pakai Linux', color: COLORS.LINUX },
    { label: 'Server & Cloud dunia', value: 'Mayoritas besar', color: COLORS.LINUX },
    { label: 'Android (kernel Linux)', value: 'Miliaran perangkat', color: COLORS.LINUX },
  ],
}

export const CLOSING_LINE = {
  unix: 'Unix = akar tua yang masih hidup — terutama lewat satu perusahaan: Apple.',
  linux: 'Linux = keturunan bebasnya, yang justru menguasai server, cloud, & saku semua orang.',
}

// ═══════════════════════════════════════════════════════════
// SFX MAP
// ═══════════════════════════════════════════════════════════
export const SFX_MAP = {
  POP: { category: 'ui', name: 'pop' },
  CHIME: { category: 'ui', name: 'chime' },
  PLINK: { category: 'ui', name: 'plink' },
  SLIDE_IN: { category: 'transitions', name: 'slide-in' },
  WHOOSH: { category: 'sfx', name: 'whoosh' },
  TYPING: { category: 'sfx', name: 'typing' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SUCCESS: { category: 'sfx', name: 'success' },
  SCAN: { category: 'sfx', name: 'scan' },
  CONFIRM: { category: 'success', name: 'confirm' },
  VICTORY: { category: 'success', name: 'victory' },
  CHARGE: { category: 'success', name: 'charge' },
  BRANCH: { category: 'impacts', name: 'impact' },
  // ── Tambahan: isi bagian kosong (connector lines, counter ticking) + variasi transisi ──
  TICK: { category: 'ui', name: 'tick' },
  DING: { category: 'success', name: 'ding' },
  SWOOSH: { category: 'transitions', name: 'swoosh' },
  SWOOSH2: { category: 'transitions', name: 'swoosh-2' },
  WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' },
  GLITCH: { category: 'transitions', name: 'glitch' },
  TELEPORT: { category: 'transitions', name: 'teleport' },
}
