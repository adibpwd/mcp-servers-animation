# Database Indexing — Topic Plan

## Overview

Animasi narrative-driven: Finding data in massive table (slow) → Indexing solution (fast). Metaphor: dari mencari nama di phone book tanpa index (setiap halaman) ke pakai index (langsung ke halaman). Visual: Database table → B-tree index, query performance comparison.

**Canvas:** 820 × 1340 (portrait 9:16)  
**Difficulty:** ⭐⭐⭐ (Intermediate-Advanced)  
**Estimasi:** 2-3 hari kerja

---

## Color Palette

```
Primary:           #FF6B6B (Emphasis red, performance)
Secondary:         #DC2626 (darker red)
Accent:            #FBBF24 (gold, highlight)
Table Data:        #60A5FA (blue, records)
Index:             #10B981 (green, optimized)
Tree Nodes:        #8B5CF6 (purple, B-tree structure)
Query Path:        #EC4899 (pink, search)
Slow:              #EF4444 (red, inefficient)
Fast:              #10B981 (green, efficient)
Scan:              #6B7280 (gray, full scan)
```

---

## Animation Breakdown

---

### Phase 1 — THE PROBLEM (10 detik)

**Badge:** "THE SEARCH PROBLEM" (red badge)  
**Caption:** "Finding data in a massive table — the naive way"

#### Beat 1 — The Table (0–3s)

**Tujuan:** Show database table with million rows.

**Layout:**
```
┌─────────────────────────────┐
│ users Table (1,000,000 rows)│
├─────────┬─────────┬────────┤
│   id    │  name   │ email  │
├─────────┼─────────┼────────┤
│ 1       │ Alice   │ a@... │
│ 2       │ Bob     │ b@... │
│ 3       │ Charlie │ c@... │
│ ...     │ ...     │ ...    │
│999999   │ Zoe     │ z@... │
└─────────────────────────────┘
```

**Animasi:**
1. Empty table frame appears (blue outline)
2. Rows start filling rapidly (animation: rows cascade down)
3. Row count increments: "1,000", "10,000", "100,000", "1,000,000 rows"
4. Table fully populated (showing first/last rows, middle rows blur)
5. Table scrollbar shows massive size (tiny slider position)
6. Label: "1 million records, average size ~200 bytes = 200MB table"

**Visual emphasis:** Scale is important — table is HUGE.

---

#### Beat 2 — The Query (3–6s)

**Tujuan:** Execute a simple query without index.

**Query:** `SELECT * FROM users WHERE email = 'alice@example.com'`

**Animasi:**
1. Query appears at top (code snippet, monospace)
2. Database engine receives query
3. Engine decision: "No index exists, must scan entire table"
4. **Full table scan begins** (animation: row-by-row scanning):
   - Rows highlight one-by-one (gray background sweep)
   - Check column "email" for each row
   - Row 1: "alice1@..." ❌
   - Row 2: "bob2@..." ❌
   - Row 3: "charlie3@..." ❌
   - ...
   - Row 847,392: "alice@example.com" ✓ FOUND!
5. Progress bar fills as scan progresses: "Scanning 1% → 50% → 98%"
6. Time counter shows: "847 milliseconds"
7. Match found, highlighted (green glow)

**Visual emphasis:** Full scan is expensive (checks almost 900k rows).

---

#### Beat 3 — Query Repeats (Multiple Times) (6–8.5s)

**Tujuno:** Same query executed again, same expensive scan.

**Animasi:**
1. Same query executed again: `SELECT * FROM users WHERE email = 'alice@example.com'`
2. Full table scan happens again (same animation, bit faster UI-wise but same data cost)
3. Time: "843 milliseconds" (similar duration)
4. This repeats 3-4 times in rapid succession (representing repeated queries in production)
5. Total time wasted: "~3.4 seconds just to find one person 4 times!"
6. Red warning badge: "⚠️ Wasteful! Same query, same expensive scan"

**Visual emphasis:** Problem compounds with repeated queries (real-world scenario).

---

#### Beat 4 — The Pain (8.5–10s)

**Tujuo:** Quantify the cost at scale.

**Animasi:**
1. Cost analysis appears (chart-like):
   - Per query: 847ms
   - Per second (web server): ~100 requests = 84,700ms wasted
   - Per day: billions of milliseconds wasted
2. Application metrics:
   - Server CPU spike (red, high usage)
   - Response time (slow, red badge: "2-5 seconds")
   - User experience impact (sad emoji 😞)
