# Icon Status — container-docker

Status singkat icon untuk topic `container-docker`. Semua icon dibuat lewat
extension `src/extensions/vm-icon-generator` (bukan download dari sumber
eksternal), sesuai `icons.json` di folder `icons/`.

## Batch Icon

| Batch | Icon | Status |
|---|---|---|
| batch-1 | laptop, isolation-wall-thick, isolation-wall-thin, hypervisor-icon, guest-os-icon, host-kernel-icon, docker-engine-icon, container-icon | ✅ Sudah ada |
| batch-2 | node-icon, python-icon, redis-icon | ✅ Sudah ada |
| batch-3 | hardware-icon, chip-icon | ✅ Sudah ada |

Semua file PNG batch-2 & batch-3 sudah terverifikasi ada di
`src/content/container-docker/icons/` dan sudah di-wire ke `loader.js` +
`Animation.jsx`. Tidak ada icon yang perlu digenerate ulang.

## Kalau perlu revisi icon baru

1. Tambah entry batch baru di `icons/icons.json` (ikuti pola batch-1/2/3).
2. Buka extension `vm-icon-generator` di tab chatgpt.com, pilih topic
   `container-docker`, jalankan batch yang baru.
3. Update `icons/loader.js` supaya icon baru ke-load.

## Catatan lain

Untuk isu lain di luar icon (konsistensi vs tailscale, out-of-frame, dsb),
buat plan baru per-topik saat dibutuhkan — jangan tumpuk banyak file plan
sekaligus di folder ini.
