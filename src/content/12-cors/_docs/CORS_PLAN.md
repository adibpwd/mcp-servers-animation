# CORS — Rencana Cerita Animasi

> **Status:** ⚙️ Implemented (first pass, REBUILD) — sintaks & bundle PASS
> (esbuild), menunggu audit visual dan preview manual/export sebelum `ready`.
>
> **Terakhir diperbarui:** 2026-09-13
>
> REBUILD dari nol pada 2026-09-13: `manifest.js`, `data.js`, `Animation.jsx`
> ditulis ulang mengikuti storyboard di bawah, TIDAK berbasis kode lama.
> Implementasi lama beserta `revisi/2026-09-13-revisi-01..04-*.md` diarsipkan
> ke `_archive/backup-24-cors-20260913/` — catatan bug-fix di file-file revisi
> tersebut (caption mismatch, body invisible, header fade, dsb.) berlaku untuk
> kode lama dan **tidak otomatis berlaku** untuk kode rebuild ini. Registry
> entry sudah diaktifkan kembali (`status: 'coming-soon'`).

## 1. Pesan Utama

CORS bukan kunci keamanan API yang dipasang server untuk semua pemanggil. CORS
adalah aturan browser: JavaScript dari satu origin hanya dapat membaca respons
origin lain bila server mengizinkannya melalui header yang tepat.

**Janji audiens:** penonton memahami origin, preflight OPTIONS, izin method/header,
serta mengapa wildcard tidak boleh dipasangkan dengan credential.

| Keputusan | Nilai |
|---|---|
| Topic ID / folder | cors / src/content/24-cors/ |
| Format | portrait 820 × 1340, scene-ui V1 |
| Durasi | ±44 detik: intro + 4 Act |
| Kategori | Developer Tools |
| Warna rencana | #FB923C |
| Fokus | browser fetch lintas origin dan preflight |
| Closing | browser memberi respons hanya setelah izin cocok |

## 2. State Contract

| State | Terlihat | Belum terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| S0 | frontend app.example dan api.example | respons dapat dibaca | fetch dimulai | browser mengenali origin beda |
| S1 | request method/header sederhana atau non-simple | data API | request butuh izin awal | OPTIONS preflight lahir |
| S2 | OPTIONS berisi Origin, method, headers | actual request | API menjawab allow headers | browser membandingkan izin |
| S3 | allow cocok atau tidak cocok | respons tersedia untuk JS bila gagal | browser evaluasi | actual request lanjut/blok baca |
| S4 | respons API + browser gate | server data “hilang” | izin cocok | app membaca respons |

## 3. Storyboard — Empat Act

### Act 1 — Domain Berbeda, Aturan Berbeda (±9 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | App meminta data API | app.example mengirim fetch |
| Tegangan | Origin berbeda | app.example dan api.example diberi alamat berbeda |
| Titik balik | Browser menjadi penjaga | browser gate muncul di antara app dan API |
| Payoff | Browser perlu izin | request berhenti di gate |

### Act 2 — Browser Bertanya Dulu (±11 dtk)

Gunakan POST dengan Authorization header sebagai contoh non-simple request agar
preflight memiliki sebab visual jelas.

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Request membawa header khusus | POST + Authorization muncul |
| Tegangan | Izin belum diketahui | actual request disimpan di gate |
| Titik balik | OPTIONS berangkat dulu | kartu preflight ke API |
| Payoff | API menerima pertanyaan | Origin, method, header terlihat sebagai label |

### Act 3 — API Menjawab Batas Izin (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | API membaca preflight | policy shelf membuka |
| Tegangan | Izin bisa tidak cocok | method/header tak diizinkan mendapat X |
| Titik balik | Header izin dikirim | Allow-Origin, Allow-Methods, Allow-Headers kembali |
| Payoff | Browser membandingkan policy | jalur cocok hijau, jalur salah merah |

