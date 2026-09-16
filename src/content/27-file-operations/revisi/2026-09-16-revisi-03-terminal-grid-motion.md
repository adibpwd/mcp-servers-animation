# Revisi-03 — 27 File Operations: Terminal Adaptif dan File Grid yang Terbaca

| Item | Nilai |
|---|---|
| Content | 27 — File Operations |
| Status | 📝 READY FOR IMPLEMENTATION — file baru, tidak menimpa Revisi-02 |
| Pemicu | Terminal expanded keluar dari zona; GUI masih berupa chip teks; perubahan state belum menjelaskan urutan sebab-akibat; dan warna intro tidak sesuai standar seri. |
| Tujuan | Menjadikan terminal sebagai sumber aksi yang jelas, lalu memperlihatkan dampaknya secara berurutan di file grid yang rapi. |

## Keputusan yang dikunci

1. **Terminal memakai tinggi berbasis jumlah baris, bukan dua tinggi tetap.**
   Tinggi dihitung dari `header + padding + (visibleRows × rowHeight) + padding`.
   Batasnya 2–6 baris; saat output panjang muncul, panel tumbuh **ke atas**
   dari baseline bawah yang tetap. Jadi panel tidak pernah mendorong diri ke
   bawah, keluar canvas, atau menabrak takeaway.
2. **File manager menjadi grid visual.** Setiap item memakai ikon SVG folder
   atau dokumen yang nyata (tab folder, folded-corner document, thumbnail
   image, log glyph), bukan hanya rounded rectangle berisi teks. Gayanya
   mengikuti keakraban Visual Studio Code, tetapi digambar inline agar state
   dan animasinya dapat dikendalikan tanpa aset eksternal.
3. **Satu command memiliki tiga tahap yang dapat dilihat:** diketik di baris
   paling bawah terminal → Enter dan command naik ke history → pulse/beam
   bergerak ke tile target → tile berubah dan memberi label hasil. GUI tidak
   boleh berubah sebelum pulse tiba.
4. **Tidak ada elemen yang bebas overflow.** Seluruh isi body memakai clip,
   setiap panel memiliki rentang zona tetap, dan teks path panjang dipendekkan
   secara visual (`~/Projects/website-demo`) agar tidak bertabrakan dengan
   chrome terminal.
5. **Intro memakai standar warna seri:** `FILE` sky blue `#38BDF8`,
   `OPERATIONS` emerald `#34D399`. Kuning `#FBBF24` hanya dipakai untuk
   warning/attention, bukan create atau title.

## Kontrak layout baru

Koordinat ini local terhadap `ContentBodyV1` (`732 × 965`). Batas terminal
selalu dihitung dari bawah sehingga perubahan jumlah baris aman.

| Zona | Local y | Isi | Guardrail |
|---|---:|---|---|
| Caption | 18–68 | Satu kalimat maks. 8 kata | Fade sebelum animasi transit melintas. |
| File grid | 92–468 | Breadcrumb, toolbar, 3 × 2 tile, detail/result ringkas | Semua tile di dalam panel dan memakai text truncation. |
| Motion corridor | 495–615 | Command pulse, beam, atau progress scan | Hanya satu motion aktif. |
| Terminal | `bottom=858`, `top=858-terminalHeight` | Header + 2–6 baris | Panel tumbuh ke atas; isi memakai clip-path. |
| Closing | 884–946 | Takeaway | Muncul hanya setelah terminal kembali ke tinggi minimum. |

```text
caption
┌──────────────────── file grid / file manager ────────────────────┐
│  ~/Projects/website-demo   ▦ Grid     [src] [assets] [README]    │
│                                       [index] [banner] [log]     │
└──────────────────────────────────────────────────────────────────┘
                         ↑ command pulse / state label
┌──────────────────────── terminal (bottom tetap) ─────────────────┐
│ $ cp …                                                            │  ← row baru selalu lahir di bawah
│ copied: banner.png                                                │
└──────────────────────────────────────────────────────────────────┘
takeaway
```

### Rumus terminal

