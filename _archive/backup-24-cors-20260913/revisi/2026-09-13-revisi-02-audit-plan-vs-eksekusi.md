# Revisi-02: Audit Plan vs Eksekusi — 24-cors

> **Status:** 🔍 Audit Only — tidak mengubah kode, data, atau layout.
>
> **Tanggal:** 2026-09-13
>
> Membandingkan `_docs/CORS_PLAN.md` (checklist §5) dengan kondisi aktual
> `data.js`, `Animation.jsx`, `manifest.js`, `registry.js`, dan folder
> `revisi/`. Tujuan: memastikan status "Draft" di plan sinkron dengan yang
> sudah benar-benar dikerjakan.

## 1. Ringkasan Cepat

Plan CORS ditandai **"PLAN ONLY / Draft"** dan seluruh 6 item checklist
masih `[ ] Draft` per 2026-09-12. Namun eksekusi kode **sudah berjalan jauh
melampaui status draft tersebut** — first pass 4 Act sudah dibangun, sudah
di-wiring audio (Revisi-01), dan sudah didaftarkan ke `registry.js`.
Dokumentasi checklist di `CORS_PLAN.md` **belum diperbarui** untuk
merefleksikan ini.

Temuan kritis: ada **bug caption** yang lolos ke Revisi-01 dan belum
diperbaiki — 16 dari 18 pemanggilan `CAPTIONS.*` di `Animation.jsx` tidak
match dengan key yang ada di `CAPTIONS` pada `data.js`.

## 2. Status per Item Checklist Plan (§5)

