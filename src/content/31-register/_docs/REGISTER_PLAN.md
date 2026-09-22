# Register Account — Rencana Cerita Animasi

> **Status:** 📝 PLAN ONLY / Draft
> **Terakhir diperbarui:** 2026-09-12
> Tidak ada implementasi, registry entry, atau aset dibuat oleh plan ini.

## 1. Peran di Seri

Topic 19 menjawab pertanyaan yang sengaja tidak dimasukkan ke Authentication:
bagaimana akun pertama kali dibuat? Raka belum punya catatan di Gedung Arsip.
Ia mengisi data seperlunya, sistem memvalidasi, password disimpan sebagai hash
plus salt, lalu akun masih Pending sampai kepemilikan email terbukti.

**Janji audiens:** register bukan sekadar menyalin form ke database. Input
divalidasi, password tidak disimpan asli, dan akun belum aktif sepenuhnya.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | register / src/content/19-register/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ±42 detik: intro + 4 Act |
| Kategori | Developer Tools |
| Warna rencana | #A78BFA |
| Handoff | amplop email verifikasi menuju topic 20 |

## 2. State Contract

| State | Terlihat | Belum terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | Raka, loket, buku anggota kosong | akun aktif/record | memilih daftar | form terbuka |
| S1 | nama, email, password, aturan input | record akun | submit | validasi berjalan |
| S2 | input invalid atau email sudah dipakai | akun aktif | input lolos | hash + salt dibuat |
| S3 | record nama/email + hash | email verified | record tersimpan | status Pending |
| S4 | amplop menuju inbox | akun aktif | email dikirim | handoff topic 20 |

## 3. Storyboard — Empat Act

### Act 1 — Belum Ada di Buku Anggota (±8 dtk)

Raka tiba; slot namanya masih kosong. Pintu login belum dapat dibuka, sehingga
petugas menunjuk loket daftar.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Akun belum ada | slot buku kosong |
| Tegangan | Login belum mungkin | pintu menolak lembut |
| Titik balik | Data diperlukan | form muncul dari loket |
| Payoff | Pendaftaran dimulai | Raka mengisi form |

### Act 2 — Form Harus Masuk Akal (±10 dtk)

Nama, email, dan password tampil sebagai input. Format email salah dan email
yang sudah dipakai adalah dua sebab berbeda; keduanya tidak membuat record.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Isi data dasar | field muncul bertahap |
| Tegangan | Data belum valid | format email retak |
| Titik balik | Email sudah terdaftar | buku menunjukkan record lama |
| Payoff | Data siap diproses | email valid belum ada dipilih |

### Act 3 — Password Tidak Ikut Disimpan (±13 dtk)

Password dan salt unik masuk mesin hash. Buku anggota menerima hash + salt,
bukan teks password. Record baru berstatus Pending.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Password tetap rahasia | slip hanya di mesin |
| Tegangan | Teks asli berbahaya | buku plaintext disingkirkan |
| Titik balik | Hash plus salt tersimpan | pola satu arah keluar |
| Payoff | Akun masih menunggu | record mendapat badge Pending |

### Act 4 — Buktikan Email Milikmu (±9 dtk)

Sistem mengirim amplop/token verifikasi ke inbox Raka. Amplop membuktikan
kontrol email, bukan password. Cerita berhenti sebelum amplop dibuka.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Email verifikasi dikirim | amplop lahir dari record Pending |
| Tegangan | Akun belum aktif | pintu aplikasi tetap redup |
| Titik balik | Inbox tujuan benar | amplop mengikuti jalur |
| Payoff | Bukti menunggu dibuka | amplop berhenti di inbox |

## 4. Guardrail Teknis

1. Server tetap memvalidasi input dan keunikan email/username, bukan hanya UI.
2. Password menggunakan password hash modern + salt unik; tidak plaintext atau
   encryption biasa.
3. Status Pending berarti email belum terbukti; email terkirim bukan verified.
4. Token verifikasi harus acak, sekali pakai, dan memiliki expiry.
5. Jangan mengubah Act 2 menjadi aturan umum yang membocorkan keberadaan akun
   pada endpoint sensitif.

## 5. Shell, Aset, dan Checklist

- Wajib SceneChromeV1 dan ContentBodyV1 local coordinates; no copied chrome.
- Aktor persistent: Raka, loket, buku, record. Form morph menjadi record,
  bukan unmount lalu spawn.
- Inline SVG: form, record, buku, mesin hash, amplop, dan jalur.
- Teks deklaratif ≤5 kata, dekat objek; tanpa emoji, pertanyaan, atau caption bar.

- [ ] **Draft** — Approve state, guardrail, dan storyboard.
- [ ] **Draft** — Buat Animation.jsx, data.js, manifest.js.
- [ ] **Draft** — Implementasikan intro dan Act 1–4 dengan time cursor.
- [ ] **Draft** — Audit asset/SFX, dead field, no teleport, safe zone.
- [ ] **Draft** — Preview/export sebelum registry coming-soon.

**Non-goals:** OAuth/social sign-in, CAPTCHA, UI library spesifik, atau
implementasi kode pada tahap plan ini.