```js
const TERM_BOTTOM = 858
const TERM_HEADER_H = 42
const TERM_PAD_Y = 14
const TERM_ROW_H = 22
const TERM_MIN_ROWS = 2
const TERM_MAX_ROWS = 6

const rowCount = Math.min(TERM_MAX_ROWS, Math.max(TERM_MIN_ROWS, history.length + 1))
const terminalHeight = TERM_HEADER_H + TERM_PAD_Y * 2 + rowCount * TERM_ROW_H
const terminalTop = TERM_BOTTOM - terminalHeight
```

- `+ 1` adalah command yang masih sedang diketik pada prompt aktif.
- `visibleHistory` selalu diambil dari akhir history sesuai `rowCount - 1`.
- `<g clipPath>` membatasi teks ke viewport terminal; command panjang wajib
  dipotong dengan helper `truncateTerminalLine(text, 58)` sebelum render.
- `less`, `tail -f`, dan `find` boleh menggunakan sampai enam baris; tidak
  boleh memakai tinggi khusus atau mengubah `TERM_BOTTOM`.

## Komponen visual yang harus dibuat

| Komponen | Bentuk | State/animasi |
|---|---|---|
| `FolderTile` | Tab folder, body bergradasi lembut, label di bawah | `pending` redup → `creating` outline berdenyut → `ready` pop-in + check kecil. |
| `FileTile` | Kertas sudut terlipat; glyph berbeda untuk HTML, image, markdown, config, log | `pending` slot putus-putus → `creating` terangkat dari bawah → `ready` settle. |
| `ImageTile` | Dokumen dengan thumbnail pegunungan/pixel sederhana | Source untuk `cp` tetap terang; target baru memiliki sparkle kecil. |
| `GridToolbar` | Breadcrumb, mode `Grid`, dan count file | Count melakukan tally saat item lahir/hilang; jangan memakai teks panjang yang overflow. |
| `CommandPulse` | Capsule kecil berisi verb command + garis/beam berarah | Muncul setelah Enter, berjalan dari terminal ke target, lalu menghilang saat state selesai. |
| `ChangeBadge` | `+ folder`, `+ copy`, `moved`, `waiting`, `removed` | Tampil dekat target 0.7–1.0 detik dan tidak menutup label file. |

Ikon harus inline SVG reusable, misalnya `FolderIcon`, `DocumentIcon`,
`ImageIcon`, `MarkdownIcon`, `ConfigIcon`, dan `LogIcon`. Jangan gunakan emoji,
huruf sebagai pengganti ikon, atau logo eksternal yang tidak relevan.

## Timeline sebab → akibat

Setiap operasi mutasi memakai urutan yang sama agar audiens langsung memahami
hubungan terminal dengan GUI. Durasi adalah target dan boleh sedikit disetel
sesudah preview, tetapi urutan state tidak boleh dilompati.

| Beat | Durasi | Terminal | Transit | GUI |
|---|---:|---|---|---|
| 1. Type | 0.45–0.70s | Karakter command muncul pada prompt di baris bawah | — | Target masih `pending`. |
| 2. Enter | 0.18s | Prompt blink; command commit lalu bergerak satu row ke atas | Capsule verb lahir dari terminal | Belum berubah. |
| 3. Travel | 0.45–0.65s | Output placeholder `running…` redup | Pulse naik dari bawah ke tile target | Tile target diberi focus ring. |
| 4. Apply | 0.30–0.45s | Output final ditulis | Pulse tiba dan burst kecil | Object masuk/pindah/hilang sesuai command. |
| 5. Explain | 0.65–0.90s | History stabil | — | `ChangeBadge` dan before/after menjelaskan hasil. |

Untuk command baca (`cat`, `less`, `head`, `tail -f`), pulse menuju panel
preview file dan tidak menciptakan/menghapus tile. Untuk `find`, pulse berubah
menjadi scan dot yang mengunjungi folder grid satu per satu; hasil hanya
dinyatakan selesai ketika tile `banner.png` mendapat focus ring. Untuk
`locate`, pulse menuju kartu indeks, dengan label singkat “indeks tersimpan”.

## State per operasi

