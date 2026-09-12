# Revisi Log — 17-rest-api

Index ringkas semua perbaikan/perubahan pasca first-pass topic ini
(`_docs/REST_API_PLAN.md` = planning SEBELUM topic jadi, folder ini =
perbaikan SESUDAHNYA). Konvensi penamaan & isi ikut
`docs/standardizations/02-standar-konten.md` bagian 3.

| No | File | Judul | Status |
|---|---|---|---|
| 01 | `2026-09-11-1159-revisi-01.md` | Ganti warna intro morph (title/tagline/cursor) dari ungu (`COLORS.TECHNICAL`) jadi hijau-biru, samain gaya `11-tailscale`; sekalian tambah rule warna intro ke `docs/standardizations/03` & `05` | ✅ DONE (kode + docs sudah diubah, preview browser & export MP4 belum dicek manual) |
| 02 | `2026-09-11-1241-revisi-02.md` | Ganti TOTAL analogi cerita dari kantor pos (amplop/pintu/petugas/stempel) jadi restoran (pelanggan/pelayan/dapur/meja), berdasar proposal user di `_docs/REST-API-storytelling-revision.md` — icon, `Animation.jsx`, `data.js` semua kena | 🚧 IN PROGRESS — `data.js`, `icons.json`, `loader.js`, `Animation.jsx` sudah ditulis ulang (analogi restoran penuh, Beat B statelessness pakai 2 request card, `FaceSimple`/officer lama dihapus, `CustomerCharacter` & `RequestCard` ditambah). Pending: generate PNG 3 REPLACE + 1 BARU (manual di ChatGPT), preview browser (`npm run dev`), export re-verify. |
| 03 | `2026-09-11-revisi-03.md` | Visual-first: ganti teks narasi/note/payoff → SVG icon inline di semua Act (10 komponen baru: `ChainLinkBadge`, `LargeQuestionMark`, `ConsistencyBadge`, `ChaosBadge`, `RuleIcon`, `PutPatchComparison`, `ConfusedChefIcon`, `StatelessDivider`, `LockFlying`, `AuthTeaser`, plus `PayoffCheckmark`/`CliffhangerIcon`/`ConsistencyCheck` untuk Act 4 & 5). Hapus 14 data constant, tambah popOut wajib tiap beat. 0 PNG baru. | ✅ DONE (kode) — `data.js` & `Animation.jsx` sudah ditulis ulang sesuai plan (13 komponen SVG baru, `flyLock`/`moveLock` untuk Act 5, timeline semua Act di-rewrite dengan popOut wajib). Syntax divalidasi via `esbuild` (OK) & cross-check semua import `data.js` (OK). Pending: preview browser manual (`npm run dev`) untuk verifikasi visual per checklist § 10, dan export MP4 re-verify. |
