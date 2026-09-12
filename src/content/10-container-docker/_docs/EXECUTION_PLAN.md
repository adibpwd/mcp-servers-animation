# Execution Plan — `container-docker` (Docker Container vs Virtual Machine)

> Turunan teknis dari `CONTAINER_DOCKER_PLAN.md`. Numbering pakai standar
> hierarki unlimited (dot notation) sesuai `PROJECT_STRUCTURE.md`.
> Referensi standar: `docs/standardizations/02-standar-konten.md`,
> `docs/standardizations/03-tutorial-buat-topic-baru.md`,
> `docs/standardizations/04-referensi-gsap.md`.

## 1. Phase 1: Setup & Scaffolding

1.1. Keputusan Tier Final (blocker sebelum lanjut)
   1.1.1. Review ulang kategorisasi Tier 2/3 vs Tier 4 berdasarkan target
          audiens ("anak IT/junior dev")
   1.1.2. Finalisasi warna & tag manifest (draft pakai `#2496ED` +
          tag ramah pemula, bukan placeholder lama `#0EA5E9`/"Advanced")

1.2. Buat struktur folder & file dasar
   1.2.1. Buat `src/content/container-docker/manifest.js` sesuai draft
          di `CONTAINER_DOCKER_PLAN.md`
   1.2.2. Buat `src/content/container-docker/data.js` (skeleton awal)
   1.2.3. Buat `src/content/container-docker/Animation.jsx` (shell
          komponen kosong + import dasar, belum ada isi Act) @done(2026-09-06)
          — sudah berisi timeline penuh + JSX render Act 1–5, file
          closed dengan benar (bracket-balanced, verified)
   1.2.4. Buat folder `icons/` (kosong dulu, isi saat Phase 4 kalau perlu
          icon generation)

## 2. Phase 2: Data Layer (`data.js`)

2.1. Constants dasar
   2.1.1. `VW = 820`, `VH = 1340` (portrait 9:16)
   2.1.2. `COLORS` object — isi 8 warna dari Color Palette (BG, PANEL,
          BORDER, TEXT, MUTED, VM/heavy, Container/light, Host kernel,
          Hypervisor, Isolation wall, Docker brand)

2.2. `PHASES` array — 5 entry, tiap entry `{ id, badge, duration }`
   2.2.1. `three-vms-hook` (9.0s)
   2.2.2. `what-is-vm` (9.0s)
   2.2.3. `what-is-container` (11.0s)
   2.2.4. `tradeoff-compare` (10.0s)
   2.2.5. `lightweight-payoff` (9.0s)

2.3. Data per elemen visual (posisi, ukuran, label)
   2.3.1. `LAPTOP_METER` — posisi gauge RAM/CPU + state warna
          (merah → hijau)
   2.3.2. `VM_BOXES` — 3 entry, tiap entry punya kernel icon sendiri
   2.3.3. `HYPERVISOR_DIAGRAM` — posisi layer Hardware/Hypervisor/Guest OS
   2.3.4. `CONTAINER_BOXES` — 3 entry, shared kernel, TANPA kernel icon
          individual
   2.3.5. `NAMESPACE_CGROUP_LABELS` — label kecil per container box
   2.3.6. `SIZE_BOOTTIME_COMPARISON` — data bar GB vs MB, menit vs detik
   2.3.7. `ISOLATION_WALL_DIFF` — data tebal-tipis tembok isolasi

2.4. `SFX_MAP` — mapping ke `shared/audio/sfxLoader.js`
   2.4.1. `loading-heavy` (VM boot)
   2.4.2. `snap-in` (container boot)
   2.4.3. `whoosh`, `meter-drop`, `success`, `warning`

## 3. Phase 3: Animation Implementation per Act @done(2026-09-06)
> Semua Act (3.1–3.5) sudah punya timeline GSAP + JSX render lengkap.
> Belum termasuk QA Phase 7 (cek wording, duplikasi caption, smoke test
> export) — itu masih perlu jalan terpisah.

