# Revisi-04 — Samakan X Ambient ACT 1 dengan X Intro/Header

| Item | Nilai |
|---|---|
| Content | 26 — Terminal Navigation |
| Tanggal | 2026-09-14 |
| Status | EXECUTED (2026-09-14) — lihat Animation.jsx |
| Fokus | Reposisi horizontal ambient `ACT 1` supaya x-nya sama dengan x intro title/header, tanpa mengubah bentuknya jadi badge. |

## Tujuan

Revisi-03 menaruh ambient `ACT 1` rata kanan (`x=776`, `textAnchor="end"`).
Revisi ini menyamakan x ambient dengan x yang dipakai intro title/header
(`layout.header.x = 44`) — kebetulan sama dengan x badge navigator
(`ActBadgeNavigatorV1` pakai `nav.x = 44`), jadi transisi dari ambient teks
ke badge sungguhan terasa menyambung di posisi horizontal yang sama.

## Perubahan

- `src/content/26-terminal-navigation/Animation.jsx`
  - Import `DEFAULT_LAYOUT_V1` dari `shared/scene-ui/v1`.
  - `INTRO_ACT_X` sekarang `DEFAULT_LAYOUT_V1.header.x` (44), bukan `776`.
  - `textAnchor` teks ambient diubah dari `"end"` ke `"start"` (rata kiri,
    tumbuh ke kanan dari x=44).
  - `INTRO_ACT_Y` tidak diubah (tetap 478, di atas tagline hero, di belakang
    blok title — tidak bertabrakan karena title hero masih center selama
    ambient tampil).

## Guardrail yang tetap berlaku (dari revisi-03)

- Tetap teks polos, `pointerEvents: 'none'`, tanpa rect/pill/border — bukan
  badge aktif.
- Tetap fade-out sebelum `contentStarted` (badge navigator sungguhan baru
  render setelah intro title sudah di posisi header).
- Tidak ada perubahan command, caption, SFX, durasi Act, atau workflow
  terminal.

## Yang masih perlu dicek manual

- Preview dev server: pastikan `ACT 1` di kiri tidak bertabrakan dengan
  tagline/title hero yang masih di tengah canvas selama ambient fade-in.
- Cek breakpoint mobile/tablet — posisi kiri lebih dekat ke safe-area edge
  dibanding versi kanan sebelumnya, pastikan tidak clipping.
