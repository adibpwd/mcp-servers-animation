# Revisi 04 — Hapus Referensi Content Berikutnya di Penutup Act 6

| Item | Nilai |
|---|---|
| Content | 81 — Network Interface |
| Diminta oleh | Adib, 2026-09-22: "id akhir act ga usah info lanjut content selanjutnya ya" |
| Status | ✅ Diimplementasikan + diverifikasi via screenshot |

## Perubahan

Act 6 (penutup topic) sebelumnya menampilkan panel `TakeawayBar` tambahan
di bawah chip row, berisi teks forward-pointer ke topic lain:
`"Lapisan port dan service menyusul di Content 84."` (`CLOSING_LINE` di
`data.js`). Sesuai instruksi, referensi ke content selanjutnya ini dihapus.

Caption closing Act 6 ("Jalur virtual juga interface.") sudah cukup
sebagai takeaway — tidak diganti dengan teks lain, cukup dihapus.

## File yang diubah

- `data.js` — hapus `export const CLOSING_LINE`.
- `acts/Act6InterfaceVirtual.jsx` — hapus import `TakeawayBar`/`CLOSING_LINE`,
  hapus field `takeawayVisible` dari `SUMMARY_STATE`, hapus render
  `<TakeawayBar .../>`.
- `acts/common.jsx` — hapus komponen `TakeawayBar` (sudah tidak dipakai
  di mana pun).
- `Animation.jsx` — hapus state `takeawayVisible`/`setTakeawayVisible`
  (deklarasi, reset di awal loop, `tl.add(() => setTakeawayVisible(true), ...)`
  di timeline Act 6, dan field-nya di object `state` yang dikirim ke
  `<Act />`). SFX `SHIMMER` di closing beat Act 6 tetap ada (audio saja,
  tidak terikat visual bar yang dihapus).

## Validasi

- esbuild bundle-check isolasi — lolos, 59.5kb.
- Screenshot `a6@7` (t=53.6, setelah closing beat) — panel penutup
  sudah tidak tampil, chip row + caption closing tetap rapi.
