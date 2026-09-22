# Revisi-01: Audio Lebih Playful dan Bervariasi — 22-oauth2-delegated-login

> **Status:** ✅ Dieksekusi (2026-09-13). `vite build` PASS (exit 0), semua
> 17 `SFX_MAP` entry ter-wire. Preview manual `npm run dev` masih pending.
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya merencanakan audio. State cerita, layout, aset visual, durasi
> Act, registry, dan metadata topic tidak berubah.

## 1. Tujuan

OAuth harus terasa seperti perjalanan izin yang seru: redirect punya dorongan ringan, consent terasa seperti stiker disetujui, PKCE punya klik kunci yang jelas, dan token scope kecil terasa sebagai hadiah terbatas.

Targetnya bukan membuat setiap frame berbunyi. Setiap Act perlu pola yang mudah
diingat: satu cue pembuka, satu cue aksi/gerak, satu cue emosi atau payoff.
Jeda baca tetap sengaja tenang. Batas default: maksimal dua SFX foreground
dalam 0,35 detik; cue ketiga digeser, dipelankan, atau dihilangkan.

## 2. Audit Source Saat Ini

SFX ada pada reject password, redirect pertama, login tick, consent confirm/ding, code travel, PKCE lock/ding, token teleport, resource travel, locked scopes, scope tick, dan profile confirm. passwordBadge dibuat popIn dengan sfx:false; providerGate, loginForm, consentCard, pkceLock, resourceShelf, lockedScopes, closing masih banyak POP generik. Perjalanan redirect tahap kedua dan transformasi ticket → code tidak memiliki cue mandiri. POP2 tampak belum ter-wire.

| Prioritas | Cue / motion | Rencana audio |
|---|---|---|
| P1 | passwordBadge reject | error-beep lembut menyertai badge, lalu connector-snap ketika aplikasi melepaskan password |
| P1 | redirect ticket → provider dan code kembali | dua varian: light-swoosh-quick pergi, slide-in pulang; jangan reuse whoosh sama |
| P1 | consent card/approve | plink saat scope muncul, chime + approval-stamp baru bersama saat Allow |
| P1 | ticket → code → token dan PKCE | click/key-turn baru bersama untuk PKCE; scan untuk verifier match; shimmer untuk token |
| P2 | locked scopes / profile returned | error-hum kecil untuk scope terkunci; relief-settle saat profil kecil kembali |
| P3 | panel/card masuk | POP, POP2, materialize bergilir agar tidak monoton |

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

`ERROR_BEEP` warnings/error-beep; `LIGHT_SWOOSH` transitions/light-swoosh-quick; `SLIDE_IN` transitions/slide-in; `SCOPE_PLINK` ui/plink; `TOKEN_SCAN` sfx/scan; `TOKEN_SHIMMER` success/shimmer; `ERROR_HUM` warnings/error-hum; `RELIEF` success/relief-settle. Kandidat baru bersama: approval-stamp dan key-turn.

Setiap cue dipicu melalui sfxOn atau opsi popIn/popOut pada waktu perubahan
state yang sama. Tidak ada setTimeout, audio loop baru, atau perubahan state
React. Bila helper popOut belum menerima category/name/volumeMult, upgrade
lokal dibuat backward-compatible dengan default silent.

## 5. Validasi Audio

Dengarkan Act 2 agar consent approve tidak menumpuk confirm + ding + POP. Pilih chime/approval-stamp sebagai foreground, lalu ding kecil atau silent.

- Ikuti docs/standardizations/06-audio-sfx.md §2, §3, §7, dan §8.
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

Kandidat baru §4 diukur `ffmpeg -af volumedetect`: `error-beep` (-3.8dB) dan
`slide-in` (-0.8dB) **lolos** baseline -18.1dB. `sfx/scan` dan
`warnings/error-hum` **gagal** (konsisten dengan temuan 19/20/21, -26.0dB
dan -49.6dB). Kandidat baru bersama `approval-stamp` dan `key-turn` belum
tersedia (shared pack masih draft) — tidak dipakai.

