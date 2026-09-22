# Revisi-07 — Hero Illustration (Ikon Ringkasan 4 Act)

| Item | Nilai |
|---|---|
| Content | 26 — Terminal Navigation |
| Tanggal | 2026-09-14 |
| Status | ✅ DIEKSEKUSI |
| Konteks | Lanjutan revisi-06 (hero background). User mengira `heroBackground`
| | sudah berupa ilustrasi/thumbnail graphic — ternyata itu cuma backdrop
| | polos. Revisi ini menambah elemen visual sungguhan: ikon yang meringkas
| | keseluruhan isi topic (bukan ilustrasi per command), supaya thumbnail
| | intro kasih gambaran alur video sebelum audiens nonton.

## Perubahan komponen shared (non-breaking)

`src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` — ditambah prop opsional baru
`heroIllustration` (UPDATE 4, pola sama seperti UPDATE 3 `heroBackground`):

- Statis di posisi hero (tidak ikut lerp ke compact header).
- Fade-out otomatis begitu progress lewat `heroIllustration.fadeOutSplit`
  (default = `titleMorphSplit`, sama seperti heroBackground) — compact header
  tidak pernah menampilkan elemen ini.
- Topic kirim SVG siap pakai lewat `heroIllustration.content` (React node,
  digambar relatif origin 0,0 sendiri). Component hanya translate ke `y`
  (default `hero.subtitleY + 90`, di bawah subtitle) dan center horizontal ke
  tengah canvas, plus opsional `scale`/`opacity`.
- Tidak diberikan → tidak ada perubahan apa pun ke topic lain yang sudah
  pakai V1 (non-breaking, sama pola PLAN-12 §11).

## Ilustrasi topic 26

`HeroWorkflowIllustration` (didefinisikan lokal di `Animation.jsx`, pure
presentational, bukan bagian timeline GSAP) — baris 4 chip ikon merepresentasikan
4 Act cerita:

| Chip | Ikon | Warna | Act |
|---|---|---|---|
| RUTE | pin lokasi | `COLORS.NAV` (cyan) | Act 1 — kenali posisi & rute |
| WORKSPACE | folder + plus | `COLORS.MODIFY` (amber) | Act 2 — susun workspace |
| KELOLA | file + pensil | `COLORS.INSPECT` (cyan muda) | Act 3 — kelola & edit aman |
| JALANKAN | terminal `>_` | `COLORS.PACKAGE` (pink) | Act 4 — siapkan & jalankan workflow |

Chip dihubungkan chevron `›` kecil warna `COLORS.MUTED` supaya terbaca sebagai
satu alur berurutan (Act 1 → 2 → 3 → 4), bukan empat ikon lepas. Warna tiap
chip sengaja disamakan dengan `PHASES[i].badgeColor` di `data.js` supaya nanti
begitu `ActBadgeNavigatorV1` aktif (setelah intro selesai), asosiasi warna
sudah dikenali audiens dari thumbnail.

Posisi: default `heroIllustration.y` (`hero.subtitleY + 90` = 754 + 90 = 844)
dipakai apa adanya, tidak perlu override — area itu kosong total selama hero
(body/terminal baru render setelah `contentStarted`), jadi tidak ada risiko
tabrakan dengan elemen lain.

## File yang berubah

- `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` — prop `heroIllustration` baru (UPDATE 4).
- `src/content/26-terminal-navigation/Animation.jsx` — komponen
  `HeroWorkflowIllustration` + wiring prop `heroIllustration` di pemanggilan
  `IntroHeaderMorphV1`.

## Sisa pekerjaan

Preview manual (`npm run dev` → `/player/terminal-navigation`) untuk cek frame
hero/thumbnail secara visual — belum dilakukan di sesi ini. Item ini
menggabung dengan item preview yang sudah tercatat di
`_docs/TERMINAL_NAVIGATION_PLAN.md` (checklist eksekusi, baris terakhir).