3. Developer realizes: "This won't scale"
4. Question appears: "There must be a better way?"

**Text overlay:** "Full table scans don't scale with data growth"

---

### Phase 1 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| The Table | 3s | 1 million rows visualized |
| The Query | 3s | Full table scan, 847ms |
| Query Repeats | 2.5s | Repeated scans, waste quantified |
| The Pain | 1.5s | Problem analysis, developer's realization |
| **Total Phase 1** | **10s** | |

---

### Phase 2 — THE INDEX SOLUTION (14 detik)

**Badge:** "THE INDEX" (green badge)  
**Caption:** "Create index, queries become instant"

#### Beat 1 — Understanding Indexing (0–3.5s)

**Metaphor:** Phone book analogy

**Animasi:**
1. Split screen:
   - **Left:** Old way — flip pages manually searching (boring)
   - **Right:** New way — use index at back (instant)
2. Index visualization:
   - Alphabetical index: "A → Page 5, B → Page 12, C → Page 23, ..."
   - Index is sorted reference, points to data location
3. Text explanation:
   - "Index = Sorted copy of column values + pointers to rows"
   - "Like a book's index: alphabetical, tells you which page"
4. Decision: "Create index on `email` column"
5. Command appears: `CREATE INDEX idx_email ON users(email);`

---

#### Beat 2 — Building the B-tree Index (3.5–9s)

**Tujuan:** Show how index is structured (B-tree).

**B-tree visualization:**

```
           ┌──────────────────┐
           │  Internal Node   │
           │ [d] [m] [s]      │  <- Keys
           └─┬────┬────┬─────┘
             │    │    │
        ┌────┘    │    └─────┐
        │         │          │
    ┌──────┐  ┌──────┐  ┌──────┐
    │Leaf 1│  │Leaf 2│  │Leaf 3│  <- Points to rows
    │a-c   │  │d-r   │  │s-z   │
    └──────┘  └──────┘  └──────┘
```

**Animasi:**
1. Rows of data start transforming
2. Rows are **sorted by email** (animation: rows re-order)
3. Tree structure starts building from bottom-up:
   - **Leaf nodes** created (bottom level, contain actual data)
   - Each leaf node: small range of emails (a-c, d-r, s-z)
   - Color: green for leaf nodes
4. **Internal nodes** created (middle level):
   - Separators inserted: [d], [m], [s]
   - Color: purple for internal nodes
5. **Root node** at top:
   - Points to internal nodes
   - Color: gold for root
6. Tree is fully balanced (animation: height stabilizes at ~log(N) depth)
7. Time to build: "3.2 seconds" (one-time cost)
8. Index size: "~80MB" (overhead, but worth it)

**Key concept:** B-tree provides logarithmic lookup depth.

---

#### Beat 3 — Querying with Index (9–12.5s)

**Tujuno:** Same query now uses index — instant.

**Query:** `SELECT * FROM users WHERE email = 'alice@example.com'`

**Animasi:**
1. Same query executed
2. Database engine decision: "Index exists, use it!"
3. **Index lookup path** visualized (animation):
   - Start at root node
   - "alice@..." < "d" ? Go left
   - Find leaf node [a-c]
   - Binary search within leaf (fast)
   - Found: "alice@example.com" ✓
4. Path highlighted in pink (glowing line through tree)
5. Row pointer followed (animation: path to table row)
6. Row retrieved instantly
7. Time counter: "2 milliseconds" (vs 847ms before!)
8. **Speed comparison appears:**
   - Before: 847ms (red)
   - After: 2ms (green)
   - **Speedup: ~424x faster!**
9. Success badge: "✓ Index lookup!"

**Visual emphasis:** Dramatic speed improvement via logarithmic traversal.

---

#### Beat 4 — Multiple Queries (12.5–14s)

**Tujuo:** Same queries execute quickly now.

**Animasi:**
1. Same query repeated 4 times
2. Each time: instant lookup (~2ms each)
3. Total time: "8ms for 4 queries" (vs 3.4 seconds before)
4. Green checkmark: "✓ Queries are instant!"
5. CPU usage drops (animation: CPU bar shrinks, becomes green)
6. Response time improves (green badge: "<100ms")
7. Happy emoji: "😄 Scalable!"

---

### Phase 2 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Understanding Indexing | 3.5s | Phone book metaphor, index concept |
| Building B-tree | 5.5s | Tree structure creation, balanced |
| Querying with Index | 3.5s | Lookup path, speed comparison |
| Multiple Queries | 1.5s | Repeated queries, now fast |
| **Total Phase 2** | **14s** | |