3.1. Act 1 — Hook: 3 App, 3 Rumah Penuh (~9s) @done(2026-09-06)
   3.1.1. Render laptop sebagai objek ANCHOR persisten (1 `id` tetap, di
          luar blok conditional per-Act — lihat § Konsep Anchor di
          `docs/standardizations/04-referensi-gsap.md`)
   3.1.2. Render 3 VM box entrance (animasi berat/lambat + SFX
          `loading-heavy`)
   3.1.3. Render meter RAM/CPU naik cepat ke merah
   3.1.4. Render karakter reaksi capek + speech bubble hook (`say()`)
   3.1.5. Closing cliffhanger text, transisi ke Act 2

3.2. Act 2 — Apa itu Virtual Machine? (~9s) @done(2026-09-06)
   3.2.1. Render diagram vertikal: Hardware → Hypervisor (violet) → 3
          Guest OS (orange, tiap kotak ada kernel icon sendiri)
   3.2.2. Animasi boot lambat tiap Guest OS (progress bar + kernel icon
          muncul berat)
   3.2.3. Badge kecil "Tiap VM = 1 OS utuh, tiap kali boot ulang dari nol"

3.3. Act 3 — Docker: Bukan VM Mini! (~11s) @done(2026-09-06)
   3.3.1. Render diagram vertikal baru: Hardware → 1 Host Kernel (sky
          blue) → Docker Engine → 3 Container (green, TANPA kernel icon)
   3.3.2. Animasi panah putus-putus dari 1 kernel host ke 3 container
          (visualisasi shared kernel)
   3.3.3. Badge kecil Namespace + Cgroup di tiap container box
   3.3.4. Animasi container snap-in cepat (kontras vs boot lambat Act 2)

3.4. Act 4 — Bukan Cuma "Lebih Kecil" (~10s) @done(2026-09-06)
   3.4.1. Split screen VM (kiri) vs Container (kanan)
   3.4.2. Bar perbandingan ukuran: GB vs MB
   3.4.3. Perbandingan boot time: menit vs detik (stopwatch)
   3.4.4. Visual isolation wall — VM tembok tebal vs container tembok
          tipis (rose)
   3.4.5. Caption trade-off keamanan (WAJIB, jangan skip)

3.5. Act 5 — Payoff: Laptop yang Sama, Jauh Lebih Lega (~9s) @done(2026-09-06)
   3.5.1. Transisi objek anchor laptop: 3 VM box → 3 container box lewat
          `gsap.to()` (posisi/warna), BUKAN `popIn()` ulang dari nol
   3.5.2. Meter RAM/CPU turun smooth ke hijau
   3.5.3. Karakter reaksi lega (kontras dgn Act 1)
   3.5.4. Catatan penutup WAJIB: kapan VM tetap dipakai (isolasi
          kuat/OS beda)
   3.5.5. Closing line penutup topic

## 4. Phase 4: Audio & SFX Integration @done(2026-09-06)
> Semua nama file di `SFX_MAP` (data.js) dicek manual — SEMUA ada di
> `public/audio/{ui,transitions,impacts,success,warnings,sfx}/*.wav`.
> Tidak ada sound yang butuh boost khusus (§4.1.1 di-skip, N/A).

4.1. Load `SFX_MAP` lewat `shared/audio/sfxLoader.js` @done(2026-09-06)
   4.1.1. Cek apakah ada SFX yang butuh lebih menonjol dari yang lain
          (kalau ya, terapkan pola `GainNode` boost — lihat "Audio
          Boost" di `docs/standardizations/04-referensi-gsap.md`, wajib
          diterapkan ke SEMUA clone di audio pool) — N/A, tidak
          diperlukan untuk topic ini
4.2. Sinkronkan `SFX_SCHEDULES` di `scripts/export-lib.js` dengan timing
     browser (`SFX_MAP` di `data.js`) — DITUNDA, hanya relevan untuk
     export video, tidak dibutuhkan untuk web preview

## 5. Phase 5: Timeline & Export Safety @done(2026-09-06)
> Pattern-nya identik dengan topic `tailscale` (yang sudah `status:
> ready`) — raw `gsap.timeline()` di `useEffect`, bukan lewat hook
> `useTimeline.js` terpisah. Sudah konsisten dgn kode existing lain.

5.1. Setup GSAP timeline via `useTimeline.js` hook — pakai pola raw
     `gsap.timeline()` di `useEffect`, sama seperti `tailscale` (bukan
     lewat hook terpisah) @done(2026-09-06)
