# 08 — Audio SFX: Sourcing, Konvensi, & Integrasi

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → **`08-audio-sfx-generation`**

Acuan lengkap untuk pipeline aset audio SFX (sound effect) tiap topic:
kapan reuse asset yang sudah ada, kapan cari/download baru, konvensi
penyimpanan & penamaan, format config `SFX_MAP`, cara integrasi ke
`Animation.jsx`, dan pitfall yang wajib dihindari. Dokumen ini mirror
struktur `06-icon-generation.md` — baca 06 dulu kalau belum familiar
dengan pola dokumen serupa.

## 1. Struktur Folder Audio

```
public/audio/
├── ui/            (klik, pop, chime — interaksi ringan)
├── impacts/       (benturan, snap, konektor — momen "kena/nempel")
├── transitions/   (whoosh, swoosh — perpindahan Act/scene)
├── warnings/      (alert, tension, critical — momen genting)
├── success/       (confirm, victory, relief — payoff positif)
└── sfx/           (kategori umum/lainnya yang tidak masuk 5 di atas)
```

Kategori ini SHARED lintas topic — 1 file audio boleh dipakai banyak
topic sekaligus. Nama folder = nama kategori yang dipakai di `SFX_MAP`
(lihat §3) dan di parameter `sfxCategory` saat memanggil `sfxLoader`.

## 2. Langkah 0 — Scan Dulu Asset yang Sudah Ada

**Sebelum download atau generate SFX baru**, scan seluruh
`public/audio/*/` untuk asset yang sudah ada tapi belum kepakai di topic
yang sedang dikerjakan. Banyak SFX generik (klik, pop, whoosh, beep)
punya variasi yang bisa dipakai ulang lintas topic tanpa perlu asset
baru sama sekali — mengecek ini dulu menghindari waktu terbuang untuk
download/generate yang sebenarnya sudah tersedia.

Cuma kalau memang tidak ada yang cocok secara konsep (bukan cuma soal
"belum pernah dipakai di topic ini"), lanjut ke §4 (sourcing SFX baru).

## 3. Skema Config `SFX_MAP` (di `data.js`)

Tiap topic simpan daftar SFX yang dipakai di `data.js`, format konsisten:

```js
export const SFX_MAP = {
  POP:      { category: 'ui', name: 'pop' },
  WHOOSH:   { category: 'transitions', name: 'whoosh' },
  IMPACT:   { category: 'impacts', name: 'impact' },
  SUCCESS:  { category: 'success', name: 'confirm' },
  // field `boost` OPSIONAL — lihat 04-referensi-gsap.md § "Audio Boost"
  TYPING:   { category: 'sfx', name: 'typing', boost: 2.2 },
}
```

`category` HARUS cocok persis dengan nama folder di `public/audio/`
(§1) — ini yang dipakai saat memanggil `sfxLoader.play(category, name,
opts)` atau helper `popIn()` (lihat §6).

**Wajib cross-check sebelum commit**: setiap entry `SFX_MAP` yang
didefinisikan harus benar-benar dipanggil di `Animation.jsx`. Entry yang
didefinisikan tapi tidak pernah dipanggil adalah sinyal config sudah
basi — SFX yang direncanakan tapi lupa di-wire, atau sisa eksperimen
yang sudah tidak relevan. Hapus entry yang memang tidak jadi dipakai,
atau segera wire kalau memang masih direncanakan.

## 4. Sourcing SFX Baru (Kalau §2 Tidak Ketemu yang Cocok)

| Situs | Lisensi | Kenapa cocok |
|---|---|---|
| **kenney.nl** | CC0, tanpa login, tanpa atribusi | Paling aman secara hukum. Pack tematik (mis. "Digital Audio", "Interface Sounds") berisi puluhan sound sekaligus per-zip, banyak pilihan dalam 1x download. |
| **mixkit.co** | Free commercial license, tanpa login | Gampang diotomasi lewat terminal (`curl` langsung ke URL preview file). |
| **pixabay.com/sound-effects** | Pixabay Content License, tanpa atribusi, tanpa login untuk download | Variasi bagus, kualitas konsisten, gampang dicari by keyword. |
| **freesound.org** | Lisensi PER FILE — WAJIB filter ke "Creative Commons 0" saat search | Library paling besar & paling unik untuk sound spesifik/nyeleneh yang tidak ada di sumber lain. Butuh akun gratis untuk download. |

**Urutan coba**: kenney.nl dulu (paling cepat, zero-risk, banyak pilihan
sekaligus) → mixkit.co (kalau butuh 1-2 sound spesifik) →
pixabay/freesound (kalau butuh sound yang benar-benar unik & tidak
ketemu di 2 sumber pertama, WAJIB filter CC0 di freesound).

