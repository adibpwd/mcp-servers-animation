# Linux vs Unix — Topic Plan

## Overview

Animasi narrative-driven: keluarga Unix/Linux, Windows yang diusir lalu nyambung lagi via WSL.
Scope: 3 phase + outro. Playful, brand-heavy, edukatif.

**Canvas:** 820 × 1340 (portrait 9:16)
**Difficulty:** ⭐⭐
**Estimasi:** 2-3 hari kerja

---

## Color Palette

```
Primary:    #06B6D4
Secondary:  #0891B2
Accent:     #22D3EE
Unix tint:  #F97316 (warm)
Linux tint: #22D3EE (cyan)
Windows:    #3B82F6 (blue)
```

---

## Animation Breakdown

---

### Phase 1 — THE UNIX FAMILY DRAMA (12 detik)

**Badge:** "UNIX FAMILY" (cyan badge atas)
**Caption:** "From one kernel to an ecosystem"

#### Beat 1 — The Family Portrait (0–3s)

**Tujuan:** Establish the "POSIX family" — semua OS yang based on Unix/Linux, terlihat kompak.

**Layout:**
```
              ╭─── POSIX HUB ───╮
              │    (center hub)  │
              ╰─────────────────╯
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ╭────┴────╮  ╭────┴────╮  ╭────┴────╮
   │  UNIX   │  │  LINUX  │  │ ???     │
   │ FAMILY  │  │ FAMILY  │  │ (Windows)│
   ╰─────────╯  ╰─────────╯  ╰─────────╯
```

**Elements (animated masuk 1-1):**

| Element | Size | Color | Label | Position |
|---------|------|-------|-------|----------|
| **macOS** | **XL** (120px) | `#9CA3AF` | "macOS" | Unix cluster, top-left |
| **Android** | **XL** (120px) | `#3DDC84` | "Android" | Linux cluster, top-right |
| **Ubuntu** | **L** (90px) | `#E95420` | "Ubuntu" | Linux cluster, center-right |
| **Solaris** | **S** (50px) | `#EF4444` | "Solaris" | Unix cluster, small |
| **AIX** | **S** (50px) | `#3B82F6` | "AIX" | Unix cluster, small |
| **HP-UX** | **S** (50px) | `#8B5CF6` | "HP-UX" | Unix cluster, small |
| **Fedora** | **S** (50px) | `#3C6EB4` | "Fedora" | Linux cluster, small |
| **Arch** | **S** (50px) | `#1793D1` | "Arch" | Linux cluster, small |
| **FreeBSD** | **XS** (40px) | `#AB2B28` | "FreeBSD" | Unix cluster, tiny |
| **Windows** | **M** (70px) | `#3B82F6` | "Windows ?" | **TENGAH**, di antara dua cluster |

**Animasi Beat 1:**
1. POSIX hub muncul dulu (glowing cyan circle, label "POSIX")
2. Unix family cluster muncul dari kiri → connector lines ke POSIX hub
3. Linux family cluster muncul dari kanan → connector lines ke POSIX hub
4. **macOS & Android muncul duluan, lebih besar, dengan glow effect** — biar langsung eye-catching
5. Small variants muncul belakangan, lebih kecil, lebih pelan
6. Windows muncul terakhir, di tengah, ada **question mark** "?" di atasnya, connector-nya putus-putus (belom nyambung)
7. Glow dots bergerak di connector lines → semua terhubung ke POSIX

**Key visual:** Semua saling kenal, kompak, satu keluarga. Windows agak ragu-ragu di tengah.

---

#### Beat 2 — The Expulsion (3–6s)

**Tujuan:** Windows coba connect ke POSIX → gagal → didorong keluar.

**Animasi Beat 2:**
1. Windows coba narik connector ke POSIX hub
2. **SNAP!** Connector putus (animated break effect — spark particles)
3. Unix family (terutama macOS XL) marah → dorong Windows
4. **Windows wobble & fly ke pojok kanan bawah** (playful physics — bounce, rotation)
5. Windows jatuh ke pojok, goyang-goyang sebentar, lalu diam
6. Label muncul di Windows: "NOT UNIX" (merah, crossed out)
7. POSIX hub + Unix/Linux families "menutup" — connector lines redraw tanpa Windows
8. **Glow dots berhenti** di area Windows → represent isolasi

**Key visual:** Playful, tidak agresif. Windows kayak ditendang keluar dari grup foto. Bisa pakai metaphor "dorong keluar dari圈".

