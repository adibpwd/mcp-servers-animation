# Revisi — 21-forgot-password

| File | Tanggal | Ringkasan | Status |
|---|---|---|---|
| `2026-09-13-revisi-01-audio-playful.md` | 2026-09-13 | Plan audio recovery, token reset, hash baru, dan session close. | 📝 PLAN ONLY |
| `2026-09-13-revisi-02-render-bugs.md` | 2026-09-13 | Fix crash `FORM_LABEL`, header/intro tidak tampil (`headerOpacity`), `gateCard` tidak pernah popIn, id mismatch `hashCard`/`tokenCard`, caption `TOKEN_DEPARTS` hilang. | ✅ 5/5 fix dieksekusi, preview manual belum |
| `2026-09-13-revisi-03-intro-header-v1-standard.md` | 2026-09-13 | Satukan header ke satu `IntroHeaderMorphV1` mount sejak awal (bukan digate `contentStarted`), hero dua baris (`titleLines`), warna judul FORGOT sky / PASSWORD emerald, hapus fallback header manual. | ✅ Kode dieksekusi, preview manual belum |
| `2026-09-13-revisi-04-plan-vs-code-audit.md` | 2026-09-13 | Audit plan vs kode: identity parity Raka→Adib (4.1), token travel inbox→gerbang (4.2), caption `sessionClosed` salah pasang (4.3), durasi PHASES disamakan runtime aktual (4.4), checklist plan diperbarui (4.5), visual dua email beda status → respons identik (4.6). | ✅ 6/6 temuan dieksekusi, preview manual belum |
