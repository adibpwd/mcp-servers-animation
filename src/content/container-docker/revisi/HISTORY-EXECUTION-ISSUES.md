# History — Masalah yang Ditemukan Selama Eksekusi Topic `container-docker`

**Date compiled**: 2026-09-06
**Sumber**: `_docs/CONTAINER_DOCKER_PLAN.md`, `_docs/EXECUTION_PLAN.md`,
temuan langsung hari ini via `PROJECT_STRUCTURE.md` + Desktop Commander
**Tujuan**: catatan audit trail — apa aja yang sempat jadi
keputusan/blocker/gap selama topic ini dikerjakan, biar gampang di-review.

---

## 1. Keputusan Tier — Sempat Jadi Blocker (Phase 1.1)

Placeholder awal `container-docker` di `registry.js` ada di **Tier 4
(Advanced/Specialist)** dengan tag "Advanced" dan warna placeholder
`#0EA5E9`. Tapi target audiens sebenarnya adalah **"anak IT/junior dev"**
(sudah pernah pakai `docker run`, belum ngerti bedanya dari VM) — nggak
cocok Tier 4.

**Resolusi**: dipindah ke **Tier 3 (Intermediate → Advanced)**, warna
final diganti ke `#2496ED` (Docker brand blue, bukan placeholder lama),
tag diganti jadi ramah pemula (`['Docker', 'Container', 'VM',
'Namespaces', 'Virtualization']`, bukan literal "Advanced").
Ditempatkan tepat setelah `virtual-memory` di registry, konsisten
dengan category `Linux Deep Dive`.

## 2. Risiko Oversimplifikasi Konsep (Difficulty ⭐⭐⭐)

Topic ini ditandai eksplisit di `CONTAINER_DOCKER_PLAN.md` sebagai
**"rawan oversimplifikasi jadi salah"**, khususnya soal isolasi &
keamanan. Miskonsepsi umum yang harus dihindari: **"container itu VM
versi ringan"** — ini SALAH, beda model isolasi total (hardware-level
vs OS-level), bukan cuma soal ukuran.

6 poin "Konsep Teknis WAJIB Akurat" yang jadi checklist (lihat Phase
7.6 di `EXECUTION_PLAN.md`, **belum diverifikasi/QA**):
   2.1. Container bukan "VM yang dikecilin" — visual jangan terlalu mirip
   2.2. VM = hardware-level virtualization (hypervisor + kernel sendiri)
   2.3. Container = OS-level virtualization (shared kernel + namespace +
        cgroup)
   2.4. Trade-off keamanan disebut eksplisit di Act 4-5 — jangan diskip
        (shared kernel = attack surface lebih besar)
   2.5. Kapan VM tetap wajib dipakai harus disebut di Act 5 (isolasi
        kuat/OS beda)
   2.6. Layered filesystem Docker — opsional, bukan inti cerita

## 3. Keputusan Teknis Selama Implementasi (Phase 3–6, semua `@done`)

- **Anchor object** — laptop di Act 1 & Act 5 wajib 1 objek GSAP yang
  sama (bukan re-render dari nol), supaya transisi "3 VM box → 3
  container box" di Act 5 kelihatan sebagai perubahan, bukan animasi
  baru. Diimplementasi lewat `gsap.to()`, bukan `popIn()` ulang.
- **Pola timeline** — dipakai `gsap.timeline()` mentah di `useEffect`
  (bukan lewat hook `useTimeline.js` terpisah), mengikuti pola existing
  `tailscale` yang sudah `status: ready`, demi konsistensi kode.
- **Determinism check** — dicek manual, **tidak ada** `Math.random()`
  dipakai di file ini (aman untuk export video yang butuh timing
  deterministik).

## 4. Scope yang Sengaja Ditunda (Bukan Bug — Keputusan Sadar)

Dari catatan penutup `EXECUTION_PLAN.md`, dihentikan sengaja sampai
Phase 6 atas permintaan, belum menghalangi preview di web dev server:

- **Phase 4.2** — sync `SFX_SCHEDULES` di `scripts/export-lib.js` dgn
  timing browser. Ditunda karena cuma relevan untuk export video, bukan
  web preview.
- **Phase 7** — QA & Checklist Verification (termasuk cek 6 poin § 2 di
  atas, smoke test export Puppeteer). **Belum jalan.**
- **Phase 8** — Final Review & Merge (update status di
  `CONTAINER_DOCKER_PLAN.md`, commit & cleanup). **Belum jalan.**

## 5. Temuan Baru Hari Ini (2026-09-06) — Gap di Luar Plan Awal

**Masalah**: Topic `container-docker` tidak muncul di Content
Management dashboard (`http://<host>:3373/content-management`),
padahal sudah `status: ready` & lengkap di `registry.js`.

**Root cause**: `EXECUTION_PLAN.md` Phase 6 cuma mencakup "Registry
Integration" (`registry.js`, dipakai player animasi). Tidak ada step
untuk sinkronisasi ke `scripts/content-db.json` (database terpisah yang
dipakai dashboard Content Management via `GET /api/content`). Karena
step ini nggak pernah ada di plan awal, entry-nya kelewat — bukan error
kode, murni gap di planning.

**Detail lengkap & rencana perbaikan**: lihat
`PLAN-FIX-MISSING-FROM-CONTENT-MANAGEMENT.md` di folder yang sama.

---

## Ringkasan Status Saat Ini

| Phase | Status |
|---|---|
| 1. Setup & Scaffolding | ✅ Done |
| 2. Data Layer | ✅ Done |
| 3. Animation per Act (1–5) | ✅ Done |
| 4. Audio & SFX | ✅ Done (4.2 ditunda, N/A utk web preview) |
| 5. Timeline & Export Safety | ✅ Done |
| 6. Registry Integration (player) | ✅ Done |
| 6b. Content Management DB sync | ❌ **Baru ketahuan hari ini — belum ada di plan awal** |
| 7. QA & Checklist Verification | ⏳ Belum jalan |
| 8. Final Review & Merge | ⏳ Belum jalan |
