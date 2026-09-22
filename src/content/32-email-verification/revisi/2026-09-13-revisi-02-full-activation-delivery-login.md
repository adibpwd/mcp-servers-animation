# Revisi-02: Email Verification sampai Login Berhasil — 20-email-verification

> **Status:** 📝 PLAN ONLY / Draft
>
> **Tanggal:** 2026-09-13
>
> **Scope:** rombak cerita, state, layout body, dan timeline content 20 saja.
> Tidak ada implementasi pada revisi plan ini.

## 1. Masalah dan Hasil untuk Audiens

Versi saat ini mulai ketika amplop sudah ada di inbox. Audiens tidak melihat
kenapa user perlu membuka email, kenapa login awal gagal, siapa yang mengirim
email dari aplikasi, serta mengapa baru setelah link diklik login berhasil.

Revisi ini membuat alur utuh:

**login ditolak karena email belum aktif → server membuat link verifikasi →
Email Delivery Provider mengirim via jalur SMTP/delivery → inbox → klik link
→ token valid mengaktifkan email → login ulang berhasil.**

Setelah menonton, audiens dapat menjelaskan bahwa email verification
membuktikan kontrol inbox, bukan password; backend menyerahkan pesan kepada
layanan pengiriman email; link bertoken sekali pakai dan bermasa berlaku; dan
akun Pending baru boleh login setelah status berubah menjadi Verified.

## 2. Keputusan Cerita

| Keputusan | Nilai |
|---|---|
| Tokoh | Adib |
| Bukti verifikasi | Link bertoken, bukan OTP sebagai jalur utama |
| Alasan login gagal | email_verified false, bukan password salah |
| Pengirim email | Email Delivery Provider, pihak ketiga pengirim email |
| SMTP | Jalur/protokol pengiriman dari aplikasi ke provider, bukan tutorial command SMTP |
| Keberhasilan akhir | Adib login ulang dan aplikasi terbuka |
| Struktur | 4 Act, ±49–52 detik |
| Expired link | Cabang singkat di Act 3, bukan jalur utama |
| Resend | Micro-label opsional, bukan alur kedua |

Ini adalah kebijakan aplikasi dalam cerita. Produk nyata dapat memilih akses
terbatas untuk akun unverified; plan tidak mengklaim semua aplikasi wajib
memblokir login.

## 3. State Contract Baru

| State | Terlihat | Belum terlihat | Pemicu | Hasil fisik |
|---|---|---|---|---|
| S0 login pending | Adib, form login, account record Pending, app door | inbox/link/token, aplikasi terbuka | Adib tekan Login | server cek password dan email |
| S1 block aktivasi | password check, field email_verified X | session/login success | status Pending ditemukan | pesan aktivasi dan tombol kirim link |
| S2 email dispatch | server, token record mask, email job, provider, SMTP route | email di inbox | server membuat token/job | provider menerima lalu deliver |
| S3 inbox/link | inbox, email link, expiry, verification gate | Verified/session | Adib klik link | token valid dikonsumsi |
| S4 login verified | record Verified, form sama, app door | token aktif/password lama | Adib login ulang | session terbit, app terbuka |

Aturan sebab-akibat: email tidak boleh muncul di inbox sebelum provider menerima
job; record tidak boleh Verified sebelum token tiba di gate dan lolos cek; app
tidak boleh terbuka sebelum login ulang pada Act 4.

## 4. Kontrak Aksi dan Continuity

| Aksi | Benda visual | Dari → ke | Efek |
|---|---|---|---|
| Login awal | credential slip | Adib → App Server | password verifier check |
| Cek aktivasi | Pending badge | App Server → account record | email_verified ditolak, session tidak terbit |
| Minta link | command Kirim link | Adib/App → App Server | token record dibuat |
| Submit pesan | email job: recipient + link mask | App Server → Delivery Provider | provider menerima tugas |
| Deliver email | amplop | provider → Inbox Adib | email muncul |
| Buka link | link token mask | Inbox → Verification Endpoint | token/expiry dicek |
| Konsumsi token | token + record | endpoint → record | token invalid setelah pakai; record Verified |
| Login ulang | credential slip sama | Adib → App Server | session terbit, app door terbuka |

Aktor persistent: Adib, App Server, account record, dan app door. Email job
harus morph menjadi amplop; link menjadi spent stamp lalu session ticket lewat
handoff terlihat. Provider Delivery sudah muncul redup sejak Act 1.

## 5. Storyboard — Empat Act

### Act 1 — Password Benar, Email Belum Aktif (±12 dtk)

