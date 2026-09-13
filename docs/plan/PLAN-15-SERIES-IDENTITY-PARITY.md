# PLAN-15 — Series Identity Parity: Brand Domain & Protagonis Antar-Topic

Tanggal: 2026-09-12
Status: 🔧 RENCANA DISETUJUI — dokumen standardisasi (09, 05, 03) BELUM
diubah. Contoh nyata yang memicu: revisi-01 & revisi-02 di content 18-auth
(`revisi/2026-09-12-revisi-01.md`, `revisi/2026-09-12-revisi-02.md`).
Eksekusi menunggu langkah lanjutan (lihat §6 Checklist Eksekusi).

## 1. Keputusan

Standardisasi saat ini mengunci kategori, palet, dan header format per topic
(09 §1.Q), tapi TIDAK mengunci dua aspek "identitas seri" yang justru paling
mudah lewat saat topic baru dibuat:

1. **Brand domain di tagline intro/header** — 17-rest-api menampilkan
   `NETWORKING · ADIB-DEV.COM`, 18-auth pertama hanya `DEVELOPER TOOLS`
   (tanpa domain). Pola `categorySegments` sudah didokumentasikan di
   `04-referensi-gsap.md` sebagai contoh, tapi bukan mandat.
2. **Kontinuitas protagonis lintas topic seri** — protagonis 18-auth diketik
   sebagai `Nina`, padahal seri memakai `Adib` (17-rest-api). Tidak ada
   aturan bahwa karakter/device yang sudah muncul di topic seri lain wajib
   nama & identitas SAMA.
3. **Warna brand domain tidak dikunci** — 17-rest-api mewarnai domain
   `#38BDF8` (NETWORKING_SKY), 18-auth memakai `#22D3EE` (SYSTEM). Tanpa
   standar, tiap topic bisa memakai warna berbeda → brand inkonsisten.
4. **Checklist QA tidak menangkap "paritas seri"** — audit statis + compile
   PASS tidak menemukan dua gap di atas karena hanya terlihat saat
   dibandingkan item-per-item dengan reference topic.

Keputusan Plan 15: kunci ketiganya di standardisasi supaya topic berikutnya
tidak mengulang.

## 2. Warna Brand Domain (Locked)

- **Nilai:** cyan `#22D3EE` (netral, kontras 14:1 di atas BG `#070913`).
- **Pemakaian:** keseluruhan string brand `ADIB-DEV.COM` pada tagline
  category intro/header.
- **Konsistensi lintas topic:** dipakai uniform; warna semantik lain tidak
  menggantikannya. 17-rest-api saat ini masih `#38BDF8` (NETWORKING_SKY) —
  disetel ke `#22D3EE` pada eksekusi belakangan (di luar perubahan docs ini;
  dicatat di §7 sebagai follow-up content).
- **Standar shared (opsional, bukan bagian eksekusi docs):** konstanta
  bersama `ADIB_DOMAIN = 'ADIB-DEV.COM'` + `ADIB_DOMAIN_COLOR = '#22D3EE'`
  di modul scene-ui/seri untuk menghilangkan drift runtime.

## 3. Perubahan Dokumen

### 3.1 `docs/standardizations/03-planning-storytelling-quality-gate.md` — §1.Q Series Identity Contract

Tambahkan ke poin "Preflight wajib" (di bawah bullet yang ada):

- tagline category intro/header = `{KATEGORI} · ADIB-DEV.COM`, dirender
  dengan `categorySegments` (`{ label: '{KATEGORI} · ', color: MUTED }` +
  `{ label: 'ADIB-DEV.COM', color: '#22D3EE' }`);
- protagonis & karakter yang sudah muncul di topic seri lain WAJIB memakai
  nama/identitas/peran SAMA (contoh: Adib di 17-rest-api & 18-auth) plus
  referensi topic sumber dicatat di plan;
- warna brand domain uniform cyan `#22D3EE` lintas topic seri portrait.

