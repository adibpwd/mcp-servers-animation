# Revisi-01: Padatkan 7-Act Storyboard Menjadi 5 Act

**Tanggal:** 2026-09-18
**Status:** ✅ EKSEKUSI SELESAI — data.js + Animation.jsx ditulis penuh,
syntax valid (esbuild). BELUM preview manual di browser & BELUM export MP4.

---

## 🗣️ User Wants

`SSH_PLAN.md` memuat 2 storyboard: plan awal (4 Act, scope kecil) dan revisi
2026-09-16 (7 Act, "peta lengkap" — dinyatakan sebagai sumber kebenaran baru
kalau bertentangan dengan plan awal). User meminta eksekusi **seluruh isi**
dari plan awal sampai revisi (7 Act), tapi dipadatkan jadi **5 Act** supaya
video tidak terlalu panjang — dengan syarat eksplisit: **tanpa menghilangkan
detail**.

## Keputusan Pemadatan

Dilakukan lewat 2 merge, bukan pemotongan konten:

| Act baru (5) | Isi (dari 7-Act revisi + plan awal) |
|---|---|
| **Act 1 — Hubungi & Verifikasi Server** | 7-Act Act1 (target: client/host/port) + Act2 (host key vs known_hosts, trust) + pembentukan kanal terenkripsi (dari plan awal §Batas akurasi poin 1, tidak eksplisit jadi Act tersendiri di revisi 7-Act tapi tidak boleh hilang) |
| **Act 2 — Login vs Hak Akses** | 7-Act Act3 (authentication: password/key/certificate/MFA vs authorization: full shell/SFTP-only/restricted command) |
| **Act 3 — Satu Kanal, Banyak Mode** | 7-Act Act4 (remote shell, remote command, file transfer: SCP/SFTP/rsync/SSHFS) |
| **Act 4 — Arahkan Trafik & Jangkau Jaringan Privat** | 7-Act Act5 (local/remote/dynamic/socket forwarding) + Act6 (bastion/jump host, config alias, multiplexing) |
| **Act 5 — Operasi Aman di Skala** | 7-Act Act7 (key lifecycle, auth policy, logging/monitoring, incident response) + closing |

Tidak ada satu pun konsep dari daftar 7-Act yang dihapus — hanya
dikelompokkan ulang secara naratif. Durasi total jadi lebih panjang dari
topic biasa (~120-130s berdasarkan estimasi badge di `PHASES`, akan diukur
ulang dari timeline nyata setelah preview manual, sama seperti pola
REVISI-08 di 17-rest-api), karena kepadatan konten memang lebih tinggi dari
topic lain — dipilih tetap detail sesuai permintaan eksplisit user, bukan
dipangkas demi durasi pendek.

## Pola implementasi

- Anchor persisten (client, server, channel line) tidak pernah dihapus,
  hanya di-morph — sesuai Continuity map di `SSH_PLAN.md`.
- Daftar konsep multi-item (metode identitas, hasil otorisasi, mode kanal,
  mekanisme file transfer, mode forwarding, kartu ops) dirender **seluruhnya
  sekaligus** sebagai chip/card row — item aktif disorot (`highlightId`),
  bukan disembunyikan satu-satu. Ini cara detail dipertahankan tanpa timeline
  jadi berlebihan panjang per item.

## Penyimpangan dari checklist `SSH_PLAN.md`

- **Icon:** dipakai inline SVG, BUKAN folder `icons/` + PNG hasil pipeline
  ChatGPT seperti disebut checklist — konsisten dengan precedent 17-rest-api
  yang juga full inline SVG tanpa folder `icons/` sama sekali. Alasan
  praktis: sesi eksekusi ini tidak punya akses ke pipeline generate-icon.
- **`registry.js`:** sudah dihapus dari project sebelum sesi ini (diganti
  `resolveTopic.js` yang baca `metadata.json` per folder langsung, lihat
  `src/content/resolveTopic.js`). `manifest.js` tetap dibuat untuk
  konsistensi historis, tapi `metadata.json` adalah yang benar-benar dipakai
  UI — lihat catatan di `overview.md`/`ways-of-working.md` project memory
  yang sudah dikoreksi.

## Belum dilakukan

- Preview manual di browser (posisi/ukuran chip row untuk 4 mode forwarding
  perlu dicek — teks `risk` agak panjang untuk card 344×92).
- Export MP4 & audit SFX nyata (nama SFX dipakai ulang dari daftar yang
  sudah diaudit di 17-rest-api, belum diverifikasi ulang file-nya ada).
- Update UI content-management untuk pastikan topic 44 muncul (mengikuti
  isu serupa yang pernah terjadi di topic 15/16).
