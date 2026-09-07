# CPU Architecture & Internals — Animation Content Roadmap

**Document Status**: Planning Phase  
**Last Updated**: 2026-09-06  
**Total Topics**: ~35-40  
**Sections**: 7  
**Est. Total Duration**: 4-5 hours of animation content

---

## Table of Contents

1. [Overview](#overview)
2. [Section 1: CPU Fundamentals](#section-1-cpu-fundamentals-5-topics)
3. [Section 2: Pipelining & Execution](#section-2-pipelining--execution-6-topics)
4. [Section 3: Cache Hierarchy](#section-3-cache-hierarchy-6-topics)
5. [Section 4: Multi-Core & Threading](#section-4-multi-core--threading-7-topics)
6. [Section 5: Speculative Execution & Security](#section-5-speculative-execution--security-5-topics)
7. [Section 6: Memory Management](#section-6-memory-management-5-topics)
8. [Section 7: Advanced Topics](#section-7-advanced-topics-5-topics)
9. [Production Roadmap](#production-roadmap)
10. [GPU Pipeline Preview](#gpu-pipeline-preview)

---

## Overview

This roadmap breaks down CPU Architecture into digestible animation topics suitable for IT professionals, junior developers, and enthusiast learners. Each topic is self-contained and can be animated independently following the project's standards.

**Key Design Principles:**
- Start with fundamentals (Section 1)
- Progress through core performance concepts (Sections 2-3)
- Move to multi-core complexity (Section 4)
- Introduce advanced/security topics last (Sections 5-7)
- Each animation 30-90 seconds in duration

---

## Section 1: CPU Fundamentals (5 topics)

### 1.1 | What is a CPU? (The Basics)

| Aspect | Details |
|--------|---------|
| **Scope** | Very small |
| **Duration** | 30-40 seconds |
| **Audience** | Total beginners, IT generalists |
| **Complexity** | Low |
| **Key Visual** | CPU box with inputs (data, instructions) → processing → outputs (results) |
| **Core Concept** | CPU = machine executing instructions from memory |
| **Learning Goal** | Understand CPU as instruction executor |
| **Implementation Note** | Simple box animation, arrow flow |
| **Status** | Planned |

### 1.2 | CPU Clock & Frequency

| Aspect | Details |
|--------|---------|
| **Scope** | Small |
| **Duration** | 40 seconds |
| **Audience** | Junior developers, enthusiasts |
| **Complexity** | Low |
| **Key Visual** | Oscillating clock signal, ticks marking instruction execution beats |
| **Core Concept** | GHz = billions of cycles/second; faster clock = more instructions/sec |
| **Learning Goal** | Understand relationship between clock frequency and throughput |
| **Implementation Note** | Waveform animation, counter incrementing with each cycle |
| **Status** | Planned |

### 1.3 | Instruction Fetch-Decode-Execute Cycle ⭐ MVP

| Aspect | Details |
|--------|---------|
| **Scope** | Small-Medium |
| **Duration** | 50 seconds |
| **Audience** | CS students, junior developers |
| **Complexity** | Low-Medium |
| **Key Visual** | 3-step loop: Fetch → Decode → Execute → Store result, repeated |
| **Core Concept** | Every CPU operation follows FDE cycle |
| **Learning Goal** | Understand fundamental CPU instruction processing loop |
| **Implementation Note** | Circular flow diagram with instruction progressing through stages |
| **Status** | **HIGH PRIORITY - Start here** |
| **Dependencies** | None |

### 1.4 | CPU Registers (Tiny Ultra-Fast Memory)

| Aspect | Details |
|--------|---------|
| **Scope** | Small |
| **Duration** | 40 seconds |
| **Audience** | System programmers, assembly learners |
| **Complexity** | Low-Medium |
| **Key Visual** | CPU interior showing small register boxes vs large RAM comparison |
| **Core Concept** | Registers = fastest memory, limited space, CPU operates on these |
| **Learning Goal** | Understand register role in CPU operations |
| **Implementation Note** | Size comparison, speed hierarchy visualization |
| **Status** | Planned |

### 1.5 | Bus Architecture (FSB/QPI)

| Aspect | Details |
|--------|---------|
| **Scope** | Small-Medium |
| **Duration** | 45 seconds |
| **Audience** | System engineers, embedded systems |
| **Complexity** | Low-Medium |
| **Key Visual** | CPU connected to RAM/Cache via bus channels, data flow |
| **Core Concept** | Bus = highway for data between components, bandwidth limited |
| **Learning Goal** | Understand data flow between components |
| **Implementation Note** | Structural diagram with parallel bus lanes |
| **Status** | Planned |

---

## Section 2: Pipelining & Execution (6 topics)

### 2.1 | Instruction Pipelining (5-Stage Classic) ⭐ MVP

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | CS students, performance engineers |
| **Complexity** | Medium |
| **Key Visual** | 5 boxes (Fetch → Decode → Execute → Memory → WriteBack) with 5 different instructions at each stage simultaneously |
| **Core Concept** | Execute multiple instructions in parallel stages, not one-by-one |
| **Learning Goal** | Understand how pipelining increases throughput |
| **Implementation Note** | Timeline showing instructions progressing through stages |
| **Demo Scenario** | Show instruction I1-I5 each in different stages in same cycle |
| **Status** | **HIGH PRIORITY - Core concept** |
| **Dependencies** | 1.3 |

### 2.2 | Pipeline Hazards (Structural, Data, Control)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 75 seconds |
| **Audience** | Performance engineers, architecture learners |
| **Complexity** | Medium-High |
| **Key Visual** | Pipeline stall examples: instruction blocked, data dependency wait, branch misprediction |
| **Core Concept** | Perfect pipelining impossible, hazards = performance loss |
| **Learning Goal** | Understand why pipelines stall |
| **Implementation Note** | Show each hazard type with visual pipeline freeze |
| **Hazard Types** | Structural (resource conflict), Data (dependency), Control (branch) |
| **Status** | Planned |
| **Dependencies** | 2.1 |

### 2.3 | Branch Prediction (Static vs Dynamic)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Performance engineers, security learners |
| **Complexity** | Medium |
| **Key Visual** | CPU guessing next instruction before branch resolves, correct/incorrect outcomes shown |
| **Core Concept** | CPU speculates which branch taken to avoid pipeline flush |
| **Learning Goal** | Understand speculative execution and branch prediction |
| **Implementation Note** | Show predictor making guess, then actual branch result |
| **Context** | Important for Spectre vulnerability (Section 5) |
| **Status** | Planned |
| **Dependencies** | 2.1, 2.2 |

### 2.4 | Out-of-Order Execution (OoO)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 75 seconds |
| **Audience** | Advanced performance engineers |
| **Complexity** | Medium-High |
| **Key Visual** | Instructions queued in different order than code, independent ops run in parallel |
| **Core Concept** | CPU reorders instructions for max parallelism, respects dependencies |
| **Learning Goal** | Understand instruction ordering flexibility |
| **Implementation Note** | Show code order vs execution order, with dependency arrows |
| **Example** | Multiple independent calculations happening out of order |
| **Status** | Planned |
| **Dependencies** | 2.1 |

### 2.5 | Superscalar Execution (Multiple Issue)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Performance engineers |
| **Complexity** | Medium |
| **Key Visual** | Multiple instructions in Execute stage simultaneously (2-wide, 4-wide, 8-wide) |
| **Core Concept** | Modern CPUs execute 4-8 instructions per cycle, not just 1 |
| **Learning Goal** | Understand multiple instruction issue |
| **Implementation Note** | Show multiple execution units working in parallel |
| **Status** | Planned |
| **Dependencies** | 2.1 |

### 2.6 | SIMD Instructions (SSE, AVX, NEON)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 50 seconds |
| **Audience** | Performance developers, game engineers, ML engineers |
| **Complexity** | Medium |
| **Key Visual** | Single instruction operating on vector of data (4 floats processed in 1 instruction vs 4 separate instructions) |
| **Core Concept** | SIMD = process many data elements in parallel in one instruction |
| **Learning Goal** | Understand vectorized computation |
| **Implementation Note** | Side-by-side comparison: scalar vs SIMD |
| **Status** | Planned |
| **Dependencies** | 2.1, 2.5 |

---

## Section 3: Cache Hierarchy (6 topics)

### 3.1 | Cache Hierarchy Overview (L1 → L2 → L3 → RAM) ⭐ MVP

| Aspect | Details |
|--------|---------|
| **Scope** | Small |
| **Duration** | 40 seconds |
| **Audience** | Junior developers, systems programmers |
| **Complexity** | Low |
| **Key Visual** | Pyramid showing speed vs capacity tradeoff: L1 tiny-fast, L2 medium, L3 big, RAM huge-slow |
| **Core Concept** | Speed-capacity pyramid, hierarchical memory access |
| **Learning Goal** | Understand memory hierarchy and tradeoffs |
| **Implementation Note** | Animated pyramid building, labels showing latency/size |
| **Status** | **HIGH PRIORITY - Foundational** |
| **Dependencies** | 1.1 |

### 3.2 | Cache Lines & Memory Access

| Aspect | Details |
|--------|---------|
| **Scope** | Small-Medium |
| **Duration** | 50 seconds |
| **Audience** | Performance programmers, systems engineers |
| **Complexity** | Low-Medium |
| **Key Visual** | Cache organized in 64-byte lines, single-byte request loads entire line |
| **Core Concept** | CPU loads 64-byte cache line, not single byte |
| **Learning Goal** | Understand cache line as fetch unit |
| **Implementation Note** | Show memory access causing line fetch |
| **Optimization Opportunity** | Foundation for cache-friendly code |
| **Status** | Planned |
| **Dependencies** | 3.1 |

### 3.3 | Cache Hits vs Misses (Latency Impact) ⭐ HIGH VALUE

| Aspect | Details |
|--------|---------|
| **Scope** | Small-Medium |
| **Duration** | 45 seconds |
| **Audience** | Performance engineers, developers |
| **Complexity** | Low-Medium |
| **Key Visual** | Timeline showing hit latency (3-4 cycles) vs miss (100-300+ cycles) |
| **Core Concept** | Cache miss = massive latency spike, hits are ~100x faster |
| **Learning Goal** | Understand impact of cache misses on performance |
| **Implementation Note** | Dramatic visual showing latency difference |
| **Practical Impact** | Critical for performance optimization |
| **Status** | Planned |
| **Dependencies** | 3.1, 3.2 |

### 3.4 | Cache Coherence (Multi-Core MESI/MOESI)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 75 seconds |
| **Audience** | Advanced concurrent programmers, systems engineers |
| **Complexity** | Medium-High |
| **Key Visual** | 2+ cores with L1 caches, coherence protocol states (Modified, Exclusive, Shared, Invalid) |
| **Core Concept** | Multi-core CPUs need protocol ensuring cache data stays in sync |
| **Learning Goal** | Understand multi-core consistency mechanisms |
| **Implementation Note** | State machine showing cache line transitions |
| **Protocol Details** | MESI (Intel/ARM), MOESI (AMD) both covered |
| **Status** | Planned |
| **Dependencies** | 3.1, 4.1 |

### 3.5 | False Sharing (Coherence Performance Killer)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Performance engineers, concurrent programmers |
| **Complexity** | Medium |
| **Key Visual** | 2 threads on different cores touching data on same cache line → unnecessary coherence traffic |
| **Core Concept** | Two independent variables on same cache line = performance disaster |
| **Learning Goal** | Understand false sharing as performance pitfall |
| **Implementation Note** | Show cache line bouncing between cores, latency spike |
| **Practical Impact** | Common bug in multi-threaded code |
| **Status** | Planned |
| **Dependencies** | 3.1, 3.4, 4.1 |

### 3.6 | Prefetching (Hardware & Software)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 55 seconds |
| **Audience** | Performance engineers, systems programmers |
| **Complexity** | Medium |
| **Key Visual** | CPU predicting next memory access, loading cache line proactively |
| **Core Concept** | Smart prefetching hides memory latency, bad prefetch = cache pollution |
| **Learning Goal** | Understand prefetching as latency hiding technique |
| **Implementation Note** | Show memory access pattern prediction |
| **Types Covered** | Hardware prefetch vs software prefetch |
| **Status** | Planned |
| **Dependencies** | 3.1, 3.2, 3.3 |

---

## Section 4: Multi-Core & Threading (7 topics)

### 4.1 | Multi-Core Processors (Cores are Independent CPUs)

| Aspect | Details |
|--------|---------|
| **Scope** | Small-Medium |
| **Duration** | 45 seconds |
| **Audience** | Junior developers, systems programmers |
| **Complexity** | Low-Medium |
| **Key Visual** | Single CPU package with 2-8 cores, each with own L1 cache, shared L3 |
| **Core Concept** | Multi-core = parallel execution on separate physical units, not just time-slicing |
| **Learning Goal** | Understand true parallelism vs concurrency |
| **Implementation Note** | Show cores as independent execution units |
| **Status** | Planned |
| **Dependencies** | 1.1, 3.1 |

### 4.2 | Hyper-Threading / SMT (Simultaneous Multi-Threading)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Systems programmers, performance engineers |
| **Complexity** | Medium |
| **Key Visual** | Single core appearing as 2 logical cores to OS, sharing execution units |
| **Core Concept** | Logical threads can hide pipeline stalls, not true parallelism |
| **Learning Goal** | Understand SMT as pipeline stall mitigation |
| **Implementation Note** | Show 2 instruction streams interleaved on same core |
| **Misconception Addressed** | SMT is not 2x performance |
| **Status** | Planned |
| **Dependencies** | 4.1, 2.1, 2.2 |

### 4.3 | Thread vs Process vs Core

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Junior developers, systems programmers |
| **Complexity** | Medium |
| **Key Visual** | Multiple processes/threads scheduled on cores, context switching shown |
| **Core Concept** | Thread = lighter process, core = physical execution unit, process = isolated address space |
| **Learning Goal** | Understand OS scheduling concepts |
| **Implementation Note** | Timeline showing threads transitioning on/off cores |
| **Status** | Planned |
| **Dependencies** | 4.1 |

### 4.4 | CPU Affinity / Thread Pinning

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 50 seconds |
| **Audience** | Performance engineers, systems programmers |
| **Complexity** | Medium |
| **Key Visual** | Threads pinned to specific cores vs free migration |
| **Core Concept** | Pinning thread to core improves cache locality |
| **Learning Goal** | Understand affinity as cache optimization |
| **Implementation Note** | Show cache benefits of pinning |
| **Practical Use** | Database, HPC, real-time systems |
| **Status** | Planned |
| **Dependencies** | 4.1, 3.3 |

### 4.5 | NUMA (Non-Uniform Memory Access)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 70 seconds |
| **Audience** | Systems engineers, database engineers |
| **Complexity** | Medium-High |
| **Key Visual** | Multi-socket CPU with local vs remote memory (latency asymmetry) |
| **Core Concept** | Large systems have memory closer to some cores, distant from others |
| **Learning Goal** | Understand memory latency asymmetry in large systems |
| **Implementation Note** | Show latency difference for local vs remote access |
| **Status** | Planned |
| **Dependencies** | 4.1, 3.1 |

### 4.6 | Power Management & Frequency Scaling

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 55 seconds |
| **Audience** | Systems engineers |
| **Complexity** | Medium |
| **Key Visual** | CPU dynamically adjusting frequency/voltage based on load |
| **Core Concept** | CPU lowers clock when idle to save power |
| **Learning Goal** | Understand power-performance tradeoff |
| **Implementation Note** | Show frequency scaling based on utilization |
| **Technologies** | Intel P-states, AMD CPPC |
| **Status** | Planned |
| **Dependencies** | 1.2 |

### 4.7 | Lock-Free & Atomic Operations

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 70 seconds |
| **Audience** | Advanced concurrent programmers |
| **Complexity** | Medium-High |
| **Key Visual** | CPU-level atomic instructions enabling multi-core synchronization |
| **Core Concept** | Compare-and-swap (CAS) = hardware-level transaction |
| **Learning Goal** | Understand hardware atomic primitives |
| **Implementation Note** | Show atomic read-modify-write operation |
| **Instructions** | CAS, XCHG, FAA shown |
| **Status** | Planned |
| **Dependencies** | 4.1, 3.4 |

---

## Section 5: Speculative Execution & Security (5 topics)

### 5.1 | Speculative Execution Basics

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Security engineers, performance engineers |
| **Complexity** | Medium |
| **Key Visual** | CPU guessing & executing speculatively, commits if guess right, discards if wrong |
| **Core Concept** | CPU makes guesses to maximize throughput, risks if guess wrong |
| **Learning Goal** | Understand speculative execution mechanism |
| **Implementation Note** | Show execution branch then rollback |
| **Performance Benefit** | Hides branch latency |
| **Status** | Planned |
| **Dependencies** | 2.3 |

### 5.2 | Spectre Attack (Exploiting Branch Prediction)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 90 seconds |
| **Audience** | Security engineers, systems programmers |
| **Complexity** | Medium-High |
| **Key Visual** | Attacker forcing CPU to leak data during speculative execution |
| **Core Concept** | Speculative data leaves traces in cache, attackers can recover it |
| **Learning Goal** | Understand Spectre vulnerability mechanism |
| **Implementation Note** | Show speculative data access → cache timing side-channel |
| **CVE** | CVE-2017-5753, CVE-2017-5715 |
| **Status** | Planned |
| **Dependencies** | 5.1, 3.3 |

### 5.3 | Meltdown Attack (Exception-Based Speculative Leak)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 90 seconds |
| **Audience** | Security engineers |
| **Complexity** | Medium-High |
| **Key Visual** | Kernel memory speculatively accessed before permission check |
| **Core Concept** | Out-of-order execution can violate privilege isolation |
| **Learning Goal** | Understand Meltdown vulnerability |
| **Implementation Note** | Show memory access bypassing permission check |
| **CVE** | CVE-2017-5754 |
| **Status** | Planned |
| **Dependencies** | 5.1, 2.4, 6.3 |

### 5.4 | Transactional Memory (TSX/RTM)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 70 seconds |
| **Audience** | Advanced concurrent programmers, security researchers |
| **Complexity** | Medium-High |
| **Key Visual** | Atomic block executing speculatively, rollback on conflict |
| **Core Concept** | Hardware transactions for lock-free programming |
| **Learning Goal** | Understand hardware transactional memory |
| **Implementation Note** | Show transaction commit/abort |
| **Intel Feature** | TSX (Transactional Synchronization Extensions) |
| **Status** | Planned |
| **Dependencies** | 5.1, 4.7 |

### 5.5 | Mitigations (IBRS, STIBP, KPTI)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 80 seconds |
| **Audience** | Systems engineers, security engineers |
| **Complexity** | Medium-High |
| **Key Visual** | Hardware/software patches restricting speculation, performance cost shown |
| **Core Concept** | Mitigations often kill performance gains from speculative execution |
| **Learning Goal** | Understand security vs performance tradeoffs |
| **Implementation Note** | Show mitigation mechanisms and overhead |
| **Mitigations Covered** | IBRS, STIBP, KPTI, other Spectre/Meltdown fixes |
| **Status** | Planned |
| **Dependencies** | 5.1, 5.2, 5.3 |

---

## Section 6: Memory Management (5 topics)

### 6.1 | Virtual Memory & TLB (Translation Lookaside Buffer)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 70 seconds |
| **Audience** | Systems programmers |
| **Complexity** | Medium-High |
| **Key Visual** | Virtual address → TLB lookup → Page table walk → Physical address |
| **Core Concept** | Virtual addresses translated to physical via MMU, TLB caches translations |
| **Learning Goal** | Understand address translation mechanism |
| **Implementation Note** | Show hit/miss scenarios |
| **Performance Impact** | TLB miss triggers page table walk (~300 cycles) |
| **Status** | Planned |
| **Dependencies** | 1.4, 3.1 |

### 6.2 | Page Faults & Paging

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 65 seconds |
| **Audience** | Systems programmers, kernel engineers |
| **Complexity** | Medium |
| **Key Visual** | Memory access to unmapped page → fault → page brought from disk |
| **Core Concept** | Virtual memory allows illusion of unlimited RAM using disk |
| **Learning Goal** | Understand paging mechanism |
| **Implementation Note** | Show page fault handling flow |
| **Performance Note** | Disk access = massive latency (millions of cycles) |
| **Status** | Planned |
| **Dependencies** | 6.1 |

### 6.3 | Memory Protection (Privilege Levels, Rings)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 55 seconds |
| **Audience** | Systems programmers, security engineers |
| **Complexity** | Medium |
| **Key Visual** | CPU rings (Ring 0 kernel, Ring 3 user), permission checks |
| **Core Concept** | Hardware enforces privilege isolation, kernel-mode vs user-mode |
| **Learning Goal** | Understand privilege level protection |
| **Implementation Note** | Show memory access permission check |
| **Security Implications** | Foundation for privilege isolation |
| **Status** | Planned |
| **Dependencies** | 1.4 |

### 6.4 | Memory-Mapped IO

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Embedded systems engineers, kernel engineers |
| **Complexity** | Medium |
| **Key Visual** | RAM addresses and I/O device addresses coexist in memory space |
| **Core Concept** | Devices appear as memory locations to CPU |
| **Learning Goal** | Understand MMIO as CPU-device communication |
| **Implementation Note** | Show address decoding routing memory access to device |
| **Status** | Planned |
| **Dependencies** | 1.4, 1.5 |

### 6.5 | DMA (Direct Memory Access)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Embedded systems, driver engineers |
| **Complexity** | Medium |
| **Key Visual** | I/O device directly accessing RAM without CPU, CPU notified via interrupt |
| **Core Concept** | Devices can read/write memory independently, frees CPU for other work |
| **Learning Goal** | Understand DMA as CPU offloading mechanism |
| **Implementation Note** | Show device bypassing CPU to access RAM |
| **Status** | Planned |
| **Dependencies** | 6.4 |

---

## Section 7: Advanced Topics (5 topics)

### 7.1 | CPU Microarchitecture Comparison (Intel vs AMD vs ARM)

| Aspect | Details |
|--------|---------|
| **Scope** | Large |
| **Duration** | 90 seconds |
| **Audience** | Performance engineers, enthusiasts |
| **Complexity** | Medium-High |
| **Key Visual** | Different designs (Intel Golden Cove, AMD Zen 5, ARM Cortex-X) compared |
| **Core Concept** | Different CPU architectures make different tradeoffs |
| **Learning Goal** | Understand architectural differences |
| **Implementation Note** | Side-by-side feature comparison |
| **Coverage** | Pipeline depth, core count, cache sizes, IPC |
| **Status** | Planned |
| **Dependencies** | 2.1, 3.1, 4.1 |

### 7.2 | Thermal Management & Throttling

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 55 seconds |
| **Audience** | Systems engineers, overclockers |
| **Complexity** | Medium |
| **Key Visual** | Temperature rising → frequency throttling → performance drop |
| **Core Concept** | CPU temperature is regulated, overheating forces slowdown |
| **Learning Goal** | Understand thermal constraints |
| **Implementation Note** | Show throttling ramping down frequency |
| **Status** | Planned |
| **Dependencies** | 1.2, 4.6 |

### 7.3 | Instruction Set Architecture (ISA: x86 vs ARM vs RISC-V)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 75 seconds |
| **Audience** | Systems programmers, computer architects |
| **Complexity** | Medium-High |
| **Key Visual** | Different ISAs, different instruction formats, different capabilities |
| **Core Concept** | Different ISAs = different instruction formats, tradeoffs |
| **Learning Goal** | Understand ISA as interface between code and hardware |
| **Implementation Note** | Show same algorithm in different ISAs |
| **ISAs Covered** | x86-64, ARM64, RISC-V |
| **Status** | Planned |
| **Dependencies** | 1.3 |

### 7.4 | Branch Target Buffer (BTB) & Return Stack Buffer (RSB)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium-Large |
| **Duration** | 70 seconds |
| **Audience** | Performance engineers, security researchers |
| **Complexity** | Medium-High |
| **Key Visual** | Specialized prediction structures for branch & return addresses, hit/miss scenarios |
| **Core Concept** | Specialized predictors for control flow |
| **Learning Goal** | Understand branch prediction mechanisms |
| **Implementation Note** | Show BTB/RSB structure and lookup process |
| **Security Note** | RSB poisoning attack relevant (Retpoline mitigation) |
| **Status** | Planned |
| **Dependencies** | 2.3, 5.1 |

### 7.5 | Instruction Set Extensions (AVX-512, SVE, etc)

| Aspect | Details |
|--------|---------|
| **Scope** | Medium |
| **Duration** | 60 seconds |
| **Audience** | Performance engineers, ML engineers |
| **Complexity** | Medium |
| **Key Visual** | CPU capabilities expanding with new instructions for specialized workloads |
| **Core Concept** | Newer CPUs add instructions for AI, crypto, compression |
| **Learning Goal** | Understand ISA extensions |
| **Implementation Note** | Show different instruction families and use cases |
| **Extensions** | AVX-512, SVE (ARM), NEON, RISC-V V extension |
| **Status** | Planned |
| **Dependencies** | 2.6 |

---

## Production Roadmap

### MVP Phase 1 (Weeks 1-2)

**Priority: HIGH | Focus: Foundational Concepts**

| Order | Topic ID | Topic Name | Status | Notes |
|-------|----------|------------|--------|-------|
| 1 | 1.3 | Instruction Fetch-Decode-Execute Cycle | 🎯 START | Foundation for all CPU concepts |
| 2 | 3.1 | Cache Hierarchy Overview | 🎯 FOLLOW | Memory hierarchy critical for performance |
| 3 | 2.1 | Instruction Pipelining | 🎯 FOLLOW | Core performance technique |

**Deliverable**: 3 polished animations, ~150 seconds total content

---

### Phase 2 (Week 3)

**Priority: HIGH | Focus: Core Concepts**

| Order | Topic ID | Topic Name | Status | Notes |
|-------|----------|------------|--------|-------|
| 4 | 4.1 | Multi-Core Processors | 🔄 QUEUE | Necessary before threading topics |
| 5 | 3.2 | Cache Lines & Memory Access | 🔄 QUEUE | Enables cache optimization understanding |
| 6 | 1.2 | CPU Clock & Frequency | 🔄 QUEUE | Quick foundational concept |

**Deliverable**: 3 more animations, ~155 seconds total

---

### Phase 3 (Week 4)

**Priority: MEDIUM | Focus: Performance & Threading**

| Order | Topic ID | Topic Name | Status | Notes |
|-------|----------|------------|--------|-------|
| 7 | 4.2 | Hyper-Threading / SMT | 🔄 QUEUE | Performance technique, depends on 4.1 |
| 8 | 3.3 | Cache Hits vs Misses | 🔄 QUEUE | High-value for developers |
| 9 | 2.2 | Pipeline Hazards | 🔄 QUEUE | Extends 2.1 |

**Deliverable**: 3 more animations, ~195 seconds total

---

### Phase 4+ (Weeks 5-6+)

**Priority: MEDIUM-LOW | Focus: Advanced & Security**

| Order | Topic ID | Topic Name | Status | Notes |
|-------|----------|------------|--------|-------|
| 10+ | Various | Remaining topics | 📋 BACKLOG | Security (Section 5), Memory (Section 6), Advanced (Section 7) |

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total Topics** | 35 |
| **Total Sections** | 7 |
| **MVP Topics (Critical)** | 3 |
| **Phase 1-2 Topics** | 6 |
| **Estimated Total Duration** | 4-5 hours video content |
| **Min Scope** | 30 seconds (1.1) |
| **Max Scope** | 90 seconds (5.2, 5.3, 7.1) |
| **Avg Scope** | 60 seconds |
| **Topics by Complexity** | Low: 8, Low-Medium: 12, Medium: 10, Medium-High: 4, High: 1 |

---

## Topic Dependencies Graph

```
1.1 (CPU Basics)
├── 1.2 (Clock)
│   └── 4.6 (Power Management)
│       └── 7.2 (Thermal)
├── 1.3 (FDE) ⭐
│   ├── 2.1 (Pipeline) ⭐
│   │   ├── 2.2 (Hazards)
│   │   ├── 2.3 (Branch Prediction)
│   │   │   ├── 5.1 (Speculation)
│   │   │   │   ├── 5.2 (Spectre)
│   │   │   │   ├── 5.3 (Meltdown)
│   │   │   │   ├── 5.4 (TSX)
│   │   │   │   └── 5.5 (Mitigations)
│   │   │   └── 7.4 (BTB/RSB)
│   │   ├── 2.4 (OoO)
│   │   ├── 2.5 (Superscalar)
│   │   └── 2.6 (SIMD)
│   ├── 3.1 (Cache Hierarchy) ⭐
│   │   ├── 3.2 (Cache Lines)
│   │   ├── 3.3 (Hits vs Misses)
│   │   ├── 3.4 (Coherence)
│   │   │   └── 3.5 (False Sharing)
│   │   └── 3.6 (Prefetch)
│   ├── 4.1 (Multi-Core)
│   │   ├── 4.2 (SMT)
│   │   ├── 4.3 (Thread vs Process)
│   │   ├── 4.4 (Affinity)
│   │   ├── 4.5 (NUMA)
│   │   └── 4.7 (Atomic Ops)
│   ├── 6.1 (Virtual Memory)
│   │   └── 6.2 (Paging)
│   ├── 6.3 (Protection)
│   └── 7.3 (ISA)
├── 1.4 (Registers)
│   ├── 6.1 (Virtual Memory)
│   └── 6.3 (Protection)
├── 1.5 (Bus)
    └── 6.4 (MMIO)
        └── 6.5 (DMA)

⭐ = MVP / Critical Path
```

---

## GPU Pipeline Preview

After CPU content is complete, planned GPU architecture breakdown:

### GPU Sections (7-8 sections, ~30-35 topics)

1. **GPU Fundamentals** — GPU vs CPU, SIMD vs massive parallelism
2. **GPU Threading Model** — Warps, blocks, grids, thread hierarchy
3. **GPU Memory Hierarchy** — Registers, shared memory, global, texture, constant cache
4. **Streaming Multiprocessors (SMs)** — Core GPU execution unit architecture
5. **GPU Execution Pipeline** — Warp scheduling, instruction issue
6. **Memory Access Patterns** — Coalescing, bank conflicts, optimization
7. **GPU Optimization Techniques** — Occupancy, memory bandwidth utilization
8. **Advanced GPU Topics** — Tensor cores, ray tracing hardware, AI accelerators

**Est. GPU Duration**: 4-5 hours content (similar to CPU)

---

## Notes for Implementation

- Each animation follows project standard from `/docs/02-standar-konten.md`
- All topic animations registered in `src/content/registry.js` with metadata
- Each topic folder contains `Animation.jsx` + `data.js`
- Use `useTimeline.js` hook for GSAP animations
- Animations tested for smooth 60fps playback
- Export capability via Puppeteer in `scripts/`
- Accessibility: All text elements labeled, color not only encoding

---

**Document Version**: 1.0  
**Last Reviewed**: 2026-09-06  
**Next Review**: After Phase 1 completion
---

## 🎯 RECOMMENDED LEARNING PATH FOR BEGINNERS

### PHILOSOPHY
Organize by **UNDERSTANDING DIFFICULTY**, not production order. Start with concepts that require ZERO prior knowledge, progress gradually. Each section should feel like "oh, NOW I get it!" 

---

## 🟢 TIER 1: ABSOLUTE BEGINNERS (No prereqs, super intuitive)

**Best for**: Total newcomers, IT generalists, curious non-technical people

### T1.1 | 1.1 - What is a CPU? (The Basics)
- **Why Start Here**: Most fundamental. Everyone can relate to "computer does stuff"
- **Difficulty**: ⭐ (literally just a box that executes instructions)
- **Duration**: 30-40 sec
- **Mental Model Building**: CPU = the brain that follows instructions
- **Real-World Analogy**: Like a very fast worker following a recipe step-by-step
- **Prerequisite**: None
- **Next**: Go to T1.2 or T1.3

---

### T1.2 | 1.2 - CPU Clock & Frequency
- **Why Here**: Understanding "GHz" that everyone sees on specs
- **Difficulty**: ⭐ (just a ticking clock)
- **Duration**: 40 sec
- **Mental Model Building**: Faster clock = more instructions per second = faster computer
- **Real-World Analogy**: Like heartbeats - more beats per second = more work done per second
- **Prerequisite**: T1.1
- **Visual Hook**: Oscillating waveform getting faster
- **Next**: T1.3 or skip to T2.1

---

### T1.3 | 1.3 - Instruction Fetch-Decode-Execute Cycle ⭐⭐⭐
- **Why Here**: THE fundamental loop. Everything else builds on this
- **Difficulty**: ⭐⭐ (3 steps, might seem complex but very intuitive with animation)
- **Duration**: 50 sec
- **Mental Model Building**: Every CPU operation = 1) get instruction 2) understand it 3) do it
- **Real-World Analogy**: Like reading recipe → understanding recipe → cooking
- **Prerequisite**: T1.1
- **Why This First**: Everything else in CPU depends on understanding this cycle
- **Common Misconception to Address**: "CPU does multiple things at once" → no, it repeats this cycle very fast
- **Next**: T1.4, T1.5, or jump to T2.1

---

### T1.4 | 1.4 - CPU Registers (Tiny Ultra-Fast Memory)
- **Why Here**: Introduces concept of "working space" CPU needs
- **Difficulty**: ⭐⭐ (comparing sizes, but intuitive concept)
- **Duration**: 40 sec
- **Mental Model Building**: Registers = notepads on desk, RAM = filing cabinet; faster to use notepad
- **Real-World Analogy**: Your desk (registers) vs storage room (RAM)
- **Prerequisite**: T1.1
- **Visual Hook**: Size comparison, speed contrast
- **Next**: T2.1 or T3.1

---

### T1.5 | 1.5 - Bus Architecture (FSB/QPI)
- **Why Here**: Understanding data flow between components (not strictly necessary but helpful)
- **Difficulty**: ⭐⭐ (just highways for data)
- **Duration**: 45 sec
- **Mental Model Building**: Data needs highways to travel between CPU and memory
- **Real-World Analogy**: Roads connecting city (CPU) to warehouse (RAM)
- **Prerequisite**: T1.1
- **Visual Hook**: Parallel data lanes on bus
- **Next**: T3.1 (since it connects to memory hierarchy)

---

## 🟠 TIER 2: BEGINNER+ (Some foundational knowledge needed)

**Best for**: Junior developers, "I know what RAM is" people

### T2.1 | 3.1 - Cache Hierarchy Overview (L1 → L2 → L3 → RAM) ⭐⭐⭐
- **Why Here**: Super important for understanding performance, very visual/intuitive
- **Difficulty**: ⭐⭐ (pyramid concept is easy, but adds complexity)
- **Duration**: 40 sec
- **Mental Model Building**: Speed-size tradeoff: tiny-fast (L1) ↔ huge-slow (RAM)
- **Real-World Analogy**: Desk (L1) → shelf (L2) → storage room (L3) → warehouse (RAM)
- **Prerequisite**: Understand that memory exists (T1.4 helps but not required)
- **Why Here**: Most important for anyone caring about performance
- **Common Misconception**: "More RAM = faster" → actually, L1 cache size matters more for speed
- **Next**: T2.2 or T2.3

---

### T2.2 | 3.3 - Cache Hits vs Misses (Latency Impact) ⭐⭐⭐
- **Why Here**: Dramatic visual showing why cache matters SO MUCH
- **Difficulty**: ⭐⭐ (timeline comparison, very intuitive)
- **Duration**: 45 sec
- **Mental Model Building**: Miss = going to warehouse, Hit = on your desk. HUGE latency difference
- **Real-World Analogy**: Finding paper on desk (3 seconds) vs warehouse (3 minutes)
- **Prerequisite**: T2.1 (cache hierarchy)
- **Visual Hook**: Timeline showing hit latency vs miss (100x slower)
- **Practical Impact**: "This is why your code is slow" moment
- **Next**: T3.1 (pipelining) or T2.3 (cache lines)

---

### T2.3 | 3.2 - Cache Lines & Memory Access
- **Why Here**: Understanding granularity of memory access
- **Difficulty**: ⭐⭐ (just "fetch unit size")
- **Duration**: 50 sec
- **Mental Model Building**: CPU doesn't fetch 1 byte, it fetches 64 bytes at once (the line)
- **Real-World Analogy**: You can't just get one egg, you get the whole carton
- **Prerequisite**: T2.1
- **Practical Implications**: Affects cache utilization and prefetching
- **Next**: T2.2 or T3.1

---

### T3.1 | 2.1 - Instruction Pipelining (5-Stage Classic) ⭐⭐⭐
- **Why Here**: Core performance technique, intuitive visual
- **Difficulty**: ⭐⭐⭐ (requires understanding FDE cycle, but animation makes it clear)
- **Duration**: 60 sec
- **Mental Model Building**: Multiple instructions in different stages at SAME TIME = parallelism
- **Real-World Analogy**: Assembly line - each worker does one task, multiple items progress simultaneously
- **Prerequisite**: T1.3 (FDE cycle is essential)
- **Visual Hook**: 5 instructions at different stages, progressing in lockstep
- **Aha Moment**: "This is how single-core can do multiple things"
- **Next**: T3.2 or T4.1

---

### T3.2 | 2.2 - Pipeline Hazards (Structural, Data, Control)
- **Why Here**: Understanding why pipelining isn't magic
- **Difficulty**: ⭐⭐⭐ (requires understanding pipelining)
- **Duration**: 75 sec
- **Mental Model Building**: Pipeline stalls = traffic jam on assembly line
- **Real-World Analogy**: Worker waiting for materials = pipeline stall
- **Prerequisite**: T3.1 (pipelining)
- **Three Types**: Structural (resource), Data (dependency), Control (branch)
- **Next**: T3.3 or T4.1

---

### T3.3 | 2.3 - Branch Prediction (Static vs Dynamic)
- **Why Here**: Understanding speculative execution (foundation for security topics)
- **Difficulty**: ⭐⭐⭐ (introduces "guessing")
- **Duration**: 60 sec
- **Mental Model Building**: CPU guesses which way branch goes to avoid pipeline stall
- **Real-World Analogy**: Chef preparing both dishes in parallel, only one gets served
- **Prerequisite**: T3.1 (pipelining)
- **Why Important**: Foundation for Spectre vulnerability
- **Correct vs Incorrect**: Show both outcomes
- **Next**: T4.2 or T5.1

---

## 🟡 TIER 3: INTERMEDIATE (Comfortable with basic concepts)

**Best for**: Developers, systems engineers, people who read through T1-3

### T4.1 | 4.1 - Multi-Core Processors (Cores are Independent CPUs)
- **Why Here**: Understanding modern computers
- **Difficulty**: ⭐⭐⭐ (requires pipeline knowledge to appreciate)
- **Duration**: 45 sec
- **Mental Model Building**: Multiple independent CPUs on one chip = true parallelism
- **Real-World Analogy**: 2 chefs working simultaneously in different kitchens
- **Prerequisite**: T1.3 (understand single core first)
- **Contrast**: Multi-core vs time-slicing
- **Next**: T4.2 or T4.3

---

### T4.2 | 4.2 - Hyper-Threading / SMT (Simultaneous Multi-Threading)
- **Why Here**: Understanding why "Core i7 with 8 cores but 16 threads"
- **Difficulty**: ⭐⭐⭐⭐ (requires pipelining + multi-core understanding)
- **Duration**: 60 sec
- **Mental Model Building**: Single core appearing as 2 to OS, shares execution units
- **Real-World Analogy**: One factory with 2 production lines sharing same machines
- **Prerequisite**: T3.1 (pipelining) + T4.1 (multi-core)
- **Common Misconception**: "SMT = 2x performance" → No, it's ~20-30% usually
- **Next**: T4.3 or T5.1

---

### T4.3 | 4.3 - Thread vs Process vs Core
- **Why Here**: Clarifying terminology many beginners confuse
- **Difficulty**: ⭐⭐⭐ (OS concepts, but very practical)
- **Duration**: 60 sec
- **Mental Model Building**: Core = hardware, Thread = scheduler unit, Process = isolated program
- **Real-World Analogy**: Stadium (process) with multiple sections (threads), each section has workers (cores)
- **Prerequisite**: T4.1 (multi-core)
- **Practical Knowledge**: How OS schedules work
- **Next**: T4.4 or T5.1

---

### T5.1 | 3.4 - Cache Coherence (Multi-Core MESI/MOESI)
- **Why Here**: Understanding multi-core memory issues
- **Difficulty**: ⭐⭐⭐⭐ (state machine, complex)
- **Duration**: 75 sec
- **Mental Model Building**: Multiple caches need protocol to stay in sync
- **Real-World Analogy**: Multiple people with notepads, need to coordinate when data changes
- **Prerequisite**: T2.1 (cache) + T4.1 (multi-core)
- **Why Important**: Foundation for false sharing, race conditions
- **Next**: T5.2 or T6.1

---

### T5.2 | 3.5 - False Sharing (Coherence Performance Killer)
- **Why Here**: Practical multi-core performance killer
- **Difficulty**: ⭐⭐⭐⭐ (requires cache coherence understanding)
- **Duration**: 60 sec
- **Mental Model Building**: Two independent variables on same cache line = disaster
- **Real-World Analogy**: Two desk neighbors sharing same shelf = constant book moving
- **Prerequisite**: T5.1 (cache coherence)
- **Practical Impact**: "This is why your parallel code is slow"
- **Next**: T6.1 or continue to T6.2

---

## 🔴 TIER 4: ADVANCED (Requires significant foundation)

**Best for**: Performance engineers, systems programmers, security engineers

### T6.1 | 5.1 - Speculative Execution Basics
- **Why Here**: Foundation for security vulnerabilities
- **Difficulty**: ⭐⭐⭐⭐ (requires pipelining + branch prediction)
- **Duration**: 60 sec
- **Mental Model Building**: CPU guesses and executes, rolls back if wrong
- **Real-World Analogy**: Chef cooking speculatively, throws away if wrong order
- **Prerequisite**: T3.3 (branch prediction)
- **Why Important**: Explains Spectre/Meltdown
- **Next**: T6.2 or T6.3

---

### T6.2 | 5.2 - Spectre Attack (Exploiting Branch Prediction)
- **Why Here**: Real-world security exploit
- **Difficulty**: ⭐⭐⭐⭐⭐ (requires speculation + caching understanding)
- **Duration**: 90 sec
- **Mental Model Building**: Attacker forces speculative execution to leak data via cache timing
- **Prerequisite**: T6.1 (speculation) + T2.1 (cache)
- **Security Implications**: Why every processor has it
- **Next**: T6.3

---

### T6.3 | 5.3 - Meltdown Attack (Exception-Based Speculative Leak)
- **Why Here**: Another major speculative execution exploit
- **Difficulty**: ⭐⭐⭐⭐⭐ (requires OoO execution understanding)
- **Duration**: 90 sec
- **Mental Model Building**: Kernel memory accessed speculatively before permission check
- **Prerequisite**: T6.1 (speculation) + T2.1 (cache) + 6.2 (memory protection concepts)
- **Why Important**: Breaks kernel isolation
- **Next**: T6.4

---

### T6.4 | 6.1 - Virtual Memory & TLB (Translation Lookaside Buffer)
- **Why Here**: Understanding modern memory management
- **Difficulty**: ⭐⭐⭐⭐ (requires abstract thinking)
- **Duration**: 70 sec
- **Mental Model Building**: Virtual addresses → TLB cache lookup → physical addresses
- **Prerequisite**: T1.4 (registers/memory basic), T2.1 (cache concept)
- **Why Important**: Foundation for OS memory management
- **Next**: T6.5 or T7.1

---

### T6.5 | 4.5 - NUMA (Non-Uniform Memory Access)
- **Why Here**: Understanding large multi-socket systems
- **Difficulty**: ⭐⭐⭐⭐ (requires multi-core + memory hierarchy)
- **Duration**: 70 sec
- **Mental Model Building**: Memory closer to some cores, distant from others = asymmetric latency
- **Prerequisite**: T4.1 (multi-core) + T2.1 (cache hierarchy)
- **Why Important**: Critical for databases, HPC systems
- **Next**: T7.1

---

### T7.1 | 2.4 - Out-of-Order Execution (OoO)
- **Why Here**: Understanding modern CPU scheduling
- **Difficulty**: ⭐⭐⭐⭐ (complex instruction reordering)
- **Duration**: 75 sec
- **Mental Model Building**: CPU reorders instructions for max parallelism, respects dependencies
- **Prerequisite**: T3.1 (pipelining)
- **Why Important**: Why register renaming, ROB exist
- **Next**: T7.2 or T8.1

---

### T7.2 | 2.5 - Superscalar Execution (Multiple Issue)
- **Why Here**: Understanding instruction-level parallelism
- **Difficulty**: ⭐⭐⭐⭐ (requires pipelining understanding)
- **Duration**: 60 sec
- **Mental Model Building**: Multiple execution units working in parallel, 4-8 instructions per cycle
- **Prerequisite**: T3.1 (pipelining)
- **Why Important**: How CPUs get so fast without just higher clock
- **Next**: T7.3 or T8.1

---

### T7.3 | 2.6 - SIMD Instructions (SSE, AVX, NEON)
- **Why Here**: Understanding vectorized computation
- **Difficulty**: ⭐⭐⭐⭐ (requires superscalar understanding)
- **Duration**: 50 sec
- **Mental Model Building**: One instruction processes 4-8 data elements in parallel
- **Prerequisite**: T7.2 (superscalar)
- **Practical Use**: Games, ML, scientific computing
- **Next**: T8.1 or T8.2

---

### T8.1 | 6.2 - Page Faults & Paging
- **Why Here**: Understanding virtual memory in action
- **Difficulty**: ⭐⭐⭐⭐ (requires virtual memory concept)
- **Duration**: 65 sec
- **Mental Model Building**: Unmapped page access → fault → page loaded from disk
- **Prerequisite**: T6.4 (virtual memory basics)
- **Why Important**: OS memory management, swap behavior
- **Next**: T8.2

---

### T8.2 | 3.6 - Prefetching (Hardware & Software)
- **Why Here**: Understanding latency hiding
- **Difficulty**: ⭐⭐⭐⭐ (requires cache + access pattern understanding)
- **Duration**: 55 sec
- **Mental Model Building**: CPU guesses future memory access, preloads cache proactively
- **Prerequisite**: T2.1 (cache) + T2.2 (cache misses)
- **Why Important**: Key optimization technique
- **Next**: Continue to T9+ if interested

---

## 📊 RECOMMENDED LEARNING SEQUENCES

### SEQUENCE A: "I'm a Total Beginner"
**Goal**: Understand how CPU works (30 mins)**

```
T1.1 (CPU Basics)
  → T1.2 (Clock & Frequency)
    → T1.3 (FDE Cycle) ⭐⭐⭐
      → T2.1 (Cache Hierarchy) ⭐⭐⭐
        → T2.2 (Cache Hits/Misses) ⭐⭐⭐
```

**Output**: Basic understanding of CPU, memory hierarchy, why cache matters

---

### SEQUENCE B: "I'm a Junior Developer"
**Goal**: Understand CPU performance basics (1 hour)**

```
T1.3 (FDE Cycle) ⭐⭐⭐
  → T3.1 (Pipelining) ⭐⭐⭐
    → T2.1 (Cache Hierarchy) ⭐⭐⭐
      → T2.2 (Cache Hits/Misses) ⭐⭐⭐
        → T4.1 (Multi-Core)
          → T4.2 (SMT)
            → T2.3 (Cache Lines)
```

**Output**: Understanding why code is fast/slow, intro to multi-threading

---

### SEQUENCE C: "I'm a Systems Programmer"
**Goal**: Deep CPU architecture knowledge (2+ hours)**

```
T1.3 (FDE Cycle)
  → T3.1 (Pipelining)
    → T3.2 (Pipeline Hazards)
      → T3.3 (Branch Prediction)
        → T7.1 (Out-of-Order Execution)
          → T7.2 (Superscalar)
            → T2.1 (Cache)
              → T5.1 (Cache Coherence)
                → T5.2 (False Sharing)
                  → T6.1 (Speculation)
                    → T6.2 (Spectre) / T6.3 (Meltdown)
```

**Output**: Expert understanding of modern CPU architecture

---

### SEQUENCE D: "I Just Want Performance Tips" (30 mins)
**Goal**: Actionable performance knowledge**

```
T2.1 (Cache Hierarchy)
  → T2.2 (Cache Hits/Misses)
    → T2.3 (Cache Lines)
      → T5.2 (False Sharing)
        → T8.2 (Prefetching)
```

**Output**: Can optimize code for cache efficiency

---

### SEQUENCE E: "I'm Interested in Security" (1 hour)
**Goal**: Understand Spectre/Meltdown**

```
T3.3 (Branch Prediction)
  → T6.1 (Speculative Execution)
    → T6.2 (Spectre)
      → T6.3 (Meltdown)
```

**Output**: Understanding why CPU security is hard

---

## 🎯 QUICK REFERENCE: BY USE CASE

### "I'm Hiring Engineers" 
Show them: **T1.3 → T3.1 → T2.1 → T4.1**
(Know FDE cycle, pipelining, cache, multi-core = competent)

### "I'm Optimizing Performance"
Show them: **T2.1 → T2.2 → T2.3 → T5.2 → T8.2**
(Cache is everything)

### "I'm Learning Security"
Show them: **T3.3 → T6.1 → T6.2 → T6.3**
(Speculative execution is dangerous)

### "I'm Teaching CS Students"
Show them in order: **T1.1 → T1.3 → T3.1 → T2.1 → T4.1 → T4.2 → T5.1**
(Build from basics to complexity)

### "I Just Want to Understand My Laptop"
Show them: **T1.1 → T1.2 → T2.1 → T4.1**
(What's inside, why GHz matters, why cache matters, why multi-core matters)

---

## 📈 PRODUCTION PRIORITY (REMAPPED BY VALUE)

### Must-Have First (MVP Week 1-2)
- **T1.3** - Instruction FDE Cycle (foundation)
- **T2.1** - Cache Hierarchy (super important)
- **T3.1** - Pipelining (core technique)

### Quick Wins (Week 2-3)
- **T2.2** - Cache Hits/Misses (dramatic, high value)
- **T1.1** - What is CPU (easiest, foundational)
- **T1.2** - Clock & Frequency (quick, relatable)

### Core Knowledge (Week 3-4)
- **T2.3** - Cache Lines (enables optimization understanding)
- **T4.1** - Multi-Core (relevance to modern systems)
- **T3.2** - Pipeline Hazards (extends pipelining)

### Intermediate (Week 4-5)
- **T4.2** - Hyper-Threading (explains specs)
- **T3.3** - Branch Prediction (security foundation)
- **T2.3** - Cache Lines

### Advanced (Week 5+)
- **T5.1** - Cache Coherence
- **T6.1** - Speculative Execution
- **T6.2/T6.3** - Spectre/Meltdown
- Others...

---

## 🎓 DIFFICULTY SUMMARY TABLE

| Tier | Topics | Prerequisite Knowledge | Best Audience | Time to Learn |
|------|--------|----------------------|---------------|----|
| **Beginner** | T1.1-1.5 | None | Anyone | 30 min |
| **Beginner+** | T2.1-3.3 | Basic hardware | Junior devs | 1 hour |
| **Intermediate** | T4.1-5.2 | Pipelining + Cache | Developers | 1.5 hours |
| **Advanced** | T6.1-8.2 | Full foundation | Systems engineers | 2+ hours |

---

**KEY INSIGHT**: Start with **T1.3, T2.1, T3.1** (the holy trinity). From there, choose your path based on interests.

