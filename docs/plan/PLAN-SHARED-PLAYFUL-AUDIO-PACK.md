# PLAN — Shared Playful Audio Pack

> **Status:** 📝 PLAN ONLY / Draft
>
> **Tanggal:** 2026-09-13
>
> Tujuan plan ini adalah menambah variasi SFX reusable untuk seri content
> Developer Tools tanpa mengubah topic, mengunduh, atau membuat file audio
> pada tahap ini.

## 1. Latar Belakang

Audit revisi HTTPS/TLS menemukan dua masalah yang harus dihindari untuk semua
topic berikutnya:

1. Wiring SFX saja tidak cukup; source file dapat terlalu pelan atau terlalu
   panjang sehingga cue terasa hilang.
2. Memakai POP/WHOOSH/DING yang sama di setiap motion membuat animasi terasa
   datar meski technically sudah “berbunyi”.

Pack ini menambah bunyi kecil yang ramah, cerah, dan mudah dibedakan anak muda:
surat, stempel, kunci, browser, dan data. Efek tetap membantu proses, bukan
menjadi musik latar atau bunyi lucu yang menutupi konsep keamanan.

## 2. Scope Konsumen Awal

| Asset family | Topic pemakai awal |
|---|---|
| Paper / mail | 19-register, 20-email-verification, 21-forgot-password |
| Approval / key | 22-oauth2-delegated-login, 21-forgot-password |
| Browser / request | 24-cors, 22-oauth2-delegated-login |
| UI reward | 19, 20, 21, 22, 24 |
| Security boundary | 21, 22, 24 |

HTTPS/TLS tidak menjadi target implementasi pack ini karena telah memiliki
revisi audio sendiri; asset bersama tetap boleh dipakai revisi berikutnya
setelah audit terpisah.

## 3. Kandidat Asset Baru

| Nama file rencana | Folder | Karakter / durasi | Momen | Topic |
|---|---|---|---|---|
| paper-send.wav | transitions | kertas terbang ringan, 0,3–0,5 dtk | email/token mulai jalan | 19, 20, 21 |
| paper-arrive.wav | ui | plop amplop masuk, 0,2–0,4 dtk | inbox menerima | 19, 20, 21 |
| paper-open.wav | ui | buka lipatan lembut, 0,2–0,4 dtk | amplop dibuka | 20, 21 |
| approval-stamp.wav | success | stempel kartun hangat, 0,3–0,6 dtk | consent/verified | 20, 22 |
| key-turn.wav | impacts | klik kunci pendek, 0,15–0,3 dtk | PKCE/revoke/session close | 21, 22 |
| bubble-pop.wav | ui | pop data ceria, 0,15–0,3 dtk | data respons siap dibaca | 24 |
| soft-deny.wav | warnings | penolakan lembut, bukan alarm kasar, 0,2–0,4 dtk | scope/gate tidak diizinkan | 21, 22, 24 |
| policy-scan.wav | sfx | scan dua nada, 0,3–0,5 dtk | policy/token/header diperiksa | 20, 22, 24 |

Asset existing tetap prioritas bila lulus semantik dan loudness. Kandidat baru
hanya dibuat jika scan dan preview membuktikan tidak ada pengganti yang cocok.

## 4. Arah Desain Audio

- Cerah, lembut, sedikit “toy-like”, tetapi bukan suara bayi atau meme.
- Nada pendek, jelas, tanpa dialog, voice, musik, atau efek panjang.
- Setiap family mempunyai warna sendiri: kertas = airy; approval = warm;
  key = tactile; policy = digital; deny = soft low blip.
- Hindari frekuensi tajam berulang dan bass berlebih agar aman di speaker HP.
- Tidak ada loop SFX ambient. Keheningan antara beat dipertahankan untuk
  membaca caption dan menghindari sensory overload.

## 5. Sourcing, Lisensi, dan Produksi

Urutan sumber: Kenney CC0 → Mixkit free commercial → Pixabay license →
Freesound **CC0 per file**. Catat sumber, URL, dan lisensi per asset dalam
manifest audio baru sebelum file dipakai. Jika generated internally, catat
prompt/provenance dan pastikan tidak menyerupai sound berhak cipta tertentu.

Setelah sumber dipilih:

1. Convert menjadi WAV 44.1 kHz, 16-bit.
2. Trim durasi sesuai tabel dan beri fade-in/out kecil untuk mencegah click.
3. Normalisasi secara konsisten; jangan hanya mengejar peak.
4. Ukur dengan ffprobe dan ffmpeg volumedetect. Bandingkan dengan baseline
   audibel existing: ui/pop, ui/tick, success/ding, success/shimmer.
5. Simpan memakai kebab-case pada folder kategori public/audio yang tepat.
6. Tambahkan manifest docs/audio/shared-playful-audio-pack.md (baru pada fase
   implementasi) berisi sumber, lisensi, durasi, measured loudness, dan pemakai.

## 6. Guardrail Integrasi

