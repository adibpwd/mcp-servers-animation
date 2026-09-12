# Execution Plan — `env-variables` (Environment Variables & .env)

> Turunan teknis dari `ENV_VARIABLES_PLAN.md`. Numbering pakai standar
> hierarki unlimited (dot notation) sesuai `PROJECT_STRUCTURE.md`.
> Referensi standar: `docs/standardizations/02-standar-konten.md`,
> `docs/standardizations/03-tutorial-buat-topic-baru.md`,
> `docs/standardizations/04-referensi-gsap.md`,
> `docs/standardizations/05-svg-text-guide.md`,
> `docs/standardizations/08-audio-sfx-generation.md`.
>
> **Status saat file ini ditulis: BELUM ADA KODE SAMA SEKALI** (sesuai
> permintaan user — "plan md aja dulu tanpa eksekusi"). Semua langkah di
> bawah masih rencana, belum ada tanda `@done`.

## 1. Phase 1: Setup & Scaffolding

1.1. Keputusan Final (blocker sebelum lanjut)
   1.1.1. Konfirmasi Tier 2 + kategori "Developer Tools" (lihat
          § Overview `ENV_VARIABLES_PLAN.md`) — belum final sampai
          user approve plan ini
   1.1.2. Finalisasi warna manifest final (`#EAB308`) — dicek tidak
          bentrok visual dengan topic Tier 2 lain yang sudah
          `ready`/`coming-soon` (`shell-pipeline` #34D399,
          `what-is-kernel` #A78BFA, `process-vs-thread` #FB923C) —
          aman, tidak ada duplikat

1.2. Buat struktur folder & file dasar
   1.2.1. Buat `src/content/env-variables/manifest.js` sesuai draft di
          `ENV_VARIABLES_PLAN.md`
   1.2.2. Buat `src/content/env-variables/data.js` (skeleton awal —
          VW/VH/COLORS/PHASES/SFX_MAP)
   1.2.3. Buat `src/content/env-variables/Animation.jsx` (shell
          komponen kosong + import dasar, belum ada isi Act)
   1.2.4. TIDAK perlu buat folder `icons/` — topic ini tidak pakai
          AI-generate icon (lihat § "Icon: Tidak Perlu AI-Generate" di
          plan)

## 2. Phase 2: Data Layer (`data.js`)

2.1. Constants dasar
   2.1.1. `VW = 820`, `VH = 1340` (portrait 9:16, konsisten topic lain)
   2.1.2. `COLORS` object — 6 warna dari Color Palette (DEV, SERVER,
          DANGER, SUCCESS, CONFIG, GIT) + 5 warna standar
          BG/PANEL/BORDER/TEXT/MUTED

2.2. `PHASES` array — 3 entry, tiap entry `{ id, badge, duration }`
   2.2.1. `same-code-hook` (8.0s)
   2.2.2. `hardcode-vs-envvar` (10.5s)
   2.2.3. `dont-commit-env` (10.5s)

2.3. Data per elemen visual (posisi, ukuran, label)
   2.3.1. `DEV_MACHINE` — posisi + state anchor (laptop icon, badge
          "LOCAL (DEV)")
   2.3.2. `SERVER_MACHINE` — posisi + state anchor (server icon, badge
          "PRODUCTION")
   2.3.3. `APP_BOX` — anchor kedua, state warna (hijau/merah), posisi
          meluncur dev→server
   2.3.4. `STICKY_NOTES` — 3 entry: `dev-env` (`DB_HOST=localhost`),
          `server-env` (`DB_HOST=prod-db.internal`), `env-example`
          (`DB_HOST=`, tanpa value)
   2.3.5. `HARDCODE_CODE_LINE` / `ENVVAR_CODE_LINE` — 2 varian teks
          kode yang di-morph/highlight (bukan swap komponen baru)
   2.3.6. `GIT_REPO_BOX` — posisi kotak git/repository, state
          (menerima/menolak sticky note)
   2.3.7. `SCANNER_ICON` — ikon mata/radar bot scanner (Act 3, tension
          beat)
   2.3.8. `GITIGNORE_LOCK_BADGE` — badge lock hijau, muncul sebagai
          solusi

2.4. `SFX_MAP` — mapping ke `shared/audio/sfxLoader.js` (SEMUA sudah
     ada di `public/audio/`, lihat plan § SFX Map — tidak perlu
     sourcing baru)
   2.4.1. `POP`, `CLICK`, `WHOOSH`, `ERROR`, `WARNING`, `CRITICAL`,
          `SUCCESS`, `TYPING`, `LOCK`, `MATERIALIZE`

## 3. Phase 3: Animation Implementation per Act

3.1. Act 1 — Hook: Kode Sama, Kenapa Beda Hasil? (~8s)
   3.1.1. Render `DEV_MACHINE` (laptop) sebagai objek ANCHOR persisten
          pertama (1 `id` tetap, popIn di sini — lihat § Persistent
          Anchor di `04-referensi-gsap.md`)
   3.1.2. Render `SERVER_MACHINE` (server) sebagai objek ANCHOR
          persisten kedua (popIn di sini, TERPISAH dari `DEV_MACHINE`)
   3.1.3. Render `APP_BOX` di dalam Laptop, hijau (`SUCCESS`), efek
          typing 1 baris kode (`connect("localhost")`) + SFX `TYPING`
   3.1.4. Animasi `APP_BOX` meluncur (moving element pattern, lihat
          `04-referensi-gsap.md` § "Advanced Pattern: Moving Element")
          dari Laptop ke Server, SFX `WHOOSH`
   3.1.5. `APP_BOX` berubah merah (`DANGER`) begitu sampai di Server,
          muncul X/crash icon, SFX `ERROR`
   3.1.6. Karakter reaksi bingung (muka bulat simpel) + speech bubble
          hook: "Kodenya sama persis... kok bisa beda?"
   3.1.7. Cliffhanger closing text ke Act 2

3.2. Act 2 — Hardcode vs Environment Variable (~10.5s)
   3.2.1. Reset state: `APP_BOX` balik hijau di kedua device (golden
          rule reset tiap Act, lihat `03-tutorial-buat-topic-baru.md`
          § 3.2)
   3.2.2. Zoom highlight ke baris kode hardcode
          (`DB_HOST = "localhost"`) dengan badge rose "HARDCODE"
   3.2.3. Morph baris kode (bukan swap komponen) ke
          `DB_HOST = process.env.DB_HOST`
   3.2.4. Sticky note kuning muncul nempel di `DEV_MACHINE` (anchor
          dari Act 1, device-nya sendiri TIDAK di-popIn ulang — sticky
          note-nya sendiri yang baru, boleh popIn) isi
          `DB_HOST=localhost`, SFX `MATERIALIZE`

   3.2.5. Sticky note kuning kedua muncul nempel di `SERVER_MACHINE`,
          isi `DB_HOST=prod-db.internal`, SFX `MATERIALIZE`
   3.2.6. Cek overlap horizontal 2 sticky note (formula
          `05-svg-text-guide.md`) sebelum finalisasi posisi
   3.2.7. Garis putus-putus dari tiap sticky note ke `APP_BOX`
          masing-masing (visualisasi baca config)
   3.2.8. `APP_BOX` di kedua device jadi/tetap hijau, SFX `SUCCESS`
   3.2.9. Badge insight: "Kode baca catatan, catatan beda-beda tiap
          tempat"

3.3. Act 3 — Jangan Titip Rahasia ke Git (~10.5s)
   3.3.1. Zoom sticky note `.env` (dari Act 2), tambah 2 baris baru
          (`DB_PASSWORD`, `API_KEY`) dengan highlight rose + badge
          "RAHASIA"
   3.3.2. Animasi sticky note "ketarik" ke `GIT_REPO_BOX`, SFX `WHOOSH`
   3.3.3. Tension beat: `SCANNER_ICON` (mata/radar) berkedip, SFX
          `WARNING` lalu `CRITICAL`, badge "Bot scanner bisa nemuin
          dalam hitungan menit"
   3.3.4. Reveal garis dari `GIT_REPO_BOX` ke ikon "penyerang"
          sederhana — visual kebocoran
   3.3.5. Solusi: `GITIGNORE_LOCK_BADGE` overlay menutup jalur sticky
          note → git, SFX `LOCK`, sticky note `.env` berhenti/gagal
          masuk
   3.3.6. Sticky note baru `.env.example` (tanpa value asli) muncul &
          berhasil masuk `GIT_REPO_BOX` dengan aman
   3.3.7. Closing payoff — jawab hook Act 1 eksplisit: "Kode yang sama,
          baca catatan berbeda tiap tempat. Catatan itu isinya rahasia
          — jangan sampai bocor."

## 4. Phase 4: Audio & SFX Integration

4.1. Load `SFX_MAP` lewat `shared/audio/sfxLoader.js`
   4.1.1. Cross-check tiap entry `SFX_MAP` benar-benar dipanggil di
          `Animation.jsx` (lihat `08-audio-sfx-generation.md` §3 & §8)
          — tidak boleh ada dead config
   4.1.2. Audit SFX Coverage penuh (metodologi
          `08-audio-sfx-generation.md` §7) sebelum topic dianggap
          selesai
   4.1.3. Cek kebutuhan `boost`/`GainNode` — kemungkinan tidak perlu
          untuk topic sesimpel ini, tapi tetap dicek manual saat
          preview (bukan diasumsikan N/A dari awal)
4.2. Sinkronkan `SFX_SCHEDULES` di `scripts/export-lib.js` dengan
     timing browser — DITUNDA sampai fase export video benar-benar
     dikerjakan (tidak dibutuhkan untuk web preview)

## 5. Phase 5: Timeline & Export Safety

5.1. Setup GSAP timeline raw
     `gsap.timeline({ repeat: -1, repeatDelay: 1.5 })` di `useEffect`
     (pola konsisten dengan `tailscale`/`container-docker`, bukan
     lewat hook `useTimeline.js` terpisah)
5.2. Implementasi `window.__animationTimeline = tl` (kontrak wajib
     export)
5.3. Implementasi `window.__flushSync = flushSync` (export safety —
     WAJIB, lihat `04-referensi-gsap.md` § "Export Safety")
5.4. Cleanup `return () => tl.kill()` saat unmount
5.5. Determinism check — pastikan TIDAK ada `Math.random()` yang
     mempengaruhi durasi/timing timeline (topic ini kemungkinan besar
     tidak butuh randomness sama sekali karena scope-nya kecil, tapi
     tetap wajib dicek eksplisit, bukan diasumsikan)

## 6. Phase 6: Registry Integration

6.1. Buat `src/content/env-variables/manifest.js` final (bukan cuma
     draft)
6.2. Import manifest ke `src/content/registry.js`
6.3. Tambah entry BARU (bukan uncomment — topic ini belum punya
     placeholder sebelumnya, beda dari `container-docker`/
     `git-version-control`) di section "Tier 2 (Beginner →
     Intermediate)", pakai pola spread manifest
