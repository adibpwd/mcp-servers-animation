# DNS Resolution — Topic Plan

## Overview

Animasi narrative-driven: User types domain → DNS query recursively travels through hierarchy → IP returned. Metaphor: dari phone book lookup ke hierarchical directory system. Visual: DNS query sebagai packet yang travel melalui DNS servers (recursive resolver, root, TLD, authoritative).

**Canvas:** 820 × 1340 (portrait 9:16)  
**Difficulty:** ⭐⭐ (Intermediate)  
**Estimasi:** 1-2 hari kerja

---

## Color Palette

```
Primary:           #06B6D4 (Cyan, technical)
Secondary:         #0891B2 (darker cyan)
Client:            #60A5FA (blue, user)
Resolver:          #10B981 (green, local)
Root Nameserver:   #FBBF24 (gold, top level)
TLD Nameserver:    #F97316 (orange, middle)
Authoritative NS:  #8B5CF6 (purple, authority)
Query:             #EC4899 (pink, outgoing)
Response:          #10B981 (green, incoming)
Cache:             #6B7280 (gray, stored)
Error:             #EF4444 (red, failure)
```

---

## Animation Breakdown

---

### Phase 1 — THE QUESTION (8 detik)

**Badge:** "THE QUESTION" (blue badge)  
**Caption:** "User wants to visit a website. But how to find it?"

#### Beat 1 — User & Browser (0–2s)

**Tujuan:** Establish the starting point — user in browser.

**Layout:**
```
        ╭──────────────────╮
        │   Web Browser    │
        │  google.com      │
        │  (address bar)   │
        ╰────────┬─────────╯
                 │
         (DNS query?)
```

**Animasi:**
1. Browser window appears (phone/laptop screen)
2. Address bar shows: "google.com" (typed, cursor blinking)
3. User clicks "Enter" or "Go" button (💥 press animation)
4. Browser pauses, thinking animation (loading spinner)
5. Speech bubble appears: "I need to find google.com's IP address"
6. Browser icon starts glowing (cyan)
7. Caption: "But the browser only knows domain names, not IP addresses"

---

#### Beat 2 — The Need for DNS (2–5s)

**Tujuan:** Explain why DNS is needed.

**Animasi:**
1. Two panels appear side-by-side:
   - **Left:** Domain name "google.com" (human readable)
   - **Right:** IP address "142.250.185.46" (technical)
2. Arrow with "???" between them
3. Text appears: "Browser needs IP to connect, but user remembers domain"
4. Problem highlighted in red: "❌ Don't know IP"
5. DNS logo appears (blue, glowing)
6. Solution highlighted in green: "✓ DNS can translate!"
7. Caption: "DNS = Phone book of the internet"

**Visual emphasis:** The translation problem is the core issue.

---

#### Beat 3 — Query Sent (5–8s)

**Tujuan:** Browser sends DNS query to resolver.

**Animasi:**
1. Browser creates DNS query packet (cyan square with label "query")
2. Query contains:
   - Domain: "google.com"
   - Type: "A" (IPv4 address)
   - ID: random (shown as hex)
3. Query packet **floats down** from browser (animation: smooth descent)
4. Below browser: **Recursive Resolver** appears (green box, labeled "ISP/Google DNS")
5. Query packet lands in resolver (↓ impact animation)
6. Resolver glows briefly (cyan pulse)
7. Resolver starts processing: "I don't have this cached..."
8. Caption: "Query sent to recursive resolver (usually ISP's DNS)"

**Visual:** Query as small animated packet, resolver as waiting destination.

---

### Phase 1 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| User & Browser | 2s | User types domain, presses enter |
| The Need for DNS | 3s | Domain vs IP problem introduced |
| Query Sent | 3s | Query packet travels to resolver |
| **Total Phase 1** | **8s** | |

---

### Phase 2 — THE RECURSIVE JOURNEY (14 detik)