5.2. Implementasi `window.__animationTimeline` (kontrak wajib export) @done(2026-09-06)
5.3. Implementasi `window.__flushSync` (export safety, lihat
     `docs/standardizations/04-referensi-gsap.md`) @done(2026-09-06)
5.4. Cleanup `tl.kill()` saat unmount @done(2026-09-06)
5.5. Determinism check — pastikan TIDAK ada `Math.random()` yang
     mempengaruhi durasi/timing timeline; kalau ada elemen "acak" visual
     (misal timing efek kecil), pakai seeded random function (lihat
     "Determinism: Hindari Math.random() di Timeline" di
     `docs/standardizations/04-referensi-gsap.md`) — dicek, tidak ada
     `Math.random()` dipakai sama sekali di file ini @done(2026-09-06)

## 6. Phase 6: Registry Integration @done(2026-09-06)

6.1. Import `manifest.js` ke `src/content/registry.js` @done(2026-09-06)
6.2. Ganti/uncomment entry `container-docker` pakai pola spread manifest
     (`{ ...containerDockerManifest, status: 'ready', component: ... }`),
     bukan hardcode literal @done(2026-09-06)
6.3. Tempatkan entry pada Tier final sesuai keputusan §1.1.1 —
     ditempatkan di Tier 3 (Intermediate → Advanced), tepat setelah
     `virtual-memory`, konsisten dengan category `Linux Deep Dive`
     @done(2026-09-06)

---

**Belum dikerjakan (sengaja dihentikan sampai sini atas permintaan):**
Phase 4.2 (sync export SFX schedule), Phase 7 (QA & checklist
verification — termasuk smoke test export Puppeteer), Phase 8 (final
review & merge). Ini nggak menghalangi preview di web dev server.

## 7. Phase 7: QA & Checklist Verification

7.1. Review 4-beat story spine tiap Act sesuai table di
     `CONTAINER_DOCKER_PLAN.md` (Setup → Tegangan → Titik Balik → Payoff)
7.2. Cek minimal 1 elemen visual non-rect per Act (speech
     bubble/karakter/badge)
7.3. Cek Persistent Anchor Object — laptop Act 1 & Act 5 harus 1 objek
     yang sama (bukan re-render)
7.4. Cek "Satu Kanal per Kalimat" — tidak ada kalimat identik dobel di
     caption (`say()`) vs card/badge (`popIn()`) di waktu berdekatan
7.5. Cek wording ringkas (maks ±7-8 kata/kalimat) & tanpa emoji di teks
     produksi
7.6. Cek 6 poin "Konsep Teknis WAJIB Akurat" di `CONTAINER_DOCKER_PLAN.md`
     tidak dilanggar:
   7.6.1. Container bukan "VM yang dikecilin" (visual jangan terlalu mirip)
   7.6.2. VM = hardware-level virtualization (hypervisor + kernel sendiri)
   7.6.3. Container = OS-level virtualization (shared kernel + namespace
          + cgroup)
   7.6.4. Trade-off keamanan disebut eksplisit di Act 4-5 (jangan diskip)
   7.6.5. Kapan VM tetap wajib disebut di Act 5
   7.6.6. Layered filesystem Docker (opsional, bukan inti cerita)
7.7. Smoke test export via Puppeteer (render frame + video, cek tidak
     ada error `window.__flushSync`)

## 8. Phase 8: Final Review & Merge

8.1. Review gap plan vs implementasi aktual (kalau ada penyesuaian dari
     draft awal, catat di sini)
8.2. Update `CONTAINER_DOCKER_PLAN.md` — tambah status
     "SUDAH DIEKSEKUSI (tanggal)" di bagian atas, mirip pola `pppplan.md`
8.3. Commit & cleanup file sementara (kalau ada)

---

## Catatan Urutan Eksekusi

- Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 berurutan (tidak ada dependency
  mundur — Phase 3 butuh Phase 2 selesai dulu karena Animation.jsx
  memanggil data dari `data.js`)
- Phase 1.1 (keputusan Tier) BLOCKER — harus selesai dulu sebelum Phase
  1.2 (karena manifest.js butuh tag/warna final) dan Phase 6 (registry
  placement)
- Phase 4 & 5 bisa paralel dengan ekor Phase 3 (SFX/timeline setup tidak
  harus nunggu semua Act selesai coding)
