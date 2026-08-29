# Docker & Containerization — Topic Plan

## Overview

Animasi narrative-driven: Virtual Machines yang kompleks → Docker Containers yang efficient. Metaphor: dari mansion besar ke apartment kompleks (banyak unit, shared infrastructure, isolated space).

**Canvas:** 820 × 1340 (portrait 9:16)  
**Difficulty:** ⭐⭐  
**Estimasi:** 2-3 hari kerja

---

## Color Palette

```
Primary:      #2496ED (Docker blue)
Secondary:    #1D63ED (darker blue)
Accent:       #00D9FF (cyan, container glow)
VM heavy:     #EF4444 (red, resource waste)
Container light: #4ADE80 (green, efficient)
Layer:        #FFD60A (gold, layer/stack)
Image:        #9CA3AF (gray, static)
Running:      #A78BFA (purple, dynamic)
Shared:       #F472B6 (pink, common kernel)
```

---

## Animation Breakdown

---

### Phase 1 — THE MANSION PROBLEM (12 detik)

**Badge:** "VIRTUAL MACHINES" (red badge)
**Caption:** "Each app gets its own complete OS — wasteful"

#### Beat 1 — The Mansion (0–3s)

**Tujuan:** Establish bahwa setiap VM adalah "complete copy of OS" yang boros.

**Layout:**
Sebuah building (mansion) dibagi menjadi 3 unit apartments/rooms. Setiap room identical:

```
         ╭─── MANSION ───╮
         │ (single host)  │
         ╰────────┬───────╯
                  │
       ┌──────────┼──────────┐
       │          │          │
   ╭──────╮  ╭──────╮  ╭──────╮
   │ VM 1 │  │ VM 2 │  │ VM 3 │
   │(10GB)│  │(10GB)│  │(10GB)│
   ╰──────╯  ╰──────╯  ╰──────╯
```

