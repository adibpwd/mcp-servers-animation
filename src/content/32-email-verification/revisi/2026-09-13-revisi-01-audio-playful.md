# Revisi-01: Audio Lebih Playful dan Bervariasi — 20-email-verification

> **Status:** ✅ Dieksekusi (2026-09-13). `vite build` PASS (exit 0), semua
> 14 `SFX_MAP` entry ter-wire. Preview manual `npm run dev` masih pending.
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya merencanakan audio. State cerita, layout, aset visual, durasi
> Act, registry, dan metadata topic tidak berubah.

## 1. Tujuan

Email verification harus berbunyi seperti mini petualangan surat: amplop tiba, terbuka, token berkilau, jam mengingatkan dengan halus, lalu cap verified menjadi payoff paling ceria.

Targetnya bukan membuat setiap frame berbunyi. Setiap Act perlu pola yang mudah
diingat: satu cue pembuka, satu cue aksi/gerak, satu cue emosi atau payoff.
Jeda baca tetap sengaja tenang. Batas default: maksimal dua SFX foreground
dalam 0,35 detik; cue ketiga digeser, dipelankan, atau dihilangkan.

## 2. Audit Source Saat Ini

Timeline sudah memiliki whoosh amplop, pop-2 buka amplop, tick jam, swoosh token, alert expiry, ding match, confirm consume, alert reuse, ding verified, confirm door. Record, inbox, gate, tokenSeen, closing stamps masih mengandalkan POP generik; setAtGate dan tokenConsumed tidak punya cue khusus. Kombinasi ding + confirm pada Act 4 perlu dipisah supaya tidak terdengar seperti dua kemenangan yang sama.

| Prioritas | Cue / motion | Rencana audio |
|---|---|---|
| P1 | amplop tiba dan terbuka | paper-arrive/paper-open baru bersama; ganti salah satu POP dengan plink agar terasa ringan |
| P1 | token berangkat dan tiba gate | light-swoosh-quick pada perjalanan + scan saat gate menerima |
| P1 | expiry / reuse rejected | latency-tick pendek untuk jam; error-beep/critical-alert hanya pada reject |
| P1 | token match, consume, verified | chime untuk match, connector-snap lembut saat consume, shimmer untuk Verified |
| P2 | record, inbox, gate, closing | materialize/plink bervariasi; relief-settle di pintu siap masuk |

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

`PAPER_ARRIVE` dan `PAPER_OPEN` kandidat baru bersama; `LIGHT_SWOOSH` transitions/light-swoosh-quick; `TOKEN_SCAN` sfx/scan; `EXPIRY_TICK` warnings/latency-tick; `ERROR_BEEP` warnings/error-beep; `VERIFY_SHIMMER` success/shimmer; `RELIEF` success/relief-settle.

Setiap cue dipicu melalui sfxOn atau opsi popIn/popOut pada waktu perubahan
state yang sama. Tidak ada setTimeout, audio loop baru, atau perubahan state
React. Bila helper popOut belum menerima category/name/volumeMult, upgrade
lokal dibuat backward-compatible dengan default silent.

## 5. Validasi Audio

Jaga Act 4: match/consume/verified/door tidak boleh menjadi empat cue keras berurutan. Prioritaskan shimmer pada Verified dan relief-settle pada pintu; cue lain kecil atau silent.

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

Kandidat asli §4 (`sfx/scan`, `warnings/latency-tick`, `warnings/error-hum`)
diukur `ffmpeg -af volumedetect` dan **semuanya terlalu pelan**
(-26.0dB, -37.4dB, -49.6dB vs baseline -18.1dB). `PAPER_ARRIVE`/
`PAPER_OPEN`/`ERROR_BEEP` dari plan asli tidak dipakai (shared pack
masih draft / durasi bermasalah). Diganti 7 alternatif existing yang
lolos ukur: `PLINK`, `LIGHT_SWOOSH`, `NUMBER_TALLY`, `CHIME`, `SNAP`
(connector-snap), `SHIMMER`, `RELIEF` (relief-settle).

**Wiring per motion:**
- `recordCard`, `inboxCard` — dari default POP → `PLINK` (P1: "ganti
  salah satu POP dengan plink agar ringan")
- perjalanan token ke gerbang — `SWOOSH` → `LIGHT_SWOOSH`
  (light-swoosh-quick, beda dari WHOOSH amplop di Act1)
- `setAtGate(true)` — **dulu total silent**, sekarang `NUMBER_TALLY`
  (scan.wav aslinya diusulkan tapi terlalu pelan)
- `tokenMatch` — `DING` → `CHIME` (P1: "chime untuk match")
- `tokenConsumed` — `CONFIRM` → `SNAP` volumeMult 0.7 (P1: "connector-snap
  lembut saat consume")
- `recordVerified` — `DING` → `SHIMMER` (P1 + §5: shimmer diprioritaskan
  di beat Verified)
- `doorLit` — `CONFIRM` → `RELIEF` (relief-settle) (§5: relief-settle di
  pintu)

`SWOOSH`, `CONFIRM`, `DING` bawaan first-pass **dihapus dari SFX_MAP**
karena revisi ini menggantikan semua titik pemakaiannya — mempertahankan
entry lama tanpa pemanggilan akan jadi dead config.

**Validasi:**
- `vite build --logLevel warn` — exit 0, tanpa error
- Cross-check `SFX_MAP.<KEY>.` di `Animation.jsx` — **14/14 entry
  ter-wire ≥1×** (POP×1, POP2×1, TICK×1, WHOOSH×1, TELEPORT×1, LOCK×1,
  ALERT_PULSE×2, PLINK×2, LIGHT_SWOOSH×1, NUMBER_TALLY×1, CHIME×1,
  SNAP×1, SHIMMER×1, RELIEF×1). Tidak ada dead config.
- **`npm run dev` preview manual — BELUM DILAKUKAN**, terutama cek Act 4
  (`reuseRejected`→`recordVerified`→`doorLit`→`closingStamps` dalam
  ~3.65s) tidak terasa seperti 4 kemenangan beruntun yang identik.
