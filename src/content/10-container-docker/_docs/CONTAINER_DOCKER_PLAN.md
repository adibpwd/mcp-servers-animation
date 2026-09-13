# Docker Container vs Virtual Machine — Topic Plan

## Overview

Animasi narrative-driven: developer yang capek laptopnya lemot tiap kali
mau jalanin 3 aplikasi beda environment (Node, Python, Redis) pakai
Virtual Machine — tiap VM install OS penuh sendiri, RAM/CPU tercekik,
boot lambat. Solusinya: Docker container — beda pendekatan virtualisasi
(OS-level, bukan hardware-level), share kernel host, jauh lebih ringan.
Ending = jawab hook Act 1 secara eksplisit + luruskan miskonsepsi umum
"container itu VM versi ringan" (BUKAN, beda konsep isolasi).

Target audiens: **anak IT / junior dev** — sudah pernah dengar/pakai
`docker run` tapi belum ngerti kenapa itu beda dari VM. Playful tone,
BUKAN dokumentasi teknis dibacakan. Ikuti kontrak
`docs/standardizations/02-topic-contract-scene-shell.md` + `docs/standardizations/03-planning-storytelling-quality-gate.md`.

**Canvas:** 820 × 1340 (portrait 9:16, standar reels mobile — sama seperti
`tailscale`, `linux-vs-unix`, `virtual-memory`, `file-permission`)
**Difficulty:** ⭐⭐⭐ (rawan oversimplifikasi jadi salah — lihat § Konsep
Teknis WAJIB Akurat, terutama soal isolasi & keamanan)
**Estimasi total durasi:** ~48 detik (5 Act)

**Catatan penempatan Tier:** placeholder `container-docker` di
`registry.js` saat ini di Tier 4 (Advanced/Specialist, tag "Advanced").
Berdasarkan diskusi (`docs/plan/topic-ideas-friendly.md` § B.4), topic ini
ditarget ke audiens "anak IT/junior dev" — kemungkinan lebih cocok Tier
2/3, bukan Tier 4. **Keputusan final tier ditunda sampai eksekusi.**

## Color Palette

```
BG:          #070913   background solid, dark navy
PANEL:       #0F172A   panel/card
BORDER:      #334155
TEXT:        #E2E8F0
MUTED:       #94A3B8

VM/heavy:        #FB923C  orange - Virtual Machine, guest OS penuh, "berat"
Container/light: #34D399  green - Docker container, ringan, efisien
Host kernel:      #38BDF8  sky blue - kernel host yang di-share container
Hypervisor:       #A78BFA  violet - lapisan hypervisor (VM only)
Isolation wall:   #F43F5E  rose - batas isolasi (namespace/cgroup vs full VM boundary)
Docker brand:     #2496ED  docker blue - elemen "Docker Engine" itu sendiri
```

## Story Spine (4-Beat per Act, wajib per docs/03)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Developer mau jalanin 3 app beda environment (Node, Python, Redis) pakai 3 Virtual Machine | Tiap VM install OS penuh sendiri → RAM/CPU laptop tercekik, boot 3x lama nunggu | — (hook belum dijawab) | Cliffhanger: "Masa iya tiap app butuh 1 OS penuh sendiri-sendiri?" |
| 2 | Perlu paham dulu APA itu VM sebelum bisa bandingin | VM = hardware virtualization: hypervisor bikin "komputer virtual" lengkap, tiap VM boot kernel sendiri dari nol | Reveal: itu sebabnya VM berat — bukan cuma app yang di-load, tapi OS UTUH tiap kali | Baseline paham: VM = isolasi kuat tapi mahal secara resource |
| 3 | Ada cara lain: Docker container — TAPI ini BUKAN "VM yang dikecilin" | Kalau bukan VM mini, terus container itu apa sebenarnya? | Titik balik: container share KERNEL host yang sama, isolasi pakai namespace + cgroup (bukan hypervisor terpisah) | Container cuma bungkus app+dependency-nya doang, bukan OS baru → jauh lebih ringan & cepat boot |
| 4 | Container & VM sekarang sudah dijelasin masing-masing | Sering disalahpahami "container = VM versi ringan" — padahal beda model isolasi total | Side-by-side comparison: ukuran (MB vs GB), boot time (detik vs menit), tapi juga trade-off keamanan (shared kernel = attack surface lebih besar) | Paham bedanya bukan cuma "lebih kecil", tapi mekanisme isolasi yang fundamentally beda |
| 5 | Semua konsep sudah jelas | — (tegangan sudah reda) | Reveal: developer ganti 3 VM jadi 3 container di laptop yang sama | Jawab hook Act 1 — laptop yang tadinya lemot sekarang jalanin 3 app ringan bebarengan, TAPI tetap disebut kapan VM masih perlu (isolasi lebih kuat, beda OS/kernel) |

