# Revisi-04: Audit Plan vs Kode Saat Ini — 21-forgot-password

> **Status:** ✅ 6/6 temuan dieksekusi (4.1–4.6). Preview manual & export
> MP4 belum dilakukan.
>
> **Tanggal:** 2026-09-13
>
> Dipicu oleh permintaan audit manual: bandingkan
> `_docs/FORGOT_PASSWORD_PLAN.md` item per item terhadap `Animation.jsx` +
> `data.js` yang sudah berjalan setelah revisi-02 (fix crash/render) dan
> revisi-03 (intro/header Scene UI V1).

## 1. Ringkasan

Plan sudah terpenuhi untuk sebagian besar kontrak teknis (scene-ui V1,
4 Act, GSAP single timeline, tidak ada plaintext password di frame mana
pun). Tapi ditemukan **6 gap** antara plan dan kode — 2 di antaranya
kategori kebijakan/konsistensi seri (bukan sekadar bug render), 1 bug
wiring caption, 1 fitur setengah-jadi (dead code), dan 2 catatan
dokumentasi/konten.

| # | Prioritas | Temuan |
|---|---|---|
| 4.1 | 🔴 P0 — Series Identity Parity | Protagonis "Raka" menyimpang dari standar seri "Adib" |
| 4.2 | 🟠 P1 — Fitur setengah jadi | `FORM_Y`, `INBOX_LABEL`, `formOpened`, `tokenSeen`, `tokenY` dead code — jalur "amplop bergerak ke inbox" di plan tidak pernah divisualisasikan |
| 4.3 | 🟠 P1 — Caption salah pasang | Beat `sessionClosed` (Act 4) pakai `CAPTIONS.HASH_NEW`, padahal ada `CAPTIONS.OLD_SESSION` yang persis untuk momen itu — dan `OLD_SESSION` sendiri jadi dead data |
| 4.4 | 🟡 P2 — Dokumentasi | Durasi timeline aktual (~29-30 detik/loop) jauh dari target `±45 detik` di plan §1 dan `PHASES.duration` total (44.5 dtk) di `data.js` |
| 4.5 | 🟡 P2 — Dokumentasi | Checklist §4 `FORGOT_PASSWORD_PLAN.md` masih 100% `- [ ]` padahal Animation.jsx/data.js/manifest.js sudah ada dan Act 1-4 sudah jalan |
| 4.6 | 🟢 P3 — Opsional/konten | Act 2 belum mendemonstrasikan "dua email beda status → respons identik" secara visual — hanya satu form + satu badge generik |

## 2. Detail Temuan

### 4.1 — Protagonis "Raka" menyimpang dari standar seri "Adib" (P0)

**Bukti:**
- `docs/plan/PLAN-15-SERIES-IDENTITY-PARITY.md` §1 poin 2 mengunci aturan:
  "protagonis & karakter yang sudah muncul di topic seri lain WAJIB memakai
  nama/identitas/peran SAMA" — mencontohkan Adib di `17-rest-api` dan
  `18-auth`, dan menyebut kasus `18-auth` sempat salah pakai nama "Nina"
  sebagai pelanggaran yang harus diperbaiki.
- `19-register/data.js` baris komentar: "Cerita: Adib belum punya record
  akun."
- `20-email-verification/data.js`: `RECORD_EMAIL =
  'iammuslikhuladib@gmail.com'`, label `INBOX_LABEL = 'INBOX ADIB'`.
- `21-forgot-password/_docs/FORGOT_PASSWORD_PLAN.md` sendiri menulis
  **prasyarat cerita: "email Raka sudah Verified (topic 20)"** — padahal
  topic 20 memverifikasi email **Adib**, bukan Raka. Plan-nya sendiri
  kontradiktif dengan topic yang dirujukannya.
- `21-forgot-password/data.js`: `RECORD_EMAIL = 'raka@devmail.id'` (domain
  pun beda dari `gmail.com` yang dipakai topic 19/20 — bukan akun yang
  sama secara naratif).
- Komentar header `Animation.jsx` dan `data.js` topic ini menyebut
  "Protagonis Raka (kontrak seri, brand ADIB-DEV.COM)" — frasa "kontrak
  seri" dipakai untuk justifikasi, padahal isinya justru melanggar kontrak
  seri yang sebenarnya (nama harus Adib).

**Dampak:** penonton yang mengikuti 19→20→21 berurutan akan melihat akun
berbeda (email beda, nama beda) padahal cerita memaksudkan ini sebagai
kelanjutan akun yang sama (lupa password dari akun yang baru saja
diverifikasi di topic 20).

**Rencana fix (butuh konfirmasi, bukan cuma teknis):**
- Ganti `RECORD_EMAIL` di `data.js` dari `'raka@devmail.id'` menjadi
  `'iammuslikhuladib@gmail.com'` (sama persis dengan topic 20 — akun yang
  sama, sekarang lupa password).
- Ganti semua sebutan "Raka" di komentar `Animation.jsx`, `data.js`, dan
  `_docs/FORGOT_PASSWORD_PLAN.md` (Peran di Seri, State Contract S0,
  prasyarat cerita) menjadi "Adib".
- Tidak ada perubahan visual/layout yang diperlukan (topic ini tidak
  memakai avatar karakter — pola sama dengan 19/20, hanya kartu abstrak),
  jadi fix ini murni ganti teks/komentar + satu constant email.

---

