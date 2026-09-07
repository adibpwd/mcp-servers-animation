# Plan — Hapus Emoji dari Speech Bubble & Teks Animasi (Topic: Tailscale)

> **Status: SELESAI TOTAL.** Ada 2 kategori emoji yang dihapus:
> 1. **Teks unicode** di `data.js`: 🤔 (`HOOK_QUESTION`, Act 1), 👀
>    (`HOOK_CLIFFHANGER`, Act 1), ⏳ (`HOLEPUNCH_TENSION`, Act 4).
> 2. **Icon PNG bergaya emoji** (`FaceReact` component) — sempat kelewat
>    di scan teks karena wujudnya gambar (`face-surprised.png` di Act 1,
>    nempel di `speechBubble1`; `face-happy.png` di Act 5, dekat closing
>    card). Ketauan pas user lapor emoji "masih muncul" walau teks sudah
>    bersih & server sudah dikonfirmasi ngirim versi bersih (curl langsung
>    ke dev server). Komponen `FaceReact` beserta semua pemanggilnya
>    (timeline trigger `popIn` & render block JSX) sudah dihapus total
>    dari `Animation.jsx` — dikonfirmasi user pilih hapus di kedua Act.
> Vite config juga sudah dibenerin (`watch.usePolling`) supaya HMR di
> Docker gak perlu restart tiap edit file source.
>
> **Tambahan #2 (konfirmasi user):** komponen `TextBox` (bekas
> `SpeechBubble`) di Act 1 & Act 3 dihapus TOTAL — bukan cuma ekornya,
> tapi seluruh kotak dialognya. Alasan user: sudah ada caption bar di
> atas (`{caption}`, di-set via fungsi `say()`) yang menampilkan teks
> yang sama (`HOOK_QUESTION` & `COORD_QUESTION`), jadi kotak dialog jadi
> redundan. Yang dihapus: render block JSX (`<g>` wrapper + `<TextBox>`),
> trigger `popIn('speechBubble1'/'speechBubble2', ...)`, dan definisi
> komponen `TextBox` itu sendiri. Fungsi `say(tl, ..., HOOK_QUESTION)` &
> `say(tl, ..., COORD_QUESTION)` TETAP dipertahankan karena itu yang
> ngisi caption bar di atas — bukan bagian dari dialog box yang dihapus.

## Latar Belakang

Topic `tailscale` masih punya emoji tertanam di beberapa string teks yang
dirender langsung ke animasi (bukan cuma di dokumentasi). Salah satunya
muncul di dalam komponen `SpeechBubble` (bubble gaya "orang mikir/ngomong")
di Act 1. Emoji ini perlu dihapus supaya visual lebih bersih & konsisten
dengan topic lain (yang sejauh ini tidak pakai emoji di teks produksi).

## Hasil Audit (grep emoji di seluruh folder `src/content/tailscale/`)

| File | Baris | Emoji | Konteks Render |
|---|---|---|---|
| `data.js` | 81 | 🤔 | `HOOK_QUESTION` → dirender di `SpeechBubble1` (Act 1, "hook") |
| `data.js` | 82 | 👀 | `HOOK_CLIFFHANGER` → dirender di cliffhanger box biasa (Act 1) |
| `_docs/TAILSCALE_PLAN.md` | 61, 63 | 🚫 🤔 | Dokumentasi draft plan, TIDAK dirender ke user |
| `revision/*.md` (banyak file) | — | ✅ ❌ ⚠️ 🎯 📋 dst | Checklist/status marker dokumentasi internal, TIDAK dirender ke user |

**Kesimpulan:** hanya 2 string di `data.js` yang benar-benar tampil di
animasi dan mengandung emoji. Sisanya murni penanda status di file
markdown internal (tidak masuk output animasi).


## Scope

**In scope (default, dieksekusi):**
- `src/content/tailscale/data.js` → `HOOK_QUESTION`, `HOOK_CLIFFHANGER`