**Badge:** "RECURSIVE JOURNEY" (gold badge)  
**Caption:** "Query travels through DNS hierarchy to find answer"

#### Beat 1 — Resolver Queries Root (0–4s)

**Tujuan:** First step in recursion — ask root nameserver.

**Layout — DNS Hierarchy:**
```
Recursive Resolver (Local)
        │
        ↓
Root Nameserver (13 worldwide)
        │
        ↓
TLD Nameserver (.com, .org, etc.)
        │
        ↓
Authoritative Nameserver (google.com's official NS)
        │
        ↓
IP Address (142.250.185.46)
```

**Animasi:**
1. Resolver shows thinking process: "I'll ask the Root Nameserver"
2. Query packet copies (clone animation)
3. Packet **floats up** from resolver to Root Nameserver (gold circle, top of hierarchy)
4. Root NS labeled: "I don't know google.com's IP..."
5. Root NS responds: "But I know who handles .com domains!"
6. Root NS sends back **TLD Nameserver address** (also as packet)
7. Response packet floats back down to Resolver
8. Resolver receives: "Go ask this TLD NS for .com"
9. Animation timing: 1-2 second round trip per query
10. Text overlay: "Root NS knows the hierarchy, not individual domains"

**Visual:** Each query-response as paired packets (query = pink ↑, response = green ↓).

---

#### Beat 2 — Resolver Queries TLD (4–9s)

**Tujuan:** Second step — ask TLD nameserver.

**Animasi:**
1. Resolver creates new query packet: "Where is google.com?"
2. Packet floats to TLD Nameserver (orange circle, middle level)
3. TLD NS labeled: ".com authority"
4. TLD NS receives query, glows
5. TLD NS responds: "I don't know google.com's IP..."
6. TLD NS: "But I know Google's Authoritative Nameserver!"
7. TLD NS sends back **Authoritative NS address**
8. Response packet returns to Resolver
9. Resolver: "Now I know who DOES know the answer"
10. Text overlay: "TLD NS delegates to authoritative NS"

**Visual:** Hierarchy descending further, getting closer to answer.

---

#### Beat 3 — Resolver Queries Authoritative (9–13s)

**Tujuan:** Final step — ask authoritative nameserver (has actual IP).

**Animasi:**
1. Resolver creates final query: "Give me google.com's IP"
2. Packet floats to **Authoritative Nameserver** (purple circle, bottom)
3. Auth NS labeled: "google.com's official NS"
4. Auth NS glows (knows the answer!)
5. Auth NS responds with: **IP address "142.250.185.46"**
6. Response packet is special (golden glow, star animation):
   - Contains IP
   - Contains TTL (Time To Live): 300 seconds
   - Marked as "ANSWER FOUND!" ✓
7. Packet floats back down to Resolver
8. Resolver celebrates (brief celebration animation)

**Visual emphasis:** Auth NS is the source of truth.

---

#### Beat 4 — Resolver Caches & Responds (13–14s)

**Tujuan:** Resolver stores answer and sends to browser.

**Animasi:**
1. Resolver receives IP, stores in **Cache** (gray database icon)
2. Cache shows: "google.com → 142.250.185.46" with TTL timer (300s countdown starts)
3. Resolver creates response packet (green, official answer)
4. Packet floats back up to Browser
5. Browser receives response: "Here's the IP!"
6. Browser displays: "✓ IP: 142.250.185.46"
7. Browser connects to IP (visual: connection line draws)
8. Caption: "Now browser can connect to Google's server!"

---

### Phase 2 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Resolver → Root | 4s | First query up, TLD address received |
| Resolver → TLD | 5s | Second query, Auth NS address received |
| Resolver → Auth | 4s | Final query, IP address received |
| Cache & Respond | 1s | Answer cached, sent to browser |
| **Total Phase 2** | **14s** | |

---

### Phase 3 — CACHING & SPEED (8 detik)

