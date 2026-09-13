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
  CYAN: '#38BDF8',
  EMERALD: '#34D399',
  AMBER: '#FBBF24',
  PURPLE: '#A78BFA',
  ROSE: '#F43F5E',
  PROMPT: '#10B981',
  CMD: '#38BDF8',
  PATH: '#F59E0B',
}

export const PHASES = [
  { id: 'pwd', badge: 'ACT 1 — PWD: TAHU LOKASI SAAT INI', badgeColor: COLORS.CYAN, duration: 8.5 },
  { id: 'ls', badge: 'ACT 2 — LS: LIHAT ISI FOLDER', badgeColor: COLORS.EMERALD, duration: 10.0 },
  { id: 'cd', badge: 'ACT 3 — CD: BERPINDAH RUANG', badgeColor: COLORS.PURPLE, duration: 10.5 },
  { id: 'path', badge: 'ACT 4 — PATH ABSOLUT VS RELATIF', badgeColor: COLORS.AMBER, duration: 10.0 },
]

export const INTRO_CATEGORY_LABEL = 'LINUX FUNDAMENTALS'
export const INTRO_DOMAIN = 'ADIB-DEV.COM'
export const INTRO_TITLE_A = 'TERMINAL '
export const INTRO_TITLE_B = 'NAVIGATION'
export const INTRO_SUBTITLE = 'Tahu lokasi, lihat isi, lalu berpindah'

export const LABELS = {
  ACT1_CMD: 'pwd',
  ACT1_OUT: '/home/adib',
  ACT2_CMD: 'ls',
  ACT2_OUT: 'docs/  projects/  notes.txt',
  ACT3_CMD1: 'cd projects',
  ACT3_OUT1: '/home/adib/projects',
  ACT3_CMD2: 'cd ..',
  ACT3_OUT2: '/home/adib',
  ACT4_ABS_CMD: 'cd /home/adib/projects',
  ACT4_REL_CMD: 'cd projects',
}

export const CAPTIONS = {
  PWD_START: 'pwd: Print Working Directory',
  PWD_EXPLAIN: 'Menunjukkan lokasi folder tempat kamu berdiri',
  LS_START: 'ls: List directory contents',
  LS_EXPLAIN: 'Menampilkan daftar file dan folder di lokasi ini',
  CD_START: 'cd: Change Directory',
  CD_EXPLAIN: 'Masuk ke folder atau kembali ke atas dengan cd ..',
  PATH_START: 'Path Absolut vs Relatif',
  PATH_EXPLAIN: 'Absolut diawali slash /, relatif dari posisi sekarang',
  SUMMARY: '3 perintah dasar untuk menguasai navigasi terminal',
}

export const SFX_MAP = {
  SHIMMER: { category: 'success', name: 'shimmer' },
  POP: { category: 'ui', name: 'pop' },
  POP2: { category: 'ui', name: 'pop-2' },
  SNAP: { category: 'impacts', name: 'connector-snap' },
  TICK: { category: 'ui', name: 'tick' },
  TYPE: { category: 'ui', name: 'typewriter' },
  SWOOSH: { category: 'transitions', name: 'light-swoosh-quick' },
  SUCCESS: { category: 'success', name: 'ding' },
}