6.4. Set `status: 'ready'` setelah Phase 7 (QA) selesai — jangan
     `ready` duluan sebelum QA lewat

## 7. Phase 7: QA & Checklist Verification

7.1. Review 4-beat story spine tiap Act sesuai table di
     `ENV_VARIABLES_PLAN.md` (Setup → Tegangan → Titik Balik → Payoff)
7.2. Cek minimal 1 elemen visual non-rect per Act (speech bubble/
     karakter/sticky note bertakuk/badge)
7.3. Cek Persistent Anchor Object — `DEV_MACHINE` & `SERVER_MACHINE`
     harus 1 objek yang sama dari Act 1 sampai Act 2 (bukan
     re-render/popIn ulang)
7.4. Cek "Satu Kanal per Kalimat" — tidak ada kalimat identik dobel di
     caption (`say()`) vs card/badge/sticky note (`popIn()`) di waktu
     berdekatan
7.5. Cek wording ringkas (maks ±7-8 kata/kalimat), tanpa emoji, tanpa
     kata ganti orang di teks produksi

7.6. Cek 5 poin "Konsep Teknis WAJIB Akurat" di `ENV_VARIABLES_PLAN.md`
     tidak dilanggar:
   7.6.1. Env var digambarkan sebagai hal yang dibaca DI LUAR kode,
          bukan bagian dari kode
   7.6.2. `.env` digambarkan sebagai convention (dotenv-style), bukan
          fitur bahasa universal
   7.6.3. Ada minimal 1 baris/caption yang menyebut env var production
          tidak selalu lewat file `.env` fisik (systemd/Docker/K8s/
          cloud dashboard)
   7.6.4. Alasan git history permanen disebut eksplisit (bukan cuma
          "jangan commit" tanpa alasan)
   7.6.5. `.env.example` digambarkan sebagai praktik yang BOLEH/BAIK,
          bukan ikut dilarang