---

### Phase 3 — INDEX TYPES & TRADEOFFS (10 detik)

**Badge:** "INDEX TYPES" (purple badge)  
**Caption:** "Different indexes for different queries"

#### Beat 1 — Single Column Index (0–2.5s)

**Tujuo:** Basic index on one column.

**Animasi:**
1. Index on `email` column (already shown)
2. Queries it speeds up:
   - `WHERE email = '...'` ✓ Fast
   - `WHERE email LIKE 'a%'` ✓ Fast (range scan)
   - `WHERE email != '...'` ❌ Still slow (negation)
3. Table shown, index tree highlighted
4. Label: "Single-column index: Good for exact match or range queries"

---

#### Beat 2 — Composite Index (2.5–5s)

**Tujuo:** Index on multiple columns.

**Scenario:** Query users by (country, email)

**Animasi:**
1. New index created on (country, email) columns
2. Tree structure re-organizes:
   - First level: partitioned by country (US, UK, CA, ...)
   - Second level: within each country, sorted by email
3. Query: `WHERE country = 'US' AND email LIKE 'a%'` 
4. Lookup path:
   - Find "US" partition (fast)
   - Within US, find emails starting with 'a' (fast)
5. Speed: "3ms" (could be slower if not ordered correctly)
6. Label: "Composite index: Order matters! Put equality first, then range"

---

#### Beat 3 — The Tradeoff (5–10s)

**Tujuo:** Indexes have costs (storage, write performance).

**Animasi:**
1. Index benefits (left side, green):
   - ✓ Queries 100x faster
   - ✓ Sorting free (index already sorted)
   - ✓ Range scans efficient
2. Index costs (right side, red):
   - ❌ Extra disk space (+80MB for this example)
   - ❌ Slower writes (INSERT/UPDATE/DELETE must update index)
   - ❌ Memory overhead (index cached in RAM)
3. Write operation shown (INSERT):
   - Without index: Write row → Done (1ms)
   - With index: Write row → Update index → Rebalance tree (5ms)
   - **4ms slower per write**
4. Tradeoff analysis:
   - **Read-heavy workload:** Indexes worth it
   - **Write-heavy workload:** Fewer indexes
   - **Mixed workload:** Strategic indexing
5. Developer decision: "Create index on frequently queried columns"

**Visual:** Scale showing tradeoff between read speed and write cost.

---

### Phase 3 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Single Column Index | 2.5s | Basic index use cases |
| Composite Index | 2.5s | Multi-column index, order matters |
| The Tradeoff | 5s | Benefits vs costs, strategic indexing |
| **Total Phase 3** | **10s** | |

---

### Phase 4 — REAL-WORLD SCENARIOS (8 detik)

**Badge:** "REAL-WORLD" (gold badge)  
**Caption:** "When to index, when not to"

#### Beat 1 — Good Indexing Candidates (0–3s)

**Animasi:**
1. Four scenarios appear with checkmarks/X:
   - **`user_id` in orders table** ✓ Index it (foreign key, join filter)
   - **`created_at`** ✓ Index it (range queries, sorting)
   - **`status` (LOW cardinality: 3 values)** ❌ Skip (index inefficient)
   - **`email`** ✓ Index it (unique, frequently searched)
2. Rule of thumb shown:
   - High cardinality columns: Index (email, id, date)
   - Low cardinality: Skip (boolean, status enum)
   - Frequently filtered: Always index
3. Example query that benefits: `SELECT * FROM orders WHERE user_id = 123 AND created_at > '2024-01-01'`

---

#### Beat 2 — Bad Indexing Mistakes (3–5.5s)

**Animasi:**
1. Common mistakes:
   - **Over-indexing:** Create index on every column (slower writes, disk bloat)
   - **Wrong order in composite:** `(email, country)` instead of `(country, email)` for `WHERE country = 'US' AND email LIKE 'a%'`
   - **Index on computed column:** Index on `UPPER(email)` doesn't help `LIKE 'a%'` query
2. Developer wastes time debugging slow queries, finds unused indexes
3. Cleanup: Drop unnecessary indexes
4. Red badge: "❌ Over-indexing hurts more than it helps"

---

#### Beat 3 — Query Analyzer Shows It (5.5–8s)

**Tujuo:** Tools to find index problems.

