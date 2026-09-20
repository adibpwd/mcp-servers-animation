
# Revisi 02 — Hybrid Icon Assets: Generate Konsep, Source Logo Distro

| Item | Keputusan |
|---|---|
| Content | 34 — Install Applications |
| Status | 📝 PLAN ONLY — tidak mengubah `icons.json`, tidak generate, dan tidak download aset. |
| Tujuan | Membuat repository, manager, dan lifecycle install lebih cepat dibaca lewat asset yang konsisten. |
| Strategi | Konsep generik dibuat dengan batch ChatGPT web; logo distro nyata disource dari official media/brand page atau Wikimedia Commons setelah audit. |

## 1. Audit aset saat ini

`src/content/34-install-applications/icons/icons.json` masih memakai `icons: []`
dan menjelaskan first pass berbasis inline SVG. Inline SVG tetap tepat untuk
actor yang berubah state, tetapi alur revisi membutuhkan asset statis untuk
membedakan distro, repository, mirror, metadata, download, verify, unpack, dan
database package.

| Jenis visual | Medium | Alasan |
|---|---|---|
| Logo distro nyata | Asset asli dari web, bukan image generation. | Bentuk brand dan provenance harus akurat. |
| Konsep umum | PNG hasil batch ChatGPT web/icon generator. | Bisa dikontrol gaya/palette dan bebas brand. |
| Actor berubah | Inline SVG/React. | Tetap butuh data text, path, morph, dan handoff. |
| Label/copy | HTML/SVG text. | Tajam dan accessible; tidak dibake menjadi bitmap. |

## 2. Asset matrix

### 2.1 Logo distro: source manual

| Runtime ID | Distro | Beat | Source prioritas | Fallback |
|---|---|---|---|---|
| `ubuntu-logo` | Ubuntu | apt / Debian family | Official Ubuntu media/brand page, lalu Wikimedia Commons. | Chip teks Ubuntu. |
| `debian-logo` | Debian | .deb / apt context | Official Debian artwork, lalu Wikimedia Commons. | Chip teks Debian. |
| `fedora-logo` | Fedora | dnf / RPM family | Official Fedora brand assets, lalu Wikimedia Commons. | Chip teks Fedora. |
| `arch-logo` | Arch Linux | pacman | Official Arch artwork, lalu Wikimedia Commons. | Chip teks Arch. |
| `opensuse-logo` | openSUSE | zypper | Official openSUSE assets, lalu Wikimedia Commons. | Chip teks openSUSE. |
| `alpine-logo` | Alpine Linux | apk / minimal system | Official Alpine asset, lalu Wikimedia Commons. | Chip teks Alpine. |

Setiap logo hanya muncul pada stasiun distro sendiri lalu collapse menjadi badge
kecil. Jangan tampilkan semua logo dalam satu frame.

### 2.2 Icon konsep: generate lewat icons.json

| ID | Type | Konsep | Penggunaan | Warna |
|---|---|---|---|---|
| `package-box` | structural | Archive box, label kosong | Candidate/download package | `#38BDF8` |
| `repo-shelf` | structural | Rak repository tiga slot | Official/community/vendor source | `#A78BFA` |
| `mirror-server` | structural | Rack server + panah sync | Official mirror internet | `#94A3B8` |
| `metadata-catalog` | accent | Index card tiga baris | Metadata lookup | `#38BDF8` |
| `dependency-nodes` | accent | Tiga node bundle | Dependency resolver | `#A78BFA` |
| `cache-tray` | accent | Tray lokal dengan archive | Cache versus download | `#94A3B8` |
| `trust-key` | accent | Sigil/key trust generik | Trust/signature context | `#34D399` |
| `download-arrow` | accent | Archive menuju tray | Download | `#FB923C` |
| `verify-seal` | accent | Check seal + scan line | Verification | `#34D399` |
| `unpack-box` | structural | Box terbuka → tiga file | Unpack/stage | `#FB923C` |
| `configure-gear` | accent | Gear + check | Configure/triggers | `#FBBF24` |
| `package-ledger` | structural | Ledger/database + stamp | Record installed | `#34D399` |

Icon generated wajib generik: tanpa text, lettermark, brand shape, atau
silhouette apt/dnf/pacman/zypper/apk maupun distro.

## 3. Batch yang kelak dimasukkan ke icons.json

Dua batch 2 × 4 dibuat agar grid mudah dipotong dan diaudit. Ini spesifikasi,
bukan edit JSON saat ini.

### Batch 1 — Repository dan planning

| Slot | ID |
|---:|---|
| 1 | package-box |
| 2 | repo-shelf |
| 3 | mirror-server |
| 4 | metadata-catalog |
| 5 | dependency-nodes |
| 6 | cache-tray |
| 7 | trust-key |
| 8 | kosong/transparan |

```text
Generate a 2x4 grid of flat-design generic Linux package-management icons on a
transparent PNG background, numbered left to right, top to bottom: 1 package
archive box with blank label strip; 2 repository shelf with three slots;
3 mirror server rack with two synchronization arrows; 4 metadata catalog card
with three rows; 5 three connected dependency nodes; 6 local cache tray with
one archive; 7 generic trust key/sigil, not a padlock; 8 empty.
Colors: #38BDF8, #A78BFA, #94A3B8, #38BDF8, #A78BFA, #94A3B8, #34D399.
No text, letters, logos, or gradients. Transparent background. Bold,
consistent silhouette. 4096x2048 canvas.
```

### Batch 2 — Lifecycle instalasi

| Slot | ID |
|---:|---|
| 1 | download-arrow |
| 2 | verify-seal |
| 3 | unpack-box |
| 4 | configure-gear |
| 5 | package-ledger |
| 6–8 | kosong/transparan |

