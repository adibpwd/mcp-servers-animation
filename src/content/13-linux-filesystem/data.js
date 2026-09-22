import { DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export const VW = DEFAULT_LAYOUT_V1.canvas.width
export const VH = DEFAULT_LAYOUT_V1.canvas.height

export const COLORS = {
  BG: '#070913',
  PANEL: '#0F172A',
  PANEL_ALT: '#111C31',
  BORDER: '#334155',
  TEXT: '#E2E8F0',
  MUTED: '#94A3B8',
  ROOT: '#22D3EE',
  HOME: '#38BDF8',
  CONFIG: '#A78BFA',
  VARIABLE: '#FB923C',
  TEMP: '#FBBF24',
  SUCCESS: '#34D399',
  DANGER: '#F43F5E',
}

export const PHASES = [
  { id: 'home', badge: 'ACT 1 — WORKSPACE DI HOME', badgeColor: COLORS.HOME, duration: 11.0 },
  { id: 'etc', badge: 'ACT 2 — CONFIG & APLIKASI SISTEM', badgeColor: COLORS.CONFIG, duration: 11.0 },
  { id: 'varTmp', badge: 'ACT 3 — DATA SAAT APP BERJALAN', badgeColor: COLORS.VARIABLE, duration: 11.0 },
  { id: 'path', badge: 'ACT 4 — NAVIGASI DENGAN PATH', badgeColor: COLORS.SUCCESS, duration: 11.0 },
]

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'LINUX '
export const INTRO_TITLE_B = 'FILESYSTEM'
export const INTRO_SUBTITLE = 'Satu pohon, banyak ruang penting'

export const LABELS = {
  ROOT: '/',
  HOME: '/home',
  ETC: '/etc',
  VAR: '/var',
  TMP: '/tmp',
  USER_HOME: '/home/adib',
  DOCUMENTS: 'Documents',
  TARGET: 'README.md',
  ROOT_DESC: 'Pintu awal semua folder',
  HOME_DESC: 'Ruang file pribadi tiap user',
  ETC_DESC: 'Konfigurasi sistem, bukan dokumen',
  VAR_DESC: 'Log dan cache aplikasi bertambah',
  TMP_DESC: 'Tempat singgah file sementara',
  PATH: '/home/adib/Projects/inventory-api/src/server.js',
}

export const TERMINAL = {
  HOME_CMD: '$ ls ~',
  HOME_OUT: 'Projects  Downloads  Documents  Videos',
  PROJECT_CMD: '$ cd ~/Projects/inventory-api',
  PROJECT_OUT: 'src  tests  package.json  README.md',
  LS_ETC_CMD: '$ ls /etc',
  LS_ETC_OUT: 'nginx  ssh  docker  systemd  hosts',
  USR_CMD: '$ which node && which code',
  USR_OUT: '/usr/bin/node  /usr/bin/code',
  LS_VAR_CMD: '$ ls /var/log',
  LS_VAR_OUT: 'nginx  docker  syslog  app.log',
  LS_TMP_CMD: '$ ls /tmp',
  LS_TMP_OUT: 'vite-build-8192  upload-preview',
}

export const HOME_ITEMS = [
  { icon: '⌘', name: 'Projects', detail: 'repo Git & aplikasi', color: COLORS.HOME },
  { icon: '↓', name: 'Downloads', detail: 'installer, ZIP, PDF', color: COLORS.TEMP },
  { icon: '▤', name: 'Documents', detail: 'catatan & proposal', color: COLORS.SUCCESS },
  { icon: '▶', name: 'Videos', detail: 'screen recording', color: COLORS.DANGER },
  { icon: '⚙', name: '.config', detail: 'setting aplikasi user', color: COLORS.CONFIG },
  { icon: '⌁', name: '.ssh', detail: 'kunci akses Git/server', color: COLORS.ROOT },
]

export const PROJECT_ITEMS = [
  { name: 'src/', detail: 'server.js · routes/' },
  { name: 'tests/', detail: 'api.test.js' },
  { name: 'package.json', detail: 'npm scripts & deps' },
  { name: 'README.md', detail: 'cara menjalankan app' },
]

export const ETC_ITEMS = [
  { name: 'nginx/', detail: 'web server config' },
  { name: 'ssh/', detail: 'akses remote server' },
  { name: 'docker/', detail: 'Docker daemon config' },
  { name: 'systemd/', detail: 'service yang dijalankan' },
  { name: 'hosts', detail: 'nama host lokal' },
]

export const USR_ITEMS = [
  { name: '/usr/bin', detail: 'node · git · code · python' },
  { name: '/usr/lib', detail: 'library aplikasi' },
  { name: '/usr/share', detail: 'docs · icon · locale' },
  { name: '/opt', detail: 'aplikasi tambahan/vendor' },
]

export const FOLDER_SUMMARIES = [
  { path: '/home/adib', label: 'workspace & file pribadi', color: COLORS.HOME },
  { path: '/etc', label: 'konfigurasi sistem', color: COLORS.CONFIG },
  { path: '/var', label: 'log, cache, data berubah', color: COLORS.VARIABLE },
  { path: '/usr · /opt', label: 'program & resource aplikasi', color: COLORS.SUCCESS },
  { path: '/tmp', label: 'file kerja sementara', color: COLORS.TEMP },
]

export const PATH_EXAMPLES = [
  { path: '/home/adib/Projects/inventory-api/src/server.js', label: 'kode aplikasi developer', color: COLORS.HOME },
  { path: '/etc/nginx/nginx.conf', label: 'konfigurasi web server', color: COLORS.CONFIG },
  { path: '/usr/bin/node', label: 'program yang dipanggil terminal', color: COLORS.SUCCESS },
  { path: '/var/log/nginx/access.log', label: 'catatan request aplikasi', color: COLORS.VARIABLE },
  { path: '/tmp/vite-build-8192', label: 'hasil kerja sementara', color: COLORS.TEMP },
]

export const CAPTIONS = {
  FILE_SAVED: 'Home adalah workspace: proyek, unduhan, dokumen, dan video.',
  HOME_PATH_SHOWN: 'Masuk ke repo yang sama dari terminal.',
  ETC_COMPARE: 'Etc menyimpan aturan untuk layanan sistem.',
  ETC_ADMIN: 'Config sistem perlu izin admin.',
  VAR_GROW: 'Aplikasi berjalan menambah log dan cache.',
  TMP_APPEAR: 'Build dan preview singgah sebentar di tmp.',
  TMP_CLEARED: 'Simpan hasil penting kembali ke home.',
  PATH_BUILD: 'Setiap item punya alamat yang dapat dinavigasi.',
  PATH_DONE: 'Path menjelaskan lokasi file, config, dan program.',
  TAKEAWAY: 'Pahami fungsi folder sebelum mengubah isinya.',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  SNAP: { category: 'impacts', name: 'connector-snap' },
  TICK: { category: 'ui', name: 'tick' },
  ARRIVE: { category: 'ui', name: 'paper-arrive' },
  LOCK: { category: 'impacts', name: 'lock' },
  BEEP: { category: 'ui', name: 'beep-2' },
  CLEAR: { category: 'warnings', name: 'soft-deny' },
  PATH: { category: 'transitions', name: 'light-swoosh-quick' },
  SUCCESS: { category: 'success', name: 'ding' },
}
