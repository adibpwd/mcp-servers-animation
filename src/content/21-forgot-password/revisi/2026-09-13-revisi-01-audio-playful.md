# Revisi-01: Audio Lebih Playful dan Bervariasi — 21-forgot-password

> **Status:** ✅ Dieksekusi (2026-09-13). `vite build` PASS (exit 0), semua
> 13 `SFX_MAP` entry ter-wire. Preview manual `npm run dev` masih pending.
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya merencanakan audio. State cerita, layout, aset visual, durasi
> Act, registry, dan metadata topic tidak berubah.

## 1. Tujuan

Recovery perlu tetap aman tetapi tidak muram: ada rasa khawatir saat lupa password, lalu perjalanan inbox/token yang jelas, dan ending lega saat hash baru berhasil.

Targetnya bukan membuat setiap frame berbunyi. Setiap Act perlu pola yang mudah
diingat: satu cue pembuka, satu cue aksi/gerak, satu cue emosi atau payoff.
Jeda baca tetap sengaja tenang. Batas default: maksimal dua SFX foreground
dalam 0,35 detik; cue ketiga digeser, dipelankan, atau dihilangkan.

## 2. Audit Source Saat Ini

Coverage lebih tipis daripada 19/20: doorBlocked tidak punya cue eksplisit; hashCardSeen, tokenCard, tokenConsumed, dan closingStamps sebagian besar silent/generic POP. Timeline langsung memakai string category pada beberapa cue dan belum memberi suara transformasi hash lama → baru. POP2 dan beberapa key SFX_MAP tampak belum digunakan.

| Prioritas | Cue / motion | Rencana audio |
|---|---|---|
| P1 | doorBlocked dan record hash terlihat | lock + error-hum sangat pendek; scan untuk record hash, bukan confirm sukses |
| P1 | respons generik dan hashCardSeen | plink netral untuk respons; materialize rendah untuk kartu hash |
| P1 | token datang, expired, match, consumed | paper-arrive, latency-tick, chime, connector-snap lembut |
| P1 | hash baru morph dan sessionClosed | scan → shimmer pada hash baru; lock-click/session-close baru bersama untuk revoke |
| P2 | form/closing | pop-2 untuk form, relief-settle untuk pintu login berhasil |

## 3. Palet Audio Playful

- **UI ringan:** plink, pop, pop-2, tick, chime; dipakai untuk kartu kecil,
  input, dan detail yang terasa ramah.
- **Gerak:** light-swoosh-quick, slide-in, swoosh; dipakai sekali pada travel
  yang menjadi fokus, bukan setiap perpindahan kecil.
- **Keamanan:** lock, connector-snap, critical-alert, alert-pulse; dipakai
  hemat hanya untuk block, expiry, atau penolakan yang penting.
- **Payoff:** shimmer, ding, confirm, relief-settle; shimmer/chime cocok untuk
  rasa magis yang ramah anak tanpa memberi kesan bahaya.
- **Ambient:** tidak memakai loop audio kontinu. Ambient visual tetap hidup,
  tetapi audio diam di sela caption agar dialog mental penonton tidak lelah.

## 4. Perubahan Data dan Timeline yang Direncanakan

Tambahkan hanya key SFX yang benar-benar dipanggil; hapus atau wire key lama
yang terbukti dead. Semua panggilan menggunakan kategori dari SFX_MAP, bukan
string nama file lepas. Cek level audio dengan ffprobe/ffmpeg volumedetect
sebelum memilih asset: cue foreground jangan memakai file terlalu pelan hanya
karena namanya cocok.

Key kandidat:

`ERROR_HUM` warnings/error-hum; `HASH_SCAN` sfx/scan; `PAPER_ARRIVE` kandidat baru bersama; `EXPIRY_TICK` warnings/latency-tick; `TOKEN_CHIME` ui/chime; `TOKEN_CONSUME` impacts/connector-snap; `HASH_SHIMMER` success/shimmer; `RELIEF` success/relief-settle. Kandidat baru bersama: session-close.

Setiap cue dipicu melalui sfxOn atau opsi popIn/popOut pada waktu perubahan
state yang sama. Tidak ada setTimeout, audio loop baru, atau perubahan state
React. Bila helper popOut belum menerima category/name/volumeMult, upgrade
lokal dibuat backward-compatible dengan default silent.

## 5. Validasi Audio

Tes jalur generic response agar tidak terdengar seperti account ditemukan. Cue success hanya dimulai saat token valid; intro gagal login harus berbeda dari expiry.

- Ikuti docs/standardizations/08-audio-sfx-generation.md §2, §3, §7, dan §8.
- Preview satu loop penuh dengan volume normal, lalu export audio. Catat cue
  terlalu pelan, bertumpuk, terlambat, atau terasa mengganggu di revisi ini.
- Tidak ada asset baru yang di-download pada revisi topic ini; kandidat aset
  baru bersama ada di docs/plan/PLAN-SHARED-PLAYFUL-AUDIO-PACK.md.

## 6. Checklist

- [x] **Draft** — Audit setiap motion signifikan terhadap cue dalam radius 0,3 detik.
- [x] **Draft** — Wire SFX_MAP tanpa dead config dan dengan kategori benar.
- [x] **Draft** — Ukur loudness asset yang dipilih; ganti asset jika terlalu pelan.
- [ ] **Draft** — Preview manual: dengarkan kepadatan setiap Act dan semua seam.
- [ ] **Draft** — Export audio; cek sinkronisasi dan tidak ada cue hilang.
- [x] **Draft** — Update README revisi dengan hasil actual setelah implementasi.

