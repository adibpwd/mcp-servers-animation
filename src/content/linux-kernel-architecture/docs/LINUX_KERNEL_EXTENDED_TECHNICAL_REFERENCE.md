# LINUX KERNEL — EXTENDED TECHNICAL REFERENCE

> **Purpose:** Deep technical dive into kernel concepts
> **For:** Animators, developers, and technical reviewers
> **Level:** Intermediate to Advanced
> **Date:** August 2026

---

## 📑 Table of Contents

1. [CPU & Privilege Levels](#cpu--privilege-levels)
2. [Interrupt & Exception Handling](#interrupt--exception-handling)
3. [System Calls (Syscalls)](#system-calls-syscalls)
4. [Process Scheduler (CFS)](#process-scheduler-cfs)
5. [Memory Management](#memory-management)
6. [Virtual Memory & Paging](#virtual-memory--paging)
7. [TLB & Performance](#tlb--performance)
8. [Device I/O & Drivers](#device-io--drivers)
9. [File System](#file-system)
10. [Network Stack](#network-stack)

---

## CPU & PRIVILEGE LEVELS

### x86-64 Privilege Rings

The x86-64 architecture defines **4 privilege rings** (0–3), though Linux uses only 2:

```
Ring 0 (Kernel Mode)
├─ Full hardware access
├─ Can execute all CPU instructions (privileged)
├─ Can access all memory
├─ Can modify CPU control registers (CR0, CR3, CR4)
└─ Used by: kernel, device drivers, interrupt handlers

Ring 3 (User Mode)
├─ Limited hardware access (sandboxed)
├─ Cannot execute privileged instructions
├─ Can only access user memory
├─ Cannot modify CPU registers
└─ Used by: regular processes, applications
```

**Current Privilege Level (CPL):**
- Stored in lowest 2 bits of CS (Code Segment) register
- x86-64 has DPL (Descriptor Privilege Level) in segment descriptors
- CPL ≤ DPL determines access rights

### Ring Transition Diagram

```
User Space (Ring 3)          Kernel Space (Ring 0)
─────────────────────────────────────────────────

Process A          Process B          Kernel
[CPL=3]           [CPL=3]           [CPL=0]
  │                 │
  └─ SYSCALL ───→ Interrupt Handler
                      │ (can access all hardware)
  ← SYSRET/IRET ──┘

Transition Time: ~50–100 CPU cycles (expensive!)
```

### Privileged Instructions

**Kernel can execute:**
- Load/store CPU control registers: MOV CR3 (set page table)
- Enable/disable interrupts: CLI, STI
- Load IDT/GDT: LIDT, LGDT
- I/O operations: IN, OUT
- Task switching: LTR (load task register)
- SYSCALL/SYSRET: transition between rings

**User mode blocks:**
- Any attempt to execute privileged instruction → CPU raises #GP (General Protection) exception → kernel kills process

---

## INTERRUPT & EXCEPTION HANDLING

### Interrupt Descriptor Table (IDT)

The IDT is a kernel data structure that maps interrupt numbers (0–255) to handlers:

```
IDT Structure (x86-64):
┌─────────────────────────────────────┐
│ Entry 0: Divide by Zero (exception) │
├─────────────────────────────────────┤
│ Entry 1: Debug (exception)          │
├─────────────────────────────────────┤
│ ...                                 │
├─────────────────────────────────────┤
│ Entry 32–47: Hardware IRQs          │  (8259 Programmable Interrupt Controller)
├─────────────────────────────────────┤
│ Entry 48: SYSCALL/software int      │  (int 0x80 or SYSCALL instruction)
├─────────────────────────────────────┤
│ Entry 128: Scheduler timer tick     │  (0x80, same as syscall entry)
├─────────────────────────────────────┤
│ Entry 255: Spurious interrupt       │
└─────────────────────────────────────┘

Each entry = 16 bytes (x86-64 gates):
- Offset (2 parts, high & low): address of handler function
- Segment selector: kernel code segment (CS)
- Type & attributes: trap gate vs interrupt gate
```

### Exception Types

**Processor Exceptions (0–31, reserved):**

| Exception | Number | Type | Description |
|-----------|--------|------|-------------|
| Divide Error | 0 | Fault | Divide by zero |
| Debug | 1 | Trap | Debug breakpoint |
| NMI | 2 | Interrupt | Non-maskable interrupt |
| Breakpoint | 3 | Trap | INT 3 instruction |
| Overflow | 4 | Trap | INTO instruction |
| Bound Range | 5 | Fault | BOUND instruction |
| Invalid Opcode | 6 | Fault | Illegal instruction |
| Device Not Available | 7 | Fault | FPU not available |
| Double Fault | 8 | Abort | Exception during exception |
| **Page Fault** | **14** | **Fault** | **Virtual memory miss** |
| Segment Not Present | 11 | Fault | Invalid segment |
| Stack Fault | 12 | Fault | Stack overflow |
| General Protection | 13 | Fault | Privilege violation |

### Interrupt Flow

```
Hardware/Software Event
        ↓
CPU atomically:
├─ Saves current flags (EFLAGS)
├─ Saves return address (RIP)
├─ Clears interrupt flag (IF)
└─ Jumps to IDT[interrupt_number] handler
        ↓
Interrupt Service Routine (ISR)
├─ Runs in kernel mode (Ring 0)
├─ Can access all hardware
└─ Usually saves registers to stack
        ↓
Handle the event
├─ Acknowledge hardware (if needed)
├─ Modify system state (if needed)
└─ Restore registers
        ↓
IRET instruction
├─ Restores RIP, EFLAGS
├─ Returns to interrupted code
└─ (or switches to another process)
```

### Interrupt vs Trap Gates

| Aspect | Interrupt Gate | Trap Gate |
|--------|----------------|-----------|
| **IF flag** | Automatically cleared (disable further interrupts) | NOT cleared (interrupts can happen) |
| **Use case** | Hardware interrupts (device events) | Exceptions, syscalls (can't be interrupted) |
| **Example** | Timer tick, NIC packet, disk I/O | Page fault, divide by zero, syscall |

---

## SYSTEM CALLS (SYSCALLS)

### How Syscalls Work

**Goal:** User process requests kernel service (can't do directly due to Ring 3 restriction)

**Mechanism:**

1. **User Process (Ring 3):**
   ```c
   #include <unistd.h>
   ssize_t result = read(file_descriptor, buffer, size);
   // Compiles to: syscall(SYS_read, file_descriptor, buffer, size)
   ```

2. **SYSCALL Instruction:**
   ```asm
   ; x86-64 calling convention: args in RDI, RSI, RDX, RCX, R8, R9
   ; Syscall number in RAX
   MOV RAX, 0        ; SYS_read
   MOV RDI, fd       ; arg1
   MOV RSI, buffer   ; arg2
   MOV RDX, size     ; arg3
   SYSCALL           ; ← CPU privilege transition
   ```

3. **CPU (atomic operation):**
   ```
   ├─ Saves RIP → RCX (return address)
   ├─ Saves RFLAGS → R11 (flags)
   ├─ Clears IF (disable interrupts)
   ├─ Changes CPL: Ring 3 → Ring 0
   ├─ Jumps to kernel entry point (SYSCALL_KERNEL_ENTRY)
   └─ Total overhead: ~50–100 CPU cycles
   ```

4. **Kernel Entry Code (`entry_SYSCALL_64` in arch/x86/entry/entry_64.S):**
   ```asm
   entry_SYSCALL_64:
   ├─ Switch to kernel stack (can't trust user stack)
   ├─ Build `pt_regs` structure (save all registers)
   ├─ Validate syscall number
   ├─ Jump to syscall handler table[RAX]
   └─ Handler executes (e.g., sys_read)
   ```

5. **Syscall Handler (e.g., `sys_read`):**
   ```c
   SYSCALL_DEFINE3(read, unsigned int, fd, char __user *, buf, size_t, count)
   {
       struct file *file = fget(fd);              // Get file descriptor
       return vfs_read(file, buf, count, &pos);   // Read from file
   }
   ```

6. **Return Path (`SYSRET` instruction):**
   ```asm
   ret_from_syscall:
   ├─ Write return value to RAX
   ├─ Restore registers from pt_regs
   ├─ SYSRET instruction:
   │  ├─ Restores CPL: Ring 0 → Ring 3
   │  ├─ Restores RIP from RCX
   │  ├─ Restores RFLAGS from R11
   │  └─ Jumps back to user code
   └─ User process resumes
   ```

### Syscall Cost

```
Time Breakdown (x86-64):
├─ SYSCALL transition: ~50 cycles
├─ Kernel entry code: ~20 cycles
├─ Syscall dispatch: ~5 cycles
├─ Handler execution: varies (1–1000000 cycles)
└─ SYSRET return: ~50 cycles

Total: ~200+ cycles for simple syscall (syscall + return)
       Can be microseconds (1 µs = ~2000 cycles at 2 GHz)

Why expensive?
- Privilege transition forces pipeline flush
- TLB entries invalidated (user→kernel address space switch)
- Instruction cache may not have kernel code
- Can't use speculative execution across rings (Meltdown/Spectre)
```

### Linux Syscall Numbers

First 300+ syscalls are used. Some examples:

```c
#define SYS_read        0
#define SYS_write       1
#define SYS_open        2
#define SYS_close       3
#define SYS_stat        4
#define SYS_fstat       5
#define SYS_lstat       6
#define SYS_poll        7
#define SYS_lseek       8
#define SYS_mmap        9
#define SYS_mprotect    10
#define SYS_munmap      11
#define SYS_brk         12
#define SYS_rt_sigaction 13
#define SYS_rt_sigprocmask 14
#define SYS_rt_sigpending 15
#define SYS_rt_sigtimedwait 16
#define SYS_rt_sigaction 17
#define SYS_rt_sigprocmask 18
// ... 300+ more
```

Full list: https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md

---

## PROCESS SCHEDULER (CFS)

### Completely Fair Scheduler (CFS)

**Introduced:** Linux kernel 2.6.23 (October 2007)
**Author:** Ingo Molnár
**Goal:** Fair CPU time allocation to all processes

### Key Concept: Virtual Runtime (vruntime)

Each process has a `vruntime` counter that tracks "unfairness":

```
vruntime = actual_time_scheduled

Algorithm:
├─ If process has run for 10ms, vruntime += 10ms
├─ If process has NOT run for 100ms while others ran, it stays behind
└─ Scheduler always picks process with LOWEST vruntime (most deprived)

Example:
Process A:   vruntime = 100ms (ran a lot, deserves break)
Process B:   vruntime = 50ms  (ran less, should run next)
Process C:   vruntime = 80ms
             ↓
Scheduler picks B (lowest vruntime)
```

### CFS Data Structure: Red-Black Tree

CFS uses a **red-black tree** (self-balancing binary search tree) to efficiently select the next process:

```
Red-Black Tree Ordered by vruntime:
              [Process B: 50ms]
              /              \
      [A: 100ms]        [C: 80ms]
      /                  /      \
  [D: 120ms]       [E: 75ms]  [F: 90ms]

Always pick: leftmost node (minimum vruntime)
Insert/remove: O(log N) complexity
Pick next: O(1) (cached as min_vruntime pointer)

Example:
├─ 100 processes in tree
├─ Finding next task: O(1)   ← Very fast!
├─ Inserting/removing: O(log 100) ≈ 7 operations
└─ Total scheduler overhead: negligible
```

### Time Slice Calculation

CFS doesn't use fixed time slices (unlike older O(1) scheduler). Instead:

```
sched_latency = 20ms (default, configurable)
    Goal: All processes should get turn within 20ms

num_processes = N
time_slice = sched_latency / N

Example:
├─ 1 process:  time_slice = 20ms
├─ 2 processes: time_slice = 10ms each
├─ 4 processes: time_slice = 5ms each
├─ 100 processes: time_slice = 0.2ms each
└─ Minimum granularity: min_granularity = 1ms (prevents thrashing)
   If calculated < 1ms, use 1ms
```

### Nice Values & Priority

Processes have `nice` values (-20 to +19):

```
nice = -20: highest priority (2× time quantum of nice=0)
nice = 0:   normal priority (default)
nice = +19: lowest priority (½ time quantum of nice=0)

weight[nice] = 1024 * 2^(-nice/10)

Example:
nice=-10: weight = 1024 * 2^(1) = 2048 → 2× CPU time
nice=0:   weight = 1024 * 2^(0) = 1024 → normal
nice=+10: weight = 1024 * 2^(-1) = 512 → ½ CPU time
```

### Scheduler Invocation Points

Scheduler runs (picks next process) when:

```
1. Timer interrupt (tick)
   └─ Every ~1ms (CONFIG_HZ = 1000 on modern kernels)
   └─ Preempt current process if time slice expired

2. Process blocks (e.g., waiting for I/O)
   └─ syscall read() → wait on disk
   └─ Immediately pick next runnable task

3. Process yields
   └─ sched_yield() syscall
   └─ Priority boosting for interactive tasks

4. Process creates another
   └─ fork() creates child
   └─ Decide: run parent or child?
```

### CFS Summary Algorithm

```
loop forever:
    // Find process with minimum vruntime
    next_task = tree.find_min()  // O(1)
    
    // Run it for time slice
    run(next_task, time_slice)
    
    // After time slice or event:
    // Update vruntime
    next_task.vruntime += actual_time_run
    
    // Reinsert into tree (position changed)
    tree.remove(next_task)         // O(log N)
    tree.insert(next_task)         // O(log N)
    
    // Loop back, pick minimum again
```

**Performance:**
- Scheduler overhead: < 1% of CPU time
- Latency to pick next task: microseconds
- Scales well: 1000s of processes

---

## MEMORY MANAGEMENT

### Memory Layout (User Process)

```
0x0000000000000000
                    ┌─────────────────────┐
                    │   Code (.text)      │ ← Read-only
                    │   - Instructions    │
                    │   - Size: varies    │
                    ├─────────────────────┤
                    │   Initialized Data  │ ← .data segment
                    │   (global variables)│
                    ├─────────────────────┤
                    │   Uninitialized Data│ ← .bss segment
                    │   (zero-initialized)│
                    ├─────────────────────┤
                    │   Heap              │ ← malloc/free
                    │   ↓ (grows down)    │
                    │                     │
                    │                     │
                    │   ↑ (grows up)      │
                    │   Stack             │
                    ├─────────────────────┤
                    │   Shared Libraries  │
                    │   (libc, etc)       │
                    └─────────────────────┘
0x7FFFFFFF (32-bit)
or
0x00007FFFFFFFFFFF (64-bit user space)

Kernel Space (high addresses):
0xFFFF800000000000 (x86-64)
                    ┌─────────────────────┐
                    │   Kernel Code       │
                    │   Kernel Data       │
                    │   Kernel Heap       │
                    │   Kernel Stack      │
                    │   Device Mappings   │
                    └─────────────────────┘
0xFFFFFFFFFFFFFFFF
```

### Buddy Allocator

Linux uses the **buddy allocator** for page allocation (4 KB pages):

```
Free Pages Management:

Free blocks of size 2^k:
├─ 2^0 (1 page = 4 KB):    [Free] [Free] [Free] [Free]
├─ 2^1 (2 pages = 8 KB):   [Free] [Free]
├─ 2^2 (4 pages = 16 KB):  [Free]
├─ 2^3 (8 pages = 32 KB):  [Free] [Free]
├─ 2^4 (16 pages = 64 KB): [Free]
└─ 2^5 (32 pages = 128 KB):[ Free]

Algorithm:
1. Allocate 7 pages (request)
   └─ No 7-page block exists
   └─ Request 8 pages (next power of 2)
   └─ Split 32-page block: → 16 + 16
   └─ Split 16-page block: → 8 + 8
   └─ Use one 8-page block
   └─ Return 8 pages to user (1 wasted for alignment)

2. Free 8 pages
   └─ Check "buddy" (other 8-page block from same 16-block)
   └─ If free, merge: 8 + 8 → 16 pages
   └─ Check next level: if both 16-page blocks free, merge → 32
   └─ Coalescing reduces fragmentation

Complexity:
├─ Allocate: O(1) for frequently-sized blocks
└─ Free: O(log N) with coalescing
```

### Slab Allocator

For small objects (structures), slab allocator sits on top of buddy:

```
Slab Cache Example (for `struct task_struct`):

Buddy Allocator
    ↓ (allocates pages)
Slab Cache Layer
    ├─ Slab 1: [object] [object] [object] [object]
    │          (8 task_struct objects per 4KB page)
    ├─ Slab 2: [object] [object] [object] [free  ]
    │          (3 allocated, 1 free)
    └─ Slab 3: [free  ] [free  ] [free  ] [free  ]
               (all free, can be returned to buddy)

Benefits:
├─ Reduces fragmentation
├─ Allocates/frees quickly (O(1))
├─ Caches slab metadata
└─ Efficient for fixed-size structures
```

---

## VIRTUAL MEMORY & PAGING

### Page Table Hierarchy (x86-64)

x86-64 uses **4-level page tables** for 48-bit virtual address space:

```
Virtual Address Format (48 bits):
┌─────┬─────┬─────┬─────┬─────────────┐
│ 16  │  9  │  9  │  9  │  9  │  12   │
│(sign)│PML4 │ PUD │ PMD │ PTE │offset │
└─────┴─────┴─────┴─────┴─────┴───────┘
0xFFFF 800000000000 = kernel space start

Translation Process:

1. CPU reads CR3 register → PML4 base address
2. Extract PML4 index (bits 39–47): index = VA[39:47]
   │
   ├─ PML4[index] = address of PDPT (Page Directory Pointer Table)
   
3. Extract PUD index (bits 30–38): index = VA[30:38]
   │
   ├─ PDPT[index] = address of PD (Page Directory)
   
4. Extract PMD index (bits 21–29): index = VA[21:29]
   │
   ├─ PD[index] = address of PT (Page Table)
   
5. Extract PTE index (bits 12–20): index = VA[12:20]
   │
   ├─ PT[index] = page entry
   │   ├─ Physical address (bits 12–51)
   │   ├─ Permissions (bits 0–11)
   │   │  ├─ Present (P): page in memory?
   │   │  ├─ Read/Write (W): writable?
   │   │  ├─ User/Supervisor (U): user accessible?
   │   │  ├─ Write-Through (WT): cache write-through?
   │   │  ├─ Cache Disable (CD): don't cache?
   │   │  ├─ Accessed (A): page accessed?
   │   │  └─ Dirty (D): page modified?
   
6. Extract page offset (bits 0–11): offset = VA[0:11]
   │
   └─ Physical Address = (PT[index] & 0xFFF000) + offset

Memory Overhead:
├─ Each level table: 512 entries × 8 bytes = 4 KB (1 page)
├─ Per-process max: 4 + 4 + 4 + 4 = 16 KB (worst case, usually less)
└─ Kernel shares one PML4 across all processes (kernel space)
```

### Page Fault Handling

**Page fault** = CPU raises exception when accessing unmapped page

```
Scenario: Process touches unmapped page

User Code:
    x = array[1000];        ← Unmapped virtual address
        ↓
    MMU translation fails:
    ├─ VA not in TLB (cache miss)
    ├─ Page table walk finds entry
    └─ Entry has Present bit = 0 (page not in RAM)
        ↓
    CPU raises #PF (Page Fault) exception (vector 14)
        ↓
    Kernel exception handler (page_fault):
    ├─ Determine page fault reason:
    │  ├─ Not present? (Page not in RAM)
    │  ├─ Permission denied? (Protection violation)
    │  └─ Reserved bit set? (CPU reserved bits violated)
    ├─ Read page from disk/swap
    ├─ Allocate physical page frame
    ├─ Update page table entry (set Present = 1)
    ├─ Flush TLB entry (for this VA)
    └─ Return from exception
        ↓
    CPU retries the instruction:
    x = array[1000];        ← Now in TLB/RAM, succeeds!
```

### Demand Paging

**Demand paging** = pages loaded only when accessed

```
Process startup:
├─ Create virtual address space
├─ Set up page table
├─ Mark all pages: Present = 0 (not in RAM)
├─ Load only entry point code into RAM
└─ Start executing

As process runs:
├─ Access code page 1 → page fault → load page
├─ Access code page 2 → page fault → load page
├─ Access heap → page fault → allocate + zero page
├─ Access unused stack → no page fault → stays on disk

Benefits:
├─ Fast startup (don't load whole program)
├─ Memory efficient (only use what's needed)
├─ Exploit locality (most memory unused)
└─ Can run multiple large programs in limited RAM
```

### Copy-on-Write (CoW)

Optimization for `fork()`:

```
fork() normally:
├─ Copy entire parent's memory → new child process
├─ Overhead: O(process_size) time & memory

With Copy-on-Write:
├─ Child shares parent's pages initially
├─ Mark pages: read-only for both
├─ On write: page fault → copy page → mark new as writable
└─ Overhead: O(1) at fork, O(1) per modified page

Example:
parent: [page1: RO] [page2: RO] [page3: RO]
child:  [page1: RO] [page2: RO] [page3: RO]  ← Same pages

Child writes to page2:
├─ Page fault (write to read-only page)
├─ Kernel allocates new frame for page2 copy
├─ Child's page2 now points to new frame (writable)
└─ parent's page2 unchanged
```

---

## TLB & PERFORMANCE

### Translation Lookaside Buffer (TLB)

**TLB** = hardware cache of recent page table translations

```
TLB Entry:
┌──────────────────────────────────────┐
│ Virtual Address Tag  (48 bits)       │
├──────────────────────────────────────┤
│ Physical Address (40 bits)           │
├──────────────────────────────────────┤
│ Permissions (Present, R/W, U/S)      │
├──────────────────────────────────────┤
│ Valid bit                            │
└──────────────────────────────────────┘

Typical size:
├─ L1 TLB (instruction): 128 entries
├─ L1 TLB (data): 64 entries
├─ L2 TLB (unified): 1024 entries
└─ Can vary by CPU model

Example on Intel i7:
├─ L1 TLB: 4-way set associative
├─ 128 entries for 4 KB pages
├─ Plus 32 entries for 2 MB pages
└─ Plus 8 entries for 1 GB pages
```

### TLB Hit vs Miss

```
Memory Access Flowchart:

      CPU generates address
            ↓
      TLB lookup
      /        \
    HIT        MISS
    /           \
  /               \
Get translation   Page table walk
from TLB          ├─ L1 cache check (usually hits)
  ↓               ├─ L2 cache check (if needed)
Physical          ├─ RAM access (slow!)
Address           └─ Update TLB
  ↓               ↓
Memory          Physical
Access          Address
  ↓               ↓
Data            (repeat memory access)
│
└─ Total: ~1 cycle     └─ Total: ~100 cycles

Difference: 100× slower on TLB miss!
```

### Context Switch & TLB Invalidation

**Problem:** Each process has own page tables. On context switch, TLB becomes invalid!

```
Process A running:
├─ TLB has translations for A's virtual addresses
├─ kernel changes CR3 to point to process B's page table
└─ TLB entries for A still loaded, but wrong!

Solution 1: Flush entire TLB
├─ MOV CR3, CR3 (reload CR3)
├─ Invalidates ALL TLB entries
├─ Expensive: ~1000+ cycle stall
└─ Problem: B has no warm TLB, will TLB miss on everything

Solution 2: PCID (Process Context ID, x86 extension)
├─ Each page table tagged with PCID
├─ TLB entries tagged with PCID
├─ Keep A's TLB, keep B's TLB (separate by PCID)
├─ Context switch: just switch PCID (2 entries)
└─ Performance: Much faster (Nehalem and later)

Solution 3: Shared kernel space (current Linux)
├─ Kernel page tables shared across processes
├─ Flush only user space TLB entries
├─ Keep kernel translations (most important for syscalls)
└─ Kernel mapped at high addresses (0xFFFF800000000000+)
```

### TLB Performance Impact

```
Workload: Random array access (poor locality)

TLB size: 64 entries (4 KB pages = 256 KB working set)

Scenario 1: Working set > TLB:
├─ TLB hit rate: ~5%
├─ TLB miss rate: ~95%
├─ Avg latency: 95% × 100 cycles = 95 cycles per access
└─ Performance: ~10 M accesses/sec

Scenario 2: Working set < TLB:
├─ TLB hit rate: ~95%
├─ TLB miss rate: ~5%
├─ Avg latency: 5% × 100 + 95% × 1 = 5.95 cycles
└─ Performance: ~1000 M accesses/sec

Ratio: 100× difference!
```

### Huge Pages (2 MB, 1 GB)

Optimization: use larger page sizes

```
Problem with 4 KB pages:
├─ Process with 1 GB working set → 256K pages
├─ L2 TLB can only hold 1024 entries → 80% miss rate!
└─ Costly page table walks

Solution: 2 MB pages
├─ Same 1 GB → 512 pages
├─ L2 TLB can hold all (only 512 entries needed)
├─ TLB hit rate: near 100%
└─ Fewer page faults, smaller page tables

Trade-offs:
├─ Pro: Better TLB performance, smaller page table
├─ Con: Wasted memory if working set not aligned to 2 MB
├─ Con: Page table walk is slightly deeper (only 3 levels instead of 4)
└─ Use case: Large data sets (databases, HPC)
```

---

## DEVICE I/O & DRIVERS

### Device Driver Architecture

```
Application (Ring 3)
    ↓ (syscall)
Kernel (Ring 0)
├─ File system / Socket / Character device interface
│      ↓
├─ Device driver (kernel module)
│  ├─ Translates generic requests → device-specific commands
│  ├─ Device abstraction layer (example: block devices)
│  │  ├─ Disk driver (SATA, NVMe, USB)
│  │  ├─ Network driver (Ethernet, WiFi)
│  │  └─ GPU driver (NVIDIA, AMD)
│  └─ Communicates with device hardware
│      ↓
├─ Interrupt controller
│  ├─ Receives interrupts from devices
│  ├─ Routes to appropriate driver handlers
│  └─ Raises CPU exceptions
│      ↓
Hardware (CPU-controlled via Bus)
├─ I/O Bus (PCIe, USB, etc)
├─ Devices (Disk, Network, USB, etc)
└─ Device Controllers
```

### DMA (Direct Memory Access)

Devices can read/write memory without CPU:

```
Traditional I/O:
CPU → Device Controller → Memory
       (CPU involved in every transfer)

DMA I/O:
Device Controller ← → Memory
(CPU just sets up transfer, device handles it)

Example: Disk read

Setup:
CPU:
├─ Allocate buffer in RAM
├─ Tell disk controller: read sector 1000, write to RAM buffer
└─ Device interrupt handler: mark buffer ready

Device:
├─ Read data from disk
├─ Transfer to RAM (without CPU)
├─ Raise interrupt (data ready)

Interrupt:
CPU:
├─ Interrupt fires
├─ Update file cache
├─ Wake up waiting process
└─ Resume

Benefit: CPU can do other work while I/O happens
```

---

## FILE SYSTEM

### Virtual File System (VFS) Layer

Linux abstracts multiple file system types with VFS:

```
Applications
    ↓ (open, read, write, close)
VFS (Virtual File System)
├─ Common interface (inode, dentry, file structures)
├─ System calls: open, close, read, write, stat, etc
├─ Path traversal: /home/user/file.txt → inode
├─ Permission checking
└─ Dispatch to specific file system
    ↓
File System Implementations
├─ ext4 (most common Linux)
├─ Btrfs (copy-on-write)
├─ XFS (high performance)
├─ FAT32 (USB drives)
├─ NTFS (Windows)
├─ NFS (network file system)
├─ tmpfs (RAM-based)
└─ Proc file system (/proc, /sys - kernel info)
    ↓
Block Device Layer
├─ I/O scheduler
├─ Caching
└─ Device drivers
    ↓
Hardware (Disk, SSD, USB, etc)
```

### Inode Structure

**Inode** = index node = metadata for a file

```c
struct inode {
    unsigned long i_ino;              // Inode number
    mode_t i_mode;                    // Type (file/dir) + permissions
    nlink_t i_nlink;                  // Hard link count
    uid_t i_uid, i_gid;               // Owner
    loff_t i_size;                    // Size in bytes
    struct timespec i_atime;          // Access time
    struct timespec i_mtime;          // Modification time
    struct timespec i_ctime;          // Change time
    blkcnt_t i_blocks;                // Blocks allocated
    struct address_space *i_mapping;  // Page cache
    struct super_block *i_sb;         // File system
    
    // Direct block pointers (ext4): 12 blocks
    block_t i_block[15];              
    
    // Indirect pointers (for larger files)
    // Single indirect: point to block of pointers
    // Double indirect: point to block of indirect pointers
    // Triple indirect: deeper tree
};
```

### Page Cache

Kernel caches disk data in RAM:

```
Disk I/O:
├─ First read: Load from disk → RAM cache → return to app
├─ Second read: Return from cache (much faster!)
├─ Write: Write to cache, mark dirty, sync to disk later

Page Cache Structure:
├─ Radix tree: organized by file offset
├─ Lookup by (inode, page_number) → physical page
├─ Shared across all processes for same file
└─ Size: can be majority of available RAM

Benefits:
├─ Reduces disk I/O (slow ~10ms vs RAM ~10ns)
├─ Transparent to applications
├─ Speeds up sequential access
└─ Reduces duplicated reads

Example:
cat /var/log/syslog  (first time)
├─ Disk read: 500 ms
└─ Copy to page cache

cat /var/log/syslog  (second time)
├─ Page cache hit: <1 ms
└─ 500× faster!
```

---

## NETWORK STACK

### Network Stack Layers (Bottom-to-Top)

```
Application Layer (Ring 3)
├─ HTTP/FTP/SSH (uses sockets)
└─ socket(AF_INET, SOCK_STREAM) → TCP socket

Socket Layer (VFS-like abstraction)
├─ Protocol families: AF_INET (IPv4), AF_INET6 (IPv6)
├─ Socket types: SOCK_STREAM (TCP), SOCK_DGRAM (UDP)
└─ Syscalls: send(), recv(), connect(), listen()

Transport Layer (TCP/UDP)
├─ TCP: Connection-oriented, reliable, in-order
│  ├─ Sequence numbers (ordering)
│  ├─ Checksums (error detection)
│  ├─ Congestion control (CWND, slow start)
│  └─ Flow control (receive window)
├─ UDP: Connectionless, unreliable, fast
│  ├─ Simple header
│  ├─ No ordering guarantee
│  └─ Used for: DNS, VoIP, gaming

Internet Layer (IP)
├─ IPv4: 32-bit addresses (192.168.1.1)
├─ IPv6: 128-bit addresses (2001:db8::1)
├─ Routing: find path to destination
├─ TTL (Time-to-Live): prevent infinite loops
└─ Fragmentation: split large packets

Link Layer (Ethernet, WiFi)
├─ MAC addresses (48-bit, per NIC)
├─ Frame format: destination MAC, source MAC, type, data, CRC
├─ ARP (Address Resolution Protocol): IP→MAC mapping
└─ VLAN tagging (for network segmentation)

Physical Layer
└─ 1000BASE-T: copper cable, voltage levels
   802.11: radio frequencies, modulation
```

### Packet Processing (Receive)

```
Hardware: NIC receives packet
    ↓
IRQ fired (interrupt)
    ↓
Device driver (ixgbe, r8169, etc):
├─ Read packet from NIC buffer (DMA already done)
├─ Allocate sk_buff (socket buffer) structure
├─ Add to device RX queue
└─ Raise softirq (soft interrupt, lower priority)
    ↓
Softirq handler (NAPI, netif_rx_schedule):
├─ Run in interrupt context (but with interrupts enabled)
├─ Pass sk_buff to network stack
└─ Batches multiple packets
    ↓
Link Layer (Ethernet):
├─ Check destination MAC (is it for us?)
├─ Strip Ethernet header
├─ Determine protocol (IPv4, IPv6, ARP)
└─ Dispatch to network layer
    ↓
Network Layer (IP):
├─ Validate header checksum
├─ Routing decision (for us? forward?)
├─ Defragmentation (if needed)
└─ Dispatch to transport layer
    ↓
Transport Layer (TCP):
├─ Validate TCP checksum
├─ Update sequence numbers
├─ Update receive window
├─ Payload copied to sk_buff->data
├─ Add to socket receive queue
└─ Wake up waiting process
    ↓
Application (blocked on recv()):
├─ Woken up by kernel
├─ read() syscall enters kernel
├─ Copy from socket queue to user buffer
└─ Return to user (data available)
```

---

## APPENDIX: CONSTANTS & PERFORMANCE

### Timing Reference

```
Latency:
├─ CPU cycle:           ~0.5 ns (2 GHz)
├─ L1 cache hit:        ~4 ns
├─ L2 cache hit:        ~12 ns
├─ L3 cache hit:        ~40 ns
├─ Main memory access:  ~100 ns
├─ SSD read:            ~100 µs
├─ Disk seek:           ~5–10 ms
├─ Context switch:      ~1–10 µs (1000–10000 cycles)
├─ Syscall:             ~0.1–1 µs (+ overhead)
├─ Page fault:          ~10–100 ms (disk I/O)
├─ TLB hit:             ~1 cycle
└─ TLB miss:            ~100 cycles

Throughput:
├─ CPU (2 GHz):         2 billion instructions/sec
├─ L1 memory:           ~50 GB/sec (saturated by L1 miss)
├─ L3 memory:           ~20 GB/sec
├─ Main memory:         ~10 GB/sec (limited by bus)
├─ SATA disk:           ~150 MB/sec
├─ NVMe SSD:            ~3000 MB/sec
└─ Network (1 Gigabit): ~125 MB/sec (theoretical)
```

### Memory Allocation Overhead

```
Buddy allocator:
├─ Allocate: O(1) average
├─ Free: O(log N) with coalescing
└─ External fragmentation: ~25% worst case

Slab allocator:
├─ Allocate: O(1)
├─ Free: O(1)
└─ Internal fragmentation: ~5–10%

Page table overhead:
├─ Per process (sparse): 16 KB (worst case)
├─ Page: 4 KB
├─ Large page (2 MB): 1 entry
└─ TLB capacity: 64–2048 entries (varies)
```

### Scheduler Overhead

```
Context switch:
├─ Register save: ~100 cycles
├─ TLB flush: ~1000 cycles (without PCID)
├─ TLB flush: ~10 cycles (with PCID)
├─ Cache miss penalty: ~1000+ cycles
└─ Total: ~1–10 microseconds

Scheduling decision:
├─ CFS pick task: O(1)
├─ Total overhead: < 1% CPU
└─ Latency to pick: microseconds
```

---

## References & Further Reading

- **Linux Kernel Documentation:** kernel.org/doc/
- **Understanding the Linux Kernel** (Bovet, Cesati) — best book
- **The Linux Programming Interface** (Kerrisk) — comprehensive
- **Linux Kernel Source:** github.com/torvalds/linux
- **OSDev.org:** https://wiki.osdev.org/Main_Page

---

**End of Extended Technical Reference**

*Use this as authoritative source for animation accuracy and technical details.*