**Wiring per motion:**
- `passwordRejected` — `ALERT_PULSE` → `ERROR_BEEP` (P1: "error-beep lembut
  menyertai badge")
- `passwordBadge` popOut — **dulu total silent**, sekarang `SNAP`
  (connector-snap) volumeMult 0.7 (P1: "connector-snap ketika aplikasi
  melepaskan password")
- redirect tiket berangkat (APP→REDIRECT) — `WHOOSH` → `LIGHT_SWOOSH`
  (P1: "dua varian ... jangan reuse whoosh sama")
- `providerGate` popIn — default `POP` → `POP2`
- code kembali (PROVIDER→PKCE, `CODE_RETURNS`) — `SWOOSH` → `SLIDE_IN`
  (P1: "slide-in pulang", beda arah dari LIGHT_SWOOSH keberangkatan)
- `pkceLock` popIn — default `POP` → `POP2`
- `consentCard` popIn (scope muncul) — default `POP` → `PLINK`
  (P1: "plink saat scope muncul")
- `consentApproved` (Allow) — `CONFIRM` → `CHIME` (P1: "chime ... saat
  Allow"; approval-stamp belum tersedia jadi chime jadi foreground tunggal)
- `challengeMatched` (PKCE verifier match) — `DING` → `NUMBER_TALLY`
  (P1: "scan untuk verifier match" — scan gagal ukur, dipakai pengganti
  bernuansa "menghitung/memverifikasi")
- carrier stage → token — `TELEPORT` → `SHIMMER` (P1: "shimmer untuk token")
- `lockedScopes` popIn — diberi `sfx: false`, `ALERT_PULSE` dijadikan
  satu-satunya cue foreground di beat ini (sebelumnya POP + ALERT_PULSE
  menumpuk di waktu yang sama)
- `profileReturned` — `CONFIRM` → `RELIEF` (P2: "relief-settle saat profil
  kecil kembali")
- `closingStamps` popIn — default `POP` → `POP2` (P3: variasi panel akhir)

`SWOOSH` dan `CONFIRM` bawaan first-pass **dihapus dari SFX_MAP** karena
seluruh titik pemakaiannya sudah digantikan — mempertahankan entry tanpa
pemanggilan akan jadi dead config. `POP2` yang sebelumnya 0 pemanggilan
(temuan audit §2) sekarang punya 3 titik pakai.

**Validasi Act 2 (§5):** `CHIME` di `consentApproved` jadi satu-satunya
foreground saat Allow (tidak lagi ditumpuk POP dari consentCard karena
consentCard sudah dapat cue sendiri — PLINK — lebih awal). `DING` di
`consentStamp` tetap ada tapi 1,6s setelahnya, bukan bertumpuk.

**Validasi:**
- `vite build --logLevel warn` — exit 0, tanpa error
- Cross-check `SFX_MAP.<KEY>.` di `Animation.jsx` — **17/17 entry
  ter-wire ≥1×** (POP×1, POP2×3, TICK×2, WHOOSH×1, LOCK×1, ALERT_PULSE×1,
  DING×1, TELEPORT×1, ERROR_BEEP×1, SNAP×1, PLINK×1, CHIME×1, SLIDE_IN×1,
  LIGHT_SWOOSH×1, NUMBER_TALLY×1, SHIMMER×1, RELIEF×1). Tidak ada dead
  config.
- **`npm run dev` preview manual — BELUM DILAKUKAN**, terutama cek Act 3
  (`SLIDE_IN`→`POP2`+`LOCK` dalam ~1.6s) dan Act 1 (`ERROR_BEEP`→`SNAP`→
  `POP2`+`LIGHT_SWOOSH` dalam ~2.25s) tidak terasa terlalu padat.