**Badge:** "CACHING" (gray badge)  
**Caption:** "Cached answers are instant — no need to query hierarchy again"

#### Beat 1 — Cache Hit (0–4s)

**Tujuan:** Show how cache eliminates future lookups.

**Scenario:** Same user (or another user) visits google.com again.

**Animasi:**
1. Browser 2 (different user) types "google.com"
2. Query travels to Resolver
3. Resolver checks cache: "google.com cached!"
4. Cache entry glows (gray box with entry highlighted)
5. TTL timer shows remaining time: "250 seconds left"
6. Resolver immediately responds from cache
7. No journey to Root/TLD/Auth NS (they stay dim/inactive)
8. Response packet returns instantly (faster animation)
9. Browser 2 gets IP in milliseconds
10. Comparison: "With cache: 1ms | Without cache: 200ms"

**Visual:** Direct path from Resolver to Browser, hierarchy unused.

---

#### Beat 2 — Cache Expiration (4–8s)

**Tujuan:** Show how TTL ensures fresh data.

**Animasi:**
1. Cache entry for google.com shown with TTL timer
2. Timer counts down: "250s → 100s → 10s → 0s"
3. When TTL reaches 0:
   - Cache entry **fades** (becomes invalid)
   - Red "EXPIRED" label appears
4. Next query for google.com after expiration:
   - Can't use cache
   - Must query hierarchy again (full journey)
   - Gets fresh IP (might be different if Google changed infra)
5. New TTL timer starts (300s again)
6. Text overlay: "TTL = Time To Live. Balances speed (cache) vs freshness (queries)"

**Visual emphasis:** TTL is the safety mechanism.

---

### Phase 3 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Cache Hit | 4s | Cached query, instant response |
| Cache Expiration | 4s | TTL expires, cache invalidated |
| **Total Phase 3** | **8s** | |

---

### Phase 4 — REAL-WORLD & ATTACKS (10 detik)

**Badge:** "DNS IN PRACTICE" (cyan badge)  
**Caption:** "DNS is everywhere — and vulnerable"

#### Beat 1 — Multiple Layers of Caching (0–3s)

**Tujuan:** Show DNS caching at multiple levels.

**Layout:**
```
Browser cache (milliseconds)
        ↓
OS cache (seconds)
        ↓
ISP Resolver cache (minutes)
        ↓
(Potentially CDN cache)
```

**Animasi:**
1. Three cache layers appear vertically:
   - **Browser cache** (top, blue)
   - **OS cache** (middle, green)
   - **ISP Resolver cache** (bottom, gold)
2. Query travels down layers:
   - Hits browser cache? Answer immediately
   - Misses? Check OS cache
   - Misses? Check ISP cache
   - Misses? Start recursive query
3. Animation shows "cache hit rates" improving (bars filling)
4. Text: "Most queries answered from cache (billions per second globally)"

**Visual:** Caching layers as concentric circles or vertical stack.

---

#### Beat 2 — DNS Attacks (3–7s)

**Tujuan:** Briefly show security concerns (DNS spoofing, poisoning).

**Animasi:**
1. Normal DNS query shown (good flow, green)
2. Attack scenario: **DNS Spoofing**
   - Attacker intercepts query
   - Sends fake response before real server replies
   - Fake response contains malicious IP
3. Malicious response packet shown (red, warning icon ⚠️)
4. Browser receives fake IP, connects to attacker's server
5. User data compromised (padlock icon broken 🔓)
6. Text: "DNS Spoofing: Attacker intercepts query, sends fake answer"
7. Another attack: **DNS Poisoning**
   - Attacker poisons resolver's cache
   - All users of that resolver get fake IP
   - Larger impact (scale animation, spreading effect)

**Visual emphasis:** Risk and scale of attacks, why DNSSEC matters.

---

#### Beat 3 — DNSSEC Protection (7–10s)