**Catatan operasional — akses jaringan:** sama seperti download aset
icon (lihat `06-icon-generation.md` §9), environment sandbox terbatas
biasanya TIDAK bisa akses domain situs-situs di atas. Download harus
dilakukan lewat terminal dengan akses jaringan penuh ke
komputer/host sebenarnya, bukan sandbox terbatas.

## 5. Konversi & Normalisasi Setelah Download

1. **Convert ke WAV 44.1kHz/16-bit** kalau sumbernya MP3/OGG, pakai
   `ffmpeg`, supaya konsisten dengan format asset existing.
2. **Trim/normalize durasi pendek** (0.1–2 detik untuk SFX pendek,
   sesuaikan untuk ambient/loop) — jangan reuse file mentah yang
   kepanjangan dari sumber asli.
3. Simpan ke folder kategori yang sesuai (§1), pakai nama file deskriptif
   kebab-case (`geiger-accelerate.wav`, bukan `sound-1.wav`).
4. Register di `SFX_MAP` (§3) dengan `category` yang cocok dengan nama
   folder tempat file disimpan.

## 6. Integrasi ke `Animation.jsx`

Referensi lengkap pola `popIn()` dengan `sfxCategory` eksplisit,
`sfxLoader.play(category, name, opts)`, dan Common Pitfalls terkait SFX
ada di `04-referensi-gsap.md`:

- § "Referensi: `popIn()` dengan `sfxCategory` Eksplisit" — signature
  helper yang benar (kategori sebagai parameter, bukan hardcode).
- § "Policy: `sfx: false` Wajib Ada Alasan" — kapan boleh silent, kapan
  wajib ada SFX pengganti.
- § "Audio Boost" — cara menaikkan volume 1 SFX melebihi native cap
  browser (`GainNode`), untuk SFX yang perlu terdengar lebih menonjol.
- Tabel "Common Pitfalls" — termasuk bug silent-failure kategori SFX
  yang mismatch.

**Jangan duplikasi dokumentasi pola-pola ini di sini** — dokumen ini
fokus ke sourcing & konvensi asset, bukan pola kode GSAP/JS-nya.

## 7. Metodologi: Audit SFX Coverage

Sebelum menganggap SFX 1 topic "selesai", lakukan audit sistematis —
jangan cuma andalkan nonton preview sekali lalu merasa "sudah cukup
rame". Langkah yang terbukti efektif:

1. **Baca ulang seluruh `useEffect` master timeline baris per baris.**
   List semua `popIn(...)`, `tl.to(...)` (tween nilai yang berdurasi),
   dan pemanggilan SFX langsung (`sfxOn`/`sfxLoader.play`).
2. **Cross-check per motion**: untuk tiap `popIn`/`tl.to`, cek apakah
   ada SFX yang menyertainya (baik dari opsi `sfx` di `popIn` itu
   sendiri, atau dari pemanggilan SFX lain yang jalan di waktu
   berdekatan/~0.3 detik).
3. **Tandai motion yang TOTAL SILENT** (tidak ada SFX sama sekali dalam
   radius waktu berdekatan) — prioritaskan motion yang signifikan secara
   visual/durasi (tween panjang, elemen besar/fokus utama) di atas
   elemen kecil/dekoratif.
4. **Putuskan per temuan**: reuse SFX existing (§2), pasang SFX baru
   (§4-5), atau dokumentasikan sengaja silent (lihat policy `sfx: false`
   di `04-referensi-gsap.md`).
5. Setelah semua terpasang, **preview manual dev server, dengerin full
   durasi** — cek tidak ada SFX yang numpuk/kepotong/berisik (terlalu
   banyak SFX bersamaan bisa jadi masalah baru, bukan cuma "kurang
   suara").

Metodologi ini lebih lambat dari sekadar nonton preview sekali, tapi
jauh lebih efektif menemukan gap yang tidak kelihatan kalau cuma
mengandalkan insting/telinga sepintas.

## 8. Checklist Sebelum Commit (Audio/SFX)

- [ ] Sudah scan `public/audio/*/` untuk asset existing sebelum
      download/generate baru (§2)
- [ ] Semua `SFX_MAP` entry di `data.js` benar-benar dipanggil di
      `Animation.jsx` — tidak ada dead config (§3)
- [ ] SFX baru (kalau ada) sudah dikonversi ke WAV 44.1kHz/16-bit,
      durasi sudah di-trim/normalize (§5)
- [ ] Helper `popIn()`/pemutar SFX generik menerima `sfxCategory`
      eksplisit, tidak hardcode 1 kategori (§6, detail di
      `04-referensi-gsap.md`)
- [ ] Audit SFX Coverage sudah dilakukan (§7) — motion signifikan yang
      silent sudah ditinjau, `sfx: false` yang tersisa punya alasan jelas
- [ ] Preview manual dev server, dengerin full durasi — tidak ada yang
      numpuk/kepotong/berisik