Tambahkan ke **✅ DO:** "Kunci tagline (kategori + domain), nama protagonis,
dan warna domain terhadap reference topic sebelum menyentuh code."

Tambahkan ke **❌ DON'T:** "Jangan ganti nama/identitas karakter yang sudah
ada di seri hanya karena topik berbeda."

### 3.2 `09` — Checklist Pre-Planning & QA Review

- §2 poin **0.2** diperluas: "Beri nilai seri parity: tagline (termasuk
  brand domain + warna), nama protagonis, dan peran karakter vs reference
  topic — lihat §1.Q."
- Audit review §6 tambah item **6.9 — Series Parity**: bandingkan item-per-
  item tagline intro, nama protagonis, dan warna brand domain terhadap
  reference topic; catat deviasi + alasan tertulis.

### 3.3 `docs/standardizations/05-svg-layout-asset-pipeline.md` — § "Warna title intro"

Perluas blok di akhir (saat ini line 187-191) dengan aturan tagline branding:

- tagline category intro/header = kategori (MUTED) + ` · ` + brand domain
  `ADIB-DEV.COM` (cyan `#22D3EE`) via `categorySegments`;
- warna domain shared/fixed lintas topic (cyan `#22D3EE`), TIDAK mengikuti
  warna semantik tema topic;
- rujuk ke `09-standar-pembuatan-konten.md` §1.Q.

### 3.4 `docs/standardizations/03-planning-storytelling-quality-gate.md` — Langkah 2 "Bikin Intro"

Tambahkan contoh konkret tagline beserta dua segmen warna:

```jsx
categorySegments={[
  { label: 'DEVELOPER TOOLS · ', color: '#94A3B8' },
  { label: 'ADIB-DEV.COM', color: '#22D3EE' },
]}
```

dengan catatan: domain TIDAK boleh dihilangkan dan warnanya TIDAK boleh ikut
tema topic.

## 4. Mengapa Bukan Hanya Catatan di Commit

02-standar-konten.md §3 membolehkan perubahan kecil cukup dicatat di commit
message. Tiga gap di atas bukan sekali-pakai: semua topic seri baru berisiko
mengulangnya karena hanya divisualkan saat membandingkan dengan reference
topic. Perubahan di docs membuatnya menjadi pre-flight checklist yang wajib
diisi sebelum coding, bukan audit yang "mungkin" ditemukan belakangan.

## 5. Non-Goals (Plan 15 ini)

- TIDAK mengubah file content topic (18-auth sudah sesuai; 17-rest-api hanya
  di-follow-up warna domain di pengeluaran terpisah — §7).
- TIDAK menambah shared constant kode (tercantum sebagai opsional saja).
- TIDAK memaksa migrasi topic lama (linu, mcp-servers, dst) ke format baru —
  sesuai 02-standar-konten.md §3 (topic lama tidak wajib dimigrasi).

## 6. Checklist Eksekusi

- [ ] 09 §1.Q: preflight tagline/domain + protagonis + warna domain
- [ ] 09 §2 poin 0.2 diperluas (seri parity)
- [ ] 09 §6: item audit baru 6.9 — Series Parity
- [ ] 05: aturan tagline branding + warna cyan #22D3EE + rujuk §1.Q
- [ ] 03 Langkah 2: contoh tagline `DEVELOPER TOOLS · ADIB-DEV.COM`
- [ ] (follow-up content, terpisah) 17-rest-api domain → #22D3EE + revisi

## 7. Follow-Up Content (Di Luar Scope Docs)

- `17-rest-api` Revisi berikutnya: NETWORKING_SKY domain lebih disetel ke
  cyan `#22D3EE` supaya warna brand domain uniform di seluruh seri saat
  topic yang memakai domain pertama-tama disingkronkan.
- Opsional: konstanta bersama brand domain & warna di modul shared.

---

**Status akhir:** 🔧 Plan dibuat dan disetujui; eksekusi perubahan docs
(bagian §3.1–§3.4) BELUM dilakukan — menunggu langkah berikutnya.