**Tujuno:** Show how DNSSEC prevents attacks.

**Animasi:**
1. DNSSEC enabled scenario
2. DNS response includes **digital signature** (lock icon, golden)
3. Browser verifies signature using public key (checkmark animation)
4. Attacker tries spoofing with fake response
5. Fake response signature **fails verification** (red X, lock breaks)
6. Browser rejects fake response: "❌ Invalid signature"
7. Browser waits for real response (from trusted server)
8. Real response arrives, signature verified ✓
9. Text: "DNSSEC = Digital signatures on DNS responses"

**Visual:** Lock/unlock metaphor for security validation.

---

### Phase 4 Timing Summary

| Beat | Duration | What happens |
|------|----------|-------------|
| Multiple Caching Layers | 3s | Browser, OS, ISP caching shown |
| DNS Attacks | 4s | Spoofing, poisoning illustrated |
| DNSSEC Protection | 3s | Digital signatures prevent attacks |
| **Total Phase 4** | **10s** | |

---

### Outro — DNS Mastery (4 detik)

**Badge:** "KEY TAKEAWAYS"  
**Caption:** "DNS: Domain to IP, hierarchy, cache, security"

**Animasi:**
1. Key concepts slide in from sides:
   - **"Recursive"** — travels through hierarchy
   - **"Cached"** — stored at multiple levels
   - **"Fast"** — millisecond response times
   - **"Secure"** — DNSSEC protects against attacks
2. DNS globe icon (earth with domain names) rotates
3. Text: "DNS runs the internet, silently, billions of times daily"
4. Fade to brand outro

---

## Timing (Full Animation)

| Phase | Duration | Cumulative |
|-------|----------|------------|
| The Question | 8s | 0-8s |
| Recursive Journey | 14s | 8-22s |
| Caching & Speed | 8s | 22-30s |
| Real-World & Attacks | 10s | 30-40s |
| Outro | 4s | 40-44s |
| **Total** | **44s** | |

---

## Data Needed

```javascript
// === DNS HIERARCHY ===
export const DNS_HIERARCHY = [
  {
    level: 1,
    name: 'Root Nameserver',
    count: 13,
    color: '#FBBF24',
    role: 'Knows TLD servers',
    examples: ['a.root-servers.net', 'b.root-servers.net'],
  },
  {
    level: 2,
    name: 'TLD Nameserver',
    tld: '.com',
    color: '#F97316',
    role: 'Knows authoritative NS',
    example: 'gtld-servers.com.',
  },
  {
    level: 3,
    name: 'Authoritative Nameserver',
    domain: 'google.com',
    color: '#8B5CF6',
    role: 'Knows actual IP',
    example: 'ns1.google.com',
  },
]

// === DNS COMPONENTS ===
export const DNS_COMPONENTS = {
  resolver: { name: 'Recursive Resolver', color: '#10B981', type: 'local', role: 'Asks questions' },
  browser: { name: 'Browser', color: '#60A5FA', type: 'client', role: 'Initiates query' },
  cache: { name: 'Cache', color: '#6B7280', type: 'storage', role: 'Stores answers' },
}

// === EXAMPLE QUERY ===
export const EXAMPLE_QUERY = {
  domain: 'google.com',
  ip: '142.250.185.46',
  type: 'A',
  ttl: 300,  // seconds
  journey: [
    { server: 'Resolver', status: 'checking cache', cached: false },
    { server: 'Root NS', status: 'asking for .com handler', response: 'TLD NS address' },
    { server: 'TLD NS', status: 'asking for google.com handler', response: 'Auth NS address' },
    { server: 'Auth NS', status: 'asking for IP', response: '142.250.185.46' },
    { server: 'Resolver', status: 'caching answer', cached: true },
  ],
}

// === CACHING LAYERS ===
export const CACHE_LAYERS = [
  { name: 'Browser Cache', ttl: 'minutes', speed: '1ms' },
  { name: 'OS Cache', ttl: 'minutes', speed: '5ms' },
  { name: 'ISP Resolver Cache', ttl: 'hours', speed: '50ms' },
]

// === ATTACK SCENARIOS ===
export const ATTACKS = [
  {
    type: 'DNS Spoofing',
    mechanism: 'Intercept query, send fake response first',
    impact: 'Single user redirected',
    mitigation: 'DNSSEC validation',
  },
  {
    type: 'DNS Poisoning',
    mechanism: 'Poison resolver cache with fake entry',
    impact: 'All users of resolver affected',
    mitigation: 'DNSSEC validation + cache isolation',
  },
]

// === PHASES ===
export const PHASES = [
  { badge: 'THE QUESTION', badgeColor: '#60A5FA', caption: 'User wants to visit a website. But how to find it?', duration: 8 },
  { badge: 'RECURSIVE JOURNEY', badgeColor: '#FBBF24', caption: 'Query travels through DNS hierarchy to find answer', duration: 14 },
  { badge: 'CACHING & SPEED', badgeColor: '#6B7280', caption: 'Cached answers are instant — no need to query again', duration: 8 },
  { badge: 'DNS IN PRACTICE', badgeColor: '#06B6D4', caption: 'DNS is everywhere — and vulnerable', duration: 10 },
]

export const VW = 820
export const VH = 1340
```

