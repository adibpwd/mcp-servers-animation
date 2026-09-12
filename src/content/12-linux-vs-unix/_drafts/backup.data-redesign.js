// ═══════════════════════════════════════════════════════════════════════════════════════════
// src/content/linux-vs-unix/data-redesign.js
// ─────────────────────────────────────────────────────────────────────────────────────────
// Linux vs Unix - REDESIGNED DATA & CONSTANTS
// Protocol Conflict Narrative: Recipe → Interpretation → Consequences → Bridge
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const VW = 1200
export const VH = 700

// ═══════════════════════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Tux (Linux)
  TUX_PRIMARY: '#06B6D4',      // Cyan, energetic
  TUX_SECONDARY: '#0C4A6E',    // Dark blue, grounded
  TUX_ACCENT: '#10B981',       // Green, growth

  // BSD Daemon
  BSD_PRIMARY: '#D97706',      // Amber, traditional
  BSD_SECONDARY: '#92400E',    // Dark brown, solid
  BSD_ACCENT: '#FCD34D',       // Gold, wisdom

  // Metaphorical
  RECIPE_BG: '#FEF3C7',        // Warm cream, inviting
  RECIPE_TEXT: '#78350F',      // Dark brown, readable
  CONFLICT_ZONE: '#EF4444',    // Red, divergence
  RESOLUTION_ZONE: '#8B5CF6',  // Purple, harmony

  // Status
  SUCCESS: '#10B981',          // Green checkmark
  ERROR: '#EF4444',            // Red X
  NEUTRAL: '#6B7280',          // Gray, informational

  // Text
  NARRATOR: '#E5E7EB',         // Light gray
  SECONDARY_TEXT: '#9CA3AF',   // Lighter gray
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// CHARACTER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const CHARACTERS = {
  TUX: {
    id: 'tux',
    name: 'Tux',
    emoji: '🐧',
    color: COLORS.TUX_PRIMARY,
    colorSecondary: COLORS.TUX_SECONDARY,
    approach: 'Energetic, flexible, community-focused',
    philosophy: 'Sharing is good!',
  },
  BSD: {
    id: 'bsd',
    name: 'BSD Daemon',
    emoji: '👹',
    color: COLORS.BSD_PRIMARY,
    colorSecondary: COLORS.BSD_SECONDARY,
    approach: 'Formal, strict, security-first',
    philosophy: 'Security first!',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASES CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASES = [
  {
    id: 'recipe',
    title: 'THE RECIPE',
    badge: 'PHASE 1: SETUP',
    badgeColor: COLORS.TUX_PRIMARY,
    duration: 4.5,
    description: 'Two systems. One blueprint. Different interpretations.',
  },
  {
    id: 'permissions',
    title: 'FILE PERMISSIONS',
    badge: 'PHASE 2A: CONFLICT',
    badgeColor: COLORS.CONFLICT_ZONE,
    duration: 3.5,
    description: 'Both valid. The recipe doesn\'t specify.',
  },
  {
    id: 'signals',
    title: 'SIGNAL HANDLING',
    badge: 'PHASE 2B: CONFLICT',
    badgeColor: COLORS.CONFLICT_ZONE,
    duration: 3.0,
    description: 'Different philosophies. Same standard.',
  },
  {
    id: 'shell',
    title: 'SHELL BEHAVIOR',
    badge: 'PHASE 2C: CONFLICT',
    badgeColor: COLORS.CONFLICT_ZONE,
    duration: 3.5,
    description: 'Philosophy embedded in implementation.',
  },
  {
    id: 'consequences',
    title: 'REAL-WORLD IMPACT',
    badge: 'PHASE 3: REALIZATION',
    badgeColor: COLORS.ERROR,
    duration: 6.0,
    description: 'Same command, different result. This is why portability is hard.',
  },
  {
    id: 'resolution',
    title: 'THE BRIDGE',
    badge: 'PHASE 4: RESOLUTION',
    badgeColor: COLORS.RESOLUTION_ZONE,
    duration: 5.0,
    description: 'Different implementations, same foundation. That\'s Unix.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 1: RECIPE SETUP
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_RECIPE = {
  title: 'Two chefs stand in a kitchen',
  sceneDescription: 'Warm, inviting kitchen with recipe card glowing between them',
  dialogues: [
    { speaker: 'narrator', text: 'Two systems. One blueprint. Different interpretations.' },
    { speaker: 'tux', text: 'I\'ll follow this recipe!' },
    { speaker: 'bsd', text: 'As will I. Let us begin.' },
    { speaker: 'narrator', text: 'But the recipe was written in 1988. Ambiguous in places.' },
  ],
  // Character positions
  tuxPosition: { x: 200, y: 350 },
  bsdPosition: { x: 1000, y: 350 },
  recipePosition: { x: 600, y: 280 },
  // Animation elements
  keyHighlights: [
    'File permissions system',
    'Signal handling',
    'Standard utilities',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 2A: FILE PERMISSIONS
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_PERMISSIONS = {
  title: 'File Permissions Interpretation',
  taskDescription: '"Arrange file ownership" (from recipe)',
  
  // Linux approach
  linux: {
    filename: 'script.sh',
    owner: 'user',
    group: 'developers',
    mode: '755',
    emoji: '📖',
    explanation: 'Readable by all - sharing is good!',
    color: COLORS.TUX_PRIMARY,
    philosophy: 'Community-focused, accessible',
  },
  
  // BSD approach
  bsd: {
    filename: 'script.sh',
    owner: 'root',
    group: 'wheel',
    mode: '700',
    emoji: '🔐',
    explanation: 'Owner only - security first!',
    color: COLORS.BSD_PRIMARY,
    philosophy: 'Security-first, restricted',
  },
  
  // Dialogue
  dialogues: [
    { speaker: 'narrator', text: 'Take file permissions. The recipe says "arrange ownership and access."' },
    { speaker: 'tux', text: 'I\'ll make files readable by the group - sharing is good!' },
    { speaker: 'bsd', text: 'I\'ll keep them private by default - security first!' },
    { speaker: 'narrator', text: 'Both are valid. The recipe doesn\'t specify.' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 2B: SIGNAL HANDLING
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_SIGNALS = {
  title: 'Signal Handling Interpretation',
  taskDescription: '"Handle process interruption" (from recipe)',
  
  // Linux approach
  linux: {
    processName: 'web-server',
    approach: 'SIGTERM → graceful exit',
    animation: 'smooth-fade',
    emoji: '👋',
    explanation: 'Wave goodbye, let it clean up',
    color: COLORS.TUX_PRIMARY,
    philosophy: 'Graceful, flexible',
  },
  
  // BSD approach
  bsd: {
    processName: 'web-server',
    approach: 'SIGTERM → wait → SIGKILL if needed',
    animation: 'escalation',
    emoji: '⚡',
    explanation: 'Wait, then escalate if ignored',
    color: COLORS.BSD_PRIMARY,
    philosophy: 'Decisive, guaranteed termination',
  },
  
  // Dialogue
  dialogues: [
    { speaker: 'narrator', text: 'The recipe says "terminate a process." But HOW?' },
    { speaker: 'tux', text: 'I\'ll send SIGTERM and let it clean up...' },
    { speaker: 'bsd', text: 'I\'ll wait. If it ignores me, I\'ll escalate to SIGKILL.' },
    { speaker: 'narrator', text: 'Different philosophies. Same standard.' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 2C: SHELL BEHAVIOR
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_SHELL = {
  title: 'Shell Pipeline Interpretation',
  taskDescription: '"Execute a command pipeline" (from recipe)',
  
  command: 'cat file.txt | grep pattern | sort',
  
  // Linux approach
  linux: {
    stages: ['cat', 'grep', 'sort'],
    boxStyle: 'rounded',
    errorHandling: 'permissive',
    emoji: '✨',
    explanation: 'Fluid, flexible - continue if step fails',
    color: COLORS.TUX_PRIMARY,
    philosophy: 'Best-effort execution',
  },
  
  // BSD approach
  bsd: {
    stages: ['cat', 'grep', 'sort'],
    boxStyle: 'sharp',
    errorHandling: 'strict',
    emoji: '🛑',
    explanation: 'Halt and verify - stop on first failure',
    color: COLORS.BSD_PRIMARY,
    philosophy: 'Fail-fast verification',
  },
  
  // Dialogue
  dialogues: [
    { speaker: 'narrator', text: 'Pipelines. A Unix superpower.' },
    { speaker: 'tux', text: 'I\'ll pass data between steps. If one fails, the others continue.' },
    { speaker: 'bsd', text: 'I\'ll verify each step. One failure stops the entire pipeline.' },
    { speaker: 'narrator', text: 'Philosophy embedded in implementation.' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 3: CONSEQUENCES
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_CONSEQUENCES = {
  title: 'Real-World Impact',
  sceneDescription: 'Developer expects portable code, but it breaks',
  
  scenario: {
    code: 'chmod 755 config.sh',
    expectation: 'Should work on any Unix system!',
    outcome: 'Permission denied on BSD',
    errorMsg: 'ERROR: Permission denied: config.sh',
  },
  
  explanation: {
    linux: 'chmod 755 makes it group-readable',
    bsd: 'Group permissions inherited differently',
    conclusion: 'Same command, different result. This is why portability is hard.',
  },
  
  dialogues: [
    { speaker: 'narrator', text: 'A developer ships code expecting POSIX compliance.' },
    { speaker: 'developer', text: 'This should work on any Unix system!' },
    { speaker: 'narrator', text: 'On Linux: works fine ✓' },
    { speaker: 'narrator', text: 'On BSD: Permission denied ✗' },
    { speaker: 'narrator', text: 'Same command, different result. This is why portability is hard.' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// PHASE 4: RESOLUTION - VENN DIAGRAM DATA
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const PHASE_RESOLUTION = {
  title: 'How Developers Write Portable Code',
  sceneDescription: 'Venn diagram showing POSIX overlap and safe zone',
  
  vennDiagram: {
    circleA: { name: 'Linux', color: COLORS.TUX_PRIMARY },
    circleB: { name: 'BSD', color: COLORS.BSD_PRIMARY },
    overlap: { name: 'POSIX Compliance', color: COLORS.RESOLUTION_ZONE },
  },
  
  // Tools in the safe zone (POSIX)
  posixTools: [
    { tool: 'ls', emoji: '📄', description: 'List files' },
    { tool: 'grep', emoji: '🔍', description: 'Pattern matching' },
    { tool: 'chmod', emoji: '🔐', description: 'Permissions' },
    { tool: 'cat', emoji: '📖', description: 'File content' },
    { tool: 'pipes', emoji: '🔗', description: 'Data flow' },
  ],
  
  // Linux-specific (outside POSIX)
  linuxOnly: [
    { tool: 'systemd', description: 'Init system' },
    { tool: '/proc', description: 'Filesystem' },
    { tool: 'Extended attributes', description: 'Metadata' },
  ],
  
  // BSD-specific (outside POSIX)
  bsdOnly: [
    { tool: 'jails', description: 'Containers' },
    { tool: 'kqueue', description: 'Event handling' },
    { tool: 'rc.d', description: 'Boot system' },
  ],
  
  // Dialogue
  dialogues: [
    { speaker: 'narrator', text: 'POSIX is the safe zone. Write your code here, and it works everywhere.' },
    { speaker: 'narrator', text: 'Venture outside, and you\'re betting on a specific OS.' },
    { speaker: 'tux', text: 'We\'re more alike than different.' },
    { speaker: 'bsd', text: 'Indeed. POSIX is our common language.' },
    { speaker: 'narrator', text: 'Different implementations, same foundation. That\'s Unix.' },
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// ANIMATION TIMING & EASING
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const ANIMATION_TIMING = {
  // Global
  MASTER_DURATION: 30, // seconds
  LOOP_DELAY: 1.5,

  // Phase-specific
  PHASE1_DURATION: 4.5,
  PHASE2A_DURATION: 3.5,
  PHASE2B_DURATION: 3.0,
  PHASE2C_DURATION: 3.5,
  PHASE3_DURATION: 6.0,
  PHASE4_DURATION: 5.0,

  // Character entrance
  CHARACTER_ENTRANCE_DURATION: 0.8,
  CHARACTER_ENTRANCE_STAGGER: 0.3,

  // Recipe card
  RECIPE_SLIDE_DURATION: 0.6,
  RECIPE_GLOW_DURATION: 0.4,

  // File comparison
  FILE_SPAWN_DURATION: 0.5,
  FILE_COMPARE_DURATION: 0.7,
  PERMISSION_CHANGE_DURATION: 0.6,

  // Process animation
  PROCESS_SPIN_DURATION: 2.0,
  PROCESS_SIGNAL_DURATION: 0.5,
  PROCESS_EXIT_DURATION: 0.8,

  // Pipeline
  PIPELINE_FLOW_DURATION: 1.2,
  STAGE_STAGGER: 0.2,

  // Venn diagram
  CIRCLE_DRAW_DURATION: 0.8,
  CIRCLE_STAGGER: 0.3,
  TOOL_APPEAR_DURATION: 0.4,
  TOOL_STAGGER: 0.15,
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS (GSAP notation)
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const EASING = {
  DEFAULT: 'power2.out',
  BOUNCY: 'back.out(1.7)',
  SMOOTH: 'power3.inOut',
  DRAMATIC: 'back.inOut(1.5)',
  SNAPPY: 'power4.out',
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// SOUND EFFECTS MAPPING
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const SFX_MAP = {
  // UI sounds
  POP: { category: 'ui', name: 'pop', duration: 0.2 },
  PLINK: { category: 'ui', name: 'plink', duration: 0.3 },
  WHOOSH: { category: 'transitions', name: 'whoosh', duration: 0.4 },
  SLIDE_IN: { category: 'transitions', name: 'slide-in', duration: 0.5 },

  // Warning/Error
  ALERT_PULSE: { category: 'warnings', name: 'alert-pulse', duration: 0.6 },
  ERROR_BEEP: { category: 'warnings', name: 'error-beep', duration: 0.3 },
  ERROR_BUZZ: { category: 'warnings', name: 'error-buzz', duration: 0.5 },

  // Success
  SUCCESS_CHIME: { category: 'success', name: 'success-chime', duration: 0.5 },
  CONFIRM_SOFT: { category: 'success', name: 'confirm-soft', duration: 0.4 },
  VICTORY_CHORD: { category: 'success', name: 'victory-chord', duration: 1.0 },

  // Character
  TAP_CHIN: { category: 'character', name: 'tap-chin', duration: 0.3 },
  SIGNAL_SEND: { category: 'character', name: 'signal-send', duration: 0.4 },

  // Hardware
  TYPEWRITER: { category: 'hardware', name: 'typewriter', duration: 0.8 },
  LAPTOP_POWER: { category: 'hardware', name: 'laptop-power-on', duration: 0.6 },
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// DIALOGUE NARRATOR SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════════════════

export const NARRATOR = {
  name: 'Narrator',
  voice: 'calm, educational, patient',
  speed: 'measured pace',
  color: COLORS.NARRATOR,
  fontSize: 18,
}

export const CHARACTER_DIALOGUE = {
  fontSize: 14,
  fontFamily: 'monospace',
}

export const ANNOTATIONS = {
  fontSize: 12,
  color: COLORS.SECONDARY_TEXT,
}