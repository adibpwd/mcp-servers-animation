# PLAN — 39 OOM Killer: Algojo Saat RAM Server Habis

| Item | Nilai |
|---|---|
| Status | 🚧 KODE FIRST PASS — `data.js`, `manifest.js`, `Animation.jsx` dieksekusi; preview manual & export MP4 belum (lihat Checklist eksekusi). |
| Audiens | Sysadmin & Backend Engineer yang pernah mendapati aplikasi tiba-tiba hilang/mati misterius (`Killed`). |
| Audience promise | Memahami mekanisme proteksi darurat Linux Kernel saat memori 100% penuh dan kalkulasi `oom_score`. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Deep Dive — Memory & Kernel
- **Title Segments**: `OOM` (Rose `#EC4899`) + ` KILLER` (Amber `#F59E0B`)
- **Prasyarat**: 03 Virtual Memory, 18 Linux Processes.

## Model Mental
Saat aplikasi meminta alokasi RAM baru tapi memori fisik dan Swap sudah habis (Overcommit exhaustion), Kernel Linux tidak boleh membiarkan seluruh OS beku/hang. Sub-sistem OOM (Out Of Memory) Killer aktif sebagai algojo darurat: menghitung skor risiko (`badness score`), memilih proses paling rakus memori yang tidak krusial bagi kelangsungan OS, lalu mengirim `SIGKILL (9)` tanpa kompromi.

## Storyboard (4 Act)
1. **Act 1: Tekanan Memori Menembus Batas (RAM 99.9%)**
   - Bar memori fisik merah membara, Swap penuh, aplikasi web rakus memakan sisa buffer.
2. **Act 2: Alarm Darurat Kernel Berbunyi**
   - Kernel mendeteksi ketiadaan alokasi halaman memori baru. Status darurat OOM aktif.
3. **Act 3: Menghitung Skor Korban (`oom_score`)**
   - Scan proses: Process A (Database krusial), Process B (System daemon), Process C (Worker memory leak).
   - Process C mendapatkan `oom_score` tertinggi karena rasio konsumsi RAM terbesar.
4. **Act 4: Eksekusi SIGKILL & Jejak di `dmesg`**
   - Algojo Kernel meluncurkan `SIGKILL (9)` ke Process C. Memori langsung lega kembali. Jejak kejadian tercatat di log `/var/log/messages` / `dmesg`.

## Checklist eksekusi

- [x] `data.js` dibuat: palette (`OOM` rose `#EC4899` + `KILLER` amber `#F59E0B`, plus `RAM`/`SWAP`/`KERNEL`/`DB`/`DAEMON`/`WORKER`/`SUCCESS`/`DENY`), 4 `PHASES`, layout local (`AXIS_X`, meter/alarm/proc/log Y), `PROCESSES` (Database 12, System daemon 34, Worker leak 891), `LOG_LINES`, `CAPTIONS` ≤5 kata, `SFX_MAP`.
- [x] `manifest.js` dibuat sesuai kontrak §5 (schemaVersion, id, title, category, tags, color, audioStrategy).
- [x] `Animation.jsx` dieksekusi: satu `IntroHeaderMorphV1` (judul `OOM` rose + ` KILLER` amber) tetap mounted setelah morph, `ActBadgeNavigatorV1` dari satu array `PHASES`, semua visual di dalam `ContentBodyV1` local coordinate.
- [x] Master timeline GSAP 4 Act — tekanan RAM/Swap → alarm kernel → hitung `oom_score` 3 proses → SIGKILL & log `dmesg` — dengan reset state penuh tiap repeat (`repeat: -1, repeatDelay: 1.2`).
- [x] Semua SFX di `SFX_MAP` merujuk file nyata di `public/audio` (diverifikasi manual terhadap listing folder, bukan ditebak).
- [ ] Preview manual `/player/oom-killer`: intro/morph, tiap Act, transisi antar-Act, dan replay/loop kedua (state harus reset bersih).
- [ ] Audit collision layout: kartu Process C (`PROC_C_Y=620`) bertumpuk dengan `killStamp` di Act 4 — pastikan tidak bentrok visual dengan `logPanel` (`LOG_Y=770`) maupun caption bar (`CAPTION_Y=900`) di semua breakpoint.
- [ ] Audit dead code: `popOut` didefinisikan tapi belum dipakai — putuskan dipakai (mis. saat proses lain di-dim) atau dihapus.
- [ ] Compile/build check (`npm run build` atau setara) — belum dijalankan pada sesi ini.
- [ ] Export MP4 single-process test.
- [ ] Naikkan `status` di `metadata.json` dari `"draft"` ke `"ready"` setelah semua di atas lolos.

**Catatan file yang benar-benar dieksekusi** (menggantikan asumsi path lama di `ps`): repo root ada di
`/home/adb/Projects/Personal/mcp-servers-animation/` (bukan nested `mcp-servers-animation/mcp-servers-animation/`).
Tidak ada `src/content/registry.js` manual — topic baru auto-discovered lewat `src/content/resolveTopic.js` (glob
`Animation.jsx` + `metadata.json`), jadi tidak ada langkah "daftarkan ke registry" yang terlewat.