## Act 1 — Hook: 3 App, 3 Rumah Penuh (≈9s)

**Badge:** "ACT 1 — 3 APP, 3 OS PENUH?"
**Visual inti:**
- Laptop di tengah, di dalamnya digambar 3 "rumah" (box VM) berjejer:
  masing-masing berlabel Node/Python/Redis, tiap rumah ada atap kecil
  bertuliskan "OS Sendiri"
- Meter RAM/CPU di pojok laptop naik cepat ke merah (rose) sambil tiap
  rumah "dibangun" satu-satu (animasi box muncul berat/lambat, disertai
  SFX berat/loading lama)
- Karakter (muka bulat simpel) reaksi capek/ngos-ngosan, keringat
- Speech bubble hook: "Kenapa jalanin app kecil aja laptop udah teriak?"
- Teks closing Act: cliffhanger — lempar ke Act 2 (apa itu VM dulu)

## Act 2 — Apa itu Virtual Machine? (≈9s)

**Badge:** "ACT 2 — VM = KOMPUTER PALSU YANG LENGKAP"
**Visual inti:**
- Diagram vertikal: Hardware (bawah) → Hypervisor (violet, label
  "software yang bikin komputer virtual") → 3 kotak Guest OS lengkap
  (orange) di atasnya, tiap kotak ada ikon kernel kecil sendiri-sendiri
- Animasi: tiap Guest OS "boot dari nol" (progress bar lambat, ikon
  kernel muncul dgn animasi berat) sebelum app di dalamnya bisa jalan
- Badge kecil: "Tiap VM = 1 OS utuh, tiap kali boot ulang dari nol"
- Payoff Act ini: paham KENAPA VM berat — bukan app-nya yang berat,
  tapi OS pembungkusnya

## Act 3 — Docker: Bukan VM Mini! (≈11s)

**Badge:** "ACT 3 — CONTAINER BUKAN VM YANG DIKECILIN"
**Visual inti:**
- Setup pertanyaan: "Kalau bukan VM mini... container itu apaan?"
- Diagram vertikal BARU (kontras visual dgn Act 2): Hardware (bawah) →
  **1 Host OS/Kernel** (sky blue, cuma SATU, tidak diulang) → Docker
  Engine (docker blue) → 3 kotak Container (green, KECIL, tanpa ikon
  kernel di dalamnya)
- Animasi: panah putus-putus dari 1 kernel host "dipinjam" ke 3
  container sekaligus (visualisasi shared kernel, bukan kernel sendiri²)
- Badge kecil: "Namespace = sekat privasi tiap container. Cgroup = jatah
  resource tiap container." (dua istilah muncul sebagai label kecil di
  tiap kotak container, bukan dijelasin panjang di sini)
- Animasi boot: container muncul cepat (snap-in, bukan progress bar
  lambat kayak Act 2) — kontras jelas dgn kecepatan boot VM
- Payoff: container = app + dependency doang, numpang kernel yang sama

## Act 4 — Bukan Cuma "Lebih Kecil" (≈10s)

**Badge:** "ACT 4 — RINGAN, TAPI ADA HARGANYA"
**Visual inti:**
- Split screen VM (kiri, orange) vs Container (kanan, green):
  - Ukuran: GB vs MB (bar perbandingan visual, container jauh lebih pendek)
  - Boot time: menit vs detik (jam animasi/stopwatch)
