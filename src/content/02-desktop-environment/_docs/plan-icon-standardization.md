# Plan: Standarisasi Icon — Desktop Environment

> Status: PLANNING (belum dieksekusi). Dokumen ini bukan bagian kontrak
> resmi topic (prefix `_docs/`), aman dihapus/diubah bebas.
>
> Konteks: sepanjang revisi motion (Tahap 1-3, lihat
> `plan-revamp-storytelling-motion.md`), semua "icon" di topic ini masih
> HAND-DRAWN — bentuk primitif SVG polos (circle/rect di dalam `Mockup`)
> atau emoji Unicode (🔧 💡). Belum ada `icons/icons.json` sama sekali di
> `desktop-environment`, padahal 2 topic lain (`virtual-memory`,
> `linux-vs-unix`) sudah pakai pipeline standar
> (`docs/06-icon-generation.md`): grid PNG di-generate via ChatGPT/DALL-E
> lewat Chrome extension → auto-crop server lokal (port 3300) → file PNG
> per-icon → di-import lewat `icons/loader.js` → dipakai di JSX via
> `<image href={getIcon('id')} .../>`.
>
> Tujuan dokumen ini: (1) audit semua elemen yang sebaiknya pindah ke
> pipeline standar, (2) susun `icons.json` sesuai skema resmi, (3) rencana
> wiring ke `Animation.jsx` dengan fallback aman, TANPA Claude
> menggambar icon manual sendiri — konten icon sepenuhnya dari hasil
> generate AI yang di-crop otomatis, bukan `<path>`/`<polygon>` buatan tangan.

## 1. Kenapa Pindah ke Pipeline Standar (Bukan SVG Manual)

| Masalah SVG/emoji manual saat ini | Kenapa icons.json lebih baik |
|---|---|
| Dock icon GNOME/KDE/XFCE cuma `<circle>`/`<rect>` polos — SEMUA slot dock terlihat identik, gak ada "konten" apa pun (§ user: "lebih bervariasi isi kontennya") | PNG hasil generate AI benar-benar menggambarkan objek nyata (browser, terminal, file manager, dst) — tiap slot dock jadi beda & bermakna |
| Emoji 🔧 / 💡 dipakai buat insight & tension beat | Emoji BUKAN aset internal — render-nya bergantung font emoji sistem. Saat export video lewat headless Chromium (`scripts/export-parallel.mjs`), font emoji bisa TIDAK tersedia/berbeda dari preview browser biasa → risiko glyph kotak/hilang di video final. PNG icon di-bundle sebagai aset, konsisten 100% preview vs export |
| GNOME/KDE/XFCE/i3 cuma dikenali lewat teks nama + warna badge, gak ada bentuk visual pembeda | Logo/mark tiap DE (redrawn monochrome, presedennya sudah ada di `linux-vs-unix/icons.json` § brand logos) bikin badge/tab/avatar race langsung dikenali sekilas, gak cuma baca teks |
| Kalau Claude gambar manual pakai `<path>` tangan, hasilnya generic & effort tinggi tiap butuh variasi baru | Sekali `icons.json` + prompt disusun, generate ulang/tambah icon baru tinggal jalanin pipeline lagi — control tetap di deskripsi + style_guide, bukan digambar ulang tiap kali |

## 2. Prinsip Batas: Icon vs Tetap SVG Manual

Supaya gak jadi "generate PNG buat SEMUA hal" (berlebihan), garis batasnya:

- **Jadi icon PNG (icons.json)** — kalau elemen itu MEWAKILI objek/benda/brand
  nyata yang orang kenali (app browser, chip CPU, logo GNOME, keyboard).
- **Tetap SVG manual (di komponen)** — kalau elemen itu primitif
  grafis/fungsional yang TIDAK mewakili objek nyata: starburst insight,
  garis track scroll, arc gauge dial, partikel debu, bentuk `Mockup`
  window/taskbar itu sendiri (window kotak, taskbar bar — ini "kanvas",
  bukan "konten"), dan `Face` (karakter maskot animasi, harus tetap bisa
  di-tween reaksi/ekspresi-nya, gak masuk akal jadi PNG statis).

## 3. Audit — Icon yang Diusulkan (14 total, muat 2 Batch × 2×4)

### Batch 1 — "DE Identity & Metrics" (2×4, 7 icon + 1 slot kosong)