### 4.2 — Fitur "amplop bergerak ke inbox" tidak pernah selesai dibangun (P1)

**Bukti:**
- `data.js` mendefinisikan **dua** posisi Y terpisah: `FORM_Y = 290 - ...`
  (form recovery) dan `INBOX_Y = 500 - ...` (inbox terpisah) — menyiratkan
  desain awal punya 2 kartu berbeda: form input, lalu inbox tempat token
  mendarat.
- `Animation.jsx` **tidak pernah import `FORM_Y`** — kartu `formCard`
  malah dipasang di `INBOX_Y` (baris render: `T('formCard', AXIS_X,
  INBOX_Y)`). Jadi `FORM_Y` 100% dead constant, dan tidak ada kartu
  "inbox" terpisah yang benar-benar dirender.
- State `formOpened`, `tokenSeen`, dan `tokenY`/`setTokenY` dideklarasikan
  dan di-reset tiap loop, tapi **tidak pernah di-set ke nilai lain atau
  dibaca di JSX manapun** — state mati total.
- Import `INBOX_LABEL` dari `data.js` tidak pernah dipakai di JSX (yang
  dipakai untuk kartu di `INBOX_Y` adalah `FORM_LABEL`).
- Ada garis panduan putus-putus di JSX: `{/* jalur token: inbox → gerbang
  */} <path d={... INBOX_Y+40 ... GATE_Y-56 ...} strokeDasharray="4 6" />`
  — path ini digambar tapi **tidak ada elemen apa pun yang benar-benar
  berjalan di sepanjang jalur itu**. Token langsung "teleport" muncul
  (`popIn`) di `GATE_Y` tanpa transit visual, padahal helper `travel()`
  sudah ada di file ini (dipakai `sendRequest`/`travel` di topic lain
  seperti 17/22) dan cocok dipakai di sini.
- Plan storyboard Act 2 payoff eksplisit menulis: "Instruksi menuju inbox
  → **amplop recovery bergerak**" — visual "bergerak" ini tidak pernah
  ada.

**Dampak:** State Contract plan (S1 vs S2) membedakan "respons generik
terkirim" dari "token tiba di inbox" sebagai dua state berbeda, tapi di
kode keduanya digabung jadi satu kartu statis tanpa transisi — kehilangan
beat "titik balik" yang dijanjikan storyboard, dan garis dashed di layar
jadi elemen dekoratif kosong tanpa fungsi (berpotensi terlihat seperti bug
visual oleh penonton — "kok ada garis putus-putus tapi nggak ada yang
lewat situ?").

**Opsi fix (pilih salah satu, butuh keputusan konten):**
1. **Selesaikan sesuai desain awal** — tambah token/amplop kecil yang
   benar-benar `travel()` dari `INBOX_Y` ke `GATE_Y` mengikuti garis
   dashed yang sudah ada, dipicu tepat setelah `tokenMatch` (menjelang
   caption `TOKEN_DEPARTS` yang sudah ada tapi belum ada visual
   pendukungnya). Hapus `FORM_Y`/`formOpened`/`tokenSeen` bila memang
   tidak jadi dipakai, atau pakai `FORM_Y` untuk kartu form terpisah dari
   inbox sesuai rencana asli.
2. **Simplifikasi resmi** — kalau desain 1-kartu (form+inbox digabung)
   memang keputusan final, hapus dead code (`FORM_Y`, `INBOX_LABEL`,
   `formOpened`, `tokenSeen`, `tokenY`, garis dashed yang tidak dipakai)
   dan update plan/storyboard §3 Act 2 supaya tidak lagi menjanjikan
   "amplop bergerak" yang tidak akan ada.

---

### 4.3 — Caption `sessionClosed` salah pasang, `OLD_SESSION` jadi dead data (P1)

**Bukti:** di `Animation.jsx` Act 4:
```js
tl.add(() => setSessionClosed(true), t4)
sfxOn(tl, t4, () => sfxLoader.play('impacts', SFX_MAP.LOCK.name, ...))
say(tl, t4 + 0.1, CAPTIONS.HASH_NEW)   // ← teksnya "Hash baru tersimpan"
```
Tapi `data.js` sudah punya key yang persis dibuat untuk momen ini:
```js
OLD_SESSION: 'Session lama ditutup',
```
`OLD_SESSION` **tidak pernah dipanggil di manapun** — sementara
`CAPTIONS.HASH_NEW` dipakai dua kali secara tidak sengaja (sekali pas
`sessionClosed`, padahal event `sessionClosed` ini adalah "menutup session
lama", bukan "menyimpan hash baru" — itu sudah jadi bagian caption
sebelumnya di `NEW_PASSWORD`/`hashNew`).

**Dampak:** penonton melihat teks "Hash baru tersimpan" persis di momen
lock/session-close (disertai SFX `LOCK`), yang secara semantik
membingungkan — SFX-nya bicara soal mengunci/menutup, tapi teksnya bicara
soal menyimpan hash. `OLD_SESSION` yang sudah ditulis khusus untuk pesan
ini tidak pernah terlihat penonton sama sekali.

**Rencana fix:** ganti `say(tl, t4 + 0.1, CAPTIONS.HASH_NEW)` menjadi
`say(tl, t4 + 0.1, CAPTIONS.OLD_SESSION)` di beat `sessionClosed`. Tidak
perlu ubah `data.js` — key-nya sudah ada dan sudah pas isinya.

