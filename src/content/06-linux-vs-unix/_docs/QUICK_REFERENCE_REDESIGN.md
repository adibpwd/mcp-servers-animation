# 🎯 Linux vs Unix Animation Redesign — Quick Reference

**Last Updated**: 2026-08-27 | **Status**: Phase 1-2A Complete

---

## 📍 File Locations

```
src/content/linux-vs-unix/
├── data-redesign.js              ✅ ALL CONSTANTS & PHASE DATA
├── Animation-redesign.jsx        ✅ PHASE 1-2A | 🔄 Phase 2B-4 READY
├── IMPLEMENTATION_GUIDE_REDESIGN.md  📖 DETAILED IMPLEMENTATION GUIDE
└── sfx-loader.js                 (unchanged)
```

---

## 🎬 The Narrative

```
🍳 PHASE 1: THE RECIPE (4.5s)
   Two chefs (Tux & BSD) get a recipe (POSIX Standard)
   → They both agree to follow it
   → But it's ambiguous in places...

⚙️ PHASE 2A: FILE PERMISSIONS (3.5s)
   Same file ownership task → Different interpretations
   • Linux: user/developers/755 (📖 open)
   • BSD: root/wheel/700 (🔐 locked)
   → Divergence detected!

🔊 PHASE 2B: SIGNAL HANDLING (3.0s)
   Same "terminate process" task → Different approaches
   • Linux: SIGTERM → graceful fade (👋)
   • BSD: SIGTERM → wait → SIGKILL (⚡)
   → Two valid philosophies!

🔗 PHASE 2C: SHELL BEHAVIOR (3.5s)
   Same pipeline: cat | grep | sort
   • Linux: rounded boxes, permissive (✨ fluid)
   • BSD: sharp boxes, strict (🛑 verify)
   → Philosophy embedded in code!

😱 PHASE 3: CONSEQUENCES (6.0s)
   Developer ships: chmod 755 config.sh
   • Linux ✓ (works)
   • BSD ✗ (Permission denied)
   → Same command, different result!

🌉 PHASE 4: THE BRIDGE (5.0s)
   Venn diagram: POSIX overlap is the safe zone
   • Shared tools: ls, grep, chmod, cat, pipes
   • Linux-only: systemd, /proc, ext attrs
   • BSD-only: jails, kqueue, rc.d
   → Write portable code in the overlap!
```

---

## 🎨 COLOR CODES

| Element | Hex | Used For |
|---------|-----|----------|
| Linux (Tux) | #06B6D4 | Primary color, energetic, open |
| Linux Dark | #0C4A6E | Secondary, grounded |
| Linux Accent | #10B981 | Growth, success |
| BSD | #D97706 | Primary color, traditional, strict |
| BSD Dark | #92400E | Secondary, solid |
| BSD Accent | #FCD34D | Gold, wisdom |
| Recipe BG | #FEF3C7 | Warm, inviting (kitchen theme) |
| Recipe Text | #78350F | Dark brown, readable |
| Conflict | #EF4444 | Red, divergence/error |
| Resolution | #8B5CF6 | Purple, harmony/solution |
| Success | #10B981 | Green, checkmark |
| Error | #EF4444 | Red, X/problem |
| Neutral | #6B7280 | Gray, informational |
| Text | #E5E7EB | Light gray, narrator |
| Secondary | #9CA3AF | Lighter gray, annotations |

---

## 🔊 SOUND EFFECTS MAP

| Event | SFX | Duration | Used In |
|-------|-----|----------|----------|
| Element appears | POP | 0.2s | Phase 1-4 |
| Transitions | WHOOSH | 0.4s | All transitions |
| Small beep | PLINK | 0.3s | Highlights, tools |
| Conflict/divergence | ERROR_BUZZ | 0.5s | Phase 2, 3 |
| Error occurs | ERROR_BEEP | 0.3s | Phase 3, 2B |
| Process signal | SIGNAL_SEND | 0.4s | Phase 2B |
| Success moment | SUCCESS_CHIME | 0.5s | Phase 4 |
| Finale | VICTORY_CHORD | 1.0s | Phase 4 |
| Screen interaction | TYPEWRITER | 0.8s | Phase 3 |
| Power on | LAPTOP_POWER | 0.6s | Phase 3 |