**Animasi:**
1. **Query execution plan** appears (simplified):
   - Bad plan: "Full table scan (847ms)"
   - Good plan: "Index scan (2ms)" with tree visualization
2. **EXPLAIN/ANALYZE output** shown:
   - Rows examined: 1,000,000 (bad) vs 47 (good via index)
   - Execution time: 847ms vs 2ms
3. Developer runs: `EXPLAIN SELECT * FROM users WHERE email = '...';`
4. Tool recommends: "Add index on `email` column for 400x speedup"
5. Developer heeds advice, problem solved

---

### Phase 4 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Good Indexing Candidates | 3s | Which columns to index |
| Bad Indexing Mistakes | 2.5s | Over-indexing, wrong order |
| Query Analyzer | 2.5s | Tools to diagnose and fix |
| **Total Phase 4** | **8s** | |

---

### Outro — Indexing Mastery (4 detik)

**Badge:** "KEY PRINCIPLES"  
**Caption:** "Index wisely: faster queries, slower writes"

**Animasi:**
1. Principles slide in:
   - **"Understand your queries"** — index what you filter/sort on
   - **"B-trees are efficient"** — logarithmic lookup depth
   - **"Tradeoffs matter"** — reads vs writes
   - **"Measure, don't guess"** — use EXPLAIN to diagnose
2. B-tree icon glows (gold)
3. Text: "Database indexing: The difference between seconds and milliseconds"
4. Fade to brand outro

---

## Timing (Full Animation)

| Phase | Duration | Cumulative |
|-------|----------|------------|
| The Problem | 10s | 0-10s |
| The Index Solution | 14s | 10-24s |
| Index Types & Tradeoffs | 10s | 24-34s |
| Real-World Scenarios | 8s | 34-42s |
| Outro | 4s | 42-46s |
| **Total** | **46s** | |

---

## Data Needed

```javascript
// === TABLE DATA ===
export const TABLE_STATS = {
  name: 'users',
  rowCount: 1000000,
  averageRowSize: 200,  // bytes
  totalSize: 200,  // MB
  columns: [
    { name: 'id', type: 'INT', cardinality: 'HIGH' },
    { name: 'name', type: 'VARCHAR(100)', cardinality: 'HIGH' },
    { name: 'email', type: 'VARCHAR(255)', cardinality: 'HIGH' },
    { name: 'created_at', type: 'DATETIME', cardinality: 'HIGH' },
    { name: 'status', type: 'ENUM', values: ['active', 'inactive', 'suspended'], cardinality: 'LOW' },
  ],
}

// === QUERY PERFORMANCE ===
export const QUERY_PERFORMANCE = {
  withoutIndex: {
    method: 'Full Table Scan',
    rowsExamined: 1000000,
    rowsMatched: 1,
    executionTime: 847,  // ms
    cpuUsage: 45,  // %
  },
  withIndex: {
    method: 'Index Lookup',
    rowsExamined: 47,
    rowsMatched: 1,
    executionTime: 2,  // ms
    cpuUsage: 2,  // %
  },
}

// === B-TREE STRUCTURE ===
export const BTREE_INDEX = {
  name: 'idx_email',
  column: 'email',
  type: 'B-tree',
  depth: 4,  // log(1000000) ≈ 4
  size: 80,  // MB
  nodes: {
    root: { key: 'root', count: 1 },
    internal: { depth: [2, 3], count: 156 },
    leaf: { depth: 4, count: 250000 },
  },
}

// === INDEX TYPES ===
export const INDEX_TYPES = [
  {
    name: 'Single-Column Index',
    example: 'CREATE INDEX idx_email ON users(email);',
    bestFor: ['Equality queries', 'Range queries', 'Sorting'],
    examples: ['WHERE email = ...', 'WHERE email LIKE "a%"'],
  },
  {
    name: 'Composite Index',
    example: 'CREATE INDEX idx_country_email ON users(country, email);',
    bestFor: ['Multi-column filters', 'Complex queries'],
    examples: ['WHERE country = "US" AND email LIKE "a%"'],
  },
  {
    name: 'Unique Index',
    example: 'CREATE UNIQUE INDEX idx_email ON users(email);',
    bestFor: ['Uniqueness guarantee', 'Primary keys'],
    examples: ['Ensuring one email per user'],
  },
]

// === WRITE PERFORMANCE ===
export const WRITE_PERFORMANCE = {
  insert: {
    withoutIndex: 1,  // ms
    withIndex: 5,  // ms
    overhead: 4,  // ms
  },
  update: {
    withoutIndex: 1,  // ms
    withIndex: 6,  // ms
    overhead: 5,  // ms (must update index)
  },
  delete: {
    withoutIndex: 1,  // ms
    withIndex: 5,  // ms
    overhead: 4,  // ms
  },
}

// === GOOD INDEX CANDIDATES ===
export const INDEX_CANDIDATES = [
  { column: 'user_id', cardinality: 'HIGH', filtered: true, recommendation: '✓ Index it' },
  { column: 'created_at', cardinality: 'HIGH', filtered: true, recommendation: '✓ Index it' },
  { column: 'status', cardinality: 'LOW', filtered: false, recommendation: '❌ Skip' },
  { column: 'email', cardinality: 'HIGH', filtered: true, recommendation: '✓ Index it' },
]

// === PHASES ===
export const PHASES = [
  { badge: 'THE SEARCH PROBLEM', badgeColor: '#EF4444', caption: 'Finding data in a massive table — the naive way', duration: 10 },
  { badge: 'THE INDEX SOLUTION', badgeColor: '#10B981', caption: 'Create index, queries become instant', duration: 14 },
  { badge: 'INDEX TYPES', badgeColor: '#8B5CF6', caption: 'Different indexes for different queries', duration: 10 },
  { badge: 'REAL-WORLD', badgeColor: '#FBBF24', caption: 'When to index, when not to', duration: 8 },
]

export const VW = 820
export const VH = 1340
```