**Physics notes:**
- Windows icon: `gsap.to` dengan `rotation: 15, yoyo: true, repeat: 2` (wobble)
- Fly out: `gsap.to` dengan `x: 350, y: 400, rotation: -20, duration: 0.6, ease: "back.out(1.7)"`
- Bounce: `gsap.to` dengan `y: "+=10", yoyo: true, repeat: 3, duration: 0.15`

---

#### Beat 3 — The Loneliness (6–9s)

**Tujuan:** Windows sendirian di pojok, bikin rumah sendiri, tapi kesepian.

**Layout update:**
```
  ╭──────╮     ╭──────╮
  │ UNIX │     │LINUX │     (keluarga tetap kompak di atas)
  │macOS │     │Android│
  │Solaris│    │Ubuntu │
  ╰──────╯     ╰──────╯

                              ╭─────────────╮
                              │   Windows   │  (pojok kanan bawah)
                              │  NT Kernel  │
                              │  Alone...   │
                              ╰─────────────╯
```

**Animasi Beat 3:**
1. Windows di pojok, sendirian
2. Windows build rumah kecil: label "NT Kernel" muncul (building animation — bricks appear 1-1)
3. Windows icon sedih (bisa pakai simple sad face emoji atau position drop)
4. **Thought bubble** muncul di atas Windows: "aku butuh teman..." atau "need Linux?"
5. Bubble bergetar pelan → expectasi
6. POSIX hub di atas berkedip — ignorable

**Key visual:** Kontras: keluarga di atas ramai, Windows di pojok sendirian. Sedikit comedic timing.

---

#### Beat 4 — The WSL Bridge (9–12s)

**Tujuan:** Windows nyambung ke Linux via WSL — harmoni.

**Layout update:**
```
  ╭──────╮     ╭──────╮
  │ UNIX │     │LINUX │
  │macOS │     │Android│
  │Solaris│    │Ubuntu │
  ╰──────╯     ╰──┬───╯
                   │
              ╭────┴────╮
              │  WSL    │  ← kabel bridge
              ╰────┬────╯
                   │
              ╭────┴─────╮
              │  Windows  │
              │ NT Kernel │
              ╰──────────╯
```

**Animasi Beat 4:**
1. Thought bubble Windows pecah → muncul WSL label (cyan, glowing)
2. **Kabel/plug** muncul dari Windows naik ke Linux cluster (animated: kabel narik diri dari bawah ke atas)
3. Kabel style: **rounded, thick, cyan glow** — kayak USB cable
4. Plug icon di ujung kabel (atas ke Linux, bawah ke Windows)
5. **Connection!** — flash effect kecil di titik connect
6. Glow dots mulai **bergerak naik-turun** di kabel → data flow
7. Windows happy (icon bounce up-down kecil)
8. Linux cluster "menerima" — Ubuntu node agak jatuh mendekat
9. Caption muncul: "Different roots, but connected"

**Kabel animation:**
```
Phase 1: Kabel muncul dari Windows (bottom)
Phase 2: Kabel naik perlahan ke Linux (top)
Phase 3: Plug snap ke Linux node
Phase 4: Flash + glow dots mulai flow
```

---

### Phase 1 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| The Family Portrait | 3s | All brands appear, POSIX hub glowing |
| The Expulsion | 3s | Windows kicked out, playful physics |
| The Loneliness | 3s | Windows alone, NT Kernel, sad |
| The WSL Bridge | 3s | Cable connects Windows to Linux |
| **Total Phase 1** | **12s** | |

---

### Phase 2 — WHERE UNIX LIVES (10 detik)

**Badge:** "WHERE UNIX LIVES"
**Caption:** "Still running critical infrastructure"

**Animasi:**
1. Scene transition: Phase 1 elements fade out
2. 4 device cards muncul satu-satu dari kiri:
   - **Mainframe** — IBM POWER / AIX → "Banks, Insurance, Government"
   - **Enterprise Server** — Oracle Solaris → "Databases, Mission-critical"
   - **Network Equipment** — Cisco IOS / VxWorks → "Routers, Firewalls, IoT"
   - **Personal** — macOS / FreeBSD → "Developer workstations, NAS"
3. Setiap card ada icon sederhana + label + usage stat
4. Glow dots bergerak dari card ke center → represent data flow