| Beat | Cerita/visual | Teks lokal | Exit |
|---|---|---|---|
| Setup | Adib kirim password pada login form; server dan record Pending terlihat redup. | Password diperiksa | credential sampai server |
| Tegangan | Password check hijau, tetapi email_verified pada record tetap Pending/X. | Email belum aktif | fokus pindah ke badge Pending |
| Titik balik | Server menahan session; app door tetap terkunci. | Aktivasi diperlukan | session ticket redup/kembali |
| Payoff | Tombol Kirim link muncul dan Adib memilihnya. | Kirim link aktivasi | command sampai server |

Jangan pernah menggunakan label password salah pada Act ini.

### Act 2 — Server Menyerahkan Email untuk Dikirim (±14 dtk)

| Beat | Cerita/visual | Teks lokal | Exit |
|---|---|---|---|
| Setup | Server membuat token acak yang hanya tampak sebagai mask + expiry. | Link dibuat sekali | token record memiliki jam |
| Tegangan | Server tidak menaruh pesan langsung ke inbox Adib. | Server menyerahkan pesan | email job keluar dari server |
| Titik balik | Job melewati jalur SMTP / Email API menuju Email Delivery Provider. | Provider mengirim email | provider menerima job |
| Payoff | Provider morph job menjadi amplop dan mengantarkannya ke inbox Adib. | Email tiba di inbox | inbox menyala |

Provider mewakili layanan email transaksional dan/atau message submission SMTP.
Jangan menggambar SMTP sebagai inbox provider atau menjanjikan email nyata hanya
melewati satu server; relay/gateway dapat ada di dunia nyata.

### Act 3 — Link Diuji Sekali dan Berbatas Waktu (±13 dtk)

| Beat | Cerita/visual | Teks lokal | Exit |
|---|---|---|---|
| Setup | Adib membuka email; CTA link tampil tanpa URL/token penuh. | Buka link verifikasi | link card keluar dari amplop |
| Tegangan | Jam menunjukkan expiry; cabang expired singkat mendapat X. | Link punya batas waktu | cabang expired ditutup |
| Titik balik | Klik link membawa token mask dari inbox ke Verification Endpoint. | Token diperiksa | endpoint membandingkan token record |
| Payoff | Token cocok, aktif, lalu dikonsumsi. | Link dipakai sekali | record morph Pending → Verified |

Tidak ada session login otomatis dari verification endpoint.

### Act 4 — Login yang Sama Kini Berhasil (±11 dtk)

| Beat | Cerita/visual | Teks lokal | Exit |
|---|---|---|---|
| Setup | Record memperlihatkan email_verified hijau; app door menunggu login ulang. | Email sudah aktif | cap Verified settle |
| Tegangan | Link bekas dicoba ulang singkat dan ditolak; Adib kembali ke form. | Link bekas ditolak | jalur lama ditutup |
| Titik balik | Adib mengirim credential sama; password check dan email check hijau. | Login lolos dua cek | dua check berdampingan |
| Payoff | Server menerbitkan session ticket dan app door terbuka. | Selamat datang | ticket menuju app; ending lega |

## 6. Layout dan Scene Shell

Scene shell tetap SceneChromeV1 dan DEFAULT_LAYOUT_V1. Tidak semua panel penuh
tampil bersamaan; stage berpindah fokus dengan overlap/parallax.

| Zona body lokal | Act utama | Isi |
|---|---|---|
| y 0–210 | 1 / 4 | Adib, login form, app door, account record |
| y 210–430 | 2 | App Server dan Email Delivery Provider |
| y 420–610 | 2 / 3 | SMTP/delivery corridor, amplop bergerak |
| y 610–790 | 3 | Inbox dan Verification Endpoint |
| y 790–950 | 4 | dua check login, session ticket, final door |

Bounding box maksimum server + provider: local x 28–704, y 230–430. Audit hero,
Act 1→2, Act 2→3, Act 3→4, dan closing dengan safe-area debug.

## 7. Rencana Perubahan Data, Render, dan Aset

### data.js

- Ganti phase menjadi login-pending, email-delivery, link-check,
  login-verified; budget 12 + 14 + 13 + 11 detik.
- Tambahkan visual data: EMAIL_VERIFIED_FIELD, EMAIL_JOB, masked VERIFY_LINK,
  EXPIRY, PROVIDER, dan SESSION_TICKET.
- Hapus label/state lama yang mengasumsikan amplop sudah tersedia sejak awal.
- Jangan menaruh token atau URL asli pada data/render; pakai mask seperti
  verify…7K9.
- Audit ulang SFX_MAP setelah timeline baru; key legacy tanpa call dihapus.

### Animation.jsx

