# Forgot Password — Rencana Cerita Animasi

> **Status:** 📝 PLAN ONLY / Draft
> **Terakhir diperbarui:** 2026-09-12
> Tidak ada implementasi, reset akun nyata, registry entry, atau aset baru.

## 1. Peran di Seri

Topic 21 menangani Adib yang lupa password. Sistem tidak “memberi tahu”
password lama: ia memverifikasi kontrol inbox, mengirim token reset sementara,
lalu menyimpan hash password baru. Token bekas dan session lama ditutup sesuai
kebijakan keamanan.

**Janji audiens:** bedakan login gagal dan password reset; link reset bukan
password; token harus pendek umur dan sekali pakai; recovery tidak seharusnya
membocorkan apakah email ada di sistem.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | forgot-password / src/content/21-forgot-password/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ~29-30 detik/loop: intro ~1s + 4 Act ~27.8s + repeatDelay 1.2s (revisi-04 §4.4: disamakan ke runtime aktual, target ±45s lama sudah tidak dipakai) |
| Kategori | Developer Tools |
| Warna rencana | #FBBF24 |
| Prasyarat cerita | email Adib sudah Verified (topic 20) |
| Closing | login menggunakan password baru, tanpa reveal password lama |

## 2. State Contract

| State | Terlihat | Belum terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | Adib lupa, record aman | password lama/token | pilih recovery | form terbuka |
| S1 | email + respons generik | email pasti terdaftar | submit | respons sama untuk semua input |
| S2 | token reset ke inbox bila cocok | password baru aktif | inbox dikuasai | token tiba |
| S3 | token valid + form baru | hash baru | token/expiry cocok | password masuk hash |
| S4 | hash baru, token habis, session lama tutup | password lama/token aktif | update selesai | login baru berhasil |

## 3. Storyboard — Empat Act

### Act 1 — Password Lama Tidak Dibuka Lagi (±9 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Password terlupa | Adib berhenti di login |
| Tegangan | Password lama tidak disimpan | record hanya berisi hash |
| Titik balik | Jalur pemulihan tersedia | papan recovery menyala |
| Payoff | Bukti baru diperlukan | Adib ke form recovery |

### Act 2 — Permintaan Tidak Membocorkan Akun (±9 dtk)

Dua input email menerima respons generik yang sama; hanya record yang cocok
diam-diam dapat menghasilkan token internal. Visual menjelaskan anti-enumeration
tanpa menjanjikan semua produk selalu memakai UI yang identik.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Masukkan email pemulihan | field muncul |
| Tegangan | Akun tidak diumumkan | dua jalur respons sama |
| Titik balik | Token dibuat diam-diam | record cocok menyalakan token |
| Payoff | Instruksi menuju inbox | amplop recovery bergerak |

### Act 3 — Link Reset Hanya Sementara (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Link reset diterima | amplop membuka token + jam |
| Tegangan | Link bisa kadaluarsa | cabang expiry mendapat X |
| Titik balik | Token cocok sekali | jalur valid ke form baru |
| Payoff | Password baru boleh dibuat | token dikunci saat form terbuka |

### Act 4 — Hash Baru Menggantikan Lama (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Buat password baru | slip masuk mesin hash |
| Tegangan | Token tidak berulang | token bekas dicoret |
| Titik balik | Hash baru tersimpan | record lama morph ke hash + salt baru |
| Payoff | Masuk dengan bukti baru | verifier cocok membuka login |

## 4. Guardrail, Shell, dan Checklist

1. Sistem tidak dapat dan tidak boleh mengirim password lama; record adalah
   hash/verifier, bukan teks asli.
2. Respons recovery generik mengurangi account enumeration.
3. Token reset acak, sekali pakai, pendek umur, dan tidak tampil mentah.
4. Password baru di-hash + salt; link tidak mengubah password tanpa input baru.
5. Invalidate session/token lama setelah reset adalah kebijakan keamanan umum.
6. Rate limit, anti-abuse, dan notifikasi cukup badge kecil agar cerita fokus.

- Wajib scene-ui V1 dan safe-area audit.
- Aktor persistent: Adib, record, inbox, token, login. Hash lama morph ke baru.
- Inline SVG: hash, token/jam, amplop, jalur, mesin hash, lock/session.
- Satu master GSAP time cursor; expose timeline + flushSync; kill ambient loop.
- Uji manual: account exists/non-exists, expired, used-token, dan success
  tanpa password asli terlihat pada frame mana pun.

- [x] Approve state contract dan policy keamanan.
- [x] Buat Animation.jsx, data.js, manifest.js.
- [x] Terapkan scene-ui V1 dan Act 1–4 (revisi-03).
- [x] Audit no teleport hash/token/session, copy, asset/SFX, collision
      (revisi-04: identity parity Adib, token travel inbox→gerbang,
      caption sessionClosed diperbaiki).
- [ ] **Belum** — Preview manual & export MP4 sebelum registry coming-soon.

**Non-goals:** MFA lengkap, support desk, pengiriman reset email, atau kode
pada tahap plan ini.

## 5. Catatan Implementasi — Intro/Header Scene UI V1 (revisi-03)

Intro dan header sudah mengikuti kontrak Scene UI V1 secara penuh
(`revisi/2026-09-13-revisi-03-intro-header-v1-standard.md`, dieksekusi
2026-09-13): satu `IntroHeaderMorphV1` sebagai satu-satunya sumber header,
dimount sejak `headerOpacity > 0` (bukan digate `contentStarted`), hero dua
baris (`titleLines`: FORGOT / PASSWORD) yang crossfade ke compact header
satu baris, dan warna judul mengikuti standar (FORGOT = `COLORS.RECORD`
sky, PASSWORD = `COLORS.SUCCESS` emerald — bukan lagi amber/ungu token).
Tidak ada lagi fallback header manual duplikat.
