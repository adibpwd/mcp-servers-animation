# HTTPS dan TLS — Rencana Cerita Animasi

> **Status:** ✅ FIRST PASS SELESAI (2026-09-12) — manifest, data, dan
> Animation (timeline 4 Act + render JSX ContentBodyV1, koordinat lokal)
> diimplementasikan; registry = coming-soon sampai preview manual & export
> MP4 lolos (lihat Checklist Eksekusi §5). Status awal: 📝 PLAN ONLY.
>
> **Terakhir diperbarui:** 2026-09-12
>
> Tidak ini merupakan konfigurasi server/sertifikat nyata — murni konten animasi
> (mental model TLS 1.3), file implementasi: manifest.js + data.js + Animation.jsx.

## 1. Pesan Utama

HTTPS bukan “website diberi gembok”. HTTPS adalah HTTP yang berjalan melalui
TLS: browser memeriksa identitas server, kedua pihak membentuk kunci sesi, lalu
permintaan HTTP terlindungi dari penyadapan dan perubahan di perjalanan.

**Janji audiens:** penonton paham gembok tidak menyembunyikan domain/semua
metadata, sertifikat bukan enkripsi data itu sendiri, dan TLS tidak otomatis
membuat website tepercaya atau bebas phishing.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | https-tls / src/content/23-https-tls/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ±46 detik: intro + 4 Act |
| Kategori | Developer Tools |
| Warna rencana | #34D399 |
| Fokus | TLS 1.3 mental model, bukan transcript byte-level |
| Closing | request HTTP masuk terowongan terkunci |

## 2. State Contract

| State | Terlihat | Belum terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | Browser Adib, server, kabel publik | plaintext aman, session key | buka https URL | handshake dimulai |
| S1 | Client hello dan pilihan keamanan | data HTTP terlindungi | server menjawab | certificate hadir |
| S2 | certificate chain dan nama domain | session key/data | browser memvalidasi | server terbukti/diblock |
| S3 | dua bahan kunci + handshake selesai | isi request terbuka | key agreement selesai | kunci sesi bersama |
| S4 | HTTP request dalam capsule | penyerang membaca/mengubah isi | request melintas | server menerima data terlindungi |

## 3. Storyboard — Empat Act

### Act 1 — Internet Jalan Umum (±9 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | HTTP melewati jalan umum | surat HTTP bergerak pada kabel terbuka |
| Tegangan | Isi mudah diintip | pengintip melihat teks request |
| Titik balik | Browser memilih HTTPS | browser membuat tiket handshake |
| Payoff | Percakapan aman dimulai | jalan berubah menjadi gerbang TLS |

### Act 2 — Browser Memeriksa Server (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Server mengirim sertifikat | certificate chain keluar dari server |
| Tegangan | Nama harus cocok | browser membandingkan domain dengan certificate |
| Titik balik | Tanda tangan dipercaya | jalur CA → certificate → browser menyala |
| Payoff | Server terverifikasi | impostor server tetap mendapat X |

### Act 3 — Kunci Sesi Dibentuk Bersama (±13 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Kedua sisi memberi bahan rahasia | dua keping key agreement bergerak |
| Tegangan | Kunci tidak dikirim utuh | paket “session key” palsu dipantulkan |
| Titik balik | Rahasia bersama terbentuk | dua bahan merge di dalam masing-masing sisi |
| Payoff | Terowongan siap dipakai | kedua sisi memegang kunci sesi identik |

### Act 4 — HTTP Kini di Dalam TLS (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Request masuk capsule | GET/profile masuk kapsul |
| Tegangan | Penyerang melihat paket luar | pengintip hanya melihat bentuk/arah packet |
| Titik balik | Isi dan perubahan terlindungi | kunci menutup capsule + integrity seal |
| Payoff | Server membaca request asli | server membuka capsule dengan kunci sesi |

## 4. Guardrail Teknis

1. TLS menyediakan confidentiality dan integrity, serta autentikasi server
   berbasis sertifikat pada alur umum; client certificate bersifat opsional.
2. Certificate membuktikan kepemilikan kunci/identitas server dalam rantai
   kepercayaan; ia bukan kunci sesi dan bukan jaminan situs tidak berbahaya.
3. TLS 1.3 membuat key material melalui authenticated key exchange; jangan
   menggambar session key sebagai kunci yang dikirim mentah lewat internet.
4. HTTPS tidak menyembunyikan semua metadata. Nama domain/SNI, IP, ukuran, dan
   timing dapat tetap terlihat bergantung konteks; visual hanya mengunci isi HTTP.
5. Gembok browser berarti koneksi ke domain tersebut terlindungi, bukan bahwa
   semua konten atau identitas bisnis pasti aman.

## 5. Shell, Aset, dan Checklist

- Wajib scene-ui V1; body dibagi Browser, Public Transit, Server dengan margin
  safe zone. Certificate, chain, key material, capsule, dan pengintip inline SVG.
- Aktor persistent: browser, server, jalan publik, handshake ticket. Jalan
  terbuka morph menjadi tunnel; request tidak teleport.
- Copy deklaratif ≤5 kata. Satu master GSAP timeline; ambient traffic di-kill
  per Act; export safety memakai expose timeline + flushSync.

- [x] **Draft** — Approve TLS 1.3 mental model dan guardrail.
- [x] **First pass** — Manifest, data (layout lokal), Animation: intro + Act 1–4
  (scene-ui V1 ContentBodyV1; keputusan seri: SceneChromeV1 TIDAK dipakai,
  sama seperti 18-auth, supaya tidak ada chrome dobel).
- [x] **First pass** — Implementasikan intro dan Act 1–4.
- [ ] **Audit** — Audit certificate/key/session distinction dan metadata claim
  (guardrail §4: pengintip hanya melihat bentuk/arah paket — isi terkunci).
- [ ] **Preview/export** — Preview manual & export MP4 sebelum registry ready.

**Rujukan teknis:** RFC 8446.