- State minimal: passwordValid, emailBlocked, sendLinkRequested, tokenIssued,
  emailJobSent, providerAccepted, mailDelivered, linkOpened, expiredBranch,
  tokenMatched, tokenSpent, recordVerified, reloginChecksPassed, sessionIssued.
- Handoff wajib: command → token record/email job → amplop → link token →
  spent stamp → session ticket.
- recordVerified hanya terjadi setelah token valid. doorLit hanya terjadi
  setelah sessionIssued pada Act 4.
- Tetap gunakan satu master timeline/time cursor, expose animation timeline
  dan flushSync. Ambient tween dibunuh tiap Act.

### Asset matrix

| Asset | Bentuk | State |
|---|---|---|
| Adib, form, app door | inline SVG | block aktivasi, login sukses |
| Account record | inline SVG | Pending → Verified |
| App Server | inline SVG | cek login, membuat job |
| Delivery Provider | inline SVG | idle, menerima, deliver |
| Job/amplop/link/token | inline SVG | job → envelope → link → spent |
| SMTP/API route | inline SVG | jalur menyala |
| Verification Endpoint | inline SVG | expired, valid, consume |
| Session ticket | inline SVG | belum terbit → terbit |

## 8. Guardrail Teknis

1. Email verification membuktikan kontrol mailbox, bukan identitas dunia nyata
   atau kekuatan password.
2. Password check dan activation check adalah keputusan berbeda; jangan
   menggambar email_verified false sebagai password salah.
3. Token harus acak, sulit ditebak, sekali pakai, time-limited, dan tidak
   tampil mentah.
4. Akun tidak aktif sebelum token valid dipresentasikan.
5. Delivery Provider hanya mengirim pesan; ia tidak memverifikasi token atau
   mengubah status account.
6. SMTP adalah protokol transfer/submission. Video hanya memodelkan delivery
   hop ringkas, bukan command SMTP.
7. Provider menerima job tidak sama dengan user membaca email; payoff delivery
   di cerita adalah amplop hadir di inbox.
8. Resend sebaiknya menyaingi token lama; rate limit, abuse, dan delivery
   failure cukup micro-label.
9. Link verification tidak otomatis berarti user authenticated; login ulang
   diperlukan sebelum session diterbitkan.
10. Log/telemetry tidak boleh merekam token atau URL penuh.

## 9. Audio

Revisi audio-01 tetap berlaku tetapi cue dipetakan ulang setelah timeline baru:

| Momen | Arah cue |
|---|---|
| Password benar → email block | confirm kecil → soft deny/lock |
| Command kirim link / token issue | tick + chime ringan |
| Job server → provider | light-swoosh-quick |
| Provider → inbox | paper-send/paper-arrive dari shared pack bila tersedia |
| Link open / expiry | paper-open + latency-tick; expired memakai deny lembut |
| Token match / spent | scan/chime → connector-snap |
| Verified / login akhir | shimmer → relief-settle |

Maksimal dua foreground cue per 0,35 detik. Pending, expired, dan successful
verification tidak boleh memakai payoff SFX yang sama. Loudness dicek mengikuti
pelajaran revisi HTTPS/TLS.

## 10. Validation Gate

- [ ] **Draft** — Setujui kontrak login pending → verification → login ulang.
- [ ] **Draft** — Update _docs plan sesudah revisi benar-benar diimplementasikan.
- [ ] **Draft** — Audit data field lama/baru: tanpa dead state atau token mentah.
- [ ] **Draft** — Audit continuity job → provider → inbox → endpoint → record → session.
- [ ] **Draft** — Audit layout Act 2 server/provider dan Act 3 inbox/gate.
- [ ] **Draft** — Audit SFX coverage, loudness, category mapping.
- [ ] **Draft** — Compile, preview satu loop, test pause/seek.
- [ ] **Draft** — Export audio; cek no empty frame, handoff, dan sync.
- [ ] **Draft** — Update README revisi dengan hasil actual setelah implementasi.

## 11. Di Luar Scope

- SMTP nyata, provider API seperti SES/Resend/SendGrid, DNS MX, DKIM/SPF/DMARC,
  queue retry, dan webhook delivery.
- OTP numeric; link bertoken adalah jalur utama agar cerita tidak terpecah.
- Password reset, MFA, OAuth, perubahan email akun, dan registry.
- Implementasi kode pada tahap plan revisi ini.

**Rujukan teknis:** [OWASP Email Validation and Verification Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html)
untuk token sekali pakai/berumur pendek dan aktivasi sesudah verifikasi;
[RFC 5321](https://www.rfc-editor.org/info/rfc5321/) untuk model SMTP relay
dan delivery.