| id | Dipakai di | Deskripsi visual |
|---|---|---|
| `gnome-logo` | Phase badge, bottom comparison tab, HOOK preview card, race avatar | Logo footprint GNOME asli, digambar ulang monokrom (presedennya: `linux-vs-unix` redraw Ubuntu/Fedora/dll asli, cuma direcolor) |
| `kde-logo` | (sama seperti di atas) | Logo gear "K" KDE Plasma asli, monokrom |
| `xfce-logo` | (sama seperti di atas) | Logo mouse XFCE asli, monokrom |
| `i3-grid` | (sama seperti di atas) | **BUKAN logo brand** (i3 gak punya mark resmi yang umum dikenal) — abstrak grid 2×2 terbelah tidak simetris, merepresentasikan konsep tiling window manager |
| `ram-stick` | Header metric card "IDLE RAM USAGE" | Stik RAM/memory module sederhana, minimalis |
| `cpu-chip` | Header metric card "CPU OVERHEAD" | Chip/processor kotak dengan pin-pin kecil |
| `customize-dial` | Header metric card "TINGKAT KUSTOMISASI" | Knob/dial putar kecil — selaras sama gauge jarum yang sudah dibikin di Tahap 3 |

### Batch 2 — "App Content & Moment Accents" (2×4, 7 icon + 1 slot kosong)

| id | Dipakai di | Deskripsi visual |
|---|---|---|
| `app-browser` | Dock GNOME, taskbar KDE/XFCE (slot 1) | Ikon browser web generik (bukan logo Chrome/Firefox spesifik) |
| `app-terminal` | Dock GNOME, taskbar KDE/XFCE (slot 2) | Jendela terminal dengan prompt `>_` |
| `app-files` | Dock GNOME, taskbar KDE/XFCE (slot 3) | File manager / folder |
| `app-settings` | Dock GNOME, taskbar KDE/XFCE (slot 4) | Gear/roda gigi pengaturan |
| `keyboard` | Act i3 (ambient accent, dekat caption "semua pakai shortcut keyboard") | Keyboard sederhana tampak atas |
| `insight-bulb` | Badge insight (pengganti emoji 💡) | Bola lampu menyala, gaya sama kayak icon lain (bukan emoji) |
| `tune-wrench` | Beat tension dial Customization (pengganti emoji 🔧) | Kunci pas/obeng sederhana |

> Total 14 icon pas ke pola "Multi-Batch Format A" standar (2 batch × 2×4,
> 7 icon + 1 kosong tiap batch) — sama persis pola yang dipakai
> `linux-vs-unix/icons.json`.

## 4. Style Guide (disamakan dengan topic lain)

```json
"style_guide": {
  "background": "transparent",
  "palette": "grayscale monochrome (black/white/gray only) — icon TETAP netral abu-abu, warna per-DE (biru GNOME/hijau KDE/kuning XFCE/merah i3) diterapkan lewat badge/chip background di JSX, BUKAN di-bake ke file PNG — supaya 1 file icon bisa dipakai ulang di konteks warna berbeda (mis. `app-browser` dipakai di 3 Mockup DE berbeda)",
  "notes": "Logo brand (gnome-logo/kde-logo/xfce-logo) ikuti bentuk asli semirip mungkin, cuma direcolor monokrom — sama seperti perlakuan Ubuntu/Fedora/dll di linux-vs-unix/icons.json. i3-grid BUKAN brand mark, abstrak murni."
}
```

## 5. Rencana Wiring ke `Animation.jsx` (setelah PNG jadi)

1. `src/content/desktop-environment/icons/loader.js` — pola sama persis
   kayak `virtual-memory`/`linux-vs-unix`: import tiap PNG, ekspor
   `ICONS` map + `getIcon(id)`.
2. Semua pemakaian WAJIB pakai fallback aman
   `{getIcon('id') && (<image .../>)}` (pola yang sama dipakai di
   `linux-vs-unix/Animation.jsx`) — supaya kalau ada 1-2 file PNG belum
   sempat di-generate, komponen TETAP render (bukan crash), cuma slot itu
   kosong sementara.