---

## File Structure

```
src/content/dns-resolution/
├── data.js           ← DNS hierarchy, queries, caching, attacks
└── Animation.jsx     ← React component (default export)
```

---

## Animation Tech Notes

- **GSAP timeline** with sub-timelines for each recursive step
- **Query packet animation:** `createGlowDot` with custom path (vertical up/down)
- **Hierarchy visualization:** SVG circles positioned at different y-levels, connected by lines
- **Cache visualization:** SVG rectangles with text entries, TTL timer countdown
- **Response flow:** Color change from pink (query) to green (response)
- **Attack visualization:** Red highlight, "fake" packet overlay, interception animation

### Key GSAP Patterns

```javascript
// Query packet travels to resolver
gsap.to(queryPacket, {
  y: 200,  // float down
  opacity: 1,
  duration: 1.5,
  ease: "power2.inOut"
})

// Recursive query up hierarchy
gsap.to(queryPacket, {
  y: -300,  // float up to Root NS
  duration: 1.2,
  ease: "power2.out"
})

// Response packet returns
gsap.to(responsePacket, {
  y: 300,  // float down
  color: '#10B981',  // green response color
  duration: 1.5,
  ease: "power2.inOut"
})

// TTL countdown
gsap.to(ttlCounter, {
  innerText: 0,
  duration: 300,  // 300 seconds
  snap: { innerText: 1 },  // round to integers
  ease: "none"
})

// Cache hit (instant response)
gsap.to(responsePacket, {
  y: 200,
  duration: 0.3,  // much faster than normal query
  ease: "power1.out"
})

// Attack interception
gsap.to(attackPacket, {
  x: 150,  // intercept path
  y: 100,
  fill: '#EF4444',  // red malicious color
  duration: 0.8,
  ease: "power1.inOut"
})
```

---

## Notes

- Background ALWAYS `#090b15`
- ViewBox ALWAYS `0 0 820 1340`
- Use `createGlowDot` from `src/shared/GlowDot.js` for query/response packets
- Cyan (#06B6D4) is primary theme (technical, DNS-specific)
- Hierarchy levels clearly separated vertically
- TTL countdown is real-time (300 seconds = 5 minutes, show time-lapse)
- Packet animation should feel like travel (not instant)
- Caching explained as fundamental performance mechanism
- Attacks shown to emphasize importance of DNSSEC
- Real-world IP address (Google's) makes it tangible
- Beginner-friendly: avoid technical details like "glue records", "zone transfers"
- Multi-user cache hits show global scale of DNS