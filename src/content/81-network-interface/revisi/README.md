# Revisi — 81 Network Interface

| Revisi | Status | Ringkasan |
|---|---|---|
| [04](2026-09-22-revisi-04-hapus-referensi-content-berikutnya.md) | ✅ Diimplementasikan | Hapus panel penutup Act 6 yang menyinggung content selanjutnya ("Lapisan port dan service menyusul di Content 84.") sesuai instruksi. |
| [03](2026-09-22-revisi-03-inline-svg-icons-and-intro-overflow-fix.md) | ✅ Diimplementasikan + screenshot nyata | 14 icon SVG inline (Ethernet/Wifi/Loopback/Link/MAC/IP/Config/Route/DNS/Name/Bridge/VLAN/VPN/Container) di semua ConceptCard + AnchorIcon. Fix judul hero terpotong (799.85px render vs 788px ruang tersedia) pakai `titleLines` 2-baris (pola topic 22), bukan re-split kata seperti rencana awal (diverifikasi tidak akan efektif). |
| [02](2026-09-22-revisi-02-fix-timing-hold-dan-overlap.md) | ✅ Diimplementasikan + screenshot nyata | Fix diagram hilang prematur sebelum caption closing selesai (Act 2/3/4/5) + fix teks desc tumpang tindih di Act 6 (momen semua chip aktif). Ditemukan via `scripts/preview-frames.mjs` + Puppeteer screenshot nyata. |
| [01](2026-09-21-revisi-01-selaras-standar-act-scene.md) | ✅ Diimplementasikan + SSR test lolos (6/6) | Selaras standar act-scene (1 act = 1 file) + bg/bgScenes intro (UPDATE 6) + categorySegments domain (UPDATE 5, Opsi A). Oracle: `44-ssh` |
