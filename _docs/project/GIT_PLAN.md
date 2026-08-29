# Git & Version Control — Topic Plan

## Overview

Animasi narrative-driven: Source code evolution, branching, merging, dan collaboration. Metaphor: dari single timeline → branching family tree → reunion. Visual: Git commit history sebagai river branches yang mengalir, merge sebagai confluence.

**Canvas:** 820 × 1340 (portrait 9:16)  
**Difficulty:** ⭐ (Beginner-friendly)  
**Estimasi:** 2 hari kerja

---

## Color Palette

```
Primary:      #F1502F (Git red)
Secondary:    #DC2626 (darker red)
Accent:       #FBBF24 (gold, highlight)
Main branch:  #10B981 (green, stable)
Feature:      #60A5FA (blue, in-progress)
Hotfix:       #EF4444 (red, urgent)
Merge:        #A78BFA (purple, convergence)
Commit:       #EC4899 (pink, checkpoint)
Time:         #6B7280 (gray, timeline)
```

---

## Animation Breakdown

---

### Phase 1 — THE BEGINNING (8 detik)

**Badge:** "INITIALIZATION" (gold badge)  
**Caption:** "One file, one commit, one branch"

#### Beat 1 — Birth of Repository (0–2s)

**Tujuan:** Initialize repo, create first commit.

**Layout:**
```
        ┌──────────────┐
        │   Repository │
        │  (empty git) │
        └────────┬─────┘
                 │
           (no commits yet)
```