| # | Item Checklist (plan) | Status di plan | Status Aktual | Bukti |
|---|---|---|---|---|
| 1 | Approve CORS scope dan technical guardrail | `[ ]` Draft | ⚠️ **Implisit jalan tanpa approval formal** — implementasi sudah dimulai memakai scope plan ini, tapi tak ada catatan approve eksplisit | `CORS_PLAN.md` masih berstatus header "PLAN ONLY / Draft" |
| 2 | Buat folder contract, manifest, SceneChromeV1 | `[ ]` Draft | ✅ **Selesai** — `manifest.js` lengkap (id, title, category, color, tags); `data.js` memakai `DEFAULT_LAYOUT_V1`; `Animation.jsx` memakai `IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, `ContentBodyV1` (scene-ui V1) | `manifest.js`, `data.js` baris import, `Animation.jsx` baris import |
| 3 | Implementasikan intro dan Act 1–4 | `[ ]` Draft | 🟡 **Sebagian** — struktur timeline GSAP utuh (intro morph + 4 Act lengkap dengan state per Act), TAPI caption yang tampil ke penonton rusak (lihat §3) | `Animation.jsx` blok `useEffect` timeline utama |
| 4 | Audit preflight cause, browser enforcement, credentials/wildcard | `[ ]` Draft | ❌ **Belum dilakukan / sebagian hilang** — cerita preflight & browser-enforcement tervisualisasi (Act 2–4), tapi guardrail #5 plan (wildcard tidak boleh dipasangkan dengan credential) **tidak muncul** di caption/label manapun | Cross-check `CAPTIONS` di `data.js` vs `CORS_PLAN.md §4` poin 5 |
| 5 | Audit asset/SFX, no teleport, collision, dead field | `[ ]` Draft | 🟡 **Sebagian** — audit SFX & loudness sudah dilakukan tuntas di Revisi-01 (13/13 key terpakai, dead key `WHOOSH`/`DENY` dihapus); audit visual "no teleport, collision, dead field" **belum ada catatan formal** | `revisi/2026-09-13-revisi-01-audio-playful.md` §6 |
| 6 | Preview/export sebelum registry coming-soon | `[ ]` Draft | ❌ **Urutan terbalik dari plan** — topic **sudah** didaftarkan ke `registry.js` dengan `status: 'coming-soon'`, padahal preview manual (`npm run dev`) dan export audio/MP4 **belum dilakukan** (dikonfirmasi eksplisit di Revisi-01 sebagai belum selesai) | `registry.js` (comment "FIRST PASS SELESAI... Belum preview manual & export MP4"); `revisi-01` §6 |

## 3. Bug yang Ditemukan — Caption Mismatch (Belum Diperbaiki)

`Animation.jsx` memanggil 18 key caption berbeda melalui helper `say()`.
Dicocokkan satu-satu ke objek `CAPTIONS` di `data.js`:

| Dipanggil di `Animation.jsx` | Ada di `CAPTIONS` (`data.js`)? |
|---|---|
| `APP_START` | ❌ tidak ada (yang ada: `APP_FETCH`) |
| `ORIGIN_DIFF` | ✅ ada |
| `TRIP_KNOWN` | ❌ tidak ada |
| `GATE_UP` | ❌ tidak ada (yang ada: `GATE_APPEAR`) |
| `NEED_PERMISSION` | ❌ tidak ada (yang ada: `NEED_IZIN`) |
| `PREFLIGHT_OFF` | ✅ ada |
| `CARRIES` | ❌ tidak ada |
| `API_READS` | ❌ tidak ada (yang ada: `API_READ`, tanpa S) |
| `POLICY_OPEN` | ❌ tidak ada (yang ada: `POLICY_TERBUKA`) |
| `CHECK_METHOD` | ❌ tidak ada |
| `MISMATCH` | ❌ tidak ada (yang ada: `DENY_TOLAK`) |
| `ALLOWED_HEADER` | ❌ tidak ada (yang ada: `ALLOW_TERIMA`) |
| `MATCH_PASS` | ❌ tidak ada |
| `ACTUAL_OFF` | ❌ tidak ada (yang ada: `ACTUAL_LANJUT`) |
| `RESP_IN` | ❌ tidak ada (yang ada: `RESPONS_MASUK`) |
| `GATE_OPEN` | ❌ tidak ada (yang ada: `GATE_TERBUKA`) |
| `DATA_READY` | ❌ tidak ada |
| `CLOSING` | ❌ tidak ada (yang ada: `BUKAN_AUTH`) |

**Hasil: hanya 2 dari 18 caption (`ORIGIN_DIFF`, `PREFLIGHT_OFF`) yang benar-benar
tampil.** 16 sisanya akan render `undefined` sebagai teks caption saat
animasi diputar — pola bug yang sama seperti yang sudah pernah dicatat pada
topic lain (`CAPTIONS.TOKEN_DEPARTS` di topic 21).

Bug ini **sudah pernah dicatat** di `revisi-01` (lihat "Catatan implementasi
(hasil actual)", bagian akhir) tapi eksplisit ditandai **di luar scope**
revisi audio tersebut, dan **belum ada revisi terpisah yang memperbaikinya**
sampai audit ini dibuat.

## 4. Kesimpulan

| Klaim di `CORS_PLAN.md` | Fakta |
|---|---|
| "Tidak ada perubahan backend, browser setting, registry entry, atau implementasi." (header plan) | ❌ **Sudah tidak akurat.** Registry entry sudah ada (`status: 'coming-soon'`), dan implementasi kode (data.js, Animation.jsx, manifest.js) sudah first pass lengkap 4 Act + audio wiring. |
| Semua checklist §5 masih `[ ] Draft` | ❌ **Tidak akurat.** Item #2 (folder/manifest/SceneChromeV1) selesai; item #3 (Act 1-4) sebagian besar selesai; item #5 (audit SFX) sebagian selesai lewat revisi-01. |

**Yang benar-benar belum dikerjakan (murni belum ada apapun):**
1. Preview manual satu loop penuh via `npm run dev`.
2. Export audio final / export MP4.
3. Perbaikan bug caption mismatch (16/18 caption tidak tampil).
4. Visualisasi guardrail credentials + wildcard (poin 5 di `CORS_PLAN.md §4`) — belum ada representasi di caption/label manapun.
5. Audit visual formal untuk no-teleport/collision/dead-field (baru audit SFX yang formal).
6. Approval eksplisit atas scope & guardrail (masih berstatus draft di dokumen, meski kode jalan duluan).

## 5. Rekomendasi

- [ ] Perbaiki caption mismatch dulu sebelum preview manual — ini bug yang paling berdampak ke penonton (16/18 baris teks hilang).
- [ ] Tambahkan minimal 1 caption/label yang merepresentasikan guardrail wildcard+credential (poin 5 plan §4) agar pesan teknis plan benar-benar tersampaikan di animasi.
- [ ] Update header status `CORS_PLAN.md` dan checklist §5 supaya tidak menyesatkan (saat ini masih tercatat "Draft" semua padahal kode sudah first pass).
- [ ] Lakukan preview manual `npm run dev` satu loop penuh, lalu export MP4/audio — checklist plan §5 poin 6 baru bisa dicentang sah setelah ini.
- [ ] Setelah caption diperbaiki dan preview lolos, baru pertimbangkan folder `revisi/` baru khusus "revisi-03-caption-fix" bila diperlukan pemisahan scope dari audit ini.