3. Titik integrasi konkret:
   - `Mockup` (GNOME dock 4 slot, KDE taskbar, XFCE taskbar) → ganti
     `<circle>`/`<rect>` polos jadi `<image href={getIcon('app-...')}>`
     di posisi yang sama, ukuran ~16-20px, ambient bob/rotate motion
     yang SUDAH ada (dari Tahap 1) tetap dipakai — cuma isinya diganti,
     bukan motion-nya.
   - Metric card header (RAM/CPU/Customization) → tambah `<image>` kecil
     (~20px) di sebelah kiri teks label.
   - Insight badge (💡) & tension wrench (🔧) → ganti jadi `<image
     href={getIcon('insight-bulb'|'tune-wrench')}>`, ukuran sama kayak
     emoji sebelumnya (~16-18px).
   - Phase badge, bottom comparison tab, HOOK preview card, race avatar
     → tambah `<image href={getIcon(\`${de.id}-logo\`) || getIcon('i3-grid')}>`
     kecil (~18-24px) di samping/atas nama DE.
4. **Tidak ada perubahan `SFX_SCHEDULES` atau timing timeline** — ini
   murni ganti KONTEN VISUAL statis, bukan nambah `master.add()`/`master.to()`
   baru, jadi selaras prinsip "non-invasive" yang sama seperti Tahap 1-3.

## 6. Batasan Teknis — Kenapa Claude Gak Bisa Generate PNG-nya Sendiri

Pipeline resmi (`docs/06-icon-generation.md` §5) butuh: Chrome extension
`src/extensions/vm-icon-generator` yang jalan di tab `chatgpt.com` buat
minta ChatGPT generate grid gambar, lalu kirim hasilnya ke local crop
server (`docker compose` + endpoint `POST /api/icons/generate`, port
3300). Ini alur interaktif berbasis browser + akun ChatGPT milik user —
Claude di sesi ini TIDAK punya akses ke Chrome extension/tab
`chatgpt.com` tersebut, jadi generate PNG aktualnya WAJIB dijalankan
manual oleh user. Bagian Claude: nyiapin `icons.json` (skema + prompt
yang presisi) dan wiring kode SETELAH file PNG sudah ada di folder.

## 7. Checklist Implementasi Bertahap

**Tahap Icon-1 — Siapkan `icons.json` (Claude bisa kerjain sekarang):**
- [ ] Buat `src/content/desktop-environment/icons/icons.json` — skema
      Multi-Batch Format A, isi persis Batch 1 & 2 di §3, plus
      `style_guide` di §4, plus 2 prompt ChatGPT (1 per batch) mengikuti
      format prompt di `docs/06-icon-generation.md` §1-3.
- [ ] Buat folder kosong `src/content/desktop-environment/icons/` siap
      diisi PNG hasil generate.

**Tahap Icon-2 — Generate (WAJIB dikerjain user, bukan Claude):**
- [ ] Jalankan `docker compose up -d` (export server aktif di :3300).
- [ ] Load Chrome extension `src/extensions/vm-icon-generator`, buka tab
      `chatgpt.com`, pilih topic `desktop-environment`, generate
      Batch 1 lalu Batch 2 (`All Batches (Sequential)` kalau didukung).
- [ ] Verifikasi 14 file PNG (7+7) sudah ke-crop otomatis masuk ke
      `src/content/desktop-environment/icons/`, nama file cocok sama
      `id` di `icons.json`.

**Tahap Icon-3 — Wiring ke kode (Claude lanjut setelah PNG ada):**
- [ ] Buat `icons/loader.js` (pola §5.1).
- [ ] Wiring ke `Mockup`, metric card header, insight/tension badge,
      phase badge, bottom comparison tab, HOOK preview card, race avatar
      (§5.2-5.3) — semua pakai fallback `getIcon(...) &&`.
- [ ] Hapus emoji 🔧/💡 yang sudah tergantikan.
- [ ] Cek sintaks `esbuild` seperti Tahap 1-3 sebelumnya.
- [ ] Preview `/player/desktop-environment`, pastikan tiap dock slot
      GNOME/KDE/XFCE keliatan beda kontennya (bukan geometris kembar
      lagi), dan gak ada slot icon yang blank karena file belum ke-generate.

## 8. Non-Goals

- Tidak mengubah struktur `data.js`, timeline, atau beat
  (`setup/tension/insight/payoff`) — murni ganti render KONTEN icon.
- Tidak menghapus `Mockup`/`Face`/`Starburst` sebagai komponen SVG
  manual — cuma isi dock/badge di dalamnya yang beralih ke PNG, bentuk
  window/taskbar/kanvas & karakter maskot tetap SVG (lihat §2).
- Tidak menyentuh `icons.json` topic lain (`virtual-memory`,
  `linux-vs-unix`) — scope ini murni `desktop-environment`.