**Elements:**
- Host/Mansion: Large gray rectangle (#374151)
- 3 VM boxes: Red glow (#EF4444), each labeled "VM 1", "VM 2", "VM 3"
- Inside each VM: **full OS stack** (visible):
  - Kernel (thick border)
  - System libraries (#9CA3AF)
  - Application (#60A5FA)
  - Size label: "10GB each"

**Animasi Beat 1:**
1. Mansion frame muncul dari atas (gray rectangle)
2. VM 1, 2, 3 muncul satu-satu dari kiri → slide ke posisi dalam mansion
3. Setiap VM punya glowing red border (active)
4. Inside masing-masing VM, kernel layer visible
5. Label size "10GB" muncul di bawah tiap VM
6. Total caption muncul: "3 VMs = 30GB of OS copies!"

**Visual emphasis:** Redundancy adalah enemy — setiap VM isinya almost identical (kernel, libc, utilities).

---

#### Beat 2 — Wasteful Resource Flow (3–6s)

**Tujuan:** Show CPU, RAM, Disk dipakai inefficient karena duplication.

**Animasi:**
1. Resource meter muncul di atas mansion: **CPU | RAM | DISK**
2. Tiap meter punya 3 segments, warna merah (maxxed out)
3. CPU bar:
   - VM 1 pakai 30% (red segment 1)
   - VM 2 pakai 30% (red segment 2)
   - VM 3 pakai 30% (red segment 3)
   - Only 10% idle (gray)
4. Glow dots bergerak di setiap VM → show "work happening"
5. Dots bergerak **lambat**, tebal-tebal → represent heavy OS overhead
6. Caption update: "Each VM wastes resources running duplicate OS kernels"

**Technical detail (text overlay):**
- Kernel size: ~100MB per VM
- Standard utilities: ~500MB per VM
- Duplication: 3 × 600MB = 1.8GB wasted just on OS!

---

#### Beat 3 — The Pain Point (6–9s)

**Tujuan:** Highlight startup time & deployment complexity.

**Animasi:**
1. A developer icon (👨‍💻) appears di tengah
2. Developer "wants to deploy" aplikasi
3. Each VM punya "startup timer" — booting sequence visible:
   - BIOS check → Kernel load → System daemons → App start
4. Timeline animated per VM:
   - VM 1 boots in 2min 30sec (slow)
   - VM 2 boots in 2min 45sec (slow)
   - VM 3 boots in 2min 30sec (slow)
5. Total time: ~8 minutes to deploy 3 VMs
6. Developer frustrated emoji (😤)
7. Text: "Startup time: Minutes per VM"

**Visual:** Progress bars filled slowly, with checkmarks appearing at each stage (BIOS, Kernel, Daemons, App).

---

#### Beat 4 — The Aha! (9–12s)

**Tujuan:** Introduce concept bahwa "maybe we can share OS?"

**Animasi:**
1. Thought bubble appears di developer's head: "What if... we share OS?"
2. A lightbulb icon glows (#FFD60A)
3. Mansion building **wobbles/shakes** — idea forming
4. Glow dots dalam VMs **pause** — stop thinking about current approach
5. Narrator voice: "What if we don't duplicate the entire OS?"
6. Building fades slightly, question mark appears
7. Caption: "There has to be a better way..."

---

### Phase 1 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| The Mansion | 3s | VMs introduced, redundancy visible |
| Wasteful Resources | 3s | CPU/RAM/Disk meter, overhead shown |
| The Pain Point | 3s | Startup time, deployment complexity |
| The Aha! | 3s | Developer realizes duplication is waste |
| **Total Phase 1** | **12s** | |

---

### Phase 2 — DOCKER SOLUTION (14 detik)

**Badge:** "CONTAINERS" (green badge)  
**Caption:** "Share OS kernel, isolate everything else"

#### Beat 1 — Shared Kernel (0–3.5s)

**Tujuan:** Introduce Docker architecture: one kernel, multiple containers.

**Layout change:**
Mansion transforms → apartment complex:

```
       ╭────── HOST ──────╮
       │  (Single Kernel) │
       ├─────────────────┤
       │ Shared Kernel   │
       ├─────┬─────┬─────┤
       │ C1  │ C2  │ C3  │
       ├─────┴─────┴─────┤
       │ Libraries, FS   │
       │ (Layered)       │
       ╰─────────────────╯
```

**Animasi:**
1. Mansion building **transforms** → apartment building (transition effect)
2. Kernel layer stays at **bottom** (now shared)
3. 3 old VMs **shrink & flatten** → become Container boxes
4. Each container becomes much smaller:
   - VM: 10GB → Container: 100MB-500MB
5. Kernel glowing with label: "SHARED KERNEL" (cyan glow)
6. Each container punya different color:
   - C1: #60A5FA (blue)
   - C2: #F97316 (orange)
   - C3: #8B5CF6 (purple)
7. Size labels update to realistic container sizes

**Key visual:** Duplication gone → shared foundation.

---

#### Beat 2 — Filesystem Isolation (3.5–7s)

**Tujuan:** Show containers think they have their own filesystem, tapi shared di bawah.

**Animasi:**
1. Each container punya its own "virtual filesystem view":
   - C1 sees: `/root`, `/app1`, `/lib` (its own)
   - C2 sees: `/root`, `/app2`, `/lib` (its own)
   - C3 sees: `/root`, `/app3`, `/lib` (its own)
2. Below, a "Shared Layer" shows actual FS:
   - `/app1`, `/app2`, `/app3` (separate)
   - `/lib` (one copy, read-only, shared)
   - Container-specific files (copy-on-write)
3. Glow dots move from container → shared layer:
   - Fast, cyan glow
   - Represent "access to shared kernel" with **namespace isolation**
4. Tooltip appears: "Namespace: Fake it for each container"
5. Copy-on-write animation: when C1 modifies `/lib/file`, it copies to C1-specific layer

**Visual emphasis:** Containers believe they're isolated, but infrastructure is shared.

---

#### Beat 3 — Resource Efficiency (7–10.5s)

**Tujuan:** Show how much better resource usage is.

**Animasi:**
1. Resource meter reappears: **CPU | RAM | DISK**
2. Compare side-by-side:
   - **Left:** VM approach (red, maxed out)
   - **Right:** Container approach (green, efficient)
3. Numbers animate up:
   - CPU: 90% usage (VMs) → 45% usage (Containers)
   - RAM: 32GB consumed (VMs) → 8GB consumed (Containers) — 75% reduction!
   - DISK: 30GB (VMs) → 3GB (Containers) — 90% reduction!
4. Green checkmarks appear: ✓ Efficient, ✓ Portable, ✓ Fast
5. Glow dots now move **faster** through containers → lighter overhead

**Technical overlay:**
- Shared kernel: -20GB
- Deduplicated layers: -5GB
- Copy-on-write efficiency: -2GB

---

#### Beat 4 — Startup Speed (10.5–14s)

**Tujuan:** Containers boot in milliseconds.

**Animasi:**
1. Developer reappears (back, still 👨‍💻)
2. Developer "deploys" 3 containers instead of VMs
3. Startup timers **fly by**:
   - C1 boots in 100ms ← progress bar almost instant
   - C2 boots in 120ms ← instant
   - C3 boots in 110ms ← instant
4. Total: **~300ms for all 3 containers** (vs 8min for VMs)
5. Developer happy emoji (😄), thumbs up
6. Text: "Startup time: Milliseconds per container"
7. Container boxes **glow bright green** → ready to use

**Comparison text overlay:**
- Before: 8 minutes
- After: 0.3 seconds
- **~1600x faster!**

---

### Phase 2 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Shared Kernel | 3.5s | Containers introduced, OS duplication gone |
| Filesystem Isolation | 3.5s | Namespaces, copy-on-write explained |
| Resource Efficiency | 3.5s | CPU/RAM/DISK comparison |
| Startup Speed | 3.5s | Deployment time comparison |
| **Total Phase 2** | **14s** | |

---

### Phase 3 — DOCKER LAYERS & IMAGES (10 detik)

**Badge:** "LAYERS & IMAGES" (gold badge)  
**Caption:** "Dockerfile → Image layers → Running container"

#### Beat 1 — Dockerfile to Image (0–4s)

**Tujuan:** Show how Dockerfile becomes layered image.

**Animasi:**
1. Dockerfile appears (code snippet):
   ```
   FROM ubuntu:20.04
   RUN apt-get install python3
   COPY app.py /app/
   CMD ["python3", "/app/app.py"]
   ```
2. Each line animates into a **layer**:
   - Layer 1: "Base OS (ubuntu)" — gold rectangle
   - Layer 2: "Python3" — gold rectangle on top
   - Layer 3: "App code (app.py)" — gold rectangle on top
   - Layer 4: "Entrypoint" — gold rectangle on top
3. Layers stack vertically, each labeled with size:
   - Layer 1: 77MB
   - Layer 2: 50MB (adds to L1)
   - Layer 3: 5MB (adds to L1+L2)
   - Layer 4: <1MB
4. Final image size: ~132MB (sum of layers)
5. Total image label: "Image: my-app:latest (132MB)"

**Key concept:** Each line in Dockerfile = one layer in image.

---

#### Beat 2 — Layer Reuse (4–7s)

**Tujuan:** Show how shared layers reduce storage.

**Animasi:**
1. 3 containers running, each from different images:
   - Image A (ubuntu + python): 4 layers
   - Image B (ubuntu + node): 4 layers
   - Image C (ubuntu + rust): 4 layers
2. All share Layer 1: "ubuntu:20.04" (77MB)
3. Layer 1 glows (#F472B6 = pink, shared color)
4. Annotation: "Shared layer — stored once, used 3x"
5. Calculate savings:
   - Without sharing: 3 × 77MB = 231MB
   - With sharing: 77MB + deltas = 150MB
   - Saved: 81MB (35% reduction)
6. Green checkmark: ✓ Deduplication works

**Visual:** Layers stack, but shared layers **light up pink** to show overlap.

---

#### Beat 3 — Runtime Container (7–10s)

**Tujuan:** Show how running container adds thin read-write layer.

**Animasi:**
1. Image stack (3 layers, static, golden)
2. **Container layer** added on top (thin, purple, dynamic)
3. When container runs:
   - Read: goes to image layers (fast, cached)
   - Write: goes to container layer (writable, isolated)
4. File modification animation:
   - Container modifies `/etc/config`
   - File is **copied from image layer → container layer** (copy-on-write)
   - Modification happens in container layer
5. Container layer grows slightly as files are modified
6. Stop container:
   - Container layer **disappears** (ephemeral)
   - Image stays intact (unchanged)
7. Label: "Container = Thin R/W layer on top of image"

---

### Phase 3 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Dockerfile to Image | 4s | Layers built, image created |
| Layer Reuse | 3s | Shared layers, deduplication |
| Runtime Container | 3s | Thin R/W layer, ephemeral |
| **Total Phase 3** | **10s** | |

---

### Phase 4 — MULTI-CONTAINER ARCHITECTURE (8 detik)

**Badge:** "COMPOSE" (purple badge)  
**Caption:** "Orchestrate multiple containers as a single app"

#### Beat 1 — The App Stack (0–4s)

**Tujuan:** Show typical multi-tier architecture (frontend, backend, DB).

**Layout:**
```
        ┌─────────────────┐
        │   Web Browser   │
        └────────┬────────┘
                 │
        ┌────────────────┐
        │  CONTAINERS    │
        ├────────────────┤
        │ Frontend (C1)  │
        ├────────────────┤
        │ Backend (C2)   │
        ├────────────────┤
        │ Database (C3)  │
        └────────────────┘
```

**Animasi:**
1. Browser icon appears at top
2. 3 containers stack below:
   - **Frontend** (Nginx): #60A5FA (blue)
   - **Backend** (Python): #F97316 (orange)
   - **Database** (PostgreSQL): #8B5CF6 (purple)
3. Each container fully isolated but **connected via network**
4. Network lines appear: blue connector lines between containers
5. Labels: port mappings visible:
   - Frontend: port 80 (HTTP)
   - Backend: port 5000 (internal)
   - Database: port 5432 (internal)

---

#### Beat 2 — Request Flow (4–6s)

**Tujuan:** Animate a request flowing through all containers.

**Animasi:**
1. User types in browser (👆 click animation)
2. HTTP request packet muncul (cyan glow dot)
3. Dot travels: Browser → Frontend Container (port 80)
4. Frontend processes (animation: box glows briefly)
5. Dot travels: Frontend → Backend Container (port 5000)
6. Backend processes (animation: box glows briefly)
7. Dot travels: Backend → Database Container (port 5432)
8. Database query (animation: cylinder spins briefly)
9. **Response travels backwards:** DB → Backend → Frontend → Browser
10. Browser shows result (✓ success checkmark)

**Visual emphasis:** Containers don't know each other's internal details — only communicate via network.

---

#### Beat 3 — Docker Compose (6–8s)

**Tujuan:** Show how docker-compose.yml orchestrates everything.

**Animasi:**
1. Dockerfile appears for each container (3 code snippets)
2. docker-compose.yml file appears (larger, center):
   ```
   services:
     frontend:
       build: ./frontend
       ports: ["80:80"]
     backend:
       build: ./backend
       ports: ["5000:5000"]
     database:
       image: postgres:13
       ports: ["5432:5432"]
   ```
3. Compose file "reads" and deploys:
   - Text from compose → arrows point to each container
   - Each container gets deployed with correct config
4. All containers spin up simultaneously
5. Network automatically created (shown as glowing lines)
6. Final state: 3-tier app running

**Key concept:** One config file → entire app orchestrated.

---

### Phase 4 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| The App Stack | 4s | Frontend, Backend, DB containers shown |
| Request Flow | 2s | HTTP request animates through stack |
| Docker Compose | 2s | Orchestration via compose file |
| **Total Phase 4** | **8s** | |

---

### Outro — Why Docker? (5 detik)

**Badge:** "WHY DOCKER?"  
**Caption:** "Portability, consistency, scale"

**Animasi:**
1. Three cards slide in from bottom:
   - **"It works on my machine!"** → ✓ "It works everywhere"
   - **Heavyweight VMs** → ✓ **Lightweight containers**
   - **Manual deployment** → ✓ **Automated, reproducible**
2. Docker whale logo appears with glow effect
3. Text: "Docker: Build once, run anywhere"
4. Fade to brand outro

---

## Timing (Full Animation)

| Phase | Duration | Cumulative |
|-------|----------|------------|
| VM Problem | 12s | 0-12s |
| Docker Solution | 14s | 12-26s |
| Layers & Images | 10s | 26-36s |
| Multi-Container | 8s | 36-44s |
| Outro | 5s | 44-49s |
| **Total** | **49s** | |

---

## Data Needed

```javascript
// === VMs (Phase 1) ===
export const VMS = [
  { id: 'vm-1', label: 'VM 1', size: '10GB', color: '#EF4444', apps: ['App1', 'Kernel', 'Libs'] },
  { id: 'vm-2', label: 'VM 2', size: '10GB', color: '#EF4444', apps: ['App2', 'Kernel', 'Libs'] },
  { id: 'vm-3', label: 'VM 3', size: '10GB', color: '#EF4444', apps: ['App3', 'Kernel', 'Libs'] },
]

// === CONTAINERS (Phase 2) ===
export const CONTAINERS = [
  { id: 'c1', label: 'C1', size: '150MB', color: '#60A5FA', app: 'App1' },
  { id: 'c2', label: 'C2', size: '180MB', color: '#F97316', app: 'App2' },
  { id: 'c3', label: 'C3', size: '120MB', color: '#8B5CF6', app: 'App3' },
]

// === RESOURCE COMPARISON ===
export const RESOURCES = {
  vms: { cpu: 90, ram: 32, disk: 30 },
  containers: { cpu: 45, ram: 8, disk: 3 },
}

// === STARTUP TIMES ===
export const STARTUP_TIMES = {
  vms: [150, 165, 150],  // seconds
  containers: [100, 120, 110],  // milliseconds
}

// === DOCKER LAYERS ===
export const LAYERS = [
  { order: 1, name: 'Base OS (ubuntu)', size: 77 },
  { order: 2, name: 'Python3', size: 50 },
  { order: 3, name: 'App code', size: 5 },
  { order: 4, name: 'Entrypoint', size: 0.5 },
]

// === PHASES ===
export const PHASES = [
  { badge: 'VIRTUAL MACHINES', badgeColor: '#EF4444', caption: 'Each app gets its own complete OS — wasteful', duration: 12 },
  { badge: 'CONTAINERS', badgeColor: '#4ADE80', caption: 'Share OS kernel, isolate everything else', duration: 14 },
  { badge: 'LAYERS & IMAGES', badgeColor: '#FFD60A', caption: 'Dockerfile → Image layers → Running container', duration: 10 },
  { badge: 'MULTI-CONTAINER', badgeColor: '#A78BFA', caption: 'Orchestrate multiple containers as a single app', duration: 8 },
]

export const VW = 820
export const VH = 1340
```

---

## File Structure

```
src/content/docker/
├── data.js           ← Constants, VMs, containers, layers, phases
└── Animation.jsx     ← React component (default export)
```

---

## Animation Tech Notes

- **GSAP timeline** with sub-timelines for each phase
- **Transform transitions:** VMs → Containers (morphing effect, scale + opacity)
- **Stacking animation:** Layers stack vertically with ease `power2.out`
- **Progress bars:** `gsap.to` with `width` animation for startup timers
- **Glow effects:** SVG `<filter>` with feGaussianBlur (reuse #dotGlow from other topics)
- **Network visualization:** SVG `<line>` elements with dashed stroke for container connections
- **Request flow:** `createGlowDot` animated along SVG path (`motionPath`)

### Key GSAP Patterns

```javascript
// VM to Container transform
gsap.to(vmBox, {
  scale: 0.3,
  y: -50,
  duration: 1,
  ease: "back.out(1.7)"
})

// Layer stacking
gsap.to(layerBox, {
  y: -layerHeight * index,
  duration: 0.5,
  delay: index * 0.1
})

// Progress bar fill
gsap.to(progressBar, {
  width: finalWidth,
  duration: timeInSeconds,
  ease: "power1.inOut"
})

// Request flow along path
gsap.to(requestDot, {
  motionPath: { path: requestPath, align: "self" },
  duration: 2,
  ease: "power1.inOut"
})
```

---

## Notes

- Background ALWAYS `#090b15`
- ViewBox ALWAYS `0 0 820 1340`
- Use `createGlowDot` from `src/shared/GlowDot.js` for animated dots
- Docker blue (#2496ED) should be primary color theme
- Mansion → Apartment complex metaphor helps non-technical audience understand
- Real-world resource numbers (CPU, RAM, DISK) from Docker docs
- Startup time comparison (8min vs 300ms) is realistic
- Layer deduplication is key differentiator from VMs
- Multi-container example (3-tier web app) shows real-world relevance