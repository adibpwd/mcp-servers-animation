# Revisi-05 — Content 27: Gabungkan Dasar `grep` untuk Mencari Isi Teks

| Item | Nilai |
|---|---|
| Content aktif | 27 — File Operations |
| Sumber yang digabung | 30 — grep Text Search (plan-only) |
| Status | 📝 PLAN / ANALISIS ONLY — jangan mengubah kode, metadata, registry, atau menghapus Content 30 pada revisi ini. |
| Keputusan | Dasar `grep` masuk sebagai Act 5 di Content 27; Content 30 dihapus hanya setelah versi gabungan lulus preview dan export. |
| Alasan | Batas durasi bukan masalah: Content 27 saat ini ±40 detik dan dapat menjadi ±55–60 detik tanpa kehilangan satu alur mental model. |

## Keputusan editorial

Content 27 sekarang sudah membangun satu proyek `website-demo`: membuat
struktur, memindahkan/membaca file, lalu menemukan **nama/lokasi file**.
`grep` adalah kelanjutan langsung, karena audiens setelah menemukan
`config.ini` atau `app.log` masih perlu menemukan **teks di dalamnya**.

Alur final yang dikunci:

```text
buat / salin / pindah / hapus
          ↓
baca isi file (cat, less, head, tail -f)
          ↓
cari nama atau lokasi file (find, locate)
          ↓
cari teks di dalam file (grep, grep -i, grep -r)
```

Ini bukan penggabungan daftar command secara acak. Act 5 menjawab pertanyaan
baru yang lahir dari Act 3–4: **“File sudah ketemu, tapi baris pentingnya di
mana?”** Dengan demikian `grep` tetap punya setup, action, payoff, dan motion
sendiri, bukan menjadi outro yang terburu-buru.

## Scope yang dipindahkan dari Content 30

| Materi Content 30 | Keputusan di Content 27 | Alasan |
|---|---|---|
| `grep port config.ini` | Dipindahkan | Membuat pembeda paling dasar: `find` mencari file, `grep` mencari isi. |
| Highlight keyword dan baris konteks | Dipindahkan | Bukti visual utama bahwa yang dicari adalah teks, bukan nama file. |
| `grep -i error app.log` | Dipindahkan | Menjelaskan mode case-insensitive dengan perubahan hasil yang nyata. |
| `grep -r TODO .` | Dipindahkan | Menutup workflow proyek: scan isi pada banyak folder/file lalu tampilkan path. |
| Regex, `grep -v`, `grep -n`, pipe ke grep, ripgrep | Tetap di luar scope | Materi lanjutan; jangan memanjangkan Act 5 tanpa payoff baru. |

## Durasi dan struktur Act

`PHASES` aktif berjumlah 37,5 detik (belum termasuk intro/hold). Tambahkan
Act 5 selama **15,0 detik**. Target total final adalah ±55–60 detik termasuk
intro, transition, dan closing; boleh sampai 60 detik karena pengguna telah
menetapkan tidak ada batas Reels yang perlu dipatuhi.

| Act | Durasi target | Unit pemahaman | Exit state |
|---|---:|---|---|
| 1 — Buat dan salin | 8,5s | File/folder bisa lahir dan tersalin | Struktur dasar terlihat. |
| 2 — Pindah dan hapus aman | 8,0s | Lokasi berubah; hapus butuh konfirmasi | Item dummy hilang aman. |
| 3 — Baca isi yang tepat | 11,5s | `cat`/`less`/`head`/`tail -f` punya cara baca berbeda | Preview isi file dikenal. |
| 4 — Temukan file | 9,5s | `find` scan lokasi; `locate` memakai indeks | `config.ini` dan `app.log` tetap tersedia untuk dicari isinya. |
| **5 — Cari isi teks** | **15,0s** | `grep` menemukan baris; `-i` mengabaikan kapitalisasi; `-r` menyusuri isi banyak file | Perbedaan nama file vs isi file terkunci. |

Tidak boleh menambah Act 6 khusus takeaway. Takeaway tetap muncul setelah Act
5 ketika terminal kembali ke tinggi minimum.

## Kontrak Before → Action → After untuk Act 5

Act 5 wajib memakai Causal Motion Contract
(`docs/standardizations/03-planning-storytelling-quality-gate.md` §1.T).
Setiap command menyelesaikan lifecycle sendiri; hasil command berikutnya tidak
muncul sebelum lifecycle sebelumnya mencapai `After`.