- Beat tegangan: "Kalau container jauh lebih enak, kenapa VM masih dipakai?"
- Titik balik (rose, isolation wall): tunjukkan VM punya tembok isolasi TEBAL
  (hardware-level, terpisah total) vs container tembok LEBIH TIPIS
  (proses-level, share kernel host) — kalau kernel host bocor/di-exploit,
  container ikut kena risiko, VM tidak
- Caption pembanding singkat: "Container ringan karena numpang kernel.
  Numpang itu jadi kelebihan SEKALIGUS kelemahannya."

## Act 5 — Payoff: Laptop yang Sama, Jauh Lebih Lega (≈9s)

**Badge:** "ACT 5 — 3 APP, 1 KERNEL, LAPTOP ADEM"
**Visual inti:**
- Laptop yang sama dari Act 1, sekarang 3 "rumah" VM (orange) diganti
  jadi 3 kotak container kecil (green) berjejer rapi, muncul cepat
  (snap-in bareng, bukan satu-satu lambat)
- Meter RAM/CPU yang tadinya merah (Act 1) sekarang turun ke hijau,
  animasi meter turun smooth
- Reveal eksplisit menjawab hook Act 1: karakter yang tadi capek/ngos-
  ngosan sekarang senyum lega
- Catatan penutup (jangan skip, wajib per § Konsep Teknis): 1 baris kecil
  "VM tetap dipakai kalau butuh isolasi lebih kuat atau OS/kernel beda
  total (misal jalanin Windows app di server Linux)."
- Closing line: "Container bukan versi kecil dari VM — beda cara
  ngebungkusnya. Itu yang bikin laptop lo lega."

## Konsep Teknis yang WAJIB Tetap Akurat (jangan disederhanakan sampai salah)

1. **Container BUKAN "VM yang dikecilin".** Ini miskonsepsi paling umum
   dan JUSTRU alasan utama topic ini dibuat — jangan sampai animasi malah
   memperkuat miskonsepsi ini lewat visual yang terlalu mirip antara
   kotak VM dan kotak container.
2. **VM = hardware-level virtualization.** Hypervisor (Type 1/bare-metal
   seperti KVM/ESXi, atau Type 2/hosted seperti VirtualBox) membuat
   "hardware virtual", tiap VM boot **kernel sendiri** yang terpisah total
   dari host maupun VM lain.
3. **Container = OS-level virtualization.** Semua container di 1 host
   **share 1 kernel** yang sama (kernel host). Isolasi didapat dari fitur
   kernel Linux: **namespace** (PID, network, mount, UTS, IPC, user —
   bikin tiap container "merasa" punya proses/network/filesystem sendiri)
   dan **cgroup** (membatasi & mengalokasikan resource CPU/memory/IO per
   container). Ini BUKAN hypervisor, jangan digambar pakai visual yang
   sama dengan hypervisor di Act 2.
4. **Trade-off keamanan wajib disebut (Act 4-5), jangan diskip demi
   "cerita bahagia".** Karena share kernel, container punya isolation
   boundary yang secara fundamental lebih tipis dari VM — kernel exploit
   berpotensi menembus ke host atau container lain, sedangkan VM punya
   kernel terpisah sehingga boundary-nya jauh lebih kuat. Ini alasan
   nyata kenapa VM masih dipakai untuk multi-tenant yang tidak saling
   percaya (misal cloud provider yang jalankan VM customer berbeda-beda).
5. **Kapan VM tetap wajib** (harus disebut di Act 5, bukan opsional):
   butuh kernel/OS yang beda dari host (misal Windows app di atas host
   Linux), atau butuh isolasi keamanan setingkat hardware untuk workload
   yang tidak saling percaya.
6. Docker image bersifat **layered** (union filesystem, umumnya
   OverlayFS) — boleh disinggung ringan kalau ada slot durasi, TAPI bukan
   inti cerita topic ini (fokus tetap di beda mekanisme isolasi VM vs
   container, bukan detail image layering).

## Manifest Draft (`manifest.js`)

```js
export default {
  schemaVersion: 1,
  id: 'container-docker',
  title: 'Docker Container vs Virtual Machine',
  subtitle: 'Why containers are not just "tiny VMs"',
  category: 'Developer Tools',
  tags: ['Docker', 'Container', 'VM', 'Namespaces', 'Virtualization'],
  color: '#2496ED',
  audioStrategy: 'realtime',
}
```