```text
Generate a 2x4 grid of flat-design generic software-installation lifecycle
icons on a transparent PNG background, numbered left to right, top to bottom:
1 download arrow carrying a package archive to local tray; 2 verification seal
with check and one scan line; 3 open archive box with three generic file sheets;
4 configuration gear with small check; 5 package ledger/database with installed
stamp; slots 6-8 empty. Colors: #FB923C, #34D399, #FB923C, #FBBF24, #34D399.
No text, letters, logos, or gradients. Transparent background, bold consistent
silhouette, 4096x2048 canvas.
```

## 4. Kontrak source logo dari web/Wikimedia

Logo nyata tidak boleh diunduh hanya karena hasil pencarian tampak cocok.

| Langkah | Kriteria lulus |
|---|---|
| Source | Official brand/media source diprioritaskan; Wikimedia hanya jika page file memiliki author, license, dan source jelas. |
| Provenance | Catat URL page/file, access date, author/owner, license, attribution, dan trademark guideline. |
| File quality | Utamakan SVG/PNG transparan; jangan gunakan thumbnail, screenshot, atau redraw tanpa source. |
| Original | Simpan unmodified original di `icons/_originals/`. |
| Runtime derivative | Resize/rasterize hanya bila diizinkan dan dicatat. |
| Fallback | Loader menghasilkan null/text chip fallback; animation tidak crash jika asset hilang. |
| Visual audit | Tidak stretch, crop, recolor/filter tanpa izin, atau imply endorsement. |

Wikimedia adalah tempat file, bukan jaminan otomatis bahwa trademark bebas
dipakai. Audit license dan brand guideline dilakukan terpisah.

## 5. Struktur file yang direncanakan

```text
src/content/34-install-applications/
├── icons/
│   ├── icons.json                  # batch definition nanti
│   ├── loader.js                    # generated/runtime asset + fallback
│   ├── package-box.png              # hasil ChatGPT web nanti
│   ├── ...
│   ├── ubuntu-logo.svg|png          # runtime derivative yang disetujui
│   └── _originals/
│       ├── LICENSE-LOGOS.md         # source/license/attribution
│       └── <distro>-original.svg
└── revisi/
    └── 2026-09-18-revisi-02-hybrid-icon-assets.md
```

Original disimpan sebagai bukti sumber; asset runtime memakai ID stabil untuk
loader. Bila brand asset tidak lolos audit, text chip menjadi fallback permanen.

## 6. Mapping visual

| Beat | Asset | Motion |
|---|---|---|
| Distro carousel | Satu logo distro + manager label | Reveal lalu badge. |
| Official repo | repo-shelf + metadata-catalog | Request masuk, index kembali. |
| Mirror internet | mirror-server + cache-tray | Sync idle; archive bergerak saat download. |
| Dependency | package-box + dependency-nodes | Nodes masuk transaction tray bertahap. |
| Download | package-box + download-arrow | Repo/mirror ke cache. |
| Verify | verify-seal + trust-key | Scan archive lalu seal attach. |
| Unpack | unpack-box | Archive morph menjadi file/system shelf. |
| Configure | configure-gear | Aktif setelah unpack sebelum record. |
| Ready | package-ledger | Stamp installed baru app ready. |

Logo tidak menjadi dekorasi berulang pada lifecycle; setelah carousel ia hanya
context badge kecil.

## 7. Loader, fallback, dan aksesibilitas

- Structural icon target 56–96 px; accent 20–36 px.
- Semua icon diberi label data/alt: logo menyebut distro, concept icon menyebut
  peran visual.
- Loader memakai named export dan safe fallback; asset logo opsional tidak boleh
  membuat build gagal.
- Inline SVG placeholder menjaga animation state sebelum asset tersedia.
- Satu asset boleh di-reuse, tetapi tiap actor bergerak punya instance visual
  sendiri.

## 8. Urutan kerja sesudah approval

1. Setujui matrix dan jumlah logo.
2. Tambah dua batch ke `icons.json`.
3. Generate batch di ChatGPT web, slice, cek transparency, order, silhouette,
   filename, dan ukuran.
4. Source logo official/Wikimedia satu per satu dan isi provenance log.
5. Tambah loader/fallback.
6. Wire asset ke scene tanpa mengganti actor yang lebih tepat sebagai SVG.
7. Preview semua stage dan fallback missing asset.
8. Baru ubah README/status berdasarkan hasil nyata.

## 9. Acceptance criteria

- [ ] Dua batch generik memiliki ID, usage, color, dan prompt; brand logo tidak
      ada di batch AI.
- [ ] Generated icons tidak mempunyai brand shape, text, atau lettermark.
- [ ] Setiap logo mempunyai provenance, license/attribution, trademark audit,
      original, dan text-chip fallback.
- [ ] Asset mendukung source, metadata, download, verify, unpack, configure,
      atau record—bukan hiasan semata.
- [ ] Logo tidak muncul bersamaan, tidak stretch, dan tidak recolor sembarang.
- [ ] Build aman bila asset opsional belum ada.
- [ ] Dokumen ini tidak generate, download, edit JSON/loader, atau animation.

## 10. Keputusan yang perlu approval

1. Logo warna asli sesuai guideline, atau monochrome hanya bila diizinkan?
2. Semua enam distro, atau cukup Ubuntu, Fedora, Arch, openSUSE, Alpine untuk
   menjaga durasi?
3. Original asset disimpan di repository, atau runtime derivative + manifest
   provenance saja?
4. Runtime memakai SVG jika tersedia, atau semua logo diraster menjadi PNG?