| Action id | Before yang benar-benar terlihat | Intent/source | Travel/process | Target & apply | After yang terbaca | Hold | Frame audit |
|---|---|---|---|---|---|---:|---|
| `grep-port` | `config.ini` sudah ada; preview menampilkan beberapa baris redup, tanpa highlight | `$ grep port config.ini` selesai diketik lalu Enter di terminal bawah | Token `port` keluar dari prompt dan bergerak ke panel preview | Token menyentuh baris `port=3000`; hanya baris itu menjadi terang dan keyword diberi highlight | Terminal menulis `port=3000`; badge `isi file` muncul | 1,0s | before / token travel / line match |
| `grep-ignore-case` | `app.log` menampilkan `error`, `Error`, dan `ERROR`; pencarian biasa diperlihatkan sebagai satu match redup | `$ grep -i error app.log` + Enter | Token `error` mendapat modifier `-i`, lalu menyapu tiga variasi kapitalisasi dari atas ke bawah | Setiap variasi menyala saat tersapu | Tiga baris tetap terang; output count `3 matches` | 1,1s | before / sweep / three matches |
| `grep-recursive` | Grid proyek berisi `src/`, `assets/`, dan beberapa file; hasil path belum ada | `$ grep -r TODO .` + Enter | Scan dot berangkat dari terminal, mengunjungi node grid/tree satu per satu, dan hanya berhenti pada file yang memuat TODO | Saat scan menyentuh match, path masuk satu per satu ke result rail | Rail berisi minimal dua path dan baris cocok; label `scan isi folder` stabil | 1,2s | before / scan midway / grouped paths |

Aturan keras:

- Keyword highlight tidak boleh muncul sebelum token/pulse mencapai target.
- Untuk `grep-port`, tampilkan **baris**, bukan sekadar nama file `config.ini`.
- Untuk `grep -i`, sample data harus memiliki tiga kapitalisasi yang berbeda;
  satu baris `ERROR` saja tidak cukup membuktikan perubahan perilaku.
- Untuk `grep -r`, scan harus mengunjungi kandidat setidaknya `src`,
  `README.md`, dan `app.log`/`config.ini`; jangan langsung teleport ke hasil.
- Hasil recursive memakai path relatif (`./src/index.html: TODO...`), sehingga
  audiens memahami file mana yang mengandung teks itu.

## Storyboard detail Act 5 (15,0 detik)

| Waktu relatif | Beat | Terminal | GUI / motion | Narasi ringkas |
|---:|---|---|---|---|
| 0,00–0,70 | Bridge | History akhir Act 4 masih menampilkan `locate banner.png` | Caption Act 4 memudar; panel preview `config.ini` masuk dari grid tanpa ganti dunia | `Nama file sudah ketemu` |
| 0,70–3,70 | Search satu baris | Type lalu Enter `grep port config.ini` | Token `port` bergerak dari terminal → baris `port=3000`; match highlight + result rail satu baris | `grep mencari isi file` |
| 3,70–4,50 | Explain | Output `port=3000` stabil | Garis konteks lain tetap terlihat redup agar yang cocok terasa selektif | `Baris cocok ditemukan` |
| 4,50–8,70 | Ignore case | Type lalu Enter `grep -i error app.log` | Panel berubah ke `app.log`; modifier `-i` menempel pada keyword; sweep menyalakan `error`, `Error`, `ERROR` | `-i abaikan kapitalisasi` |
| 8,70–9,80 | Explain | Output ringkas `3 matches` | Tiga match stabil bersamaan; bukan tiga modal berbeda | `Semua variasi terbaca` |
| 9,80–13,80 | Recursive scan | Type lalu Enter `grep -r TODO .` | Preview mengecil menjadi project grid/tree; scan dot berjalan terminal → folder → file; setiap hit menambah result rail | `-r scan isi folder` |
| 13,80–15,00 | Closing | Terminal output final menampilkan dua path ringkas | Result rail stabil, lalu takeaway mengganti caption | `Nama file dan isi file berbeda` |

## Kontrak visual dan layout

Tidak ada zona baru. Revisi memakai layout Content 27 yang sudah aman:

| Zona local `ContentBodyV1` | Penggunaan Act 5 | Guardrail |
|---|---|---|
| Caption 18–68 | Bridge dan satu kalimat per beat | Maks. 8 kata; fade saat token melintas. |
| Grid 92–468 | Mode preview `grep`; lalu project grid/tree untuk `-r` | Modal preview menggantikan isi grid, tidak menambah panel di atasnya. |
| Motion 495–615 | Keyword token, modifier `-i`, scan dot | Satu token/scan aktif pada satu waktu. |
| Terminal (`bottom=858`) | Prompt dan output command `grep` | Tinggi adaptif 2–6 baris, tumbuh ke atas, tetap clipped. |
| Closing 884–946 | Takeaway akhir | Hanya muncul setelah terminal kembali minimum. |

### Komponen yang perlu direncanakan saat implementasi

| Komponen | Reuse / perubahan | Perilaku yang harus dibuktikan |
|---|---|---|
| `FilePreviewPanel` | Reuse dari Act 3, tambah mode `grep` | Baris konteks dahulu tampak; rect highlight berada tepat di belakang substring match. |
| `KeywordToken` | Baru | Capsule `port`, `error`, atau `TODO` bergerak dari source terminal ke target; hilang setelah Apply. |
| `GrepModifier` | Baru, kecil | `-i` menyatu dengan token saat travel agar perubahan aturan terlihat, bukan badge statis. |
| `MatchHighlight` | Baru/reusable | Highlight masuk bertahap; tidak menutup teks atau mengurangi kontras. |
| `ResultRail` | Baru | Satu hasil untuk grep file tunggal; dua/lebih hasil relative path untuk `-r`. |
| `RecursiveScan` | Evolusi scan `find` | Jalurnya node → node dengan progress yang dapat dilihat; berbeda dari `locate` yang instan. |

## Data dan copy yang wajib ditambah saat implementasi

### Data sample

Tambahkan data grep terpisah dari preview umum agar command dan hasil selalu
konsisten saat loop/export:

```js
GREP_SCENARIOS = {
  port: {
    command: '$ grep port config.ini',
    sourceId: 'config',
    keyword: 'port',
    matchedLines: ['port=3000'],
  },
  ignoreCase: {
    command: '$ grep -i error app.log',
    sourceId: 'applog',
    keyword: 'error',
    modifier: '-i',
    // Preview data wajib memuat `error`, `Error`, dan `ERROR`.
  },
  recursive: {
    command: '$ grep -r TODO .',
    keyword: 'TODO',
    scanIds: ['src', 'readme', 'config', 'applog'],
    results: [
      './src/index.html:<!-- TODO: add navigation -->',
      './README.md:TODO: write deployment guide',
    ],
  },
}
```

### Copy in-video

| Beat | Copy | Larangan |
|---|---|---|
| Pembeda | `grep mencari isi file` | Jangan tulis “cari file” untuk grep. |
| Case-insensitive | `-i abaikan kapitalisasi` | Jangan klaim semua typo akan cocok. |
| Recursive | `-r scan isi folder` | Jangan menyamakan `-r` dengan `find`. |
| Closing | `find nama, grep isi` | Jangan tampilkan daftar command panjang sebagai penutup. |

### Palette dan audio

- Gunakan `COLORS.FIND`/pink yang sudah ada untuk token dan result grep agar
  “mode pencarian” konsisten. `READ`/cyan tetap untuk panel preview, sehingga
  audiens dapat membedakan aksi pencarian dari aktivitas membaca.
- `grep-port`: satu cue `ui/paper-arrive` pada match pertama.
- `grep -i`: cue ringan `ui/chime` saat modifier aktif; jangan satu SFX per
  baris match.
- `grep -r`: satu `transitions/light-swoosh-quick` untuk scan dan satu
  `success/ding` saat result rail lengkap.
- Semua entry baru wajib masuk `SFX_MAP` dan schedule export pada timestamp
  identik dengan beat Apply.

## Perubahan yang direncanakan, bukan dieksekusi sekarang

| Urutan setelah plan disetujui | File | Perubahan |
|---:|---|---|
| 1 | `src/content/27-file-operations/data.js` | Tambah Act 5, scenario grep, sample line kapitalisasi, captions, GUI verb, palette/SFX, dan command steps. |
| 2 | `src/content/27-file-operations/Animation.jsx` | Tambah lifecycle causal grep, keyword token, substring highlight, result rail, dan recursive scan. |
| 3 | `src/content/27-file-operations/metadata.json` + `manifest.js` | Perluas subtitle/tags agar menyebut pencarian isi teks. |
| 4 | `src/content/27-file-operations/caption.md` | Perbarui caption sosial agar mencakup pembeda `find` vs `grep`. |
| 5 | `scripts/export-lib.js` | Tambah cue grep hanya setelah timeline final disepakati. |
| 6 | Preview + export Content 27 | Audit semua state/loop dan export versi gabungan. |
| 7 | `src/content/30-grep-text-search/` | **Setelah langkah 6 lulus:** hapus folder plan/metadata Content 30 dan hapus/update entry roadmap yang menunjuknya. |

