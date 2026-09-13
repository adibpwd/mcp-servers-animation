// src/content/registry.js
// ─────────────────────────────────────────────────────────────
// Daftar semua content topics
// Tambah topic baru = tambah object baru ke array ini
//
// Topic yang sudah migrasi ke kontrak baru (punya manifest.js,
// lihat _docs/project/CONTENT_STANDARDIZATION_PLAN.md) membaca
// metadata via import + spread dari manifest-nya, alih-alih
// hardcode literal di sini. Topic lama TIDAK wajib ikut pola ini.
// ─────────────────────────────────────────────────────────────

import linuxVsUnixManifest from './12-linux-vs-unix/manifest.js'
import tailscaleManifest from './11-tailscale/manifest.js'
import containerDockerManifest from './10-container-docker/manifest.js'
import httpRequestResponseManifest from './14-http-request-response/manifest.js'
import dnsExplainedManifest from './13-dns-explained/manifest.js'
import asyncEventLoopManifest from './15-async-event-loop/manifest.js'
// import envVariablesManifest from './16-env-variables/manifest.js'  // DI-BACKUP (16-env-variables, lihat registry backup/2026-09-12-fix-16)
import restApiManifest from './17-rest-api/manifest.js'
import authManifest from './18-auth/manifest.js'
import httpsTlsManifest from './23-https-tls/manifest.js'
import oauth2DelegatedLoginManifest from './22-oauth2-delegated-login/manifest.js'
import registerManifest            from './19-register/manifest.js'
import emailVerificationManifest   from './20-email-verification/manifest.js'
import forgotPasswordManifest     from './21-forgot-password/manifest.js'
import linuxFilesystemManifest    from './25-linux-filesystem/manifest.js'
import terminalNavigationManifest from './26-terminal-navigation/manifest.js'

// ═══════════════════════════════════════════════════════════════
// ✅ FIRST PASS SELESAI — 19/20/21/24 rebuild penuh (timeline 4 Act,
// render JSX, scene-ui V1, pure inline SVG — tidak pakai icons/ folder,
// ala 17/18/22/23). 24-cors = 4 Act primer CORS (#FB923C). Ketiganya
// status coming-soon sampai preview manual & export MP4 lolos (lihat
// *_PLAN.md § Checklist Eksekusi).
// ═══════════════════════════════════════════════════════════════
import corsManifest                from './24-cors/manifest.js'
// ↑ 22-oauth2-delegated-login: first pass selesai (timeline 4 Act + render
// JSX, pure inline SVG — tidak pakai icons/ folder, sama seperti 17/18/23),
// belum preview manual & export MP4 (lihat
// 22-oauth2-delegated-login/_docs/OAUTH2_DELEGATED_LOGIN_PLAN.md §7).
// ↑ 18-auth: diaktifkan kembali (2026-09-12) — rebuild selesai first pass
// penuh (timeline 4 Act + render JSX). Status coming-soon sampai preview
// manual & export MP4 lolos (lihat 18-auth/_docs/AUTH_PLAN.md §13).
// ↑ 23-https-tls: first pass selesai (timeline 4 Act + render JSX), status
// coming-soon sampai preview manual & export MP4 lolos
// (lihat 23-https-tls/_docs/HTTPS_TLS_PLAN.md).

