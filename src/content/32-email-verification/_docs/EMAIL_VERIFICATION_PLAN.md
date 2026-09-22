# Email Verification — Rencana Cerita Animasi

> **Status:** 📝 PLAN ONLY / Draft
> **Terakhir diperbarui:** 2026-09-12
> Tidak mengubah topic 19, 18, registry, atau implementasi apa pun.

## 1. Peran di Seri

Topic 20 meneruskan amplop Pending dari Register. Raka membuktikan bahwa ia
menguasai inbox yang didaftarkan. Token valid mengubah record Pending menjadi
Verified. Ini bukan login dan bukan reset password.

**Janji audiens:** alamat yang diketik berbeda dari email yang benar-benar
dikuasai; token verifikasi adalah bukti sementara, sekali pakai, dan berekspirasi.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | email-verification / src/content/20-email-verification/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ±38 detik: intro + 4 Act |
| Kategori | Developer Tools |
| Warna rencana | #22D3EE |
| Payoff | akun Verified siap login ke topic 18 |

## 2. State dan Continuity Contract

| State | Terlihat | Belum terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | record Pending, amplop inbox | badge Verified | buka inbox | token terlihat |
| S1 | token/tautan + jam expiry | akun aktif | buka tautan | token ke gerbang |
| S2 | token dan record verifikasi | cap sukses | cocok, aktif | token dikonsumsi |
| S3 | record Pending → Verified | token bisa ulang | update sukses | token dicoret |
| S4 | pintu login menyala | login sukses | Raka berjalan | handoff Auth |

Aktor persistent: Raka, amplop, record akun, jalur inbox → gerbang. Amplop
berubah menjadi token lalu cap Verified secara handoff terlihat, tanpa teleport.

## 3. Storyboard — Empat Act

### Act 1 — Alamat Ditulis Belum Cukup (±8 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Akun masih menunggu | record Pending bernapas |
| Tegangan | Alamat belum terbukti | pintu login terkunci |
| Titik balik | Amplop tiba di inbox | jalur record → inbox menyala |
| Payoff | Bukti ada di inbox | Raka mengambil amplop |

### Act 2 — Tautan Membawa Bukti Sementara (±9 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Tautan dibuat khusus | token muncul dari amplop |
| Tegangan | Bukti punya batas waktu | jam expiry bergerak |
| Titik balik | Raka membuka tautan | token menuju gerbang |
| Payoff | Bukti sampai sistem | gerbang menahan token untuk cek |

### Act 3 — Token Dicek Sekali (±11 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Token diperiksa | token bertemu record |
| Tegangan | Token bisa kadaluarsa | cabang expiry mendapat X |
| Titik balik | Token cocok dan aktif | jalur valid hijau |
| Payoff | Token langsung dikonsumsi | token menjadi cap sekali pakai |

### Act 4 — Status Akun Berubah (±8 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Token sudah dipakai | token bekas hilang |
| Tegangan | Bukti tidak berulang | percobaan kedua mendapat X |
| Titik balik | Email berhasil terbukti | record mendapat cap Verified |
| Payoff | Akun siap masuk | Raka ke pintu login menyala |

## 4. Guardrail, Shell, dan Checklist

1. Email verification membuktikan kontrol inbox, bukan identitas dunia nyata.
2. Token harus acak, sekali pakai, berumur pendek, dan tidak tampil mentah.
3. Resend token membatalkan/menyaingi token lama; cukup badge kecil, bukan Act.
4. Verifikasi email tidak selalu otomatis membuat session login.

- Wajib scene-ui V1, local body coordinate, safe-area debug.
- Inline SVG: amplop, token, jam, record, gerbang, jalur, dan cap.
- Motion cerita amplop → token → gerbang → cap; ambient inbox/jam di-kill
  setiap Act berubah.
- Copy deklaratif ≤5 kata, dekat objek, tanpa caption bar/pertanyaan.

- [ ] **Draft** — Approve contract dan guardrail.
- [ ] **Draft** — Buat folder contract: Animation.jsx, data.js, manifest.js.
- [ ] **Draft** — Implementasikan intro dan empat Act.
- [ ] **Draft** — Audit expiry, once-use, handoff, asset/SFX, no teleport.
- [ ] **Draft** — Preview/export sebelum registry coming-soon.

**Non-goals:** konfigurasi SMTP/provider atau implementasi pengiriman email.