7.7. Cek overlap horizontal 2 sticky note Act 2 pakai formula
     (`05-svg-text-guide.md`), bukan cuma eyeball
7.8. Smoke test export via Puppeteer (render frame + video, cek tidak
     ada error `window.__flushSync`) — SETELAH Phase 4.2
     (`SFX_SCHEDULES`) dikerjakan

## 8. Phase 8: Final Review & Merge

8.1. Review gap plan vs implementasi aktual (kalau ada penyesuaian
     dari draft awal, catat di sini)
8.2. Update `ENV_VARIABLES_PLAN.md` — tambah status "SUDAH DIEKSEKUSI
     (tanggal)" di bagian atas
8.3. Commit & cleanup file sementara (kalau ada)

---

## Catatan Urutan Eksekusi

- Phase 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 berurutan (Phase 3 butuh Phase 2
  selesai dulu karena `Animation.jsx` memanggil data dari `data.js`)
- Phase 1.1 (keputusan Tier/warna) BLOCKER ringan — kemungkinan besar
  langsung disetujui karena tidak ada konflik warna/kategori, tapi
  tetap butuh approve user dulu sebelum Phase 1.2
- Phase 4 & 5 bisa paralel dengan ekor Phase 3 (SFX/timeline setup
  tidak harus nunggu semua Act selesai coding)
- **Belum ada satu pun langkah di atas yang dieksekusi** — file ini
  murni planning sesuai permintaan user ("plan md aja dulu tanpa
  eksekusi")