**Catatan:** placeholder lama di `registry.js` pakai `color: '#0EA5E9'` dan
tag `'Advanced'` (Tier 4). Draft manifest di atas pakai warna brand Docker
(`#2496ED`) dan tag lebih ramah pemula — sesuaikan lagi saat eksekusi
setelah tier final diputuskan.

## data.js Skeleton (rencana, belum final)

```js
export const VW = 820
export const VH = 1340

export const COLORS = { /* lihat Color Palette di atas */ }

export const PHASES = [
  { id: 'three-vms-hook',   badge: 'ACT 1 — 3 APP, 3 OS PENUH?',        duration: 9.0 },
  { id: 'what-is-vm',       badge: 'ACT 2 — VM = KOMPUTER PALSU YANG LENGKAP', duration: 9.0 },
  { id: 'what-is-container',badge: 'ACT 3 — CONTAINER BUKAN VM YANG DIKECILIN', duration: 11.0 },
  { id: 'tradeoff-compare', badge: 'ACT 4 — RINGAN, TAPI ADA HARGANYA', duration: 10.0 },
  { id: 'lightweight-payoff', badge: 'ACT 5 — 3 APP, 1 KERNEL, LAPTOP ADEM', duration: 9.0 },
]

// diisi detail per-Act saat implementasi:
// LAPTOP_METER (RAM/CPU gauge), VM_BOXES (3x, dgn kernel icon masing²),
// HYPERVISOR_DIAGRAM, CONTAINER_BOXES (3x, shared kernel, snap-in cepat),
// NAMESPACE_CGROUP_LABELS, SIZE_BOOTTIME_COMPARISON, ISOLATION_WALL_DIFF
export const SFX_MAP = { /* loading-heavy (VM boot), snap-in (container
  boot), whoosh, meter-drop (RAM turun), success, warning (isolation
  trade-off beat) — map ke shared/audio/sfxLoader */ }
```

## Checklist Sebelum Implementasi Kode (lihat juga docs/standardizations/03-planning-storytelling-quality-gate.md bagian Checklist)

- [ ] Plan ini direview/disetujui user
- [ ] Keputusan final Tier di `registry.js` diambil (lihat § Overview
      "Catatan penempatan Tier")
- [ ] Folder `src/content/container-docker/{Animation.jsx,data.js,manifest.js}`
      dibuat
- [ ] `registry.js` — uncomment entry lama ATAU ganti pakai spread
      manifest (pola baru, lihat `tailscale`/`linux-vs-unix`)
- [ ] Tiap Act ikuti 4-beat table di atas saat coding (bukan cuma daftar fakta)
- [ ] Minimal 1 elemen visual non-rect per Act (speech bubble/karakter/badge)
- [ ] `window.__animationTimeline` + `window.__flushSync` + cleanup `tl.kill()`
- [ ] SFX browser sinkron dengan `SFX_SCHEDULES` di `scripts/export-lib.js`
- [ ] Konsep teknis di atas (§ Konsep Teknis WAJIB Akurat) tidak dilanggar
      — terutama poin 1 (bukan VM mini) dan poin 4-5 (trade-off keamanan
      & kapan VM masih perlu, JANGAN diskip di Act 5)
- [ ] Wording ringkas & tanpa emoji di teks produksi (lihat
      `docs/standardizations/03-planning-storytelling-quality-gate.md` § Wording Ringkas & Tanpa Emoji)
- [ ] Laptop di Act 1 & Act 5 dirender jadi SATU objek anchor persisten
      (1 `id` tetap, di luar blok conditional per-Act, transisi pakai
      `gsap.to()`) — BUKAN dibuat ulang lewat `popIn()` di tiap Act,
      lihat "Advanced Pattern: Persistent Anchor Object Lintas-Act" di
      `docs/standardizations/04-motion-gsap-reference.md`
- [ ] Cek tidak ada kalimat identik yang tampil dobel di 2 kanal
      berbeda (caption `say()` vs card/badge `popIn()`) di waktu
      berdekatan — lihat "3.7 Satu Kanal per Kalimat" di
      `docs/standardizations/02-topic-contract-scene-shell.md`