export const CONTENT_REGISTRY = [
  // ═══════════════════════════════════════════════════════════
  // ✅ READY
  // ═══════════════════════════════════════════════════════════

  {
    id:        'mcp-servers',
    title:     'MCP Servers',
    subtitle:  'How AI agents plug into your tools',
    category:  'AI Infrastructure',
    tags:      ['MCP', 'Protocol', 'Tools', 'AI'],
    color:     '#4ADE80',
    status:    'ready',
    component: () => import('./01-mcp-servers/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🔜 COMING SOON — Tier 1 (Orang Awam Friendly)
  // ═════════════════════════════════════════════════════════════

  {
    id:        'desktop-environment',
    title:     'Desktop Environment',
    subtitle:  'GNOME vs KDE vs XFCE vs i3 — which one for you?',
    category:  'Linux Basics',
    tags:      ['Desktop', 'GUI', 'Comparison', 'Beginner'],
    color:     '#60A5FA',
    status:    'ready',
    component: () => import('./02-desktop-environment/Animation'),
  },

  {
    id:        'linux-vs-windows',
    title:     'Linux vs Windows vs macOS',
    subtitle:  'Philosophy, architecture, and which one to pick',
    category:  'Operating Systems',
    tags:      ['OS', 'Comparison', 'Beginner', 'Cross-platform'],
    color:     '#F472B6',
    status:    'ready',
    component: () => import('./03-linux-vs-windows/Animation'),
  },

  {
    id:        'file-permission',
    title:     'Linux File Permission',
    subtitle:  'Understanding rwxrwxrwx and chmod explained',
    category:  'Linux Basics',
    tags:      ['Permission', 'chmod', 'Security', 'Beginner'],
    color:     '#FBBF24',
    status:    'ready',
    component: () => import('./04-file-permission/Animation'),
  },

  // ═════════════════════════════════════════════════════════════
  // 🔜 COMING SOON — Tier 2 (Beginner → Intermediate)
  // ═════════════════════════════════════════════════════════════

  {
    id:        'shell-pipeline',
    title:     'Shell Pipeline (|)',
    subtitle:  'How pipes connect commands — STDIN/STDOUT flow',
    category:  'Linux Fundamentals',
    tags:      ['Shell', 'Pipe', 'STDIN', 'STDOUT'],
    color:     '#34D399',
    status:    'coming-soon',
    component: () => import('./05-shell-pipeline/Animation'),
  },

  {
    id:        'what-is-kernel',
    title:     'What is Linux Kernel?',
    subtitle:  'ELI5: The core that manages everything',
    category:  'Linux Fundamentals',
    tags:      ['Kernel', 'Core', 'System', 'Beginner'],
    color:     '#A78BFA',
    status:    'coming-soon',
    component: () => import('./06-what-is-kernel/Animation'),
  },

  {
    id:        'process-vs-thread',
    title:     'Process vs Thread',
    subtitle:  'Memory isolation, context switching, and when to use each',
    category:  'Operating Systems',
    tags:      ['Process', 'Thread', 'Memory', 'Concurrency'],
    color:     '#FB923C',
    status:    'coming-soon',
    component: () => import('./07-process-vs-thread/Animation'),
  },

  // ═════════════════════════════════════════════════════════════
  // 🔜 COMING SOON — Tier 3 (Intermediate → Advanced)
  // ═════════════════════════════════════════════════════════════

  {
    id:        'linux-kernel-architecture',
    title:     'Linux Kernel Architecture',
    subtitle:  'User Space → Syscall → Kernel → Hardware layers explained',
    category:  'Linux Deep Dive',
    tags:      ['Kernel', 'Architecture', 'System', 'Intermediate'],
    color:     '#06B6D4',
    status:    'coming-soon',
    component: () => import('./08-linux-kernel-architecture/Animation'),
  },

  {
    id:        'virtual-memory',
    title:     'Virtual Memory Management',
    subtitle:  'RAM vs Disk swap, page tables, TLB, and paging explained',
    category:  'Linux Deep Dive',
    tags:      ['Memory', 'Virtual', 'Paging', 'Advanced'],
    color:     '#EC4899',
    status:    'ready',
    component: () => import('./09-virtual-memory/Animation'),
  },

  {
    ...containerDockerManifest,
    status:    'ready',
    component: () => import('./10-container-docker/Animation'),
  },

  // ═════════════════════════════════════════════════════════════
  // 🔜 COMING SOON — Tier 4 (Advanced / Specialist)
  // ═════════════════════════════════════════════════════════════

  // Uncomment when ready:
  // {
  //   id:        'systemd-architecture',
  //   title:     'systemd Architecture',
  //   subtitle:  'Boot → systemd → Services → User Apps flow',
  //   category:  'Linux Deep Dive',
  //   tags:      ['systemd', 'Boot', 'Services', 'Advanced'],
  //   color:     '#10B981',
  //   status:    'coming-soon',
  //   component: () => import('./systemd-architecture/Animation'),
  // },

  // {
  //   id:        'network-stack',
  //   title:     'Linux Network Stack',
  //   subtitle:  'TCP/IP layers, packet flow, and how networking works',
  //   category:  'Linux Deep Dive',
  //   tags:      ['Network', 'TCP/IP', 'Stack', 'Advanced'],
  //   color:     '#06B6D4',
  //   status:    'coming-soon',
  //   component: () => import('./network-stack/Animation'),
  // },

  // ═══════════════════════════════════════════════════════════
  // ✅ GIT & VERSION CONTROL (coming soon)
  // ═══════════════════════════════════════════════════════════
  // TODO: Implement git-version-control animation
  // {
  //   id:        'git-version-control',
  //   title:     'Git & Version Control',
  //   subtitle:  'Commits, branches, merging, and collaboration',
  //   category:  'Developer Tools',
  //   tags:      ['Git', 'Version Control', 'Collaboration', 'Development'],
  //   color:     '#F1502F',
  //   status:    'ready',
  //   component: () => import('./git/Animation'),
  // },

  // ═══════════════════════════════════════════════════════════
  // ✅ NEW TOPIC — migrasi ke kontrak baru (manifest.js)
  // ═══════════════════════════════════════════════════════════

  {
    ...tailscaleManifest,
    status:    'ready',
    component: () => import('./11-tailscale/Animation'),
  },

  {
    ...linuxVsUnixManifest,
    status:    'ready',
    component: () => import('./12-linux-vs-unix/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — status coming-soon sampai preview & export MP4
  // dicoba manual (lihat dns-explained/_docs/DNS_PLAN.md § Checklist)
  // ═══════════════════════════════════════════════════════════

  {
    ...dnsExplainedManifest,
    status:    'coming-soon',
    component: () => import('./13-dns-explained/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — Intro + Act 1 baru, Act 2–6 nyusul (lihat
  // http-request-response/_docs/HTTP_REQUEST_RESPONSE_PLAN.md)
  // ═══════════════════════════════════════════════════════════

  {
    ...httpRequestResponseManifest,
    status:    'coming-soon',
    component: () => import('./14-http-request-response/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — Intro + Act 1..5 first pass selesai, belum
  // preview manual & export MP4 (lihat
  // async-event-loop/_docs/PLAN-ASYNC-EVENT-LOOP.md §10 Checklist)
  // ═══════════════════════════════════════════════════════════

  {
    ...asyncEventLoopManifest,
    status:    'coming-soon',
    component: () => import('./15-async-event-loop/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 DI-BACKUP (16-env-variables) — tidak ditampilkan di registry
  // ═══════════════════════════════════════════════════════════

  // {
  //   ...envVariablesManifest,
  //   status:    'coming-soon',
  //   component: () => import('./16-env-variables/Animation'),
  // },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — Intro + Act 1..5 first pass selesai (pure SVG,
  // icon PNG belum di-generate), belum preview manual & export MP4
  // (lihat rest-api/_docs/REST_API_PLAN.md § Checklist Eksekusi)
  // ═══════════════════════════════════════════════════════════

  {
    ...restApiManifest,
    status:    'coming-soon',
    component: () => import('./17-rest-api/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — rebuild 18-auth selesai first pass (timeline 4 Act
  // + render JSX), belum preview manual & export MP4 (lihat
  // auth/_docs/AUTH_PLAN.md § Checklist Eksekusi)
  // ═══════════════════════════════════════════════════════════

  {
    ...authManifest,
    status:    'coming-soon',
    component: () => import('./18-auth/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — rebuild 23-https-tls selesai first pass (timeline
  // 4 Act + render JSX), belum preview manual & export MP4 (lihat
  // 23-https-tls/_docs/HTTPS_TLS_PLAN.md Checklist Eksekusi)
  // ═══════════════════════════════════════════════════════════

  {
    ...httpsTlsManifest,
    status:    'coming-soon',
    component: () => import('./23-https-tls/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — 22-oauth2-delegated-login first pass selesai
  // (timeline 4 Act + render JSX), belum preview manual & export MP4
  // (lihat 22-oauth2-delegated-login/_docs/OAUTH2_DELEGATED_LOGIN_PLAN.md
  // §7 Checklist Eksekusi)
  // ═══════════════════════════════════════════════════════════

  {
    ...oauth2DelegatedLoginManifest,
    status:    'coming-soon',
    component: () => import('./22-oauth2-delegated-login/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ FIRST PASS SELESAI — 19/20/21 rebuild penuh (timeline 4 Act +
  // render JSX, scene-ui V1), ≥ manifest.js utuh. Belum preview manual
  // & export MP4 (lihat *_PLAN.md § Checklist Eksekusi).
  // 19-register: datang/logo + detail, AXIS, warna pribadi.
  // 20-email-verification: email konfirmasi huruf lebar.
  // 21-forgot-password: reset pakai token one-time.
  // ═══════════════════════════════════════════════════════════

  {
    ...registerManifest,
    status:    'coming-soon',
    component: () => import('./19-register/Animation'),
  },

  {
    ...emailVerificationManifest,
    status:    'coming-soon',
    component: () => import('./20-email-verification/Animation'),
  },

  {
    ...forgotPasswordManifest,
    status:    'coming-soon',
    component: () => import('./21-forgot-password/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ FIRST PASS SELESAI — 24-cors rebuild penuh dari nol mengikuti
  // _docs/CORS_PLAN.md (2026-09-13), timeline 4 Act + render JSX.
  // Belum preview manual & export MP4 (lihat CORS_PLAN.md § Checklist
  // Eksekusi). Versi lama (pre-rebuild) diarsipkan di
  // _archive/backup-24-cors-20260913/, bukan basis rebuild ini.
  // ═══════════════════════════════════════════════════════════

  {
    ...corsManifest,
    status:    'coming-soon',
    component: () => import('./24-cors/Animation'),
  },

  {
    ...linuxFilesystemManifest,
    status:    'ready',
    component: () => import('./25-linux-filesystem/Animation'),
  },

  // ═══════════════════════════════════════════════════════════
  // 🚧 IN PROGRESS — 26-terminal-navigation first pass selesai
  // (timeline 4 Act + render JSX, scene-ui V1, pure inline SVG),
  // belum preview manual & export MP4 (lihat
  // 26-terminal-navigation/_docs/TERMINAL_NAVIGATION_PLAN.md § Checklist Eksekusi)
  // ═══════════════════════════════════════════════════════════

  {
    ...terminalNavigationManifest,
    status:    'coming-soon',
    component: () => import('./26-terminal-navigation/Animation'),
  },
]
