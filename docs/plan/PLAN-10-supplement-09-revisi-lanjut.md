# PLAN-10: Supplement PLAN-09 — Temuan Baru dari Revisi 10–14

**Tujuan plan ini:** Melengkapi `PLAN-09-standar-pembuatan-konten.md` dengan
pola masalah tambahan yang ditemukan di revisi-10 sampai revisi-14 topic
`14-http-request-response`. Plan ini TIDAK berdiri sendiri — harus dibaca
bersama PLAN-09.

**Status:** 📋 PLAN SAJA — belum eksekusi penulisan doc final.

**Kaitannya dengan PLAN-09:**
- PLAN-09: Fondasi utama (analisis revisi-01 s/d revisi-09), sudah sangat lengkap.
- PLAN-10 ini: Supplement/tambahan dari revisi-10 s/d revisi-14 yang tidak tercakup.
- Saat eksekusi, kedua plan ini digabung menjadi `docs/standardizations/03-planning-storytelling-quality-gate.md`.

**Akan ditaruh di:** `docs/standardizations/03-planning-storytelling-quality-gate.md`
(digabung dengan isi PLAN-09 — bukan jadi doc terpisah)

---

## Ringkasan Temuan Baru (Revisi 10–14)

| Revisi | Masalah yang Ditemukan | Kategori Baru |
|---|---|---|
| revisi-10 | `PHASES[].caption` tidak pernah dirender tapi tidak ditandai "dead field" | G. Dead Field Audit |
| revisi-10 | Semua caption memakai kalimat tanya — padahal AI adalah guru yang menjelaskan | Perluasan §A Narasi (sudah ada di PLAN-09, tapi butuh aturan lebih tegas) |
| revisi-11 | Analogi "Browser = Tukang Pos" salah — tukang pos one-way, browser two-way | H. Validasi Aktor Analogi |
| revisi-11 | HTML/JS/CSS "tiba-tiba muncul di browser" tanpa konteks dari mana asalnya | Perluasan §E Struktur Act |
| revisi-12 | FlowchartSpine dimulai dari node tengah, bukan dari node awal Act 1 | Sudah ada di §F PLAN-09, butuh contoh konkret ditambah |
| revisi-13 | Face (muka) di browser & server mengganggu visual — tidak menambah kejelasan | I. Visual Noise Audit |
| revisi-13 | Rect overlay pintu di atas server-building PNG mengaburkan bentuk server | I. Visual Noise Audit |
| revisi-13 | Amplop request tidak di-popOut setelah "masuk server" — kelihatan nempel | Perluasan §C Layout PLAN-09 |
| revisi-14 | Amplop request di-morph naik ke y=330 padahal narasi menyatakan sudah berangkat | J. Konsistensi Arah Gerak |
| revisi-14 | Teks (methodBadge, addressLabel) posisi hardcode, tidak mengikuti posisi amplop | K. Teks Mengikuti Posisi Elemen |
| revisi-14 | DNS hanya label, tidak ada visual "keputusan routing" ke server mana | L. Node Intermediary sebagai Gerbang |

---
