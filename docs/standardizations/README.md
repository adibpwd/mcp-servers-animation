# Standardizations — Index

Tujuh dokumen di bawah adalah standar aktif untuk membuat atau merevisi topic
animasi. Struktur ini menggantikan alur lama 01–09 yang tersebar. Isi detail
lama tidak dihapus: redirect kompatibilitas terdahulu dipindahkan ke folder
backup agar folder standar utama hanya memuat tujuh dokumen aktif.

## Alur Baca Wajib untuk Topic Baru

    01 Architecture & Runtime
      → 02 Topic Contract & Scene Shell
        → 03 Planning, Storytelling & Quality Gate
          → 04 Motion & GSAP Reference
            → 05 SVG Layout & Asset Pipeline
              → 06 Audio & SFX
                → 07 Act Scene Pattern (1 Act = 1 File + Intro Background)

Baca dokumen 01–03 secara berurutan sebelum coding. Dokumen 04–07 adalah
referensi produksi yang dibuka saat diperlukan, lalu tetap diaudit pada tahap
validasi.

## Tujuh Dokumen Aktif

| Dokumen | Peran |
|---|---|
| [01-architecture-runtime.md](01-architecture-runtime.md) | Runtime animasi: React, GSAP, state, export, dan arsitektur scene. |
| [02-topic-contract-scene-shell.md](02-topic-contract-scene-shell.md) | Kontrak folder, manifest, registry, lifecycle, dan scene-ui V1. |
| [03-planning-storytelling-quality-gate.md](03-planning-storytelling-quality-gate.md) | Tutorial topic baru, storytelling, pre-planning, continuity, layout contract, anti-pattern, dan checklist quality gate—termasuk kontrak wajib Before → Action → After. |
| [04-motion-gsap-reference.md](04-motion-gsap-reference.md) | Referensi teknis GSAP: timeline, state handoff, export safety, determinism, motion patterns, dan lifecycle action/reflow koleksi dinamis. |
| [05-svg-layout-asset-pipeline.md](05-svg-layout-asset-pipeline.md) | SVG text, warna, safe-zone, scene coordinate, icon/asset audit, generation, crop, dan loader. |
| [06-audio-sfx.md](06-audio-sfx.md) | Sourcing, SFX_MAP, audio coverage, loudness, integrasi, dan validasi audio. |
| [07-act-scene-pattern.md](07-act-scene-pattern.md) | Pola "1 Act = 1 file" (pure presentational, body-local + origin, mode summary) dan scene act sebagai background intro/thumbnail. |

## Rute Cepat Berdasarkan Kebutuhan

| Kebutuhan | Dokumen aktif |
|---|---|
| Membuat folder topic / manifest / registry | 02 |
| Menentukan cerita, Act, state contract, continuity, layout, scene shell, before → action → after | 03 |
| Tween, repeat, seek, flushSync, export safety, action lifecycle, atau grid reflow | 04 |
| Text overflow, color, overlap, local coordinate, icon | 05 |
| Asset SFX, Audio Beat Map, loudness, audio coverage | 06 |
| Organisasi scene per Act, intro/thumbnail background, mode summary | 07 |
| Menjelaskan alur React/GSAP/export dari awal | 01 |

## Arsip Redirect Dokumen Lama

Nama lama 01-architecture.md sampai 09-standar-pembuatan-konten.md berada di
[backup/standardizations/](../../backup/standardizations/). Isinya hanya redirect singkat untuk membantu menelusuri
referensi historis; jangan menulis standar baru di sana.

07-plan-single-service.md bukan standar pembuatan content. Plan itu sekarang
berada di [docs/plan/PLAN-SINGLE-SERVICE.md](../plan/PLAN-SINGLE-SERVICE.md).

## Aturan Pemeliharaan

- Tambahkan aturan baru pada salah satu dari enam dokumen aktif, bukan membuat
  nomor standar baru tanpa alasan kuat.
- Jika suatu topik besar, buat bab baru dalam dokumen yang paling dekat
  tanggung jawabnya; jangan memecah detail hanya demi nomor file.
- Gunakan arsip redirect lama hanya untuk menelusuri referensi historis.
- Jika perlu perubahan lintas dokumen, update cross-reference pada enam
  dokumen aktif dan tambahkan contoh nyata bila aturan berasal dari revisi.

**Konsolidasi terakhir:** 2026-09-16 — ditambah pelajaran Revisi 02–04
Content 27: causal motion, state nyata, reflow, dan audit layout dinamis.
