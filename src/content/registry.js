// src/content/registry.js
// ─────────────────────────────────────────────────────────────
// Daftar semua content topics
// Tambah topic baru = tambah object baru ke array ini
// ─────────────────────────────────────────────────────────────

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
    component: () => import('./mcp-servers/Animation'),
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
    component: () => import('./desktop-environment/Animation'),
  },

  {
    id:        'linux-vs-windows',
    title:     'Linux vs Windows vs macOS',
    subtitle:  'Philosophy, architecture, and which one to pick',
    category:  'Operating Systems',
    tags:      ['OS', 'Comparison', 'Beginner', 'Cross-platform'],
    color:     '#F472B6',
    status:    'ready',
    component: () => import('./linux-vs-windows/Animation'),
  },

  {
    id:        'file-permission',
    title:     'Linux File Permission',
    subtitle:  'Understanding rwxrwxrwx and chmod explained',
    category:  'Linux Basics',
    tags:      ['Permission', 'chmod', 'Security', 'Beginner'],
    color:     '#FBBF24',
    status:    'ready',
    component: () => import('./file-permission/Animation'),
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
    component: () => import('./shell-pipeline/Animation'),
  },

  {
    id:        'what-is-kernel',
    title:     'What is Linux Kernel?',
    subtitle:  'ELI5: The core that manages everything',
    category:  'Linux Fundamentals',
    tags:      ['Kernel', 'Core', 'System', 'Beginner'],
    color:     '#A78BFA',
    status:    'coming-soon',
    component: () => import('./what-is-kernel/Animation'),
  },

  {
    id:        'process-vs-thread',
    title:     'Process vs Thread',
    subtitle:  'Memory isolation, context switching, and when to use each',
    category:  'Operating Systems',
    tags:      ['Process', 'Thread', 'Memory', 'Concurrency'],
    color:     '#FB923C',
    status:    'coming-soon',
    component: () => import('./process-vs-thread/Animation'),
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
    component: () => import('./linux-kernel-architecture/Animation'),
  },

  {
    id:        'virtual-memory',
    title:     'Virtual Memory Management',
    subtitle:  'RAM vs Disk swap, page tables, TLB, and paging explained',
    category:  'Linux Deep Dive',
    tags:      ['Memory', 'Virtual', 'Paging', 'Advanced'],
    color:     '#EC4899',
    status:    'ready',
    component: () => import('./virtual-memory/Animation'),
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
  //   id:        'container-docker',
  //   title:     'Container/Docker Architecture',
  //   subtitle:  'Namespaces, Cgroups, and how containers work',
  //   category:  'Linux Deep Dive',
  //   tags:      ['Docker', 'Container', 'Namespaces', 'Advanced'],
  //   color:     '#0EA5E9',
  //   status:    'coming-soon',
  //   component: () => import('./container-docker/Animation'),
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
  // ✅ NEW TOPIC
  // ═══════════════════════════════════════════════════════════

  {
    id:        'linux-vs-unix',
    title:     'Linux vs Unix',
    subtitle:  'From AT&T Bell Labs to modern ecosystems',
    category:  'Operating Systems',
    tags:      ['Linux', 'Unix', 'BSD', 'macOS', 'Windows'],
    color:     '#06B6D4',
    status:    'ready',
    component: () => import('./linux-vs-unix/Animation'),
  },
]