---

## ⏱️ TIMING CONSTANTS (from data-redesign.js)

```javascript
ANIMATION_TIMING = {
  MASTER_DURATION: 30,                    // Total animation
  LOOP_DELAY: 1.5,                        // Before repeat

  PHASE1_DURATION: 4.5,
  PHASE2A_DURATION: 3.5,
  PHASE2B_DURATION: 3.0,
  PHASE2C_DURATION: 3.5,
  PHASE3_DURATION: 6.0,
  PHASE4_DURATION: 5.0,

  CHARACTER_ENTRANCE_DURATION: 0.8,       // Scale 0→1
  CHARACTER_ENTRANCE_STAGGER: 0.3,        // Delay between chars

  RECIPE_SLIDE_DURATION: 0.6,
  RECIPE_GLOW_DURATION: 0.4,

  FILE_SPAWN_DURATION: 0.5,
  FILE_COMPARE_DURATION: 0.7,
  PERMISSION_CHANGE_DURATION: 0.6,

  PROCESS_SPIN_DURATION: 2.0,
  PROCESS_SIGNAL_DURATION: 0.5,
  PROCESS_EXIT_DURATION: 0.8,

  PIPELINE_FLOW_DURATION: 1.2,
  STAGE_STAGGER: 0.2,

  CIRCLE_DRAW_DURATION: 0.8,
  CIRCLE_STAGGER: 0.3,
  TOOL_APPEAR_DURATION: 0.4,
  TOOL_STAGGER: 0.15,
}
```

---

## 🎯 EASING FUNCTIONS

```javascript
EASING = {
  DEFAULT: 'power2.out',      // Standard smooth exit
  BOUNCY: 'back.out(1.7)',    // Character entrances
  SMOOTH: 'power3.inOut',     // Morphing/transitions
  DRAMATIC: 'back.inOut(1.5)', // Impactful moments
  SNAPPY: 'power4.out',        // Quick, punchy
}
```

---

## 🏗️ STATE STRUCTURE

Each phase has its own state object:

### Phase 1: Recipe
```javascript
{
  tuxOpacity, tuxScale,           // Tux character
  bsdOpacity, bsdScale,           // BSD character
  recipeOpacity, recipeScale,     // Recipe card
  recipeGlow,                     // Glow effect
  eyeGlowTux, eyeGlowBsd,        // Eye glows
  highlightIdx,                   // Current highlight (0-2)
}
```

### Phase 2A: Permissions
```javascript
{
  fileOpacity, fileScale,         // File representation
  linuxOpacity, linuxY,          // Linux approach (slides from bottom)
  bsdOpacity, bsdY,              // BSD approach (slides from top)
  permissionChangeProgress,       // 0-1 for mode change morph
  deltaOpacity, deltaY,          // "Divergence detected" label
}
```

### Phase 2B: Signals (Template)
```javascript
{
  processOpacity, processRotation, processScale, // Process circle
  signalSentTux, signalSentBsd,  // Boolean flags
  timelineProgress,               // 0-1 for both paths
  exitAnimationTux, exitAnimationBsd, // 0-1 for exits
}
```

### Phase 2C: Shell (Template)
```javascript
{
  commandOpacity,                 // Command text
  linuxPipelineProgress,          // 0-1 flow
  bsdPipelineProgress,            // 0-1 flow
  linuxStages: [0, 0, 0],        // Opacity for each stage
  bsdStages: [0, 0, 0],
  dataFlowProgress,               // 0-1 for data traveling
}
```