**Animasi:**
1. Folder icon appears with `git init` text floating above
2. Git logo pops in (cyan, small glow)
3. Text appears: "git init" (monospace, #E5E7EB)
4. Repository outline starts glowing
5. "main" branch label appears at bottom (green, small)

---

#### Beat 2 — First Commit (2–4s)

**Tujuan:** Show what a commit is — snapshot of code.

**Animasi:**
1. File icon appears: "index.js" (with code preview)
2. Developer adds file: `git add index.js` (text animation)
3. File slides into "Staging Area" (illustrated as a bench/stage)
4. Developer commits: `git commit -m "Initial commit"` (text animation)
5. Commit circle appears (#EC4899) with label "commit 0a1f2b"
6. Commit contains:
   - Snapshot of files (miniature previews)
   - Author info
   - Timestamp
   - Message: "Initial commit"
7. Commit **attaches** to "main" branch (cyan line)

**Visual:** Commit = circle with metadata, connected to branch.

---

#### Beat 3 — Linear History (4–8s)

**Tujuan:** Show more commits, linear progression.

**Animasi:**
1. Developer makes changes → commits again
2. 3 more commits appear sequentially:
   - Commit 2: "Add authentication"
   - Commit 3: "Add database schema"
   - Commit 4: "Fix login bug"
3. Each commit:
   - Appears as pink circle
   - Connected by line to previous commit (git chain)
   - Shows brief commit message in tooltip
4. Timeline scrolls upward as commits add
5. "main" branch label stays at tip (latest commit)
6. Git HEAD pointer shows "pointing at main" (text: HEAD → main)
7. Caption: "Linear history on main branch"

**Visual emphasis:** Chain of commits = project history.

---

### Phase 1 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Birth of Repository | 2s | git init, main branch created |
| First Commit | 2s | First file committed, snapshot |
| Linear History | 4s | Multiple commits, linear chain |
| **Total Phase 1** | **8s** | |

---

### Phase 2 — BRANCHING (12 detik)

**Badge:** "BRANCHING" (blue badge)  
**Caption:** "Parallel development — features in isolation"

#### Beat 1 — Create Feature Branch (0–3s)

**Tujuan:** Branch diverges from main for feature development.

**Layout:**
```
main:     ●─●─●─●  (main branch continues)
          /
feature:  ●  (feature branch starts)
```

**Animasi:**
1. Main branch continues with new commits
2. Developer types: `git checkout -b feature/auth`
3. At current commit on main, a **new branch splits off** (fork animation)
4. Feature branch labeled "feature/auth" (blue color)
5. Feature branch line diverges downward/to the side
6. HEAD pointer **moves to feature branch**: "HEAD → feature/auth"
7. Main branch commits continue separately (green dots)
8. Feature branch commits also appear (blue dots)
9. Glow dots move separately on each branch → parallel work

**Visual emphasis:** One project, two simultaneous development paths.

---

#### Beat 2 — Parallel Development (3–8s)

**Tujuan:** Feature and main branch develop independently.

**Animasi:**
1. Split screen (optional):
   - **Left:** Main branch (green commits)
   - **Right:** Feature branch (blue commits)
2. Developers work on both branches:
   - Main: "Refactor utils" (commit)
   - Feature: "Add OAuth provider" (commit)
   - Main: "Update docs" (commit)
   - Feature: "Add login form" (commit)
3. Each commit adds to its respective branch
4. Branches visually **diverge** (fork gets wider)
5. Commits labeled with brief messages
6. Timeline shows elapsed time: "2 days later..."

**Technical detail:** Show that changes on one branch don't affect the other.

---

#### Beat 3 — Ready to Merge (8–12s)

**Tujuan:** Feature branch complete, ready to rejoin.

**Animasi:**
1. Feature branch ends with commit: "Finalize auth feature" (✓ checkmark)
2. Developer creates Pull Request (PR):
   - PR title: "Add authentication system"
   - Branches: feature/auth → main
   - Green checkmark: "All checks pass"
3. PR card slides in with:
   - Branch names
   - Commit count: "3 commits"
   - Code diff summary (simplified)
4. Main branch waits (commits pause)
5. Caption: "Feature complete! Ready to merge."
6. Approval icon appears (thumbs up 👍)

**Visual:** PR as a "bridge" connecting branches, waiting to be crossed.

---

### Phase 2 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Create Feature Branch | 3s | Branch diverges from main |
| Parallel Development | 5s | Both branches develop independently |
| Ready to Merge | 4s | PR created, feature complete |
| **Total Phase 2** | **12s** | |

---

### Phase 3 — MERGING & CONFLICTS (10 detik)

**Badge:** "MERGE" (purple badge)  
**Caption:** "Combining branches — smooth and conflict"

#### Beat 1 — Fast-Forward Merge (0–3.5s)

**Tujuan:** Simple merge when main hasn't changed since branch.

**Scenario:** Another branch (simple-feature) merges cleanly.

**Animasi:**
1. "simple-feature" branch shown (2 commits ahead)
2. Main branch hasn't advanced (no new commits)
3. Merge command: `git merge simple-feature`
4. Feature branch **slides into main** (fast-forward animation)
5. Main branch pointer **jumps forward** to feature branch tip
6. Feature branch and main **align** (same commit)
7. Feature branch label disappears (merged, deleted)
8. Green checkmark: ✓ "Fast-forward merge"
9. Caption: "No conflicts — main just caught up"

**Visual:** Feature slides smoothly into main, like traffic merging.

---

#### Beat 2 — Conflict Scenario (3.5–7s)

**Tujuan:** Merge conflict when both branches modified same file.

**Scenario:** feature/auth and main both modified `auth.js`.

**Animasi:**
1. Two branches converging:
   - feature/auth: Modified `auth.js` (blue highlight)
   - main: Modified `auth.js` (green highlight)
2. Merge attempt: `git merge feature/auth`
3. **CONFLICT!** Red warning banner slides down (🚨)
4. Conflict visualization shows **merged file with conflict markers**:
   ```
   <<<<<<< HEAD
   // main's version
   =======
   // feature's version
   >>>>>>> feature/auth
   ```
5. Developer icon appears, looking confused (😕)
6. File highlighted red, labeled "CONFLICT"
7. Status: "Merge paused — resolve conflicts manually"

**Visual emphasis:** Conflicts are not scary — just need resolution.

---

#### Beat 3 — Resolving & Completing (7–10s)

**Tujuan:** Developer resolves conflict, completes merge.

**Animasi:**
1. Developer edits conflicted file:
   - Conflict markers removed
   - Best of both versions combined
   - File now shows merged content (code snippet visible)
2. Developer commits: `git add auth.js && git commit -m "Merge feature/auth"`
3. **Merge commit** appears (purple circle, special marker)
4. Merge commit labeled: "Merge commit: abc1234"
5. Two parent commits visible (one from each branch)
6. Branches **converge** at merge commit
7. Feature branch deleted (labeled "merged ✓")
8. Main branch continues from merge commit
9. Green checkmark: ✓ "Merge complete"
10. Caption: "Conflict resolved, branches unified"

**Visual:** Merge commit as a junction point, two rivers becoming one.

---

### Phase 3 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Fast-Forward Merge | 3.5s | Simple merge, no conflicts |
| Conflict Scenario | 3.5s | Conflict detected, resolution needed |
| Resolving & Completing | 3s | Conflict resolved, merge complete |
| **Total Phase 3** | **10s** | |

---

### Phase 4 — COLLABORATION (10 detik)

**Badge:** "COLLABORATION" (pink badge)  
**Caption:** "Multiple developers, one repository"

#### Beat 1 — Push & Pull (0–4s)

**Tujuan:** Show remote repo and synchronization.

**Layout:**
```
Local Repos:          Remote Repo (GitHub):
Developer 1 ←→        ●─●─●─●
Developer 2 ←→        (Central repo)
Developer 3 ←→
```

**Animasi:**
1. Remote GitHub logo appears (centered, gray background = "cloud")
2. Local developer repos on left (3 mini repo icons)
3. Developer 1 makes commit locally
4. Developer 1 pushes: `git push origin main`
5. Commit packet floats right → appears on remote (red to gray transition)
6. Remote repo updates with new commit
7. Developer 2 sees update, pulls: `git pull origin main`
8. Remote commit floats left → appears on Developer 2's local repo
9. Developer 2 now has latest code
10. Caption: "Push = upload your commits | Pull = download others' commits"

**Visual emphasis:** Network synchronization, everyone's in sync.

---

#### Beat 2 — Pull Request Workflow (4–7s)

**Tujuan:** Collaborative review process via PRs.

**Animasi:**
1. Developer 3 creates feature branch + commits locally
2. Developer 3 pushes feature to remote: `git push origin feature/api`
3. Feature branch appears on remote (blue line)
4. Developer 3 creates Pull Request:
   - Compares: feature/api → main
   - Adds description, labels, reviewers
5. PR card appears (purple outline):
   - Title: "Add REST API endpoints"
   - Author: "Developer 3"
   - Reviewers: Developer 1, Developer 2
   - Comment section (empty, waiting for review)
6. Developers 1 & 2 review:
   - Comments appear in PR (chat-like)
   - Suggestions ("change variable name", etc.)
   - 👍 Approvals appear
7. All checks pass (green badges)

**Visual:** PR as a conversation space, collaborative decision-making.

---

#### Beat 3 — Auto-Deploy & Celebrate (7–10s)

**Tujuan:** Merge → automatic deployment → live!

**Animasi:**
1. PR approval count: 2/2 reviewers ✓
2. "Merge PR" button highlighted (green)
3. Developer clicks → Merge commit created on main
4. **Deployment workflow triggers** (animated CI/CD):
   - Tests run (progress bar fills)
   - Build succeeds (green checkmark)
   - Deploy to server (rocket emoji 🚀)
5. Version number updates: v1.2.3 → v1.3.0 (semantic versioning)
6. "Live!" badge appears on main branch (gold)
7. Celebration animation: confetti 🎉 (optional, playful)
8. Feature branch auto-deleted on remote
9. Caption: "From code to production — fully automated"

**Visual emphasis:** Modern DevOps workflow, code review → automatic deployment.

---

### Phase 4 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Push & Pull | 4s | Synchronization, remote repo |
| Pull Request Workflow | 3s | Code review, collaborative |
| Auto-Deploy & Celebrate | 3s | Merge → deploy → live |
| **Total Phase 4** | **10s** | |

---

### Outro — Git Essentials (5 detik)

**Badge:** "GIT ESSENTIALS"  
**Caption:** "Master these commands, master collaboration"

**Animasi:**
1. Command cheatsheet appears (animated in from bottom):
   ```
   git init          # Start a repo
   git add .         # Stage changes
   git commit -m ""  # Save snapshot
   git branch        # Create branch
   git checkout      # Switch branch
   git merge         # Combine branches
   git push/pull     # Sync with remote
   ```
2. Each command highlights with matching visual from animation
3. Commands fade in with staggered timing
4. Final text: "Git: The language of collaboration"
5. Fade to brand outro

---

## Timing (Full Animation)

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Initialization | 8s | 0-8s |
| Branching | 12s | 8-20s |
| Merging & Conflicts | 10s | 20-30s |
| Collaboration | 10s | 30-40s |
| Outro | 5s | 40-45s |
| **Total** | **45s** | |

---

## Data Needed

```javascript
// === COMMITS ===
export const COMMITS = [
  { id: 'c0', hash: '0a1f2b', message: 'Initial commit', author: 'dev', timestamp: 0, branch: 'main' },
  { id: 'c1', hash: '1b2f3c', message: 'Add authentication', author: 'dev', timestamp: 1, branch: 'main' },
  { id: 'c2', hash: '2c3f4d', message: 'Add database schema', author: 'dev', timestamp: 2, branch: 'main' },
  { id: 'c3', hash: '3d4f5e', message: 'Fix login bug', author: 'dev', timestamp: 3, branch: 'main' },
]

// === BRANCHES ===
export const BRANCHES = [
  { id: 'main', name: 'main', color: '#10B981', type: 'primary', commits: ['c0', 'c1', 'c2', 'c3'] },
  { id: 'feature-auth', name: 'feature/auth', color: '#60A5FA', type: 'feature', commits: ['c2', 'c4', 'c5'] },
  { id: 'feature-simple', name: 'simple-feature', color: '#F97316', type: 'feature', commits: ['c1', 'c6'] },
]

// === PULL REQUESTS ===
export const PULL_REQUESTS = [
  { id: 'pr1', title: 'Add authentication system', from: 'feature/auth', to: 'main', status: 'ready-to-merge', reviews: 2 },
  { id: 'pr2', title: 'Add REST API endpoints', from: 'feature/api', to: 'main', status: 'in-review', reviews: 1 },
]

// === MERGE SCENARIOS ===
export const MERGE_TYPES = [
  { type: 'fast-forward', branch: 'simple-feature', conflict: false, auto: true },
  { type: 'merge-commit', branch: 'feature/auth', conflict: true, auto: false },
]

// === PHASES ===
export const PHASES = [
  { badge: 'INITIALIZATION', badgeColor: '#FBBF24', caption: 'One file, one commit, one branch', duration: 8 },
  { badge: 'BRANCHING', badgeColor: '#60A5FA', caption: 'Parallel development — features in isolation', duration: 12 },
  { badge: 'MERGE', badgeColor: '#A78BFA', caption: 'Combining branches — smooth and conflict', duration: 10 },
  { badge: 'COLLABORATION', badgeColor: '#EC4899', caption: 'Multiple developers, one repository', duration: 10 },
]

export const VW = 820
export const VH = 1340
```

---

## File Structure

```
src/content/git/
├── data.js           ← Commits, branches, PRs, phases
└── Animation.jsx     ← React component (default export)
```

---

## Animation Tech Notes

- **GSAP timeline** with sub-timelines for each phase
- **Branch divergence:** SVG `<path>` curves that split from a point
- **Commit circles:** SVG `<circle>` elements with labels, positioned on branch lines
- **Merge animation:** Paths converge, merge commit placed at junction
- **Conflict markers:** SVG `<rect>` with conflict text display
- **Push/Pull animation:** `createGlowDot` moving horizontally between local/remote
- **PR card:** Animated slide-in with staggered sub-elements

### Key GSAP Patterns

```javascript
// Branch divergence
gsap.to(featureBranch, {
  x: -100,  // diverge left
  duration: 1.5,
  ease: "power2.out"
})

// Commit appears on branch
gsap.fromTo(commitCircle,
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
)

// Fast-forward merge (branch slides into main)
gsap.to(featureBranch, {
  x: 0,  // align with main
  opacity: 0.3,  // fade out, merged
  duration: 1,
  ease: "power1.inOut"
})

// Conflict resolution (red highlight)
gsap.to(conflictBox, {
  backgroundColor: '#FEE2E2',  // red tint
  duration: 0.5,
  yoyo: true,
  repeat: 3
})

// Push to remote (horizontal float)
gsap.to(commitPacket, {
  x: 300,  // float to remote
  duration: 1.5,
  ease: "power2.inOut"
})
```

---

## Notes

- Background ALWAYS `#090b15`
- ViewBox ALWAYS `0 0 820 1340`
- Git red (#F1502F) should be primary theme
- Branch visualizations use curves to show divergence/convergence
- Commit order matters — show sequential hashes
- Fast-forward merge is "easiest path" (good for beginners)
- Merge conflicts are shown as learning moment, not scary
- PR workflow is modern (post-2015 Git best practices)
- Deployment shown as natural outcome of PR merge
- Beginner-friendly language (avoid "rebase", "cherry-pick", etc.)
- Real-world scenario: feature branch workflow is industry standard