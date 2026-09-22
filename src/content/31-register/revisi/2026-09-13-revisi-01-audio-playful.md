# Revisi-01: Audio Lebih Playful dan Bervariasi — 19-register

> **Status:** ✅ Dieksekusi (2026-09-13). `vite build` PASS (exit 0), semua
> 18 `SFX_MAP` entry ter-wire. Preview manual `npm run dev` masih pending.
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya merencanakan audio. State cerita, layout, aset visual, durasi
> Act, registry, dan metadata topic tidak berubah.

## 1. Tujuan

Register perlu terasa optimistis dan seperti membuka buku anggota baru: field punya bunyi kecil berbeda, hash terasa sebagai transformasi yang memuaskan, dan amplop verifikasi menjadi payoff hangat.

Targetnya bukan membuat setiap frame berbunyi. Setiap Act perlu pola yang mudah
diingat: satu cue pembuka, satu cue aksi/gerak, satu cue emosi atau payoff.
Jeda baca tetap sengaja tenang. Batas default: maksimal dua SFX foreground
dalam 0,35 detik; cue ketiga digeser, dipelankan, atau dihilangkan.

## 2. Audit Source Saat Ini

SFX sekarang sudah ada pada block login, validasi, perjalanan slip, salt, hash, pending, dan amplop. Namun popIn untuk rak, loket, tiga field, record, mesin, inbox, dan closing memakai POP seragam; doorX bahkan eksplisit silent. POP2 tampak belum punya panggilan khusus. Perubahan state hashDone dan pending berurutan berisiko memberi ding lalu alert terlalu dekat.

| Prioritas | Cue / motion | Rencana audio |
|---|---|---|
| P1 | doorX dan loginBlocked | lock untuk block utama + error-beep lembut pada X, bukan POP silent |
| P1 | machineBox, slip tiba, hashDone | connector-snap saat mesin menerima; scan singkat saat pola hash; shimmer saat hash selesai |
| P1 | record Pending dan amplop tiba | stamp-pending baru bersama atau chime ringan; paper-send baru bersama lalu ding saat inbox |
| P2 | tiga field form | tick, plink, pop-2 bergilir; tidak tiga POP identik |
| P2 | validAll / submit | confirm lalu light-swoosh-quick untuk submit |
| P3 | booksShelf, loket, closing stamp | materialize/shimmer volume rendah, relief-settle pada closing |

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

`FIELD_PLINK` ui/plink; `FIELD_POP2` ui/pop-2; `MACHINE_SNAP` impacts/connector-snap; `HASH_SCAN` sfx/scan; `HASH_SHIMMER` success/shimmer; `ERROR_BEEP` warnings/error-beep; `LIGHT_SWOOSH` transitions/light-swoosh-quick. Kandidat baru bersama: paper-send dan approval-stamp.

Setiap cue dipicu melalui sfxOn atau opsi popIn/popOut pada waktu perubahan
state yang sama. Tidak ada setTimeout, audio loop baru, atau perubahan state
React. Bila helper popOut belum menerima category/name/volumeMult, upgrade
lokal dibuat backward-compatible dengan default silent.

## 5. Validasi Audio

Dengarkan khusus jarak hash selesai → Pending: satu payoff hangat lalu jeda minimal 0,35 dtk sebelum warning Pending. Pastikan tiga field tidak berbunyi seperti mesin ketik keras.

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

Kandidat asli dari §4 (`sfx/scan`, `sfx/materialize`) diukur pakai
`ffmpeg -af volumedetect` dan **keduanya terlalu pelan** (-26.0dB dan
-27.2dB vs baseline -18.1dB) — pelajaran langsung dari audit
23-https-tls revisi-02. Diganti alternatif yang lolos ukur:
`ui/number-tally` (-1.3dB, dipakai untuk "pola hash diproses") dan
`success/shimmer` (-18.1dB, dipakai untuk entrance halus). Kandidat
`paper-send`/`approval-stamp` dari shared pack belum ada file-nya
(pack masih draft) — tidak dipakai.

**8 SFX_MAP entry baru** (semua reuse existing, 0 download):
`SHIMMER`, `SNAP` (connector-snap), `NUMBER_TALLY`, `CRITICAL_ALERT`,
`PLINK`, `CHIME`, `LIGHT_SWOOSH` (light-swoosh-quick), `RELIEF`
(relief-settle).

**Wiring per motion:**
- `booksShelf`, `loketCard` — `SHIMMER` volumeMult 0.6 (P3, entrance halus)
- `doorX` — dari `sfx:false` → `CRITICAL_ALERT` volumeMult 0.8 (dulu silent)
- `field_nama`/`field_email`/`field_password` — `TICK`/`PLINK`/`POP2` bergilir (dulu 3× POP identik)
- `submitBtn` — `LIGHT_SWOOSH` (dulu default POP)
- slip tiba di mesin (`slipDone`) — `SNAP` ditambah, dibarengi `TICK` (saltAdded) 0,1s kemudian
- pola hash diproses — `NUMBER_TALLY` ditambah di tengah jeda (slipDone+0.8)
- `hashDone` — `DING` → `SHIMMER` (diversifikasi, DING sudah dipakai di banyak topic lain)
- `pendingRecord` — `ALERT_PULSE` → `CHIME` (Pending bukan alarm, cuma nunggu)
- `closingStamps` — dari default POP → `RELIEF` (relief-settle)

**Validasi:**
- `vite build --logLevel warn` — exit 0, tanpa error
- Cross-check `SFX_MAP.<KEY>.` di `Animation.jsx` — **18/18 entry
  ter-wire ≥1×** (POP×1, POP2×1, TICK×3, WHOOSH×1, SWOOSH×1,
  TELEPORT×1, LOCK×1, CONFIRM×1, DING×1, ALERT_PULSE×2, SHIMMER×3,
  SNAP×1, NUMBER_TALLY×1, CRITICAL_ALERT×1, PLINK×1, CHIME×1,
  LIGHT_SWOOSH×1, RELIEF×1). Tidak ada dead config.
- **`npm run dev` preview manual — BELUM DILAKUKAN**, butuh telinga
  manusia untuk cek kepadatan tiap Act & seam antar-beat.