### Phase 3: Consequences (Template)
```javascript
{
  laptopOpacity, codeOpacity,     // Laptop screen
  splitProgress,                  // 0-1 split screen
  linuxSuccess, bsdError,         // 0-1 glow effects
  errorMessageY, errorMessageOpacity,
  shakeIntensity,                 // 0-10 for screen shake
}
```

### Phase 4: Resolution (Template)
```javascript
{
  circleAOpacity, circleBOpacity, // Venn diagram circles
  circleLabelOpacity,             // Circle labels
  posixTools: [0, 0, 0, 0, 0],   // 5 POSIX tools opacity
  linuxOnly: [0, 0, 0],          // 3 Linux tools opacity
  bsdOnly: [0, 0, 0],            // 3 BSD tools opacity
  characterReactionProgress,      // 0-1 for finale reactions
}
```

---

## 🖼️ SVG STRUCTURE

```jsx
<svg viewBox="0 0 1200 700">
  {/* PHASE 1: RECIPE SCENE */}
  <g className="phase-1-scene">
    <circle /> {/* Tux character */}
    <circle /> {/* BSD character */}
    <rect /> {/* Recipe card */}
    <text /> {/* Labels and captions */}
  </g>

  {/* PHASE 2A: PERMISSIONS SCENE */}
  <g className="phase-2a-scene">
    <rect /> {/* File */}
    <g> {/* Linux approach */}</g>
    <g> {/* BSD approach */}</g>
    <text /> {/* Delta label */}
  </g>

  {/* PHASE 2B: SIGNALS SCENE */}
  <g className="phase-2b-scene">
    <circle /> {/* Process spinner */}
    <line /> {/* Timeline */}
    <circle /> {/* Path indicators */}
  </g>

  {/* PHASE 2C: SHELL SCENE */}
  <g className="phase-2c-scene">
    <text /> {/* Command */}
    <g> {/* Linux pipeline */}</g>
    <g> {/* BSD pipeline */}</g>
  </g>

  {/* PHASE 3: CONSEQUENCES SCENE */}
  <g className="phase-3-scene">
    <rect /> {/* Laptop screen */}
    <text /> {/* Code */}
    <g> {/* Linux execution */}</g>
    <g> {/* BSD execution */}</g>
    <text /> {/* Error message */}
  </g>

  {/* PHASE 4: RESOLUTION SCENE */}
  <g className="phase-4-scene">
    <circle /> {/* Venn circle A (Linux) */}
    <circle /> {/* Venn circle B (BSD) */}
    <g> {/* POSIX tools */}</g>
    <g> {/* Linux-only tools */}</g>
    <g> {/* BSD-only tools */}</g>
  </g>

  {/* FILTERS */}
  <defs>
    <filter id="glow"> ... </filter>
  </defs>
</svg>
```

---

## 📋 PHASE DATA OBJECTS

### PHASE_RECIPE
```javascript
{
  title: 'Two chefs stand in a kitchen',
  sceneDescription: 'Warm, inviting kitchen...',
  dialogues: [...],
  tuxPosition: { x, y },
  bsdPosition: { x, y },
  recipePosition: { x, y },
  keyHighlights: ['File permissions', 'Signal handling', 'Utilities'],
}
```

### PHASE_PERMISSIONS
```javascript
{
  title: 'File Permissions Interpretation',
  taskDescription: '"Arrange file ownership"',
  linux: {
    filename: 'script.sh',
    owner: 'user',
    group: 'developers',
    mode: '755',
    emoji: '📖',
    explanation: 'Readable by all',
    color: COLORS.TUX_PRIMARY,
    philosophy: 'Community-focused',
  },
  bsd: { /* same structure but different values */ },
  dialogues: [...],
}
```

---

## 🔧 COMMON PATTERNS

### Animate Opacity + Scale (Character Entrance)
```javascript
master.to(
  { scale: 0, opacity: 0 },
  {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    ease: 'back.out(1.7)',
    onUpdate(anim) {
      setState(prev => ({
        ...prev,
        scale: anim.targets()[0].scale,
        opacity: anim.targets()[0].opacity,
      }))
    },
  },
  startTime
)
```