---

## File Structure

```
src/content/database-indexing/
├── data.js           ← Table stats, query performance, B-tree, indexes
└── Animation.jsx     ← React component (default export)
```

---

## Animation Tech Notes

- **GSAP timeline** with sub-timelines for each phase
- **Row scanning animation:** Use `gsap.staggerTo()` for row-by-row highlight sweep
- **B-tree visualization:** SVG nested `<g>` elements for nodes, `<line>` for connections
- **Tree traversal:** `createGlowDot` animated along path from root to leaf
- **Performance comparison:** Dual bars side-by-side with counter animation
- **Lookup path highlighting:** Glow effect on selected path through tree

### Key GSAP Patterns

```javascript
// Full table scan (row-by-row)
gsap.staggerTo(rows, 0.1, {
  backgroundColor: '#E5E7EB',
  opacity: 0.5,
  ease: "power1.inOut"
}, 0.01)  // stagger 10ms between each row

// Time counter
gsap.to(timeCounter, {
  innerText: 847,
  duration: 2,
  snap: { innerText: 1 },
  ease: "power2.inOut"
})

// Tree building (nodes appear bottom-up)
gsap.fromTo(leafNodes,
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 0.5, delay: (_, i) => i * 0.1 }
)

gsap.fromTo(internalNodes,
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 0.5, delay: 2.5 },
  0  // absolute position in timeline
)

gsap.fromTo(rootNode,
  { opacity: 0, scale: 0 },
  { opacity: 1, scale: 1, duration: 0.5, delay: 3 },
  0  // absolute position
)

// Index lookup path (glow along path)
gsap.to(pathLine, {
  strokeDashoffset: 0,
  stroke: '#EC4899',
  strokeWidth: 4,
  duration: 2,
  ease: "power2.inOut"
})

// Speed comparison (bars shrink/grow)
gsap.to(slowBar, {
  width: 0.9 * maxWidth,  // 847ms normalized
  duration: 1,
  ease: "power1.out"
})

gsap.to(fastBar, {
  width: 0.05 * maxWidth,  // 2ms normalized
  duration: 1,
  ease: "power1.out",
  delay: 0.5
})
```

---

## Notes

- Background ALWAYS `#090b15`
- ViewBox ALWAYS `0 0 820 1340`
- Red (#FF6B6B) is primary theme (emphasis on performance impact)
- B-tree depth logarithmic — show depth = log(1,000,000) ≈ 4
- TTL for database context — no expiration here, but highlight "rebuild on write"
- Realistic numbers: 1M rows, 200MB table size, ~2ms vs 847ms
- Phone book analogy helps non-DBAs understand concept
- Tradeoff analysis (read vs write) is crucial for advanced understanding
- Query analyzer tools (EXPLAIN) shown as practical solution
- Composite index order matters — good teaching point
- Real-world scenarios avoid N+1 queries (save for advanced topic)
- Write overhead quantified (4-5ms per operation adds up)