- Tidak ada SFX_MAP entry tanpa pemanggilan nyata.
- Panggilan harus memakai category + name dari SFX_MAP; jangan mengirim semua
  name ke helper kategori ui seperti bug yang ditemukan di CORS.
- Maksimal dua foreground cue dalam jendela 0,35 detik. Bila collision,
  cue paling kecil diberi volumeMult rendah, digeser, atau dibuang.
- Asset baru tidak otomatis dipakai semua topic; setiap topic tetap menjalani
  SFX coverage audit dan preview manual.
- Jangan memakai boost untuk menutupi source terlalu pelan pada preview; pilih
  atau normalisasi asset yang benar. Cek export-mode secara khusus.
- SFX success tidak boleh membunyikan kegagalan/pending sebagai kemenangan.

## 7. Tahap Implementasi Kelak

- [ ] **Draft** — Scan ulang public/audio untuk kandidat pengganti existing.
- [ ] **Draft** — Pilih sumber/lisensi legal per candidate dan catat provenance.
- [ ] **Draft** — Download/generate hanya asset yang lolos keputusan §3.
- [ ] **Draft** — Convert, trim, normalisasi, dan ukur loudness.
- [ ] **Draft** — Uji di speaker desktop dan speaker HP pada volume normal.
- [ ] **Draft** — Tambahkan manifest asset bersama dan update standard audio bila
      pola baru perlu jadi kontrak.
- [ ] **Draft** — Terapkan bertahap ke revision plan 19, 20, 21, 22, 24.
- [ ] **Draft** — Preview/export tiap topic dan hapus cue yang terasa berisik.

## 8. Rencana Update Standar Dokumentasi

Setelah pack dan minimal satu topic pemakai sudah lolos preview/export, update
docs/standardizations/08-audio-sfx-generation.md. Jangan mengubah standar
hanya berdasarkan asumsi plan; aturan final harus berasal dari implementasi
yang sudah didengar dan diverifikasi.

| Bagian standar | Update yang direncanakan | Tujuan |
|---|---|---|
| §2 — Scan asset existing | Tambah audit **semantik + loudness**, bukan hanya file ada atau tidak | Mencegah asset ter-wire tetapi nyaris tak terdengar |
| §3 — SFX_MAP | Wajib pakai entry object category + name saat diputar; larang helper yang memaksa semua cue ke kategori ui | Mencegah bug routing seperti CORS |
| §5 — Normalisasi | Tambah baseline loudness, pengukuran ffprobe/volumedetect, dan uji speaker HP | Cue foreground konsisten terdengar |
| §7 — Coverage audit | Tambah matriks per Act: opening, aksi/gerak, tension atau payoff, lalu alasan untuk motion silent | Topic baru tidak hanya punya pop generik atau area panjang tanpa audio |
| §7 — Variasi | Tambah aturan family: UI, travel, security, payoff; jangan reuse cue yang sama pada tiga beat berurutan tanpa alasan | Audio terasa punya karakter, tidak monoton |
| §7 — Kepadatan | Tambah batas maksimal dua foreground cue per 0,35 detik dan kebijakan silence untuk waktu baca caption | Playful tanpa sensory overload |
| §8 — Checklist commit | Tambah preview satu loop penuh + export audio, audit dead SFX_MAP, category match, dan catatan cue terlalu pelan/numpuk | Validasi tidak berhenti pada compile/wiring |

### Kontrak Baru yang Diusulkan

Setiap plan topic baru kelak mencantumkan **Audio Beat Map** singkat per Act:

| Act | Cue pembuka | Cue aksi utama | Cue emosi/payoff | Cue sengaja silent + alasan |
|---|---|---|---|---|
| Act N | asset + kategori | asset + kategori | asset + kategori | contoh: hold baca 1 dtk |

Map ini hanya rencana; implementasi wajib tetap melewati audit source,
loudness, preview, dan export. Tidak semua motion wajib punya suara, tetapi
setiap motion signifikan yang silent harus keputusan sadar, bukan kelalaian.

### Checklist Update Standar

- [ ] **Draft** — Implementasikan dan QA minimal satu topic pemakai pack.
- [ ] **Draft** — Catat hasil preview speaker desktop dan HP, termasuk cue yang
      terlalu pelan atau terlalu ramai.
- [ ] **Draft** — Update 08-audio-sfx-generation.md dengan keputusan tabel di atas.
- [ ] **Draft** — Tambah Audio Beat Map ke template plan topic kompleks di
      02-standar-konten.md dan/atau 03-tutorial-buat-topic-baru.md.
- [ ] **Draft** — Link plan pack, manifest provenance, dan contoh topic yang
      sudah lolos ke standar sebagai referensi nyata.
- [ ] **Draft** — Review ulang semua checklist agar tidak mewajibkan suara pada
      momen yang memang perlu hening.

## 9. Non-Goals

- Tidak mengunduh atau membuat audio pada plan ini.
- Tidak mengganti musik latar karena project memakai strategi SFX real-time.
- Tidak mengubah shared loader tanpa kebutuhan lintas-topic yang terbukti.
- Tidak menargetkan HTTPS/TLS revisi yang sudah ada tanpa audit baru.