### Staggered Animation (Multiple Objects)
```javascript
master.to(..., phase1_start)
master.to(..., phase1_start + 0.3)  // Stagger by 0.3s
master.to(..., phase1_start + 0.6)  // +0.3s more
```

### Progress-Based Animation (0-1)
```javascript
master.to(
  { progress: 0 },
  {
    progress: 1,
    duration: 2.0,
    onUpdate(anim) {
      setState(prev => ({
        ...prev,
        progress: anim.targets()[0].progress,
      }))
    },
  },
  startTime
)
```

### Conditional SFX Integration
```javascript
if (previewSfx && audioUnlocked) {
  master.add(
    () => sfxLoader.play(SFX_MAP.POP.name, volume),
    startTime + 0.3
  )
}
```

---

## ✅ CHECKLIST FOR COMPLETING PHASES 2B-4

### Phase 2B: Signal Handling
- [ ] Process spinning circle animation
- [ ] Tux signal timeline (SIGTERM)
- [ ] BSD signal timeline (SIGTERM + SIGKILL)
- [ ] Exit animations (smooth vs crash)
- [ ] Timeline visualization
- [ ] SFX integration (SIGNAL_SEND, ERROR_BEEP)
- [ ] SVG elements

### Phase 2C: Shell Behavior
- [ ] Command text display
- [ ] Linux pipeline stages (rounded)
- [ ] BSD pipeline stages (sharp)
- [ ] Data flow animation
- [ ] Stage stagger timing
- [ ] Error handling visualization
- [ ] SFX integration (PLINK, WHOOSH)
- [ ] SVG elements

### Phase 3: Consequences
- [ ] Laptop screen appearance
- [ ] Code snippet display
- [ ] Split screen effect
- [ ] Linux success glow
- [ ] BSD error glow
- [ ] Error message animation
- [ ] Screen shake effect
- [ ] SFX integration (LAPTOP_POWER, ERROR_BEEP, ALERT)
- [ ] SVG elements

### Phase 4: Resolution
- [ ] Venn diagram circle A
- [ ] Venn diagram circle B
- [ ] Circle labels
- [ ] POSIX tools population (5 tools)
- [ ] Linux-only tools (3 tools)
- [ ] BSD-only tools (3 tools)
- [ ] Character dialogue display
- [ ] Finale reactions
- [ ] SFX integration (WHOOSH, PLINK, SUCCESS_CHIME, VICTORY)
- [ ] SVG elements

---

## 🧪 TESTING COMMANDS

```bash
# Start dev server
npm run dev

# Check animation timing
# Open browser devtools → Performance tab
# Record 30-second animation
# Verify frame rate ≥ 50fps

# Test on mobile
# Use Chrome DevTools device emulation
# Check responsive behavior

# Test SFX
# Set audioUnlocked=true in component props
# Verify all sounds play in sync
```

---

## 📚 DOCUMENTATION MAP

| Document | Purpose |
|----------|---------|
| `data-redesign.js` | All constants, colors, phase data |
| `Animation-redesign.jsx` | Main animation component |
| `IMPLEMENTATION_GUIDE_REDESIGN.md` | Detailed implementation with code templates |
| `REDESIGN_IMPLEMENTATION_SUMMARY.md` | High-level overview and status |
| `QUICK_REFERENCE_REDESIGN.md` | This file (quick lookup) |

---

**Next Developer Starting Point**:
1. Read this file (you are here!)
2. Review `REDESIGN_IMPLEMENTATION_SUMMARY.md` for overview
3. Reference `data-redesign.js` for constants
4. Follow templates in `IMPLEMENTATION_GUIDE_REDESIGN.md`
5. Implement phases 2B-4 in `Animation-redesign.jsx`

---

**Questions?** → Check `IMPLEMENTATION_GUIDE_REDESIGN.md` section "HOW TO CONTINUE IMPLEMENTATION"