---

## 7. Eksekusi (2026-09-13)

Kandidat asli §4 (`sfx/scan`, `warnings/latency-tick`, `warnings/error-hum`)
diukur ulang `ffmpeg -af volumedetect` — **konsisten dengan temuan 19/20,
semuanya masih terlalu pelan** (-26.0dB, -37.4dB, -49.6dB vs baseline
-18.1dB). `PAPER_ARRIVE` dan kandidat "session-close" dari plan asli tidak
dipakai (shared pack masih draft). Diganti alternatif existing yang lolos
ukur: `NUMBER_TALLY` (-1.3dB), `PLINK` (-18.1dB), `LIGHT_SWOOSH` (-1.0dB),
`CHIME` (-4.7dB), `SNAP`/connector-snap (-0.9dB), `SHIMMER` (-18.1dB),
`RELIEF`/relief-settle (-0.9dB), `ALERT_PULSE` (-10.7dB), `LOCK` (-1.0dB),
`TICK` (-18.1dB, pas di baseline).

Selain wiring audio, ditemukan bahwa file ini masih memanggil
`sfxLoader.transition('whoosh'/'teleport', ...)` dengan string literal,
bukan `SFX_MAP.WHOOSH.name` — beda dari konvensi 19/20. Diperbaiki agar
konsisten (whoosh tetap dipakai di intro; teleport digantikan, lihat di
bawah).

**Wiring per motion:**
- `doorBlocked` — **dulu total silent**, sekarang `LOCK` (P1: pintu login terkunci)
- `recordExists` — `CONFIRM` → `NUMBER_TALLY` (P1: "scan untuk record hash,
  bukan confirm sukses" — scan gagal ukur, dipakai pengganti netral non-triumphant)
- `formCard` popIn — default `POP` → `POP2` (P2: "pop-2 untuk form")
- `genericSeen` — `POP` → `PLINK` (P1: "plink netral untuk respons")
- `hashCardSeen` — **tetap silent by design**: caption-nya sendiri
  "Bukti dibuat tanpa diumumkan", jadi diam di sini justru menguatkan makna,
  bukan celah cue yang lupa
- `INBOX_CHECK` (caption) — **dulu total silent**, ditambah `TICK` ringan
  (memberi guna pada key yang sebelumnya dead di SFX_MAP)
- `tokenCard` popIn — default `POP` → `LIGHT_SWOOSH` (P1: kesan "tautan tiba",
  beda dari WHOOSH intro)
- `expiredDemo` — `sfxLoader.transition('teleport')` (mismatch semantik,
  teleport tidak cocok untuk "link kadaluarsa") → `ALERT_PULSE`
  (kategori warnings, sekaligus mengaktifkan key yang sebelumnya dead)
- `tokenMatch` — `DING` → `CHIME` (P1: "chime untuk match")
- `tokenConsumed` — **dulu total silent**, sekarang `SNAP` volumeMult 0.7
  (P1: "connector-snap lembut saat consume")
- `hashNew` — `CONFIRM` → `SHIMMER` (P1: shimmer pada hash baru tersimpan)
- `sessionClosed` — `sfxLoader.transition('whoosh')` literal → `LOCK` (reuse,
  volumeMult 0.85 agar beda tekanan dari LOCK di Act1) — dipilih karena
  "session ditutup" secara tematik = mengunci, bukan whoosh generik
- `doorLit` — `DING` → `RELIEF` (P2: "relief-settle untuk pintu login berhasil")

`SWOOSH`, `TELEPORT`, `CONFIRM`, `DING` bawaan first-pass **dihapus dari
SFX_MAP** karena revisi ini menggantikan seluruh titik pemakaiannya —
mempertahankan entry lama tanpa pemanggilan akan jadi dead config.

**Catatan di luar scope (tidak diubah):** caption `CAPTIONS.TOKEN_DEPARTS`
dipanggil di Animation.jsx tapi key ini tidak ada di `data.js` (kemungkinan
bug lama, di luar cerita/caption yang boleh disentuh revisi audio-only ini).
Perlu di-flag terpisah ke pwd2y untuk diperbaiki di revisi non-audio.

**Validasi:**
- `vite build --logLevel warn` — exit 0, tanpa error
- Cross-check `SFX_MAP.<KEY>.` di `Animation.jsx` — **13/13 entry
  ter-wire ≥1×** (POP×1, POP2×1, TICK×1, WHOOSH×1, LOCK×2, ALERT_PULSE×1,
  NUMBER_TALLY×1, PLINK×1, LIGHT_SWOOSH×1, CHIME×1, SNAP×1, SHIMMER×1,
  RELIEF×1). Tidak ada dead config.
- **`npm run dev` preview manual — BELUM DILAKUKAN**, terutama cek Act 3
  (`tokenMatch`→`tokenConsumed` dalam ~2.2s, CHIME lalu SNAP pelan) dan
  Act 4 (`hashNew`→`sessionClosed`→`doorLit` dalam ~3.4s, SHIMMER→LOCK→RELIEF)
  tidak terasa seperti beruntun identik.