### Act 4 — Browser yang Membatasi Pembacaan (±12 dtk)

| Beat | Teks lokal | Visual |
|---|---|---|
| Setup | Izin cocok, request asli berjalan | actual POST berangkat |
| Tegangan | API tetap menerima request tertentu | server menerima packet tanpa janji browser bisa membaca |
| Titik balik | Browser membuka gate untuk JS | respons melewati browser gate |
| Payoff | Data tersedia untuk aplikasi | kartu respons masuk app.example |

Label kecil di sisi gagal: “CORS bukan auth API”. API tetap memerlukan
authentication/authorization sendiri.

## 4. Guardrail Teknis

1. Origin adalah scheme + host + port; domain mirip belum tentu same-origin.
2. CORS ditegakkan browser. Non-browser client dapat memanggil API tanpa CORS
   enforcement, sehingga CORS bukan pengganti auth/authz.
3. Preflight biasanya dipicu request non-simple; tidak semua cross-origin fetch
   selalu preflight.
4. Browser hanya mengekspos respons ke JavaScript ketika header CORS cocok.
   Jangan menyederhanakan menjadi “server tidak menerima request sama sekali”.
5. Credentialed CORS membutuhkan origin spesifik dan Allow-Credentials true;
   Access-Control-Allow-Origin wildcard tidak kompatibel dengan credential.
6. Jangan menyarankan mode no-cors sebagai solusi; responsnya opaque dan bukan
   cara memperoleh akses data API.

## 5. Shell, Aset, dan Checklist

- Wajib scene-ui V1. Tiga actor utama: app origin, browser gate, API policy
  shelf; semuanya terlihat redup sejak Act 1.
- Inline SVG: URL plaques, request cards, OPTIONS ticket, policy shelf, header
  stamps, browser gate. Actual request harus berasal dari gate yang sama.
- Motion: preflight pergi → response policy kembali → actual request; tidak ada
  actual request sebelum policy cocok pada jalur contoh.
- Copy deklaratif ≤5 kata, dekat objek, tanpa caption bar/pertanyaan/emoji.

- [x] **Approve CORS scope dan technical guardrail** — scope & guardrail teknis (§4) tidak berubah dari plan awal, dipakai apa adanya sebagai basis rebuild.
- [x] **Buat folder contract, manifest, SceneChromeV1 (REBUILD)** — `manifest.js`, `data.js` (`DEFAULT_LAYOUT_V1`), `Animation.jsx` (`IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, `ContentBodyV1`) ditulis ulang dari nol 2026-09-13; sintaks tervalidasi (`node --check`, esbuild bundle) dan registry entry aktif kembali.
- [x] **Implementasikan intro dan Act 1–4 (REBUILD)** — timeline GSAP 4 Act (popIn/popOut/travel, no-teleport pattern mengikuti referensi 17-rest-api) ditulis lengkap; **belum pernah dijalankan di browser**, jadi bug kelas revisi-03/04 pada kode lama (caption mismatch, body invisible, dsb.) belum bisa dipastikan tidak muncul lagi di kode baru ini.
- [ ] **Audit preflight cause, browser enforcement, credentials/wildcard (REBUILD)** — narasi & guardrail sudah ditulis di data.js/Animation.jsx sesuai §3–4, tapi verifikasi visual di preview manual belum dilakukan.
- [ ] **Audit asset/SFX, no teleport, collision, dead field (REBUILD)** — belum dilakukan sama sekali untuk kode rebuild ini (audit SFX/loudness revisi-01 berlaku untuk kode lama, bukan kode ini).
- [ ] **Preview/export sebelum registry coming-soon** — registry sudah `coming-soon`; sintaks & bundle esbuild PASS, tapi preview manual `npm run dev` dan export MP4/audio **masih belum dilakukan** — build/bundle check bukan pengganti preview visual/audio manual.

**Rujukan teknis:** MDN CORS Guide.
