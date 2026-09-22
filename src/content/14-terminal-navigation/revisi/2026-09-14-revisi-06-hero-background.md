# Revisi 06 — Hero Background (topic 26-terminal-navigation)

**Tanggal:** 2026-09-14
**Status:** Selesai diimplementasikan

## Konteks

`IntroHeaderMorphV1.jsx` baru saja dapat prop opsional baru `heroBackground`
(UPDATE 3, non-breaking, sama pola `categorySegments`/`titleLines`) untuk
kebutuhan thumbnail — backdrop statis di posisi hero, fade-out otomatis
begitu progress lewat `titleMorphSplit`, tidak ada di compact header.

## Perubahan

- `Animation.jsx` — tambah prop `heroBackground` pada pemanggilan
  `IntroHeaderMorphV1` di intro:
  ```jsx
  heroBackground={{
    fill: 'rgba(56, 189, 248, 0.10)',
    stroke: 'rgba(56, 189, 248, 0.25)',
  }}
  ```
- Warna diambil dari `COLORS.NAV` (`#38BDF8`, tema "navigasi" topic ini)
  di-translucent-kan, konsisten dengan identitas warna topic (bukan warna
  netral default component).
- Semua field lain (rx, padding, opacity, fadeOutSplit) pakai default
  component — auto-bounding-box dari tagline/title(titleLines)/subtitle,
  center ke tengah canvas.

## Dampak

- Non-breaking: hanya menambah backdrop translucent di momen hero intro.
- Compact header (setelah morph, `contentStarted === true`) tidak berubah
  sama sekali — backdrop sudah fade-out total sebelum itu.
- Tidak menyentuh timing/duration animasi lain.