| Command | Before | Apply | After yang terlihat |
|---|---|---|---|
| `mkdir -p src assets` | Dua slot folder putus-putus | Dua pulse tiba berurutan, tab folder terbuka | `src/` dan `assets/` pop-in; counter +2. |
| `touch src/index.html` | Slot file dalam `src` kosong | Pulse masuk ke folder lalu file keluar | `index.html` naik dari bawah. |
| `cp … banner.png` | Source image terang; target slot kosong | Beam bercabang source → target | Source tetap ada, `banner.png` muncul, badge `+ copy`. |
| `mv … README.md` | `brief.txt` di source; target belum ada | Satu tile bergerak mengikuti path | Source menjadi empty slot, tile settle sebagai `README.md`, badge `moved`. |
| `rm -i old-draft.txt` + `y` | Target diberi danger outline | Pulse berhenti di state `waiting` lalu lanjut setelah `y` | Tile shrink/fade, empty slot tersisa, counter −1. |
| baca/cari | Tile sudah ada | Pulse fokus ke preview/scan | Tidak mengubah counter maupun tile permanen. |

## Koreksi palette

| Peran | Warna | Alasan |
|---|---|---|
| Intro `FILE` / info terminal | `#38BDF8` | Standar Title A dan informasi. |
| Intro `OPERATIONS` / hasil sukses | `#34D399` | Standar Title B dan success. |
| Create dan command aktif | `#FB923C` | Aktivitas/proses, bukan warning. |
| Copy | `#A78BFA` | Objek kedua / technical transform. |
| Read | `#22D3EE` | System/read focus. |
| Find / index | `#F472B6` | Mode pencarian terpisah. |
| Delete / error | `#F43F5E` | Alert. |
| Warning / menunggu konfirmasi | `#FBBF24` | Satu-satunya penggunaan kuning. |

Standar ini merujuk ke `docs/standardizations/05-svg-layout-asset-pipeline.md`
bagian **Color Palette Project** dan
`docs/standardizations/03-planning-storytelling-quality-gate.md` bagian
**Aturan Keras Warna Header**.

## File implementasi baru yang diharapkan

Karena pengguna meminta revisi tidak menimpa hasil agent sebelumnya, buat
varian baru berikut lalu preview sebelum mengganti entry aktif:

| File baru | Peran |
|---|---|
| `src/content/27-file-operations/data.revisi-03.js` | Palette baru, data tile, state operation, dan token terminal adaptif. |
| `src/content/27-file-operations/Animation.revisi-03.jsx` | Implementasi grid/icon, timeline type→Enter→travel→apply, dan terminal clipped. |
| `src/content/27-file-operations/revisi/2026-09-16-revisi-03-terminal-grid-motion.md` | Dokumen ini; kontrak sebelum implementasi. |

`resolveTopic.js` hanya memuat `Animation.jsx`. Jangan mengubah resolver atau
menimpa `Animation.jsx` sampai preview revisi disetujui. Setelah disetujui,
lakukan pergantian entry secara eksplisit dan simpan versi lama sebagai backup
yang bernama jelas.

## Checklist penerimaan

- [ ] Tinggi terminal mengikuti jumlah baris dan bertumbuh ke atas dari
      baseline tetap; tidak ada bagian keluar canvas.
- [ ] Terminal selalu menampilkan prompt baru di bawah dan history bergeser
      ke atas saat command masuk.
- [ ] Semua tile folder/file memakai ikon SVG yang mudah dikenali; tidak ada
      chip teks polos sebagai representasi utama.
- [ ] `mkdir`, `touch`, `cp`, `mv`, dan `rm -i` memperlihatkan state pending,
      perjalanan command, dan hasil akhir yang berbeda.
- [ ] GUI tidak berubah sebelum command pulse tiba di target.
- [ ] Tile, badge, preview, beam, terminal, dan takeaway berada dalam zona
      masing-masing tanpa overlap pada state terminal paling tinggi.
- [ ] `FILE` memakai sky blue dan `OPERATIONS` memakai emerald; kuning hanya
      muncul untuk perhatian/konfirmasi.
- [ ] Loop kedua reset history, prompt, counter, focus ring, badge, scan,
      dan seluruh state file dengan benar.
- [ ] Preview manual dilakukan pada state 2, 4, dan 6 row terminal serta pada
      setiap transisi operasi sebelum menjadikan revisi sebagai entry aktif.