**Layout:**
```
┌─────────────────────────────────┐
│   [Mainframe Icon]  IBM AIX     │
│   Banks, Insurance, Gov         │
├─────────────────────────────────┤
│   [Server Icon]  Oracle Solaris │
│   Databases, Mission-critical   │
├─────────────────────────────────┤
│   [Router Icon]  Cisco/VxWorks  │
│   Routers, Firewalls, IoT       │
├─────────────────────────────────┤
│   [Laptop Icon]  macOS/FreeBSD  │
│   Dev workstations, NAS         │
└─────────────────────────────────┘
```

---

### Phase 3 — LINUX WINS (10 detik)

**Badge:** "LINUX DOMINANCE"
**Caption:** "Open source ate the world"

**Animasi:**
1. Bar chart horizontal muncul satu-satu dari atas:
   - **Servers:** Linux 96.3% ████░ Unix 3.7%
   - **Cloud:** Linux 90%+ █████░
   - **Supercomputers:** Linux 100% ██████
   - **Mobile (Android):** Linux 72% ████░
   - **Desktop:** Linux 4% █░ Unix (macOS) 15% ██
2. Bars animate dari 0 ke value, color coded:
   - Linux = cyan (#06B6D4)
   - Unix = dim gray (#374151)
3. Counter animasi: persentase naik dari 0 ke target
4. Di bawah chart, text: "Why? → Free, modular, community-driven"

**Layout:**
```
Servers         [████████████████████████] 96.3%
Cloud           [████████████████████░░░] 90%+
Supercomputers  [██████████████████████] 100%
Mobile          [██████████████░░░░░░░░] 72%
Desktop         [███░░░░░░░░░░░░░░░░░░] 4%
```

---

### Outro — POSIX BROTHERS (5 detik)

**Badge:** "POSIX BROTHERS"
**Caption:** "Different roots, same POSIX DNA"

**Animasi:**
1. Dua circle overlap (Venn diagram):
   - Kiri: "Linux" (cyan)
   - Kanan: "Unix/BSD" (gray-blue)
   - Overlap: "POSIX" (shared standards)
2. Di dalam overlap: shared tools — `ls`, `grep`, `pipe`, `chmod`
3. Fade to brand logo "AI Explainer"
4. End

**Layout:**
```
    ╭─────────╮
    │  Linux  │
    │         ╰──────╮
    │    POSIX       │
    │   ls grep      │ Unix/BSD
    │    pipe        │
    ╰──────╮         │
           │  macOS  │
           ╰─────────╯
```

---

## Timing

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Unix Family Drama | 12s | 0-12s |
| Where Unix Lives | 10s | 12-22s |
| Linux Wins | 10s | 22-32s |
| POSIX Brothers | 5s | 32-37s |
| **Total** | **37s** | |

---

## Data Needed

```javascript
// === UNIX FAMILY ===
export const UNIX_FAMILY = [
  { id: 'macos',     name: 'macOS',     year: 2001, company: 'Apple',   size: 'XL', color: '#9CA3AF', icon: '🍎' },
  { id: 'solaris',   name: 'Solaris',   year: 1992, company: 'Oracle', size: 'S',  color: '#EF4444', icon: '☀️' },
  { id: 'aix',       name: 'AIX',       year: 1986, company: 'IBM',    size: 'S',  color: '#3B82F6', icon: '🏢' },
  { id: 'hpux',      name: 'HP-UX',     year: 1984, company: 'HP',     size: 'S',  color: '#8B5CF6', icon: '🖨️' },
  { id: 'freebsd',   name: 'FreeBSD',   year: 1993, company: null,     size: 'XS', color: '#AB2B28', icon: '😈' },
]

// === LINUX FAMILY ===
export const LINUX_FAMILY = [
  { id: 'android',   name: 'Android',   year: 2008, company: 'Google',  size: 'XL', color: '#3DDC84', icon: '🤖' },
  { id: 'ubuntu',    name: 'Ubuntu',    year: 2004, company: 'Canonical', size: 'L', color: '#E95420', icon: '🟠' },
  { id: 'fedora',    name: 'Fedora',    year: 2003, company: 'Red Hat', size: 'S',  color: '#3C6EB4', icon: '🎩' },
  { id: 'arch',      name: 'Arch',      year: 2002, company: null,      size: 'S',  color: '#1793D1', icon: '🏔️' },
  { id: 'debian',    name: 'Debian',    year: 1993, company: null,      size: 'S',  color: '#A80030', icon: '🌀' },
]

// === WINDOWS ===
export const WINDOWS = {
  id: 'windows', name: 'Windows', year: 1985, company: 'Microsoft', size: 'M', color: '#3B82F6', icon: '🪟',
  kernel: 'NT Kernel', wslNote: 'Windows Subsystem for Linux',
}

// === USE CASES (Phase 2) ===
export const UNIX_USE_CASES = [
  { device: 'Mainframe',        os: 'AIX',           usage: 'Banks, Insurance, Government', icon: '🏢' },
  { device: 'Enterprise Server', os: 'Solaris',       usage: 'Databases, Mission-critical',  icon: '🖥️' },
  { device: 'Network Equipment', os: 'Cisco IOS/VxWorks', usage: 'Routers, Firewalls, IoT',   icon: '🌐' },
  { device: 'Personal',         os: 'macOS/FreeBSD',  usage: 'Dev workstations, NAS',        icon: '💻' },
]

// === DOMINANCE (Phase 3) ===
export const LINUX_DOMINANCE = [
  { category: 'Servers',          linux: 96.3, unix: 3.7 },
  { category: 'Cloud',            linux: 90,   unix: 10 },
  { category: 'Supercomputers',   linux: 100,  unix: 0 },
  { category: 'Mobile (Android)', linux: 72,   unix: 28 },
  { category: 'Desktop',          linux: 4,    unix: 15 },
]

// === PHASES ===
export const PHASES = [
  { badge: 'UNIX FAMILY',     badgeColor: '#06B6D4', caption: 'From one kernel to an ecosystem',             duration: 12 },
  { badge: 'WHERE UNIX LIVES', badgeColor: '#06B6D4', caption: 'Still running critical infrastructure',     duration: 10 },
  { badge: 'LINUX DOMINANCE', badgeColor: '#06B6D4', caption: 'Open source ate the world',                  duration: 10 },
  { badge: 'POSIX BROTHERS',  badgeColor: '#06B6D4', caption: 'Different roots, same POSIX DNA',            duration: 5 },
]

// === SIZE MAP ===
export const SIZE_MAP = {
  XL: 120,  // macOS, Android
  L: 90,    // Ubuntu
  M: 70,    // Windows
  S: 50,    // Solaris, AIX, HP-UX, Fedora, Arch, Debian
  XS: 40,   // FreeBSD
}
```

---

## File Structure

```
src/content/linux-vs-unix/
├── data.js           ← Constants, data, phases
└── Animation.jsx     ← React component (default export)
```

---

## Animation Tech Notes

- **GSAP timeline** with sub-timelines for each beat
- **Playful physics**: wobble, bounce, spring easing (`back.out(1.7)`)
- **Connector lines**: SVG `<line>` or `<path>` with `stroke-dasharray` animation
- **Kabel animation**: SVG path with `stroke-dashoffset` reveal + glow filter
- **Glow dots**: `createGlowDot` from `src/shared/GlowDot.js`
- **Size transitions**: `gsap.to(element, { scale: 0.5, duration: 0.3 })` for shrink effects
- **Thought bubble**: SVG `<ellipse>` + `<text>` with fade in/out
- **Flash effect**: Quick `opacity: 0 → 1 → 0` with `box-shadow` burst

### Key GSAP Patterns

```javascript
// Wobble physics
gsap.to(windowsRef.current, {
  rotation: 15,
  duration: 0.1,
  yoyo: true,
  repeat: 5,
  ease: "power1.inOut"
})

// Fly out to corner
gsap.to(windowsRef.current, {
  x: 350, y: 400,
  rotation: -20,
  duration: 0.6,
  ease: "back.out(1.7)"
})

// Cable draw
gsap.fromTo(cableRef.current,
  { strokeDashoffset: 500 },
  { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }
)

// Glow dot flow along cable
gsap.to(dotRef.current, {
  motionPath: { path: cablePath, align: "self" },
  duration: 2,
  repeat: -1,
  ease: "none"
})
```

---

## Notes

- Background ALWAYS `#090b15` (consistent with other topics)
- ViewBox ALWAYS `0 0 820 1340`
- Use `createGlowDot` from `src/shared/GlowDot.js` for animated dots
- Brand sizing: macOS & Android are XL to catch attention
- Windows is the "protagonist" of Phase 1 — relatable, funny
- BSD mentioned briefly (FreeBSD XS in Unix cluster)
- Unix stats source: IDC, Gartner, StatCounter (2024-2025 data)