**Out of scope (default, TIDAK disentuh kecuali dikonfirmasi):**
- `_docs/TAILSCALE_PLAN.md` (emoji di draft plan lama)
- `revision/*.md` (checklist ✅/❌/⚠️ dipakai sebagai status marker progres,
  bukan bagian dari animasi — menghapusnya bisa bikin dokumen historis
  jadi susah dibaca)

## Task Planning Hierarchy

1. Phase 1: Audit & Konfirmasi Scope
   1.1. Audit seluruh file topic `tailscale` untuk emoji
      1.1.1. Scan `data.js`, `Animation.jsx`, `manifest.js` (kode produksi)
      1.1.2. Scan `_docs/` dan `revision/*.md` (dokumentasi internal)
   1.2. Konfirmasi scope final ke user: apakah cuma teks produksi, atau
        termasuk dokumentasi juga
2. Phase 2: Revisi Teks Produksi (`data.js`)
   2.1. `HOOK_QUESTION` (dirender di `SpeechBubble1`, Act 1)
      2.1.1. Hapus emoji 🤔 di akhir kalimat
      2.1.2. Rapikan spasi/tanda baca sisa (hilangkan trailing space)
   2.2. `HOOK_CLIFFHANGER` (dirender di cliffhanger box, Act 1)
      2.2.1. Hapus emoji 👀 di akhir kalimat
      2.2.2. Rapikan spasi/tanda baca sisa
   2.3. Verifikasi tidak ada emoji lain tersisa di `data.js`
        (`COORD_QUESTION`, `HOLEPUNCH_TENSION`, `RELAY_TENSION`, dst —
        hasil audit menunjukkan sudah bersih)

3. Phase 3: Regression Check `Animation.jsx`
   3.1. Cek `SpeechBubble` component (baris ~470) — pastikan `wrapText`
        tetap wrap dengan baik setelah panjang string berubah (lebih
        pendek tanpa emoji)
   3.2. Cek `FaceReact` component — pakai PNG icon
        (`face-surprised.png` / `face-happy.png`), BUKAN emoji unicode,
        jadi tidak perlu diubah sama sekali
   3.3. Pastikan tidak ada import/reference lain ke string yang direvisi
        (cek `say(tl, ..., HOOK_QUESTION)` & `say(tl, ..., HOOK_CLIFFHANGER)`
        di baris 219 & sekitar — cuma dipakai untuk trigger animasi teks,
        aman)
4. Phase 4 (Opsional — nunggu konfirmasi user): Dokumentasi Internal
   4.1. `_docs/TAILSCALE_PLAN.md` — putuskan apakah emoji di draft plan
        lama ikut dibersihkan
   4.2. `revision/*.md` — checklist ✅/❌/⚠️ **direkomendasikan tetap
        dipertahankan** karena berfungsi sebagai status marker progres
        historis, bukan konten yang tampil ke penonton animasi
5. Phase 5: Testing & Verifikasi Visual
   5.1. Jalankan dev server (`npm run dev`), play animasi Act 1
   5.2. Pastikan `SpeechBubble1` (hook question) & cliffhanger box tampil
        rapi tanpa emoji, tidak ada sisa spasi ganda/tanda baca aneh
   5.3. Re-grep emoji di `data.js` untuk pastikan sudah bersih total

## File yang Diubah

- `src/content/tailscale/data.js`
  - `HOOK_QUESTION` (baris 81)
  - `HOOK_CLIFFHANGER` (baris 82)

## Catatan

- `FaceReact` pakai PNG icon, bukan emoji — tidak termasuk revisi ini.
- Emoji di dokumentasi (`_docs/`, `revision/*.md`) sengaja dipisah sebagai
  Phase opsional karena fungsinya beda (checklist internal, bukan output
  visual) — jangan dihapus otomatis tanpa konfirmasi eksplisit.