Tidak boleh menghapus Content 30 sebelum langkah 6 selesai. Selama fase
implementasi, Content 30 menjadi sumber referensi dan fallback plan, bukan
content yang dirender bersamaan.

## Checklist penerimaan sebelum Content 30 dihapus

- [ ] Act 5 menambah ±15 detik dan total video berada pada target ±55–60
      detik tanpa hold kosong.
- [ ] `grep port config.ini` membuat baris `port=3000` terlihat sebagai isi
      file; keyword tidak muncul terlalu dini.
- [ ] `grep -i error app.log` memvisualkan sedikitnya tiga kapitalisasi dan
      ketiganya menjadi match setelah modifier diterapkan.
- [ ] `grep -r TODO .` memperlihatkan scan lintas node dan mengumpulkan
      minimal dua hasil berpath relatif.
- [ ] `find`/`locate` tetap berarti mencari nama/lokasi file, sedangkan
      `grep` berarti mencari isi; perbedaan ditulis pada takeaway.
- [ ] Preview grep, result rail, motion corridor, terminal paling tinggi, dan
      closing tidak overlap di frame before, transit, atau after.
- [ ] Semua action baru reset bersih pada loop kedua: history, token,
      highlight, result rail, scan progress, dan panel preview.
- [ ] SFX baru dipetakan, tidak dobel, dan sinkron dengan Apply.
- [ ] Preview manual dan export final Content 27 disetujui.
- [ ] Baru setelah semua item di atas lulus, Content 30 dan entri roadmapnya
      dihapus secara eksplisit dalam perubahan terpisah yang recoverable.

## Status pelaksanaan (2026-09-16)

Langkah 1–4 dari tabel "Perubahan yang direncanakan, bukan dieksekusi sekarang"
sudah dieksekusi lewat Desktop Commander.

| File | Status |
|---|---|
| `data.js` | ✅ direvisi (entry aktif) — Act 5 ditambah ke `PHASES`, `GREP_SCENARIOS` baru, `TERMINAL_STEPS`/`CAPTION_BY_CMD`/`GUI_VERB`/`CHANGE_BADGE`/`SFX_MAP` diperluas. Backup: `data.revisi-04.js`. |
| `Animation.jsx` | ✅ direvisi (entry aktif) — `GrepPreviewPanel` & `GrepResultRail` baru; `CommandPulse` (`kind: 'scan'`) digeneralisasi agar dipakai ulang oleh `grep -r`; scheduling Act 5 (`grep-port`, `grep-icase`, `grep-recursive`) ditambah di `scheduleAct`. Lolos syntax check esbuild (bundle + external deps) — **belum diverifikasi visual di browser/preview**. Backup: `Animation.revisi-04.jsx`. |
| `metadata.json` + `manifest.js` | ✅ subtitle & tags diperluas menyebut "cari isi teks" / `grep`. |
| `caption.md` | Tidak ada file caption sosial untuk Content 27 di project ini — langkah dilewati (tidak applicable). |
| `scripts/export-lib.js` | Tidak disentuh — tidak ada tabel cue per-topic di file ini; SFX baru (`SFX_MAP.CHIME` → `ui/chime.wav`, sudah dicek ada di `public/audio/ui/`) berjalan lewat `sfxLoader` yang sama seperti SFX lain, tidak butuh perubahan terpisah. |
| Preview + export Content 27 | ⏳ **Belum dilakukan** — perlu dibuka manual di browser/player untuk verifikasi visual (highlight match, result rail, scan `-r`, reset saat loop kedua) sebelum checklist penerimaan di atas bisa dicentang. |
| `src/content/30-grep-text-search/` | Tidak disentuh, sesuai aturan — baru dihapus setelah checklist penerimaan lulus. |

**Belum dieksekusi:** semua item checklist penerimaan di atas (perlu preview
manual), dan langkah 7 (hapus Content 30) yang memang menunggu checklist itu.
